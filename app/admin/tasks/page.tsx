"use client";

import { useState, useEffect } from "react";
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  CheckCircle,
  AlertCircle,
  X,
  Calendar,
  Building,
  User,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [clientFilter, setClientFilter] = useState("ALL");

  // Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clientId: "NONE",
    priority: "MEDIUM",
    category: "GST_FILING",
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  });

  const fetchTasksAndClients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (priorityFilter !== "ALL") params.append("priority", priorityFilter);
      if (categoryFilter !== "ALL") params.append("category", categoryFilter);
      if (clientFilter !== "ALL") params.append("clientId", clientFilter);

      const [tasksRes, clientsRes] = await Promise.all([
        fetch(`/api/tasks?${params.toString()}`),
        fetch("/api/clients?limit=100"),
      ]);

      const tasksData = await tasksRes.json();
      const clientsData = await clientsRes.json();

      if (tasksData.tasks) setTasks(tasksData.tasks);
      if (clientsData.clients) setClients(clientsData.clients);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksAndClients();
  }, [statusFilter, priorityFilter, categoryFilter, clientFilter]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setActionError("Task title is required.");
      return;
    }
    setCreating(true);
    setActionError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create task");

      setActionSuccess(`Task "${data.task.title}" created successfully.`);
      setCreateModalOpen(false);
      setFormData({
        title: "",
        description: "",
        clientId: "NONE",
        priority: "MEDIUM",
        category: "GST_FILING",
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      });
      fetchTasksAndClients();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setActionSuccess("Task status updated.");
      fetchTasksAndClients();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800 border border-red-200">Urgent</span>;
      case "HIGH":
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">High</span>;
      case "MEDIUM":
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Low</span>;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "GST_FILING":
        return "GST Compliance";
      case "ITR":
        return "Income Tax";
      case "AUDIT":
        return "Statutory Audit";
      case "ROC_ANNUAL":
        return "MCA & ROC";
      case "BILLING":
        return "Billing & Fees";
      default:
        return "General";
    }
  };

  const urgentCount = tasks.filter((t) => t.priority === "URGENT" || t.priority === "HIGH").length;
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;

  const columns = [
    { key: "TODO", label: "To Do", bg: "bg-slate-50", border: "border-slate-200" },
    { key: "IN_PROGRESS", label: "In Progress", bg: "bg-blue-50/50", border: "border-blue-200" },
    { key: "WAITING_FOR_CLIENT_DOCS", label: "Awaiting Client Docs", bg: "bg-amber-50/50", border: "border-amber-200" },
    { key: "COMPLETED", label: "Completed", bg: "bg-emerald-50/50", border: "border-emerald-200" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#17365D]">Tasks & Compliance Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">
            Statutory filing deadlines, audit engagements, and client workflow tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode("board")}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition ${
                viewMode === "board" ? "bg-white text-[#17365D] shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition ${
                viewMode === "list" ? "bg-white text-[#17365D] shadow-sm font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" /> List
            </button>
          </div>

          <button
            onClick={() => {
              setActionError(null);
              setCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-[#17365D] hover:bg-[#122b4a] text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-sm text-red-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Tasks</span>
            <CheckSquare className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{tasks.length}</p>
          <p className="text-xs text-slate-500 mt-1">Across all clients</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Urgent & High Priority</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600 mt-2">{urgentCount}</p>
          <p className="text-xs text-slate-500 mt-1">Requires immediate attention</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">In Progress</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{inProgressCount}</p>
          <p className="text-xs text-slate-500 mt-1">Under verification / filing</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completed</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{completedCount}</p>
          <p className="text-xs text-slate-500 mt-1">Successfully fulfilled</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING_FOR_CLIENT_DOCS">Awaiting Client Docs</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Priority</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white"
          >
            <option value="ALL">All Categories</option>
            <option value="GST_FILING">GST Filing</option>
            <option value="ITR">Income Tax</option>
            <option value="AUDIT">Statutory Audit</option>
            <option value="ROC_ANNUAL">ROC & MCA</option>
            <option value="BILLING">Billing</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Client</label>
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white"
          >
            <option value="ALL">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Area: Kanban or List */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500">
          <div className="animate-spin w-6 h-6 border-2 border-[#17365D] border-t-transparent rounded-full mx-auto mb-3" />
          Loading tasks and deadlines...
        </div>
      ) : viewMode === "board" ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div
                key={col.key}
                className={`flex flex-col rounded-xl border ${col.border} ${col.bg} p-4 min-h-[420px]`}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                  <h3 className="font-semibold text-sm text-slate-800">{col.label}</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="text-xs text-slate-400 text-center py-8">No tasks in this lane</div>
                  ) : (
                    colTasks.map((t) => (
                      <div
                        key={t.id}
                        className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm hover:shadow transition space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {getCategoryLabel(t.category)}
                          </span>
                          {getPriorityBadge(t.priority)}
                        </div>

                        <h4 className="text-sm font-semibold text-slate-900 leading-snug">{t.title}</h4>

                        {t.description && (
                          <p className="text-xs text-slate-500 line-clamp-2">{t.description}</p>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {new Date(t.dueDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
                          {t.client && (
                            <span className="truncate max-w-[120px] font-medium text-slate-700" title={t.client.name}>
                              {t.client.name}
                            </span>
                          )}
                        </div>

                        {/* Fast Status Change Actions */}
                        <div className="pt-1 flex items-center gap-1 justify-end border-t border-slate-50">
                          {col.key !== "TODO" && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, "TODO")}
                              className="text-[11px] text-slate-500 hover:text-slate-800 px-1.5 py-0.5 rounded hover:bg-slate-100"
                            >
                              To Do
                            </button>
                          )}
                          {col.key !== "IN_PROGRESS" && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, "IN_PROGRESS")}
                              className="text-[11px] text-blue-600 hover:text-blue-800 px-1.5 py-0.5 rounded hover:bg-blue-50"
                            >
                              In Progress
                            </button>
                          )}
                          {col.key !== "COMPLETED" && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, "COMPLETED")}
                              className="text-[11px] text-emerald-600 hover:text-emerald-800 px-1.5 py-0.5 rounded hover:bg-emerald-50 font-medium"
                            >
                              Mark Done
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST / TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Task Title</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Client</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Due Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900">{t.title}</p>
                      {t.description && <p className="text-xs text-slate-500 truncate max-w-sm">{t.description}</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {getCategoryLabel(t.category)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-700 font-medium">{t.client?.name || "General Firm"}</td>
                    <td className="px-5 py-3.5">{getPriorityBadge(t.priority)}</td>
                    <td className="px-5 py-3.5 text-xs font-mono text-slate-600">
                      {new Date(t.dueDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          t.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : t.status === "IN_PROGRESS"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {t.status !== "COMPLETED" ? (
                        <button
                          onClick={() => handleUpdateStatus(t.id, "COMPLETED")}
                          className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded font-medium transition"
                        >
                          Mark Complete
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium">✓ Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-lg font-bold text-[#17365D]">Create Task or Compliance Deadline</h2>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. File GSTR-3B for Sharma Infotech (Nov 2026)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#17365D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / ICAI Notes</label>
                <textarea
                  rows={2}
                  placeholder="Key instructions, documents required from client, or verification notes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#17365D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white"
                  >
                    <option value="GST_FILING">GST Filing</option>
                    <option value="ITR">Income Tax Return</option>
                    <option value="AUDIT">Statutory & Tax Audit</option>
                    <option value="ROC_ANNUAL">ROC / MCA Filings</option>
                    <option value="BILLING">Billing & Fees</option>
                    <option value="GENERAL">General Firm Work</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#17365D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Association</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white"
                  >
                    <option value="NONE">General Firm Task</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-[#17365D] hover:bg-[#122b4a] text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {creating ? "Scheduling..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
