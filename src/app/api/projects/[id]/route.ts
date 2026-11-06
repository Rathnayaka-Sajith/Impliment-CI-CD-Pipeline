// ============================================================================
// TIER 2: API CONTROLLER - /api/projects/[id] (DELETE project)
// ============================================================================
import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/services/projectService";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ProjectService.deleteProject(id);
    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete project";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
