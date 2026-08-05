import { ImposterSyndromeShader } from "@/registry/components/imposter-syndrome-shader"

export function ImposterSyndromeShaderDemo({ preview = false }: { preview?: boolean }) {
  return <ImposterSyndromeShader className={preview ? "h-64" : "w-full"} />
}
