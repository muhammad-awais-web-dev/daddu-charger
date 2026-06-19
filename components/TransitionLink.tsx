"use client";

import React from "react";
import { useTransition } from "./TransitionContext";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  loaderText?: string;
}

export function TransitionLink({ href, children, className, loaderText }: TransitionLinkProps) {
  const { startTransition } = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(href, loaderText);
  };

  return (
    <div onClick={handleClick} className={`${className || ""} cursor-pointer`}>
      {children}
    </div>
  );
}
