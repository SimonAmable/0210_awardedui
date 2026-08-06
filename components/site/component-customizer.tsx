"use client"

import { useState } from "react"

import { ComponentPreview } from "@/components/site/component-preview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CausticsShaderBackground } from "@/registry/components/caustics-shader-background"
import { CloudsShaderBackground } from "@/registry/components/clouds-shader-background"
import { ImposterSyndromeShader } from "@/registry/components/imposter-syndrome-shader"
import { MarqueeStrip } from "@/registry/components/marquee-strip"
import { SmokeShaderBackground } from "@/registry/components/smoke-shader-background"
import type { RegistryItemMetadata } from "@/lib/registry-types"

function PropList({ item }: { item: RegistryItemMetadata }) {
  return <section className="mt-8"><h2 className="text-lg font-semibold">Props</h2><div className="mt-3 overflow-hidden rounded-lg border"><div className="grid grid-cols-[minmax(7rem,1fr)_minmax(7rem,1fr)_5rem] gap-3 border-b bg-muted/30 px-4 py-2 text-xs font-medium text-muted-foreground"><span>Name</span><span>Type</span><span>Default</span></div>{item.props.map((prop) => <div key={prop.name} className="grid grid-cols-[minmax(7rem,1fr)_minmax(7rem,1fr)_5rem] gap-3 border-b px-4 py-3 text-xs last:border-b-0"><div><code className="font-medium text-foreground">{prop.name}</code><p className="mt-1 text-muted-foreground md:hidden">{prop.description}</p></div><code className="break-words text-muted-foreground">{prop.type}</code><code className="text-muted-foreground">{prop.defaultValue}</code></div>)}</div></section>
}

function RangeField({ id, label, value, onChange, min, max, step = 1, suffix = "" }: { id: string; label: string; value: number; onChange: (value: number) => void; min: number; max: number; step?: number; suffix?: string }) {
  return <div><div className="flex items-center justify-between gap-3"><Label htmlFor={id}>{label}</Label><span className="font-mono text-xs text-muted-foreground">{value}{suffix}</span></div><Input id={id} className="mt-2 h-9 px-0" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></div>
}

function Toggle({ pressed, onPressedChange, children }: { pressed: boolean; onPressedChange: (pressed: boolean) => void; children: React.ReactNode }) {
  return <Button type="button" variant={pressed ? "default" : "outline"} size="sm" aria-pressed={pressed} onClick={() => onPressedChange(!pressed)}>{children}</Button>
}

export function ComponentCustomizer({ item }: { item: RegistryItemMetadata }) {
  const [duration, setDuration] = useState(28)
  const [direction, setDirection] = useState<"left" | "right">("left")
  const [colors, setColors] = useState(item.customizer === "shader-caustics" ? ["#020617", "#075985", "#22d3ee", "#ecfeff"] : ["#000000", "#00FF37", "#B6FF41", "#000000"])
  const [style, setStyle] = useState<"smoke" | "caustics">(item.customizer === "shader-caustics" ? "caustics" : "smoke")
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

  if (item.customizer === "generic") return <div className="mt-4"><div className="rounded-lg border bg-muted/20 p-3 sm:p-6"><ComponentPreview slug={item.slug} /></div><PropList item={item} /></div>
  if (item.customizer === "clouds") return <div className="mt-4"><div className="rounded-lg border bg-muted/20 p-3 sm:p-6"><CloudsShaderBackground className="w-full" /></div><section className="mt-8"><h2 className="text-lg font-semibold">Customize</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">The cloud field uses the supplied Shadertoy-style uniforms and responds to pointer clicks through <code>iMouse</code>.</p></section><PropList item={item} /></div>
  if (item.customizer === "scene") return <div className="mt-4"><div className="rounded-lg border bg-muted/20 p-3 sm:p-6"><ImposterSyndromeShader /></div><section className="mt-8"><h2 className="text-lg font-semibold">Customize</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Open the preview to interact with the original Shadertoy shader and drag the sun across the sky.</p></section><PropList item={item} /></div>

  const isMarquee = item.customizer === "marquee"
  const isCaustics = item.customizer === "shader-caustics"
  const Shader = isCaustics ? CausticsShaderBackground : SmokeShaderBackground
  const preview = isMarquee ? <MarqueeStrip duration={duration} direction={direction}><span>Design direction</span><span aria-hidden="true">✳</span><span>Built to ship</span><span aria-hidden="true">✳</span><span>Source owned</span><span aria-hidden="true">✳</span></MarqueeStrip> : <div className="relative isolate h-[22rem] overflow-hidden rounded-md bg-black"><Shader colors={colors} preset={style} intensity={intensity} speed={speed} drift={drift} zoom={zoom} warp={warp} contrast={contrast} rotation={rotation} grain={grain} seed={seed} offset={{ x: offsetX, y: offsetY }} animate={animate} reverse={reverse} smoothBlend={smoothBlend} cursor={cursor} cursorEffect={cursorEffect} cursorStrength={cursorStrength} cursorRadius={cursorRadius} /><div className="relative z-10 flex h-full max-w-md flex-col justify-end p-6 text-white"><span className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">{isCaustics ? "Caustics background" : "Smoke background"}</span><h3 className="mt-2 text-2xl font-semibold tracking-tight">{isCaustics ? "Caustics, shaped in real time." : "Smoke, shaped in real time."}</h3><p className="mt-2 text-sm text-white/70">Move your pointer after enabling the cursor effect.</p></div></div>

  return <div className="mt-4"><div className="rounded-lg border bg-muted/20 p-3 sm:p-6">{preview}</div><section className="mt-8"><h2 className="text-lg font-semibold">Customize</h2><p className="mt-1 text-sm text-muted-foreground">Adjust the live preview with the component&apos;s public props.</p>{isMarquee ? <div className="mt-4 grid gap-4 sm:grid-cols-2"><RangeField id="marquee-duration" label="Duration" value={duration} onChange={setDuration} min={10} max={60} suffix="s" /><div><Label htmlFor="marquee-direction">Direction</Label><Select value={direction} onValueChange={(value) => value && setDirection(value)}><SelectTrigger id="marquee-direction" className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="left">Left</SelectItem><SelectItem value="right">Right</SelectItem></SelectContent></Select></div></div> : <div className="mt-4 space-y-6"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><div><Label htmlFor="shader-style">Style</Label><Select value={style} onValueChange={(value) => value && setStyle(value)}><SelectTrigger id="shader-style" className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="smoke">Smoke</SelectItem><SelectItem value="caustics">Caustics</SelectItem></SelectContent></Select></div><div className="sm:col-span-2"><Label>Colours</Label><div className="mt-2 flex flex-wrap gap-2">{colors.map((color, index) => <Input key={index} aria-label={`Colour ${index + 1}`} type="color" value={color} onChange={(event) => updateColor(index, event.target.value)} className="h-10 w-14 cursor-pointer p-1" />)}</div></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><RangeField id="shader-intensity" label="Intensity" value={intensity} onChange={setIntensity} min={0} max={100} /><RangeField id="shader-speed" label="Speed" value={speed} onChange={setSpeed} min={0} max={100} /><RangeField id="shader-drift" label="Drift" value={drift} onChange={setDrift} min={0} max={100} /><RangeField id="shader-zoom" label="Zoom" value={zoom} onChange={setZoom} min={0} max={100} /><RangeField id="shader-warp" label="Warp" value={warp} onChange={setWarp} min={0} max={100} /><RangeField id="shader-contrast" label="Contrast" value={contrast} onChange={setContrast} min={0} max={100} /><RangeField id="shader-rotation" label="Rotation" value={rotation} onChange={setRotation} min={-180} max={180} suffix="°" /><RangeField id="shader-grain" label="Grain" value={grain} onChange={setGrain} min={0} max={100} /><RangeField id="shader-seed" label="Seed" value={seed} onChange={setSeed} min={0} max={100} /><RangeField id="shader-offset-x" label="Offset X" value={offsetX} onChange={setOffsetX} min={-100} max={100} /><RangeField id="shader-offset-y" label="Offset Y" value={offsetY} onChange={setOffsetY} min={-100} max={100} /><RangeField id="shader-cursor-strength" label="Cursor strength" value={cursorStrength} onChange={setCursorStrength} min={0} max={100} /></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><RangeField id="shader-cursor-radius" label="Cursor radius" value={cursorRadius} onChange={setCursorRadius} min={0} max={100} suffix="" /><div><Label htmlFor="shader-cursor-effect">Cursor effect</Label><Select value={cursorEffect} onValueChange={(value) => value && setCursorEffect(value)}><SelectTrigger id="shader-cursor-effect" className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="velocity">Velocity</SelectItem><SelectItem value="repel">Repel</SelectItem><SelectItem value="swirl">Swirl</SelectItem><SelectItem value="ripple">Ripple</SelectItem></SelectContent></Select></div><div><Label>Playback and effects</Label><div className="mt-2 flex flex-wrap gap-2"><Toggle pressed={animate} onPressedChange={setAnimate}>Animate</Toggle><Toggle pressed={reverse} onPressedChange={setReverse}>Reverse</Toggle><Toggle pressed={smoothBlend} onPressedChange={setSmoothBlend}>Smooth blend</Toggle><Toggle pressed={cursor} onPressedChange={setCursor}>Cursor</Toggle></div></div></div></div>}</section><PropList item={item} /></div>
}
