import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/auth"
import { generateUserReport, generateRevenueReport, generateActivityReport } from "@/lib/reports"

export async function GET(request: NextRequest) {
  try {
    const adminUser = await verifyAdminAuth(request)
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const format = searchParams.get("format") || "json"

    let reportData
    switch (reportType) {
      case "users":
        reportData = await generateUserReport(startDate, endDate)
        break
      case "revenue":
        reportData = await generateRevenueReport(startDate, endDate)
        break
      case "activity":
        reportData = await generateActivityReport(startDate, endDate)
        break
      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
    }

    if (format === "csv") {
      const csv = convertToCSV(reportData)
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${reportType}-report.csv"`,
        },
      })
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error("Reports API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function convertToCSV(data: any[]): string {
  if (!data.length) return ""

  const headers = Object.keys(data[0]).join(",")
  const rows = data.map((row) => Object.values(row).join(","))
  return [headers, ...rows].join("\n")
}
