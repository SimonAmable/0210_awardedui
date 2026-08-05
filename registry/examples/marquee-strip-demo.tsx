import { MarqueeStrip } from "@/registry/components/marquee-strip"

export function MarqueeStripDemo() {
  return <div className="flex min-h-[16rem] items-center"><MarqueeStrip><span>Design direction</span><span aria-hidden="true">✳</span><span>Built to ship</span><span aria-hidden="true">✳</span><span>Source owned</span><span aria-hidden="true">✳</span></MarqueeStrip></div>
}
