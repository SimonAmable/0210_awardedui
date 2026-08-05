"use client"

import { useState, type SVGProps } from "react"

export function CharacterLogo({
  "aria-label": ariaLabel,
  className,
  onAnimationEnd,
  onPointerDown,
  ...props
}: SVGProps<SVGSVGElement>) {
  const decorative = !ariaLabel
  const [isClicked, setIsClicked] = useState(false)

  function handlePointerDown(event: React.PointerEvent<SVGSVGElement>) {
    setIsClicked(false)
    requestAnimationFrame(() => setIsClicked(true))
    onPointerDown?.(event)
  }

  function handleAnimationEnd(event: React.AnimationEvent<SVGSVGElement>) {
    if (event.animationName === "character-logo-blink") setIsClicked(false)
    onAnimationEnd?.(event)
  }

  return (
    <svg
      className={`character-logo ${className ?? ""}`}
      viewBox="0 0 100 100"
      fill="none"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={ariaLabel}
      onAnimationEnd={handleAnimationEnd}
      onPointerDown={handlePointerDown}
      {...props}
    >
      <path
        d="M50 4.5C75.9 4.5 93.8 23 94.6 48.1c.8 25.2-15.5 42.8-40 46.1C29.8 97.5 8.1 82.8 5.9 58.8 3.6 34.5 17.5 12.8 40.8 6.3 44 5.4 47.1 4.5 50 4.5Z"
        fill="currentColor"
      />
      <g className="character-logo__gaze">
        <g className={`character-logo__eyes ${isClicked ? "character-logo--clicked" : ""}`}>
          <path
            d="m25.5 38 8.5-8 8.5 8M57.5 38l8.5-8 8.5 8"
            stroke="hsl(var(--background))"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="6"
          />
        </g>
      </g>
      <path
        d="M25 59.5 37.5 74 50 59.5 62.5 74 75 59.5"
        stroke="hsl(var(--background))"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
      />
    </svg>
  )
}
