"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  DashboardStatsDTO,
  ProjectDTO,
  TaskDTO,
  TaskPriority,
  TaskStatus,
} from "@/types";
import StatsBanner from "@/components/StatsBanner";
import ProjectSidebar from "@/components/ProjectSidebar";
import TaskBoard from "@/components/TaskBoard";
import ArchitectureDrawer, {
  ApiLogEntry,
} from "@/components/ArchitectureDrawer";
import { Leaf, Layers, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [stats, setStats] = useState<DashboardStatsDTO>({
    totalProjects: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    highPriorityTasks: 0,
    completionRate: 0,
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);
  const [isArchOpen, setIsArchOpen] = useState<boolean>(true);
  const [apiLogs, setApiLogs] = useState<ApiLogEntry[]>([]);

  const recordLog = useCallback(
    (
      method: ApiLogEntry["method"],
      endpoint: string,
      status: number,
      tierFlow: string
    ) => {
      setApiLogs((prev) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          method,
          endpoint,
          status,
          timestamp: new Date().toLocaleTimeString(),
          tierFlow,
        },
        ...prev.slice(0, 19),
      ]);
    },
    []
  );

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedProjectId !== "ALL")
        params.set("projectId", selectedProjectId);
      if (priorityFilter !== "ALL") params.set("priority", priorityFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const taskUrl = `/api/tasks${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const [projRes, taskRes, statsRes] = await Promise.all([
        fetch("/api/projects"),
        fetch(taskUrl),
        fetch("/api/stats"),
      ]);

      const [projJson, taskJson, statsJson] = await Promise.all([
        projRes.json(),
        taskRes.json(),
        statsRes.json(),
      ]);

      if (projJson.data) setProjects(projJson.data);
      if (taskJson.data) setTasks(taskJson.data);
      if (statsJson.data) setStats(statsJson.data);

      recordLog(
        "GET",
        taskUrl,
        taskRes.status,
        "UI → TaskService.getTasks() → Prisma SQLite"
      );
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId, priorityFilter, searchQuery, recordLog]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Create Project (Tier 1 -> Tier 2 POST /api/projects -> Tier 3 Prisma)
  const handleCreateProject = async (data: {
    name: string;
    description: string;
    color: string;
  }) => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    recordLog(
      "POST",
      "/api/projects",
      res.status,
      "UI → ProjectService.createProject() → Prisma.project.create()"
    );
    await loadDashboardData();
  };

  // Delete Project
  const handleDeleteProject = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });
    recordLog(
      "DELETE",
      `/api/projects/${id}`,
      res.status,
      "UI → ProjectService.deleteProject() → Prisma.project.delete()"
    );
    if (selectedProjectId === id) {
      setSelectedProjectId("ALL");
    } else {
      await loadDashboardData();
    }
  };

  // Create Task
  const handleCreateTask = async (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    projectId: string;
    dueDate: string | null;
  }) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    recordLog(
      "POST",
      "/api/tasks",
      res.status,
      "UI → TaskService.createTask() → Prisma.task.create()"
    );
    await loadDashboardData();
  };

  // Update Task Status
  const handleUpdateTaskStatus = async (id: string, status: TaskStatus) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    recordLog(
      "PATCH",
      `/api/tasks/${id}`,
      res.status,
      `UI → TaskService.updateTask(${status}) → Prisma.task.update()`
    );
    await loadDashboardData();
  };

  // Delete Task
  const handleDeleteTask = async (id: string) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    recordLog(
      "DELETE",
      `/api/tasks/${id}`,
      res.status,
      "UI → TaskService.deleteTask() → Prisma.task.delete()"
    );
    await loadDashboardData();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Header (White & Emerald Green) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  Testing 3-Tier Architecture
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  3-Tier Practice App
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Next.js UI • Service & API Layer • Prisma SQLite Database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsArchOpen(!isArchOpen)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isArchOpen
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200"
                  : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3-Tier Inspector</span>
            </button>

            <button
              type="button"
              onClick={loadDashboardData}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
              title="Refresh data from database"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Live 3-Tier Inspector Drawer */}
        <ArchitectureDrawer
          isOpen={isArchOpen}
          logs={apiLogs}
          onClearLogs={() => setApiLogs([])}
        />

        {/* KPI Metric Cards */}
        <StatsBanner stats={stats} />

        {/* Workspace Grid: Left Project Sidebar + Right Task Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-3">
            <ProjectSidebar
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
            />
          </div>

          <div className="lg:col-span-9">
            <TaskBoard
              tasks={tasks}
              projects={projects}
              selectedProjectId={selectedProjectId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              onCreateTask={handleCreateTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-emerald-100/80 bg-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>
            Verdanza Workspace — Built with Next.js App Router, Tailwind CSS, Prisma & SQLite
          </span>
          <span className="text-emerald-700 font-medium">
            Tier 1 (UI) → Tier 2 (Services/API) → Tier 3 (Database)
          </span>
        </div>
      </footer>
    </div>
  );
}
