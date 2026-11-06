"use client";

import React, { useState } from "react";
import { ProjectDTO } from "@/types";
import {
  FolderPlus,
  Layers,
  Trash2,
  Folder,
  X,
  Check,
} from "lucide-react";

interface ProjectSidebarProps {
  projects: ProjectDTO[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (data: {
    name: string;
    description: string;
    color: string;
  }) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
}

const GREEN_PALETTE = [
  "#10b981", // Emerald 500
  "#059669", // Emerald 600
  "#047857", // Emerald 700
  "#14b8a6", // Teal 500
  "#16a34a", // Green 600
  "#0d9488", // Teal 600
];

export default function ProjectSidebar({
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(GREEN_PALETTE[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onCreateProject({ name, description, color });
      setName("");
      setDescription("");
      setIsAdding(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-sm h-fit">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Workspaces
          </h2>
          <p className="text-xs text-slate-400">Filter tasks by project</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs transition-colors border border-emerald-200/70"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          New
        </button>
      </div>

      {/* New Project Form */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-900">
              Create Project
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Project name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-lg border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            placeholder="Short description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="flex items-center gap-1.5">
            {GREEN_PALETTE.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => setColor(hex)}
                className="w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: hex }}
              >
                {color === hex && <Check className="w-3 h-3 text-white" />}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Project"}
          </button>
        </form>
      )}

      {/* Project List */}
      <div className="space-y-1.5">
        <button
          onClick={() => onSelectProject("ALL")}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
            selectedProjectId === "ALL"
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
              : "text-slate-700 hover:bg-emerald-50/70"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4" />
            <span>All Projects</span>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              selectedProjectId === "ALL"
                ? "bg-emerald-700 text-emerald-50"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {projects.reduce((acc, p) => acc + (p._count?.tasks ?? 0), 0)}
          </span>
        </button>

        {projects.map((project) => {
          const total = project._count?.tasks ?? 0;
          const done = project.completedTasksCount ?? 0;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const isSelected = selectedProjectId === project.id;

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`group cursor-pointer rounded-xl p-3 transition-all border ${
                isSelected
                  ? "bg-emerald-50/90 border-emerald-300 shadow-sm"
                  : "bg-white border-transparent hover:border-emerald-100 hover:bg-slate-50/70"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <span
                    className={`text-sm font-semibold truncate ${
                      isSelected ? "text-emerald-950" : "text-slate-700"
                    }`}
                  >
                    {project.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs font-medium text-slate-500">
                    {done}/{total}
                  </span>
                  <button
                    type="button"
                    title="Delete project"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProject(project.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {project.description && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 pl-5">
                  {project.description}
                </p>
              )}

              {/* Mini Completion Bar */}
              <div className="mt-2.5 pl-5">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: project.color || "#10b981",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="text-center py-8 px-3">
            <Folder className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              No projects yet. Click <strong>New</strong> above to create your first workspace!
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
