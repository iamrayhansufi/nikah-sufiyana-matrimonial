import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/auth"
import { 
  generateUserReport, 
  generateRevenueReport, 
  generateActivityReport,
  type UserReportEntry,
  type RevenueReportEntry,
  type ActivityReportEntry 
} from "@/lib/reports"

type ReportType = "users" | "revenue" | "activity"
type ReportFormat = "json" | "csv"

type ReportData = UserReportEntry | RevenueReportEntry | ActivityReportEntry

export async function GET(request: NextRequest) {
  try {
    const adminUser = await verifyAdminAuth(request)
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get("type") as ReportType | null
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const format = (searchParams.get("format") || "json") as ReportFormat

    if (!reportType) {
      return NextResponse.json({ error: "Report type is required" }, { status: 400 })
    }

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 })
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 })
    }

    if (end < start) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 })
    }

    let reportData: UserReportEntry[] | RevenueReportEntry[] | ActivityReportEntry
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
      const csv = convertToCSV(reportData, reportType)
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
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    }, { status: 500 })
  }
}

function convertToCSV(
  data: UserReportEntry[] | RevenueReportEntry[] | ActivityReportEntry,
  reportType: ReportType
): string {
  if (reportType === "activity") {
    const activityData = data as ActivityReportEntry
    const registrationRows = activityData.dailyRegistrations.map(({ date, registrations }) => 
      `Registration,${date},${registrations}`
    )
    const statusRows = activityData.statusBreakdown.map(({ status, count }) => 
      `Status,${status},${count}`
    )
    return ["Type,Label,Count", ...registrationRows, ...statusRows].join("\n")
  }

  const arrayData = data as (UserReportEntry[] | RevenueReportEntry[])
  if (!arrayData.length) return ""

  const headers = Object.keys(arrayData[0]).join(",")
  const rows = arrayData.map((row) => 
    Object.values(row).map(value => {
      if (value instanceof Date) {
        return value.toISOString()
      }
      return String(value)
    }).join(",")
  )
  return [headers, ...rows].join("\n")
}

