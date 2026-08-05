import { ShaderBackground, type ShaderBackgroundProps } from "./shader-background"

export type CausticsShaderBackgroundProps = ShaderBackgroundProps

export function CausticsShaderBackground({ preset = "caustics", ...props }: CausticsShaderBackgroundProps) {
  return <ShaderBackground {...props} preset={preset} mode="caustics" />
}
