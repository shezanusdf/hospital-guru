"use client";

import React, { useState } from "react";
import {
  Users, MessageCircle, FileText, AlertTriangle,
  CheckCircle, Clock, RefreshCw, Mail, Phone,
  ChevronDown, ChevronUp, Search, Filter, LogOut
} from "lucide-react";

type Inquiry = {
  id: string;
  inquiryNumber: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  guestCountry: string | null;
  guestLanguage: string | null;
  treatmentName: string | null;
  medicalSummary: string | null;
  urgency: string;
  source: string;
  status: string;
  chatContext: string | null;
  internalNotes: string | null;
  createdAt: Date | string;
};

type Stats = {
  total: number; new: number; inProgress: number; completed: number;
  chatbot: number; webForm: number; urgent: number;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new:         { label: "New",         color: "#1d4ed8", bg: "#eff6ff" },
  in_progress: { label: "In Progress", color: "#92400e", bg: "#fef3c7" },
  quote_sent:  { label: "Quote Sent",  color: "#6d28d9", bg: "#f5f3ff" },
  accepted:    { label: "Accepted",    color: "#065f46", bg: "#d1fae5" },
  completed:   { label: "Completed",   color: "#14532d", bg: "#dcfce7" },
  cancelled:   { label: "Cancelled",   color: "#6b7280", bg: "#f3f4f6" },
};

const URGENCY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  emergency: { label: "Emergency", color: "#991b1b", bg: "#fee2e2" },
  urgent:    { label: "Urgent",    color: "#92400e", bg: "#fef3c7" },
  routine:   { label: "Routine",   color: "#065f46", bg: "#d1fae5" },
};

const SOURCE_CONFIG: Record<string, { label: string; icon: string }> = {
  chatbot:  { label: "AI Chatbot", icon: "🤖" },
  web_form: { label: "Web Form",   icon: "📝" },
  whatsapp: { label: "WhatsApp",   icon: "💬" },
  phone:    { label: "Phone",      icon: "📞" },
};

function timeAgo(date: Date | string) {
  const d = new Date(date);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60)   return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function parseChatContext(raw: string | null): Record<string, string> {
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

export default function AdminClient({ inquiries: initial, stats }: { inquiries: Inquiry[]; stats: Stats }) {
  const [inquiries, setInquiries]         = useState<Inquiry[]>(initial);
  const [expandedId, setExpandedId]       = useState<string | null>(null);
  const [filterStatus, setFilterStatus]   = useState("all");
  const [filterSource, setFilterSource]   = useState("all");
  const [search, setSearch]               = useState("");
  const [updatingId, setUpdatingId]       = useState<string | null>(null);
  const [noteId, setNoteId]               = useState<string | null>(null);
  const [noteText, setNoteText]           = useState("");

  const filtered = inquiries.filter((i) => {
    if (filterStatus !== "all" && i.status !== filterStatus) return false;
    if (filterSource !== "all" && i.source !== filterSource) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        i.guestName?.toLowerCase().includes(q) ||
        i.guestEmail?.toLowerCase().includes(q) ||
        i.guestCountry?.toLowerCase().includes(q) ||
        i.treatmentName?.toLowerCase().includes(q) ||
        i.inquiryNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function saveNote(id: string) {
    await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ internalNotes: noteText }),
    });
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, internalNotes: noteText } : i));
    setNoteId(null);
    setNoteText("");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-blue-700 to-teal-600 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-xl">Hospital<span className="text-teal-300">Guru</span></span>
            <span className="bg-white/20 text-xs font-semibold px-2 py-0.5 rounded-full">Admin</span>
          </div>
          <div className="text-blue-200 text-xs mt-0.5">Inquiry Management Dashboard</div>
        </div>
        <button
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            window.location.reload();
          }}
          className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          {[
            { label: "Total",       value: stats.total,      icon: Users,         color: "text-blue-600",   bg: "bg-blue-50" },
            { label: "New",         value: stats.new,        icon: Clock,         color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "In Progress", value: stats.inProgress, icon: RefreshCw,     color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Completed",   value: stats.completed,  icon: CheckCircle,   color: "text-green-600",  bg: "bg-green-50" },
            { label: "🤖 Chatbot",  value: stats.chatbot,    icon: MessageCircle, color: "text-blue-500",   bg: "bg-blue-50" },
            { label: "📝 Web Form", value: stats.webForm,    icon: FileText,      color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "⚡ Urgent",   value: stats.urgent,     icon: AlertTriangle, color: "text-red-600",    bg: "bg-red-50" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center mx-auto mb-1`}>
                  <Icon size={14} className={s.color} />
                </div>
                <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-gray-400 text-[10px] font-medium">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Filters + Search */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, country, treatment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-300 bg-white"
            >
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-300 bg-white"
            >
              <option value="all">All Sources</option>
              {Object.entries(SOURCE_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {v.label}</option>
              ))}
            </select>
          </div>
          <div className="text-xs text-gray-400 font-medium ml-auto">
            {filtered.length} of {inquiries.length}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Users size={36} className="mx-auto mb-3 text-gray-200" />
              <p className="font-medium">No inquiries found</p>
              <p className="text-sm mt-1">Submit a form or chat with GuruBot to see data here</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Reference</th>
                  <th className="text-left px-4 py-3">Patient</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Country</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Condition</th>
                  <th className="text-left px-4 py-3">Urgency</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Source</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Time</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inq) => {
                  const status  = STATUS_CONFIG[inq.status]  ?? STATUS_CONFIG.new;
                  const urgency = URGENCY_CONFIG[inq.urgency] ?? URGENCY_CONFIG.routine;
                  const source  = SOURCE_CONFIG[inq.source]   ?? SOURCE_CONFIG.web_form;
                  const isExpanded = expandedId === inq.id;
                  const chatCtx = parseChatContext(inq.chatContext);

                  return (
                    <React.Fragment key={inq.id}>
                      <tr
                        className={`border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                          inq.urgency === "emergency" ? "bg-red-50/50" :
                          inq.urgency === "urgent"    ? "bg-yellow-50/30" : ""
                        }`}
                        onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                      >
                        <td className="px-4 py-3">
                          <div className="font-mono text-xs font-bold text-blue-700">{inq.inquiryNumber}</div>
                          <div className="text-[10px] text-gray-400">{inq.guestLanguage === "ru" ? "🇷🇺 RU" : "🇬🇧 EN"}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900 text-sm">{inq.guestName ?? "—"}</div>
                          <div className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                            {inq.guestEmail && <span className="flex items-center gap-0.5"><Mail size={9} />{inq.guestEmail}</span>}
                            {inq.guestPhone && <span className="flex items-center gap-0.5 ml-1"><Phone size={9} />{inq.guestPhone}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-600">
                          {inq.guestCountry ?? "—"}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="text-sm text-gray-700 max-w-[180px] truncate">
                            {inq.treatmentName ?? inq.medicalSummary ?? "—"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span style={{ color: urgency.color, background: urgency.bg }}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                            {urgency.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs text-gray-500">{source.icon} {source.label}</span>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={inq.status}
                            disabled={updatingId === inq.id}
                            onChange={(e) => updateStatus(inq.id, e.target.value)}
                            style={{ color: status.color, background: status.bg }}
                            className="text-[11px] font-bold border-0 rounded-full px-2 py-1 outline-none cursor-pointer"
                          >
                            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                              <option key={k} value={k}>{v.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-400 whitespace-nowrap">
                          {timeAgo(inq.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </td>
                      </tr>

                      {/* Expanded row */}
                      {isExpanded && (
                        <tr key={`${inq.id}-expanded`} className="bg-blue-50/30 border-b border-blue-100">
                          <td colSpan={9} className="px-4 py-4">
                            <div className="grid md:grid-cols-3 gap-4">

                              {/* Medical summary */}
                              <div>
                                <div className="text-xs font-bold text-gray-500 uppercase mb-2">Medical Summary</div>
                                <div className="bg-white rounded-lg p-3 border border-gray-100 text-sm text-gray-700 leading-relaxed">
                                  {inq.medicalSummary ?? inq.treatmentName ?? "No summary provided"}
                                </div>
                              </div>

                              {/* Chat context */}
                              {Object.keys(chatCtx).length > 0 && (
                                <div>
                                  <div className="text-xs font-bold text-gray-500 uppercase mb-2">Chat Data</div>
                                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                                    {Object.entries(chatCtx)
                                      .filter(([k]) => !["leadCaptured"].includes(k))
                                      .map(([k, v]) => (
                                        <div key={k} className="flex gap-2 text-xs mb-1">
                                          <span className="text-gray-400 w-16 shrink-0 font-medium">{k}</span>
                                          <span className="text-gray-700">{String(v)}</span>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}

                              {/* Actions + notes */}
                              <div>
                                <div className="text-xs font-bold text-gray-500 uppercase mb-2">Quick Actions</div>
                                <div className="space-y-2">
                                  {inq.guestEmail && (
                                    <a href={`mailto:${inq.guestEmail}?subject=Re: Your HospitalGuru Inquiry ${inq.inquiryNumber}`}
                                       className="flex items-center gap-2 bg-blue-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                      <Mail size={12} /> Email Patient
                                    </a>
                                  )}
                                  {inq.guestPhone && (
                                    <a href={`https://wa.me/${inq.guestPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(inq.guestName ?? "")}%2C%20HospitalGuru%20here%20regarding%20inquiry%20${inq.inquiryNumber}`}
                                       target="_blank" rel="noreferrer"
                                       className="flex items-center gap-2 bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                      💬 WhatsApp Patient
                                    </a>
                                  )}

                                  {/* Internal note */}
                                  {noteId === inq.id ? (
                                    <div>
                                      <textarea
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        placeholder="Add internal note..."
                                        rows={2}
                                        className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none resize-none"
                                      />
                                      <div className="flex gap-2 mt-1">
                                        <button onClick={() => saveNote(inq.id)}
                                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md">Save</button>
                                        <button onClick={() => setNoteId(null)}
                                          className="text-xs text-gray-500 px-3 py-1 rounded-md border border-gray-200">Cancel</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => { setNoteId(inq.id); setNoteText(inq.internalNotes ?? ""); }}
                                      className="flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors w-full">
                                      📝 {inq.internalNotes ? "Edit Note" : "Add Note"}
                                    </button>
                                  )}

                                  {inq.internalNotes && noteId !== inq.id && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-xs text-yellow-800">
                                      📌 {inq.internalNotes}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
