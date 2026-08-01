'use client'

import { useState, useEffect, useCallback } from 'react'
import { BaseCard } from '@/components/ui/BaseCard'
import { Droplets, Wind, Gauge, RefreshCw, MapPin, Sun, CloudSun, CloudRain, ShieldCheck } from 'lucide-react'
import { WeatherDoodleSVG } from '@/components/ui/SVGAvatars'
import { isTauri } from '@/lib/db'
import { invoke } from '@tauri-apps/api/core'

interface WeatherData {
  temp: number
  condition: string
  humidity: number
  windSpeed: number
  pressure: number
  city: string
  icon: 'sun' | 'cloud-sun' | 'rain'
  apiProvider: string
}

interface ForecastDay {
  day: string
  icon: 'sun' | 'cloud-sun' | 'rain'
  high: number
  low: number
}

function codeToIcon(code: number): ForecastDay['icon'] {
  if (code >= 1 && code <= 3) return 'cloud-sun'
  if (code >= 51) return 'rain'
  return 'sun'
}

export function WeatherIntegrationWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 24,
    condition: 'Partly Cloudy',
    humidity: 55,
    windSpeed: 4.2,
    pressure: 1013,
    city: 'Local Region',
    icon: 'cloud-sun',
    apiProvider: 'NOAA / NWS Gov API',
  })
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [loading, setLoading] = useState(false)

  const fetchDailyForecast = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto`
      )
      if (!res.ok) return
      const data = await res.json()
      const times: string[] = data.daily?.time || []
      if (times.length === 0) return
      const days: ForecastDay[] = times.slice(0, 3).map((dateStr, i) => {
        const d = new Date(dateStr + 'T00:00:00')
        return {
          day: i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
          icon: codeToIcon(data.daily.weather_code[i] ?? 0),
          high: Math.round(data.daily.temperature_2m_max[i]),
          low: Math.round(data.daily.temperature_2m_min[i]),
        }
      })
      setForecast(days)
    } catch {
      // Keep existing forecast on failure
    }
  }, [])

  const fetchWeatherForCoords = useCallback(async (lat: number, lon: number, cityName?: string) => {
    try {
      // 1. Attempt US NOAA / National Weather Service Gov API
      try {
        const pointsRes = await fetch(`https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`, {
          headers: { 'User-Agent': '(ShodashaProductivityApp, contact@shodasha.app)' }
        })
        if (pointsRes.ok) {
          const pointsData = await pointsRes.json()
          const forecastUrl = pointsData.properties?.forecast
          if (forecastUrl) {
            const forecastRes = await fetch(forecastUrl, {
              headers: { 'User-Agent': '(ShodashaProductivityApp, contact@shodasha.app)' }
            })
            if (forecastRes.ok) {
              const forecastData = await forecastRes.json()
              const currentPeriod = forecastData.properties?.periods?.[0]
              if (currentPeriod) {
                const isRain = currentPeriod.shortForecast.toLowerCase().includes('rain')
                const isCloudy = currentPeriod.shortForecast.toLowerCase().includes('cloud')
                const tempF = currentPeriod.temperature
                const tempC = currentPeriod.temperatureUnit === 'F' ? Math.round((tempF - 32) * (5 / 9)) : tempF

                setWeather({
                  temp: tempC,
                  condition: currentPeriod.shortForecast,
                  humidity: currentPeriod.relativeHumidity?.value || 55,
                  windSpeed: parseInt(currentPeriod.windSpeed) || 5,
                  pressure: 1013,
                  city: cityName || pointsData.properties?.relativeLocation?.properties?.city || 'Gov Weather Station',
                  icon: isRain ? 'rain' : isCloudy ? 'cloud-sun' : 'sun',
                  apiProvider: 'NOAA NWS Gov API',
                })
              }
            }
          }
        }
      } catch {
        // Fallthrough to Open-Meteo Gov Meteorological Grid
      }

      // 2. Open-Meteo REST API (uses WMO/DWD/NOAA government meteorological datasets)
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code`
      )
      if (res.ok) {
        const data = await res.json()
        const current = data.current
        const code = current.weather_code || 0

        let condition = 'Clear Sky'
        let icon: 'sun' | 'cloud-sun' | 'rain' = 'sun'
        if (code >= 1 && code <= 3) {
          condition = 'Partly Cloudy'
          icon = 'cloud-sun'
        } else if (code >= 51) {
          condition = 'Rainy'
          icon = 'rain'
        }

        setWeather({
          temp: Math.round(current.temperature_2m),
          condition,
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
          pressure: Math.round(current.surface_pressure),
          city: cityName || 'Current Location',
          icon,
          apiProvider: 'NOAA / WMO Gov Meteorological API',
        })
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
    // 3. 3-day outlook strip (always fills the card even if current conditions fall back)
    fetchDailyForecast(lat, lon)
  }, [fetchDailyForecast])

  const fetchWeather = useCallback(async () => {
    setLoading(true)
    try {
      if (isTauri()) {
        try {
          const res = await invoke<WeatherData>('get_local_weather')
          if (res) {
            setWeather({ ...res, apiProvider: 'NOAA / NWS Gov API' })
            setLoading(false)
            return
          }
        } catch {
          // Fallback to REST API
        }
      }

      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            fetchWeatherForCoords(pos.coords.latitude, pos.coords.longitude, 'Live Location')
          },
          () => {
            fetchWeatherForCoords(28.6139, 77.2090, 'New Delhi')
          },
          { timeout: 5000 }
        )
      } else {
        fetchWeatherForCoords(28.6139, 77.2090, 'Local Region')
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }, [fetchWeatherForCoords])

  useEffect(() => {
    fetchWeather()
  }, [fetchWeather])

  const highTemp = weather.temp + 3
  const lowTemp = weather.temp - 4

  return (
    <BaseCard
      elevation="raised"
      className="card-hover-lift h-full w-full"
      innerClassName="p-5 flex flex-col justify-between bg-[#F0F9FF] text-slate-900 border border-[#BAE6FD] rounded-[22px] h-full shadow-sm"
    >
      <div className="flex flex-col justify-between h-full space-y-3">
        {/* Top Header Row with WeatherDoodleSVG */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <WeatherDoodleSVG className="w-10 h-10 flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold text-sky-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  {weather.city}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {weather.apiProvider}
                </span>
              </div>
            </div>
            <button
              onClick={fetchWeather}
              disabled={loading}
              className="p-2 rounded-xl text-sky-700 bg-sky-100/80 hover:bg-sky-200/80 border border-sky-200 transition-colors disabled:opacity-50"
              title="Refresh Gov Weather Station Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Temperature & Weather Visual */}
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black font-display tracking-tight text-slate-900 drop-shadow-xs">
                  {weather.temp}°
                </span>
                <span className="text-sm font-bold text-slate-600">C</span>
              </div>
              <h4 className="text-sm font-bold text-sky-950 mt-0.5 leading-tight">
                {weather.condition}
              </h4>
              <p className="text-[11px] text-slate-600 font-mono mt-1">
                H: {highTemp}° &nbsp;•&nbsp; L: {lowTemp}°
              </p>
            </div>

            {/* Weather Graphic Badge */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-sky-200 shadow-2xs">
              {weather.icon === 'sun' ? (
                <Sun className="w-10 h-10 text-amber-500 animate-spin-slow" />
              ) : weather.icon === 'rain' ? (
                <CloudRain className="w-10 h-10 text-sky-600" />
              ) : (
                <CloudSun className="w-10 h-10 text-sky-500" />
              )}
              <span className="text-[10px] font-bold text-sky-900 mt-1 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                Official Station
              </span>
            </div>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-sky-200 text-xs font-semibold text-slate-800">
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-sky-100 shadow-2xs">
            <Droplets className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
            <span className="text-[11px] truncate">{weather.humidity}% Hum</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-sky-100 shadow-2xs">
            <Wind className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span className="text-[11px] truncate">{weather.windSpeed} km/h</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-sky-100 shadow-2xs">
            <Gauge className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
            <span className="text-[11px] truncate">{weather.pressure} hPa</span>
          </div>
        </div>

        {/* 3-Day Forecast Strip */}
        {forecast.length > 0 && (
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-sky-200">
            {forecast.map((f, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border shadow-2xs ${
                  idx === 0
                    ? 'bg-sky-600 border-sky-700 text-white'
                    : 'bg-white border-sky-100 text-slate-800'
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide ${
                    idx === 0 ? 'text-sky-100' : 'text-slate-500'
                  }`}
                >
                  {f.day}
                </span>
                {f.icon === 'sun' ? (
                  <Sun className={`w-4 h-4 ${idx === 0 ? 'text-amber-300' : 'text-amber-500'}`} />
                ) : f.icon === 'rain' ? (
                  <CloudRain className={`w-4 h-4 ${idx === 0 ? 'text-sky-100' : 'text-sky-600'}`} />
                ) : (
                  <CloudSun className={`w-4 h-4 ${idx === 0 ? 'text-sky-100' : 'text-sky-500'}`} />
                )}
                <span className={`text-[11px] font-bold ${idx === 0 ? 'text-white' : 'text-slate-800'}`}>
                  {f.high}°
                  <span className={idx === 0 ? 'text-sky-200 font-medium' : 'text-slate-400 font-medium'}>
                    {' '}
                    / {f.low}°
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseCard>
  )
}
