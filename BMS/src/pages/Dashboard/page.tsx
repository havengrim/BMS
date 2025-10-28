"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { Button } from "@/components/ui/button"
import { useExportReports } from "@/stores/useCertificates"
import { Download } from "lucide-react"
import data from "./data.json"

export default function Page() {
  const exportReports = useExportReports()

  const handleExport = () => {
    exportReports.mutate()
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

              {/* ✅ Export Button Section */}
              <div className="flex justify-end px-4 lg:px-6">
                <Button
                  onClick={handleExport}
                  disabled={exportReports.isPending}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {exportReports.isPending ? "Exporting..." : "Download Reports"}
                </Button>
              </div>

              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
