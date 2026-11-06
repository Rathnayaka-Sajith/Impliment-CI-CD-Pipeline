// ============================================================================
// TIER 2: BUSINESS LOGIC LAYER - Task Service
// Handles filtering, validation, status workflow, and analytics calculations
// ============================================================================
import { prisma } from "@/lib/db";
import { TaskPriority, TaskStatus } from "@/types";

const VALID_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "COMPLETED"];
const VALID_PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];

export class TaskService {
  /**
   * Get tasks with optional filters (projectId, status, priority, search)
   */
  static async getTasks(filters?: {
    projectId?: string;
    status?: string;
    priority?: string;
    search?: string;
  }) {
    const where: Record<string, unknown> = {};

    if (filters?.projectId && filters.projectId !== "ALL") {
      where.projectId = filters.projectId;
    }
    if (filters?.status && filters.status !== "ALL") {
      where.status = filters.status;
    }
    if (filters?.priority && filters.priority !== "ALL") {
      where.priority = filters.priority;
    }
    if (filters?.search?.trim()) {
      const q = filters.search.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
      ];
    }

    return prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });
  }

  /**
   * Validate and create a new task
   */
  static async createTask(data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    projectId: string;
    dueDate?: string | null;
  }) {
    const trimmedTitle = data.title?.trim();
    if (!trimmedTitle) {
      throw new Error("Task title is required.");
    }
    if (!data.projectId) {
      throw new Error("A task must belong to a project.");
    }

    const status: TaskStatus =
      data.status && VALID_STATUSES.includes(data.status)
        ? data.status
        : "TODO";
    const priority: TaskPriority =
      data.priority && VALID_PRIORITIES.includes(data.priority)
        ? data.priority
        : "MEDIUM";

    return prisma.task.create({
      data: {
        title: trimmedTitle,
        description: data.description?.trim() || null,
        status,
        priority,
        projectId: data.projectId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: {
        project: {
          select: { id: true, name: true, color: true },
        },
      },
    });
  }

  /**
   * Update an existing task (status, priority, title, description, dueDate)
   */
  static async updateTask(
    id: string,
    data: Partial<{
      title: string;
      description: string | null;
      status: TaskStatus;
      priority: TaskPriority;
      projectId: string;
      dueDate: string | null;
    }>
  ) {
    if (!id) {
      throw new Error("Task ID is required.");
    }

    const updatePayload: Record<string, unknown> = {};
    if (data.title !== undefined) {
      const trimmed = data.title.trim();
      if (!trimmed) throw new Error("Task title cannot be empty.");
      updatePayload.title = trimmed;
    }
    if (data.description !== undefined) {
      updatePayload.description = data.description?.trim() || null;
    }
    if (data.status !== undefined) {
      if (!VALID_STATUSES.includes(data.status)) {
        throw new Error("Invalid task status.");
      }
      updatePayload.status = data.status;
    }
    if (data.priority !== undefined) {
      if (!VALID_PRIORITIES.includes(data.priority)) {
        throw new Error("Invalid task priority.");
      }
      updatePayload.priority = data.priority;
    }
    if (data.projectId !== undefined) {
      updatePayload.projectId = data.projectId;
    }
    if (data.dueDate !== undefined) {
      updatePayload.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    return prisma.task.update({
      where: { id },
      data: updatePayload,
      include: {
        project: {
          select: { id: true, name: true, color: true },
        },
      },
    });
  }

  /**
   * Delete a task by ID
   */
  static async deleteTask(id: string) {
    if (!id) {
      throw new Error("Task ID is required.");
    }
    return prisma.task.delete({
      where: { id },
    });
  }

  /**
   * Calculate aggregate dashboard metrics
   */
  static async getDashboardStats() {
    const [totalProjects, tasks] = await Promise.all([
      prisma.project.count(),
      prisma.task.findMany({
        select: { status: true, priority: true },
      }),
    ]);

    const totalTasks = tasks.length;
    const todoTasks = tasks.filter((t) => t.status === "TODO").length;
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
    const highPriorityTasks = tasks.filter(
      (t) => t.priority === "HIGH" && t.status !== "COMPLETED"
    ).length;

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalProjects,
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      highPriorityTasks,
      completionRate,
    };
  }
}
