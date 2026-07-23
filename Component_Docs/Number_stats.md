# Basic Number Ticker

> A component that animates a number from one value to another.

## Table of Contents

- [Installation](#installation)
  - [Cli](#cli)
  - [Manual](#manual)
    - [basic-number-ticker](#basic-number-ticker)
- [Examples](#examples)
  - [Controlling the animation from outside the component](#controlling-the-animation-from-outside-the-component)
- [Props](#props)

Example:

```tsx
import NumberTicker from "@/components/fancy/text/basic-number-ticker"

const NumberTickerDemo = () => {
  return (
    <div className="p-10 flex w-dvw h-dvh justify-center items-center bg-white">
      <p className="w-full text-7xl md:text-9xl flex justify-center font-azeret-mono text-[#1f464d]">
        <NumberTicker
          from={0}
          target={100}
          autoStart={true}
          transition={{ duration: 3.5, type: "tween", ease: "easeInOut" }}
          onComplete={() => console.log("complete")}
          onStart={() => console.log("start")}
        />
        %
      </p>
    </div>
  )
}

export default NumberTickerDemo

```

## Installation

### Cli

```bash
npx shadcn add @fancy/basic-number-ticker
```

### Manual

#### basic-number-ticker

```tsx
"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"
import {
  animate,
  AnimationPlaybackControls,
  motion,
  useMotionValue,
  useTransform,
  ValueAnimationTransition,
} from "motion/react"

import { cn } from "@/lib/utils"

interface NumberTickerProps {
  from: number // Starting value of the animation
  target: number // End value of the animation
  transition?: ValueAnimationTransition // Animation configuration, refer to motion docs for more details
  className?: string // additionl CSS classes for styling
  onStart?: () => void // Callback function when animation starts
  onComplete?: () => void // Callback function when animation completes
  autoStart?: boolean // Whether to start the animation automatically
}

// Ref interface to allow external control of the animation
export interface NumberTickerRef {
  startAnimation: () => void
}

const NumberTicker = forwardRef<NumberTickerRef, NumberTickerProps>(
  (
    {
      from = 0,
      target = 100,
      transition = {
        duration: 3,
        type: "tween",
        ease: "easeInOut",
      },
      className,
      onStart,
      onComplete,
      autoStart = true,
      ...props
    },
    ref
  ) => {
    const count = useMotionValue(from)
    const rounded = useTransform(count, (latest) => Math.round(latest))
    const [controls, setControls] = useState<AnimationPlaybackControls | null>(
      null
    )

    // Function to start the animation
    const startAnimation = useCallback(() => {
      if (controls) controls.stop()
      onStart?.()

      count.set(from)

      const newControls = animate(count, target, {
        ...transition,
        onComplete: () => {
          onComplete?.()
        },
      })
      setControls(newControls)
    }, [])

    // Expose the startAnimation function via ref
    useImperativeHandle(ref, () => ({
      startAnimation,
    }))

    useEffect(() => {
      if (autoStart) {
        startAnimation()
      }
      return () => controls?.stop()
    }, [autoStart])

    return (
      <motion.span className={cn(className)} {...props}>
        {rounded}
      </motion.span>
    )
  }
)

NumberTicker.displayName = "NumberTicker"

export default NumberTicker

// Usage example:
// To start the animation from outside the component:
// 1. Create a ref:
//    const tickerRef = useRef<NumberTickerRef>(null);
// 2. Pass the ref to the NumberTicker component:
//    <NumberTicker ref={tickerRef} from={0} target={100} autoStart={false} />
// 3. Call the startAnimation function:
//    tickerRef.current?.startAnimation();

```

## Examples

### Controlling the animation from outside the component

To start the animation from outside the component, you can use the `startAnimation` function that is exposed via the ref. In this example, the animation (re)start when the component enters the viewport.

Example:

```tsx
"use client"

import { useEffect, useRef } from "react"
import {
  Activity,
  ArrowDownRight,
  DollarSign,
  LucideIcon,
  TrendingUp,
  Zap,
} from "lucide-react"
import { motion, useInView } from "motion/react"

import NumberTicker, {
  NumberTickerRef,
} from "@/components/fancy/text/basic-number-ticker"

const cards = [
  {
    title: "Revenue",
    icon: DollarSign,
    from: 0,
    target: 1250321,
    prefix: "$",
    suffix: "",
    gradient: "from-gray-100 to-blue-400",
    size: "large",
  },
  {
    title: "Conversion Rate",
    icon: TrendingUp,
    from: 0,
    target: 12.5,
    prefix: "",
    suffix: "%",
    gradient: "from-gray-100 to-purple-200",
    size: "small",
  },
  {
    title: "Bounce Rate",
    icon: ArrowDownRight,
    from: 100,
    target: 35.8,
    prefix: "",
    suffix: "%",
    gradient: "from-gray-100 to-orange-200",
    size: "small",
  },
  {
    title: "Avg. Session Duration",
    icon: Zap,
    from: 0,
    target: 245,
    prefix: "",
    suffix: "s",
    gradient: "from-gray-100 to-purple-200",
    size: "small",
  },
  {
    title: "New Users",
    icon: TrendingUp,
    from: 0,
    target: 15420,
    prefix: "",
    suffix: "",
    gradient: "from-gray-100 to-orange-200",
    size: "small",
  },
  {
    title: "Active Users",
    icon: Activity,
    from: 0,
    target: 8750,
    prefix: "",
    suffix: "",
    gradient: "from-gray-100 to-blue-200",
    size: "small",
  },
]

interface CardProps {
  title: string
  icon: LucideIcon
  from: number
  target: number
  prefix: string
  suffix: string
  gradient: string
  size: string
}

const Card = ({ card, index }: { card: CardProps; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const tickerRef = useRef<NumberTickerRef>(null)
  const inView = useInView(cardRef, { once: false })

  useEffect(() => {
    if (inView) {
      tickerRef.current?.startAnimation()
    }
  }, [inView])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`p-6 bg-linear-to-b from-50% to-130% flex justify-between flex-col text-foreground dark:text-muted ${
        card.gradient
      } ${card.size === "large" ? "col-span-2 row-span-2" : ""}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs md:text-sm">{card.title}</h3>
        <card.icon className={`h-4 w-4`} />
      </div>
      <div
        className={`${card.size === "large" ? "text-2xl md:text-5xl" : "text-xl md:text-3xl"}`}
      >
        {card.prefix}
        <NumberTicker
          ref={tickerRef}
          from={card.from}
          target={card.target}
          transition={{
            duration: 3,
            ease: "easeInOut",
            type: "tween",
            delay: index * 0.2,
          }}
          className="tabular-nums"
          autoStart={false}
        />
        {card.suffix}
      </div>
    </motion.div>
  )
}

export default function FancyNumberTickerDemo() {
  return (
    <div className="w-dvw h-dvh font-azeret-mono bg-white">
      <div className="grid grid-cols-3 grid-rows-2 h-full">
        {cards.map((card, index) => (
          <Card key={index} card={card} index={index} />
        ))}
      </div>
    </div>
  )
}

```

## Props

| Prop | Type | Default | Description |
|----------|----------|----------|----------|
| from* | `number` | `0` | Starting value of the animation |
| target* | `number` | `100` | End value of the animation |
| transition | `ValueAnimationTransition` | `{ duration: 3, type: "tween", ease: "easeInOut" }` | Animation configuration, refer to motion docs for more details |
| className | `string` | `undefined` | Additional CSS classes for styling |
| onStart | `() => void` | `undefined` | Callback function when animation starts |
| onComplete | `() => void` | `undefined` | Callback function when animation completes |
| autoStart | `boolean` | `true` | Whether to start the animation automatically |

---

*This documentation is also available in [interactive format](https://fancycomponents.dev/docs/components/components/text/basic-number-ticker).*