// ============================================================================
// TIER 2: API CONTROLLER - /api/stats (GET dashboard statistics)
// ============================================================================
import { NextResponse } from "next/server";
import { TaskService } from "@/services/taskService";

export async function GET() {
  try {
    const stats = await TaskService.getDashboardStats();
    return NextResponse.json({ data: stats }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load statistics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
