import { isTauri } from '@/lib/db'

/**
 * Opens an external web URL in the user's default browser.
 * In Tauri native desktop context, uses @tauri-apps/plugin-shell.
 * In web browser context, uses window.open with secure attributes.
 */
export async function openExternalUrl(rawUrl: string | undefined | null) {
  if (!rawUrl) return
  let href = rawUrl.trim()
  if (!href) return

  // Automatically prepend https:// if missing a protocol scheme
  if (!/^https?:\/\//i.test(href)) {
    href = `https://${href}`
  }

  if (isTauri()) {
    try {
      const { open } = await import('@tauri-apps/plugin-shell')
      await open(href)
      return
    } catch (err) {
      console.warn('Tauri shell open failed, falling back to window.open', err)
    }
  }

  window.open(href, '_blank', 'noopener,noreferrer')
}

/**
 * Extracts a concise display hostname/domain from a full URL.
 * e.g., "https://github.com/my/repo" -> "github.com"
 */
export function getCleanDomain(rawUrl: string | undefined | null): string {
  if (!rawUrl) return ''
  try {
    let href = rawUrl.trim()
    if (!/^https?:\/\//i.test(href)) {
      href = `https://${href}`
    }
    const parsed = new URL(href)
    return parsed.hostname.replace(/^www\./i, '')
  } catch {
    return rawUrl
  }
}
