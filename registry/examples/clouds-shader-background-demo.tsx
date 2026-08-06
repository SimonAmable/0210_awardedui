import { CloudsShaderBackground } from "@/registry/components/clouds-shader-background"

export function CloudsShaderBackgroundDemo({ preview = false }: { preview?: boolean }) {
  return <CloudsShaderBackground className={preview ? "h-64 w-full" : "w-full"} />
}
