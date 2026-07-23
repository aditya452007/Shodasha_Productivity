Installation
CLI
pnpm dlx shadcn@latest add https://animata.design/r/tabs/gooey-tabs.json
Copy
The registry item installs gooey-tabs.tsx and animata/tabs/shared.ts.

Manual
Install dependencies
npm install motion @phosphor-icons/react
CopyCopy
Run the following command
It will create a new file called gooey-tabs.tsx inside the components/animata/tabs directory.

``` mkdir "components/animata/tabs" && type null > "components/animata/tabs/shared.ts" && type null > "components/animata/tabs/gooey-tabs.tsx" ```


```ts

import { type FocusEvent, type KeyboardEvent, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/** Visible focus ring — use with a matching border-radius class. */
export function tabFocusClass(radiusClass: string) {
  return cn(
    radiusClass,
    "outline-none focus-visible:z-10",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  );
}

export function useTabSelection({
  defaultActiveIndex = 0,
  activeIndex: activeIndexProp,
  onActiveIndexChange,
}: {
  defaultActiveIndex?: number;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
}) {
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultActiveIndex);
  const [focusedIndex, setFocusedIndex] = useState(
    defaultActiveIndex >= 0 ? defaultActiveIndex : 0,
  );
  const activeIndex = activeIndexProp ?? uncontrolledIndex;

  const setActiveIndex = (index: number) => {
    onActiveIndexChange?.(index);
    if (activeIndexProp === undefined) {
      setUncontrolledIndex(index);
    }
    setFocusedIndex(index);
  };

  useEffect(() => {
    if (activeIndex >= 0) {
      setFocusedIndex(activeIndex);
    }
  }, [activeIndex]);

  return { activeIndex, setActiveIndex, focusedIndex, setFocusedIndex };
}

export function focusTabInList(tablist: HTMLElement, index: number) {
  queueMicrotask(() => {
    tablist.querySelectorAll<HTMLElement>('[role="tab"]')[index]?.focus();
  });
}

export function handleTabListFocusCapture(
  event: FocusEvent<HTMLElement>,
  activeIndex: number,
  setFocusedIndex: (index: number) => void,
) {
  const related = event.relatedTarget as Node | null;
  if (related && event.currentTarget.contains(related)) {
    return;
  }
  const index = activeIndex >= 0 ? activeIndex : 0;
  setFocusedIndex(index);
  focusTabInList(event.currentTarget, index);
}

/** Manual activation: arrows move focus; Enter / Space select the focused tab. */
export function handleTabListKeyDown(
  event: KeyboardEvent<HTMLElement>,
  count: number,
  setActiveIndex: (index: number) => void,
  setFocusedIndex: (index: number) => void,
) {
  if (count < 1) {
    return;
  }

  const tablist = event.currentTarget;
  const tabs = tablist.querySelectorAll<HTMLElement>('[role="tab"]');
  const target = event.target as HTMLElement;
  const currentTab = target.closest<HTMLElement>('[role="tab"]');

  if (!currentTab || !tablist.contains(currentTab)) {
    return;
  }

  const currentIndex = Array.from(tabs).indexOf(currentTab);
  if (currentIndex === -1) {
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    setActiveIndex(currentIndex);
    setFocusedIndex(currentIndex);
    return;
  }

  if (count < 2) {
    return;
  }

  let next: number | null = null;
  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      next = (currentIndex + 1) % count;
      break;
    case "ArrowLeft":
    case "ArrowUp":
      next = (currentIndex - 1 + count) % count;
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = count - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  setFocusedIndex(next);
  focusTabInList(tablist, next);
}


```

Example demo code 

```ts

"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import {
  Children,
  type ComponentProps,
  createContext,
  type FocusEvent,
  isValidElement,
  type KeyboardEvent,
  type ReactNode,
  use,
  useId,
} from "react";
import { cn } from "@/lib/utils";
import {
  handleTabListFocusCapture,
  handleTabListKeyDown,
  tabFocusClass,
  useTabSelection,
} from "./shared";

type GooeyTabsContextValue = {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  filterId: string;
  intensity: number;
  contrast: number;
  lightness: number;
};

const GooeyTabsContext = createContext<GooeyTabsContextValue | null>(null);

type GooeyTabSlotContextValue = {
  index: number;
  count: number;
};

const GooeyTabSlotContext = createContext<GooeyTabSlotContextValue | null>(null);

function useGooeyTabs() {
  const context = use(GooeyTabsContext);
  if (!context) {
    throw new Error("GooeyTabs primitives must be used within <GooeyTabs>.");
  }
  return context;
}

function useGooeyTabSlot() {
  const context = use(GooeyTabSlotContext);
  if (!context) {
    throw new Error("GooeyTabs.Tab must be a direct child of <GooeyTabs.List>.");
  }
  return context;
}

function textFromNode(node: ReactNode): string {
  if (node == null || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(textFromNode).join("");
  }
  if (isValidElement(node)) {
    return textFromNode((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function GooeyFilter({
  filterId,
  intensity,
  contrast,
  lightness,
  className,
  children,
}: {
  filterId: string;
  intensity: number;
  contrast: number;
  lightness: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{ filter: `url(#${filterId})`, isolation: "isolate" }}
      className={cn("relative flex flex-wrap rounded-sm", className)}
    >
      <svg aria-hidden className="absolute size-0" xmlns="http://www.w3.org/2000/svg">
        <title>Gooey filter</title>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={intensity} result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${contrast} ${lightness}`}
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      {children}
    </div>
  );
}

type GooeyTabsRootProps = {
  children: ReactNode;
  defaultActiveIndex?: number;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  intensity?: number;
  contrast?: number;
  lightness?: number;
  className?: string;
};

function GooeyTabsRoot({
  children,
  defaultActiveIndex = 0,
  activeIndex: activeIndexProp,
  onActiveIndexChange,
  intensity = 6,
  contrast = 18,
  lightness = -7,
  className,
}: GooeyTabsRootProps) {
  const { activeIndex, setActiveIndex, focusedIndex, setFocusedIndex } = useTabSelection({
    defaultActiveIndex,
    activeIndex: activeIndexProp,
    onActiveIndexChange,
  });
  const filterId = `gooey-tabs-${useId().replace(/:/g, "")}`;

  return (
    <GooeyTabsContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
        focusedIndex,
        setFocusedIndex,
        filterId,
        intensity,
        contrast,
        lightness,
      }}
    >
      <div className={className}>{children}</div>
    </GooeyTabsContext.Provider>
  );
}

type GooeyTabsListProps = ComponentProps<"nav"> & {
  "aria-label"?: string;
};

function GooeyTabsList({
  className,
  children,
  "aria-label": ariaLabel = "Tabs",
  onKeyDown,
  onFocusCapture,
  ...props
}: GooeyTabsListProps) {
  const { activeIndex, setActiveIndex, setFocusedIndex, filterId, intensity, contrast, lightness } =
    useGooeyTabs();
  const tabs = Children.toArray(children).filter(isValidElement);
  const count = tabs.length;

  return (
    <GooeyFilter
      filterId={filterId}
      intensity={intensity}
      contrast={contrast}
      lightness={lightness}
      className={cn({ "px-0": activeIndex !== -1 }, className)}
    >
      <nav aria-label={ariaLabel} className="overflow-visible" {...props}>
        <div
          role="tablist"
          onFocusCapture={(event: FocusEvent<HTMLElement>) => {
            onFocusCapture?.(event);
            handleTabListFocusCapture(event, activeIndex, setFocusedIndex);
          }}
          onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
            onKeyDown?.(event);
            if (!event.defaultPrevented) {
              handleTabListKeyDown(event, count, setActiveIndex, setFocusedIndex);
            }
          }}
          className="flex flex-wrap"
        >
          {tabs.map((tab, index) => (
            <GooeyTabSlotContext.Provider key={tab.key ?? index} value={{ index, count }}>
              {tab}
            </GooeyTabSlotContext.Provider>
          ))}
        </div>
      </nav>
    </GooeyFilter>
  );
}

function GooeyTabsIcon({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 empty:hidden [&_svg]:size-6", className)}
      {...props}
    />
  );
}

function GooeyTabsLabel({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("min-w-0 overflow-hidden select-none whitespace-nowrap text-sm", className)}
      {...props}
    />
  );
}

type GooeyTabsTabProps = Omit<HTMLMotionProps<"button">, "children"> & {
  color: string;
  label?: string;
  children?: ReactNode;
};

function getGooeyTabParts(
  children: ReactNode,
  Icon: typeof GooeyTabsIcon,
  Label: typeof GooeyTabsLabel,
) {
  let hasIcon = false;
  let visibleLabel = "";

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }
    if (child.type === Icon) {
      hasIcon = true;
    }
    if (child.type === Label) {
      visibleLabel += textFromNode((child.props as { children?: ReactNode }).children);
    }
  });

  return { hasIcon, visibleLabel: visibleLabel.trim() };
}

function gooeyTabGridClass(isSelected: boolean, hasIcon: boolean, hasLabel: boolean) {
  if (hasIcon && hasLabel) {
    return isSelected ? "grid-cols-[auto_1fr] gap-2 px-4" : "grid-cols-[auto_0fr] gap-0 px-2";
  }
  if (hasIcon) {
    return isSelected ? "grid-cols-[auto] px-4" : "grid-cols-[auto] px-2";
  }
  if (hasLabel) {
    return isSelected ? "grid-cols-[1fr] gap-0 px-4" : "grid-cols-[0fr] gap-0 px-2";
  }
  return isSelected ? "px-4" : "px-2";
}

function GooeyTabsTab({
  color,
  label,
  className,
  children,
  onClick,
  onFocus,
  ...props
}: GooeyTabsTabProps) {
  const { activeIndex, setActiveIndex, setFocusedIndex } = useGooeyTabs();
  const { index, count } = useGooeyTabSlot();
  const isSelected = activeIndex === index;

  const { hasIcon, visibleLabel } = getGooeyTabParts(children, GooeyTabsIcon, GooeyTabsLabel);
  const hasVisibleLabel = Boolean(visibleLabel);
  const ariaLabel = label ?? (hasVisibleLabel ? undefined : `Tab ${index + 1}`);

  return (
    <motion.button
      type="button"
      role="tab"
      aria-selected={isSelected}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setActiveIndex(index);
        }
      }}
      onFocus={(event: FocusEvent<HTMLButtonElement>) => {
        onFocus?.(event);
        if (!event.defaultPrevented) {
          setFocusedIndex(index);
        }
      }}
      className={cn(
        tabFocusClass(isSelected ? "rounded" : "rounded-sm"),
        "relative grid h-10 cursor-pointer items-center overflow-visible text-white",
        "transition-[grid-template-columns,gap,padding,margin,border-radius] duration-200 ease-in-out motion-reduce:transition-none",
        gooeyTabGridClass(isSelected, hasIcon, hasVisibleLabel),
        color,
        {
          "mx-4": isSelected && activeIndex !== 0 && activeIndex !== count - 1,
          "mr-4": isSelected && activeIndex === 0,
          "ml-4": isSelected && activeIndex === count - 1,
        },
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

const GooeyTabs = Object.assign(GooeyTabsRoot, {
  List: GooeyTabsList,
  Tab: GooeyTabsTab,
  Icon: GooeyTabsIcon,
  Label: GooeyTabsLabel,
});

export default GooeyTabs;
export { GooeyTabsIcon, GooeyTabsLabel, GooeyTabsList, GooeyTabsRoot, GooeyTabsTab, useGooeyTabs };


```




Usage
Compose tabs with primitives. Each GooeyTabs.Tab needs a color class string. GooeyTabs.Icon is optional — label-only, icon-only, or both. The grid columns adjust automatically. Icons are decorative (aria-hidden) when a label is visible; use the label prop for icon-only tabs.

import GooeyTabs from "@/animata/tabs/gooey-tabs";
import { HouseIcon } from "@phosphor-icons/react";
 
<GooeyTabs defaultActiveIndex={0}>
  <GooeyTabs.List>
    <GooeyTabs.Tab color="bg-violet-500 hover:bg-violet-600" label="Home">
      <GooeyTabs.Icon>
        <HouseIcon weight="duotone" aria-hidden />
      </GooeyTabs.Icon>
      <GooeyTabs.Label>Home</GooeyTabs.Label>
    </GooeyTabs.Tab>
  </GooeyTabs.List>
</GooeyTabs>
Copy
Use defaultActiveIndex={-1} for an all-icon row (none selected until Enter/Space or click). Structure: <nav>, inner role="tablist", and motion.button with role="tab" (SVG goo filter wraps the list).

Keyboard (manual activation): Tab visits every tab; arrow keys move focus; Enter or Space selects. Click selects immediately.

Use activeIndex and onActiveIndexChange for controlled mode. Optional intensity, contrast, and lightness on the root adjust the goo filter. Label width uses CSS grid (0fr / 1fr) with no layout measurement in JavaScript.