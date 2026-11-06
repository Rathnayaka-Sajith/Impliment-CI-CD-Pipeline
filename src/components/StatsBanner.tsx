"use client";

import React from "react";
import { DashboardStatsDTO } from "@/types";
import {
  CheckCircle2,
  Clock,
  FolderKanban,
  Flame,
} from "lucide-react";

interface StatsBannerProps {
  stats: DashboardStatsDTO;
}

export default function StatsBanner({ stats }: StatsBannerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Projects */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Projects
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {stats.totalProjects}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Across <span className="font-semibold text-slate-700">{stats.totalTasks}</span> total tracked tasks
        </p>
      </div>

      {/* In Progress Tasks */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              In Progress
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {stats.inProgressTasks}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          <span className="font-semibold text-slate-700">{stats.todoTasks}</span> tasks waiting in backlog
        </p>
      </div>

      {/* Completion Rate */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Completed
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-bold text-emerald-600">
                {stats.completedTasks}
              </p>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {stats.completionRate}%
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full mt-3.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>

      {/* High Priority Open */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              High Priority Open
            </p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {stats.highPriorityTasks}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Flame className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          {stats.highPriorityTasks === 0
            ? "All urgent tasks are cleared!"
            : "Requires immediate attention"}
        </p>
      </div>
    </div>
  );
}
