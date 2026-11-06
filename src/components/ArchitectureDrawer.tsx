"use client";

import React from "react";
import { Database, Layers, Server, Monitor, Activity, Terminal } from "lucide-react";

export interface ApiLogEntry {
  id: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  endpoint: string;
  status: number;
  timestamp: string;
  tierFlow: string;
}

interface ArchitectureDrawerProps {
  isOpen: boolean;
  logs: ApiLogEntry[];
  onClearLogs: () => void;
}

export default function ArchitectureDrawer({
  isOpen,
  logs,
  onClearLogs,
}: ArchitectureDrawerProps) {
  if (!isOpen) return null;

  const methodBadge = (method: ApiLogEntry["method"]) => {
    switch (method) {
      case "GET":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "POST":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "PATCH":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "DELETE":
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-5 mb-6 animate-in fade-in duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              3-Tier Architecture Live Inspector
            </h3>
            <p className="text-xs text-slate-500">
              Watch how your UI actions flow through the 3 tiers in real time
            </p>
          </div>
        </div>
      </div>

      {/* 3 Tiers Diagram Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
            <Monitor className="w-4 h-4 text-emerald-600" />
            Tier 1: Presentation Layer
          </div>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            React Client Components (<code className="text-emerald-700 font-mono">src/components/*</code> &{" "}
            <code className="text-emerald-700 font-mono">src/app/page.tsx</code>). Renders the White & Green UI and sends HTTP requests via <code className="font-mono">fetch()</code>.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
            <Server className="w-4 h-4 text-emerald-600" />
            Tier 2: Business Logic / API
          </div>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            API Route Controllers (<code className="text-emerald-700 font-mono">src/app/api/*</code>) + Domain Services (<code className="text-emerald-700 font-mono">src/services/*</code>). Validates inputs and enforces business rules.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
            <Database className="w-4 h-4 text-emerald-600" />
            Tier 3: Data Access & DB
          </div>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Prisma ORM (<code className="text-emerald-700 font-mono">src/lib/db.ts</code> &{" "}
            <code className="text-emerald-700 font-mono">prisma/schema.prisma</code>) persisted in local SQLite database (<code className="font-mono">prisma/dev.db</code>).
          </p>
        </div>
      </div>

      {/* Live API Request Log */}
      <div className="bg-slate-900 rounded-xl p-3.5 text-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>Live Tier-to-Tier Request Trace ({logs.length})</span>
          </div>
          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="text-[11px] text-slate-400 hover:text-white transition-colors"
            >
              Clear log
            </button>
          )}
        </div>
        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">
            Interact with any project or task below to see the 3-tier request trace...
          </p>
        ) : (
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 font-mono text-xs">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex flex-wrap items-center justify-between gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${methodBadge(
                      log.method
                    )}`}
                  >
                    {log.method}
                  </span>
                  <span className="text-emerald-300">{log.endpoint}</span>
                  <span className="text-slate-400 hidden sm:inline">
                    → {log.tierFlow}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> {log.status} OK
                  </span>
                  <span className="text-slate-500">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
