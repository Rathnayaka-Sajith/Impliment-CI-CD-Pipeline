// ============================================================================
// TIER 2: API CONTROLLER - /api/tasks (GET filtered tasks, POST create task)
// ============================================================================
import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "@/services/taskService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") || undefined;
    const status = searchParams.get("status") || undefined;
    const priority = searchParams.get("priority") || undefined;
    const search = searchParams.get("search") || undefined;

    const tasks = await TaskService.getTasks({
      projectId,
      status,
      priority,
      search,
    });
    return NextResponse.json({ data: tasks }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch tasks";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const task = await TaskService.createTask(body);
    return NextResponse.json({ data: task }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create task";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
