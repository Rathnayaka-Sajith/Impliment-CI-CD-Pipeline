// ============================================================================
// TIER 2: API CONTROLLER - /api/projects (GET all, POST create)
// ============================================================================
import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/services/projectService";

export async function GET() {
  try {
    const projects = await ProjectService.getAllProjects();
    return NextResponse.json({ data: projects }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch projects";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const project = await ProjectService.createProject(body);
    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
