import { ShaderBackground, type ShaderBackgroundProps } from "./shader-background"

export type SmokeShaderBackgroundProps = ShaderBackgroundProps & {
  /** @deprecated Use CausticsShaderBackground for the caustics effect. */
  style?: "smoke" | "caustics"
}

export function SmokeShaderBackground({ preset = "smoke", style = "smoke", ...props }: SmokeShaderBackgroundProps) {
  return <ShaderBackground {...props} preset={preset} mode={style} />
}
