"use client";

import { useEffect, useRef } from "react";
import { useTransition } from "./TransitionContext";

export function PageTransitionCompleter() {
  const { finishTransition } = useTransition();
  const hasFinished = useRef(false);

  useEffect(() => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    finishTransition();
  }, [finishTransition]);

  return null;
}
