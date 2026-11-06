// ============================================================================
// TIER 2: API CONTROLLER - /api/tasks/[id] (PATCH update, DELETE task)
// ============================================================================
import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "@/services/taskService";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await TaskService.updateTask(id, body);
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update task";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await TaskService.deleteTask(id);
    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete task";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
