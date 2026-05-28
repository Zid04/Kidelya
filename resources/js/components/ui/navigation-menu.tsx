import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "flex list-none items-center justify-center gap-2",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  `
  inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold
  transition-all duration-200 cursor-pointer

  bg-white text-[#93197D] border border-[#FDC600]/40
  hover:bg-[#FFF4CC] hover:border-[#FDC600]
  focus:ring-2 focus:ring-[#E94E6F]/40 focus:border-[#E94E6F]

  data-[state=open]:bg-[#FFF4CC] data-[state=open]:border-[#FDC600]
  disabled:opacity-50 disabled:cursor-not-allowed
  `
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="ml-1 size-4 transition-transform duration-300 data-[state=open]:rotate-180"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        `
        p-4 rounded-xl border border-[#FDC600]/40 bg-white shadow-lg
        text-[#93197D] w-full md:w-auto

        data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out
        data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out
        data-[motion=from-end]:slide-in-from-right-52
        data-[motion=from-start]:slide-in-from-left-52
        data-[motion=to-end]:slide-out-to-right-52
        data-[motion=to-start]:slide-out-to-left-52
        `,
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute top-full left-0 z-50 flex justify-center">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          `
          mt-2 rounded-xl border border-[#FDC600]/40 bg-white shadow-lg
          overflow-hidden
          data-[state=open]:animate-in data-[state=closed]:animate-out
          data-[state=open]:zoom-in-90 data-[state=closed]:zoom-out-95
          `,
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        `
        flex flex-col gap-1 p-3 rounded-lg text-sm transition-all
        text-[#93197D]
        hover:bg-[#FDC600]/20 hover:text-[#93197D]
        focus:ring-2 focus:ring-[#E94E6F]/40
        `,
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        `
        top-full z-10 flex h-2 items-end justify-center
        data-[state=visible]:animate-in data-[state=hidden]:animate-out
        data-[state=visible]:fade-in data-[state=hidden]:fade-out
        `,
        className
      )}
      {...props}
    >
      <div className="h-3 w-3 rotate-45 bg-[#FDC600] shadow-md rounded-sm" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
