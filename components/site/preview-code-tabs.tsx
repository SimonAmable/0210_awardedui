"use client"

import { ComponentCustomizer } from "@/components/site/component-customizer"
import { CodeBlock } from "@/components/site/code-block"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { RegistryItemMetadata } from "@/lib/registry-types"

export function PreviewCodeTabs({ item, code }: { item: RegistryItemMetadata; code: string }) {
  return <Tabs defaultValue="preview"><TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger></TabsList><TabsContent value="preview" className="mt-4 min-h-[38rem]"><ComponentCustomizer item={item} /></TabsContent><TabsContent value="code" className="mt-4 min-h-[38rem]"><CodeBlock code={code} label="Copy code" className="min-h-[38rem]" /></TabsContent></Tabs>
}
