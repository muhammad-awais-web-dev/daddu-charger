"use client";

import React from "react";
import { useTransition } from "./TransitionContext";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function TransitionLink({ href, children, className }: TransitionLinkProps) {
  const { startTransition } = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(href);
  };

  return (
    <div onClick={handleClick} className={`${className || ""} cursor-pointer`}>
      {children}
    </div>
  );
}
