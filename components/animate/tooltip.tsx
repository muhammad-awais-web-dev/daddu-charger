"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { motion, AnimatePresence, Transition } from "framer-motion";

interface TooltipProviderProps extends TooltipPrimitive.TooltipProviderProps {
  transition?: Transition;
  openDelay?: number;
  closeDelay?: number;
}

const TooltipContext = React.createContext<{
  transition?: Transition;
  openDelay?: number;
  closeDelay?: number;
}>({
  transition: { type: "spring", stiffness: 300, damping: 35 },
});

export function TooltipProvider({
  children,
  openDelay = 0,
  closeDelay = 300,
  transition = { type: "spring", stiffness: 300, damping: 35 },
  ...props
}: TooltipProviderProps) {
  return (
    <TooltipContext.Provider value={{ transition, openDelay, closeDelay }}>
      <TooltipPrimitive.Provider
        delayDuration={openDelay}
        skipDelayDuration={closeDelay}
        {...props}
      >
        {children}
      </TooltipPrimitive.Provider>
    </TooltipContext.Provider>
  );
}

interface TooltipProps extends TooltipPrimitive.TooltipProps {
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
}

const TooltipPropsContext = React.createContext<{
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  open?: boolean;
}>({});

export function Tooltip({
  children,
  side = "top",
  sideOffset = 10,
  align = "center",
  alignOffset = 0,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  ...props
}: TooltipProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  return (
    <TooltipPropsContext.Provider value={{ side, sideOffset, align, alignOffset, open }}>
      <TooltipPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </TooltipPrimitive.Root>
    </TooltipPropsContext.Provider>
  );
}

export const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  TooltipPrimitive.TooltipTriggerProps
>(({ asChild = false, ...props }, ref) => {
  return (
    <TooltipPrimitive.Trigger asChild={asChild} ref={ref} {...props} />
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  layout?: boolean | "position" | "size" | "preserve-aspect";
  transition?: Transition;
}

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>(({ children, className = "", layout = "preserve-aspect", transition, ...props }, ref) => {
  const providerContext = React.useContext(TooltipContext);
  const tooltipPropsContext = React.useContext(TooltipPropsContext);

  const activeTransition = transition || providerContext.transition;

  // Animation values based on the side it's aligning against
  const side = tooltipPropsContext.side || "top";
  
  const getInitialTranslate = () => {
    switch (side) {
      case "top":
        return { y: 4 };
      case "bottom":
        return { y: -4 };
      case "left":
        return { x: 4 };
      case "right":
        return { x: -4 };
      default:
        return { y: 4 };
    }
  };

  const initial = { opacity: 0, scale: 0.95, ...getInitialTranslate() };
  const animate = { opacity: 1, scale: 1, x: 0, y: 0 };
  const exit = { opacity: 0, scale: 0.95, ...getInitialTranslate() };

  return (
    <AnimatePresence>
      {tooltipPropsContext.open && (
        <TooltipPrimitive.Portal forceMount>
          <TooltipPrimitive.Content
            ref={ref}
            side={side}
            sideOffset={tooltipPropsContext.sideOffset}
            align={tooltipPropsContext.align}
            alignOffset={tooltipPropsContext.alignOffset}
            forceMount
            className="z-[9999]"
            {...props}
          >
            <motion.div
              layout={layout}
              initial={initial}
              animate={animate}
              exit={exit}
              transition={activeTransition}
              className={`overflow-hidden rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-900 shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 ${className}`}
              style={{ originX: 0.5, originY: 0.5 }}
            >
              {children}
            </motion.div>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      )}
    </AnimatePresence>
  );
});
TooltipContent.displayName = "TooltipContent";
