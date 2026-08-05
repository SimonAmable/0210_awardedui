"use client"

import { useState } from "react"

import { EditorialImageReveal } from "@/registry/components/editorial-image-reveal"
import { MarqueeStrip } from "@/registry/components/marquee-strip"
import { SmokeShaderBackground } from "@/registry/components/smoke-shader-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ComponentSlug = "marquee-strip" | "editorial-image-reveal" | "smoke-shader-background" | "caustics-shader-background"
type PropRow = [string, string, string, string]

const visual = <div className="h-full w-full bg-[radial-gradient(circle_at_70%_20%,#d4d4d8,transparent_13%),linear-gradient(135deg,#27272a_10%,#71717a_44%,#e4e4e7_44%,#f4f4f5)]" />

const propRows: Record<ComponentSlug, PropRow[]> = {
  "marquee-strip": [
    ["children", "ReactNode", "Required", "Content repeated in the strip."],
    ["duration", "number", "28", "Loop duration in seconds."],
    ["direction", '"left" | "right"', '"left"', "Scroll direction."],
    ["repeat", "number", "2", "Number of content copies."],
    ["className", "string", "—", "Optional wrapper classes."],
  ],
  "editorial-image-reveal": [
    ["eyebrow", "string", "—", "Small category label."],
    ["title", "string", "—", "Project title."],
    ["year", "string", "—", "Project date or year."],
    ["href", "string", "—", "Card link destination."],
    ["media", "ReactNode", "—", "Custom media displayed in the reveal."],
    ["className", "string", "—", "Optional wrapper classes."],
  ],
  "smoke-shader-background": [
    ["colors", "string[]", "preset palette", "One to eight custom colours; overrides the selected preset."],
    ["preset", '"smoke" | "caustics" | "ember" | "aurora"', '"smoke"', "Built-in palette used when colors is omitted."],
    ["intensity / contrast", "number", "100 / 25", "Output strength and tonal separation."],
    ["speed / drift", "number", "33 / 0", "Animation rate and directional travel."],
    ["zoom / warp", "number", "50 / 50", "Field scale and distortion."],
    ["grain / seed", "number", "74 / 0", "Noise texture and deterministic variation."],
    ["rotation / offset", "number / object", "0 / { 0, 0 }", "Field orientation and position."],
    ["animate / reverse", "boolean", "true / false", "Playback controls."],
    ["smoothBlend", "boolean", "false", "Ease palette transitions."],
    ["cursor*", "boolean / options", "off", "Optional pointer velocity, repel, swirl, or ripple effect."],
    ["className", "string", "—", "Optional canvas classes."],
  ],
  "caustics-shader-background": [
    ["colors", "string[]", "preset palette", "One to eight custom colours; overrides the selected preset."],
    ["preset", '"smoke" | "caustics" | "ember" | "aurora"', '"caustics"', "Built-in palette used when colors is omitted."],
    ["intensity / contrast", "number", "100 / 25", "Output strength and tonal separation."],
    ["speed / drift", "number", "33 / 0", "Animation rate and directional travel."],
    ["zoom / warp", "number", "50 / 50", "Field scale and distortion."],
    ["grain / seed", "number", "74 / 0", "Noise texture and deterministic variation."],
    ["rotation / offset", "number / object", "0 / { 0, 0 }", "Field orientation and position."],
    ["animate / reverse", "boolean", "true / false", "Playback controls."],
    ["smoothBlend", "boolean", "false", "Ease palette transitions."],
    ["cursor*", "boolean / options", "off", "Optional pointer velocity, repel, swirl, or ripple effect."],
  ],
}

function PropList({ slug }: { slug: ComponentSlug }) {
  return <section className="mt-8"><h2 className="text-lg font-semibold">Props</h2><div className="mt-3 overflow-hidden rounded-lg border"><div className="grid grid-cols-[minmax(7rem,1fr)_minmax(7rem,1fr)_5rem] gap-3 border-b bg-muted/30 px-4 py-2 text-xs font-medium text-muted-foreground"><span>Name</span><span>Type</span><span>Default</span></div>{propRows[slug].map(([name, type, defaultValue, description]) => <div key={name} className="grid grid-cols-[minmax(7rem,1fr)_minmax(7rem,1fr)_5rem] gap-3 border-b px-4 py-3 text-xs last:border-b-0"><div><code className="font-medium text-foreground">{name}</code><p className="mt-1 text-muted-foreground md:hidden">{description}</p></div><code className="break-words text-muted-foreground">{type}</code><code className="text-muted-foreground">{defaultValue}</code></div>)}</div></section>
}

function RangeField({ id, label, value, onChange, min, max, step = 1, suffix = "" }: { id: string; label: string; value: number; onChange: (value: number) => void; min: number; max: number; step?: number; suffix?: string }) {
  return <div><div className="flex items-center justify-between gap-3"><Label htmlFor={id}>{label}</Label><span className="font-mono text-xs text-muted-foreground">{value}{suffix}</span></div><Input id={id} className="mt-2 h-9 px-0" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></div>
}

function Toggle({ pressed, onPressedChange, children }: { pressed: boolean; onPressedChange: (pressed: boolean) => void; children: React.ReactNode }) {
  return <Button type="button" variant={pressed ? "default" : "outline"} size="sm" aria-pressed={pressed} onClick={() => onPressedChange(!pressed)}>{children}</Button>
}

export function ComponentCustomizer({ slug }: { slug: ComponentSlug }) {
  const [duration, setDuration] = useState(28)
  const [direction, setDirection] = useState<"left" | "right">("left")
  const [eyebrow, setEyebrow] = useState("Architecture")
  const [title, setTitle] = useState("A quiet study in material and light.")
  const [year, setYear] = useState("2026")
  const [colors, setColors] = useState(["#000000", "#00FF37", "#B6FF41", "#000000"])
  const [style, setStyle] = useState<"smoke" | "caustics">(slug === "caustics-shader-background" ? "caustics" : "smoke")
  const [intensity, setIntensity] = useState(100)
  const [speed, setSpeed] = useState(33)
  const [drift, setDrift] = useState(0)
  const [zoom, setZoom] = useState(50)
  const [warp, setWarp] = useState(50)
  const [contrast, setContrast] = useState(25)
  const [rotation, setRotation] = useState(0)
  const [grain, setGrain] = useState(74)
  const [seed, setSeed] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [reverse, setReverse] = useState(false)
  const [smoothBlend, setSmoothBlend] = useState(false)
  const [cursor, setCursor] = useState(false)
  const [cursorEffect, setCursorEffect] = useState<"velocity" | "repel" | "swirl" | "ripple">("velocity")
  const [cursorStrength, setCursorStrength] = useState(50)
  const [cursorRadius, setCursorRadius] = useState(50)

  const updateColor = (index: number, value: string) => setColors((current) => current.map((color, colorIndex) => colorIndex === index ? value : color))
  const preview = slug === "marquee-strip" ? <MarqueeStrip duration={duration} direction={direction}><span>Design direction</span><span aria-hidden="true">✳</span><span>Built to ship</span><span aria-hidden="true">✳</span><span>Source owned</span><span aria-hidden="true">✳</span></MarqueeStrip> : slug === "editorial-image-reveal" ? <EditorialImageReveal eyebrow={eyebrow} title={title} year={year} href="#editorial-image-reveal" media={visual} /> : <div className="relative isolate h-[22rem] overflow-hidden rounded-md bg-black"><SmokeShaderBackground colors={colors} style={style} intensity={intensity} speed={speed} drift={drift} zoom={zoom} warp={warp} contrast={contrast} rotation={rotation} grain={grain} seed={seed} offset={{ x: offsetX, y: offsetY }} animate={animate} reverse={reverse} smoothBlend={smoothBlend} cursor={cursor} cursorEffect={cursorEffect} cursorStrength={cursorStrength} cursorRadius={cursorRadius} /><div className="relative z-10 flex h-full max-w-md flex-col justify-end p-6 text-white"><span className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">WebGL background</span><h3 className="mt-2 text-2xl font-semibold tracking-tight">Smoke, shaped in real time.</h3><p className="mt-2 text-sm text-white/70">Move your pointer after enabling the cursor effect.</p></div></div>

  return <div className="mt-4"><div className="rounded-lg border bg-muted/20 p-3 sm:p-6">{preview}</div><section className="mt-8"><h2 className="text-lg font-semibold">Customize</h2><p className="mt-1 text-sm text-muted-foreground">Adjust the live preview with the component&apos;s public props.</p>{slug === "marquee-strip" ? <div className="mt-4 grid gap-4 sm:grid-cols-2"><RangeField id="marquee-duration" label="Duration" value={duration} onChange={setDuration} min={10} max={60} suffix="s" /><div><Label htmlFor="marquee-direction">Direction</Label><Select value={direction} onValueChange={(value: "left" | "right") => setDirection(value)}><SelectTrigger id="marquee-direction" className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="left">Left</SelectItem><SelectItem value="right">Right</SelectItem></SelectContent></Select></div></div> : slug === "editorial-image-reveal" ? <div className="mt-4 grid gap-4 sm:grid-cols-3"><div><Label htmlFor="editorial-eyebrow">Eyebrow</Label><Input id="editorial-eyebrow" className="mt-2" value={eyebrow} onChange={(event) => setEyebrow(event.target.value)} /></div><div><Label htmlFor="editorial-title">Title</Label><Input id="editorial-title" className="mt-2" value={title} onChange={(event) => setTitle(event.target.value)} /></div><div><Label htmlFor="editorial-year">Year</Label><Input id="editorial-year" className="mt-2" value={year} onChange={(event) => setYear(event.target.value)} /></div></div> : <div className="mt-4 space-y-6"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><div><Label htmlFor="shader-style">Style</Label><Select value={style} onValueChange={(value: "smoke" | "caustics") => setStyle(value)}><SelectTrigger id="shader-style" className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="smoke">Smoke</SelectItem><SelectItem value="caustics">Caustics</SelectItem></SelectContent></Select></div><div className="sm:col-span-2"><Label>Colours</Label><div className="mt-2 flex flex-wrap gap-2">{colors.map((color, index) => <Input key={index} aria-label={`Colour ${index + 1}`} type="color" value={color} onChange={(event) => updateColor(index, event.target.value)} className="h-10 w-14 cursor-pointer p-1" />)}</div></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><RangeField id="shader-intensity" label="Intensity" value={intensity} onChange={setIntensity} min={0} max={100} /><RangeField id="shader-speed" label="Speed" value={speed} onChange={setSpeed} min={0} max={100} /><RangeField id="shader-drift" label="Drift" value={drift} onChange={setDrift} min={0} max={100} /><RangeField id="shader-zoom" label="Zoom" value={zoom} onChange={setZoom} min={0} max={100} /><RangeField id="shader-warp" label="Warp" value={warp} onChange={setWarp} min={0} max={100} /><RangeField id="shader-contrast" label="Contrast" value={contrast} onChange={setContrast} min={0} max={100} /><RangeField id="shader-rotation" label="Rotation" value={rotation} onChange={setRotation} min={-180} max={180} suffix="°" /><RangeField id="shader-grain" label="Grain" value={grain} onChange={setGrain} min={0} max={100} /><RangeField id="shader-seed" label="Seed" value={seed} onChange={setSeed} min={0} max={100} /><RangeField id="shader-offset-x" label="Offset X" value={offsetX} onChange={setOffsetX} min={-100} max={100} /><RangeField id="shader-offset-y" label="Offset Y" value={offsetY} onChange={setOffsetY} min={-100} max={100} /><RangeField id="shader-cursor-strength" label="Cursor strength" value={cursorStrength} onChange={setCursorStrength} min={0} max={100} /></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><RangeField id="shader-cursor-radius" label="Cursor radius" value={cursorRadius} onChange={setCursorRadius} min={0} max={100} /><div><Label htmlFor="shader-cursor-effect">Cursor effect</Label><Select value={cursorEffect} onValueChange={(value: "velocity" | "repel" | "swirl" | "ripple") => setCursorEffect(value)}><SelectTrigger id="shader-cursor-effect" className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="velocity">Velocity</SelectItem><SelectItem value="repel">Repel</SelectItem><SelectItem value="swirl">Swirl</SelectItem><SelectItem value="ripple">Ripple</SelectItem></SelectContent></Select></div><div><Label>Playback and effects</Label><div className="mt-2 flex flex-wrap gap-2"><Toggle pressed={animate} onPressedChange={setAnimate}>Animate</Toggle><Toggle pressed={reverse} onPressedChange={setReverse}>Reverse</Toggle><Toggle pressed={smoothBlend} onPressedChange={setSmoothBlend}>Smooth blend</Toggle><Toggle pressed={cursor} onPressedChange={setCursor}>Cursor</Toggle></div></div></div></div>}</section><PropList slug={slug} /></div>
}
