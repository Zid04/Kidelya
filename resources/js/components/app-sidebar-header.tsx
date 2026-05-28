import { Breadcrumbs } from "@/components/breadcrumbs"
import type { BreadcrumbItem as BreadcrumbItemType } from "@/types"

export function AppSidebarHeader({
  breadcrumbs = [],
}: {
  breadcrumbs?: BreadcrumbItemType[]
}) {
  return (
    <header className="flex h-16 items-center border-b border-[#FDC600]/40 px-6 bg-white">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
    </header>
  )
}
