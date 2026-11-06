// ============================================================================
// TIER 2: BUSINESS LOGIC LAYER - Project Service
// Handles validation, domain logic, and communicates with Tier 3 (Prisma DB)
// ============================================================================
import { prisma } from "@/lib/db";

export class ProjectService {
  /**
   * Fetch all projects along with total task count and completed task count
   */
  static async getAllProjects() {
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: { tasks: true },
        },
        tasks: {
          select: { status: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return projects.map((project) => {
      const completedTasksCount = project.tasks.filter(
        (t) => t.status === "COMPLETED"
      ).length;
      const { tasks, ...rest } = project;
      return {
        ...rest,
        completedTasksCount,
      };
    });
  }

  /**
   * Validate and create a new project
   */
  static async createProject(data: {
    name: string;
    description?: string;
    color?: string;
  }) {
    const trimmedName = data.name?.trim();
    if (!trimmedName || trimmedName.length < 2) {
      throw new Error("Project name must be at least 2 characters long.");
    }

    return prisma.project.create({
      data: {
        name: trimmedName,
        description: data.description?.trim() || null,
        color: data.color || "#10b981",
      },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });
  }

  /**
   * Delete a project by ID (cascades to its tasks)
   */
  static async deleteProject(id: string) {
    if (!id) {
      throw new Error("Project ID is required.");
    }
    return prisma.project.delete({
      where: { id },
    });
  }
}
