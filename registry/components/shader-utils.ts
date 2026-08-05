export const shaderVertexShader = `attribute vec2 a_position; void main(){ gl_Position=vec4(a_position,0.,1.); }`

export const shaderColorPresets = {
  smoke: ["#000000", "#00FF37", "#B6FF41", "#000000"],
  caustics: ["#020617", "#075985", "#22d3ee", "#ecfeff"],
  ember: ["#180000", "#7f1d1d", "#f97316", "#fef3c7"],
  aurora: ["#020617", "#312e81", "#22c55e", "#d9f99d"],
} as const

export type ShaderColorPreset = keyof typeof shaderColorPresets
export const defaultOffset = { x: 0, y: 0 }

export interface ShaderBackgroundProps {
  colors?: string[]
  preset?: ShaderColorPreset
  intensity?: number
  zoom?: number
  warp?: number
  contrast?: number
  speed?: number
  grain?: number
  drift?: number
  animate?: boolean
  reverse?: boolean
  rotation?: number
  offset?: { x: number; y: number }
  seed?: number
  smoothBlend?: boolean
  cursor?: boolean
  cursorEffect?: "velocity" | "repel" | "swirl" | "ripple"
  cursorStrength?: number
  cursorRadius?: number
  className?: string
}

export function hexToRgb(hex: string) {
  const value = hex.replace("#", "")
  const number = Number.parseInt(value.length === 3 ? value.split("").map((part) => part + part).join("") : value, 16)
  return [((number >> 16) & 255) / 255, ((number >> 8) & 255) / 255, (number & 255) / 255]
}

export function resolvePalette(colors: string[] | undefined, preset: ShaderColorPreset) {
  const validColors = colors?.filter((color) => /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(color)).slice(0, 8)
  return validColors?.length ? validColors : shaderColorPresets[preset]
}
