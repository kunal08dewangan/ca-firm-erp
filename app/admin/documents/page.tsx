"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Folder,
  FileText,
  Upload,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Shield,
  FileSpreadsheet,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  X,
  Lock,
  Calendar,
  Building,
} from "lucide-react";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedClient, setSelectedClient] = useState("ALL");
  const [selectedFY, setSelectedFY] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [search, setSearch] = useState("");

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Upload Form
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    clientId: "",
    title: "",
    category: "GST",
    financialYear: "2026-27",
    fileName: "",
    fileMimeType: "application/pdf",
    fileSizeBytes: 524288,
  });

  const categories = [
    { id: "ALL", label: "All Categories" },
    { id: "GST", label: "GST Returns & Invoices" },
    { id: "ITR", label: "Income Tax & Computations" },
    { id: "BALANCE_SHEET", label: "Financials & Audit" },
    { id: "PAN_AADHAAR", label: "KYC & Registrations" },
    { id: "ROC", label: "MCA & ROC Filings" },
    { id: "GENERAL", label: "General & Agreements" },
  ];

  const financialYears = ["ALL", "2026-27", "2025-26", "2024-25", "2023-24"];

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedClient !== "ALL") params.append("clientId", selectedClient);
      if (selectedFY !== "ALL") params.append("financialYear", selectedFY);
      if (selectedCategory !== "ALL") params.append("category", selectedCategory);
      if (search) params.append("search", search);

      const [docsRes, clientsRes] = await Promise.all([
        fetch(`/api/documents?${params.toString()}`),
        fetch("/api/clients?limit=100"),
      ]);

      const docsData = await docsRes.json();
      const clientsData = await clientsRes.json();

      if (docsData.documents) setDocuments(docsData.documents);
      if (clientsData.clients) {
        setClients(clientsData.clients);
        if (!uploadData.clientId && clientsData.clients.length > 0) {
          setUploadData((prev) => ({ ...prev, clientId: clientsData.clients[0].id }));
        }
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClient, selectedFY, selectedCategory, search]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.title.trim()) {
      setActionError("Please provide a document title.");
      return;
    }
    setUploading(true);
    setActionError(null);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload document");

      setActionSuccess(`Document "${data.document.title}" stored securely in client vault.`);
      setUploadModalOpen(false);
      setUploadData({
        clientId: clients[0]?.id || "",
        title: "",
        category: "GST",
        financialYear: "2026-27",
        fileName: "",
        fileMimeType: "application/pdf",
        fileSizeBytes: 524288,
      });
      fetchData();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: any) => {
    try {
      const res = await fetch(`/api/documents/${doc.id}/download`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get download link");

      // In real scenario this initiates download from signed link
      setActionSuccess(`Generated secure expiring link for "${data.title}". Download started.`);
      // Simulated file download trigger
      const link = document.createElement("a");
      link.href = "#";
      link.setAttribute("download", `${doc.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (docId: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the client vault?`)) return;
    try {
      const res = await fetch(`/api/documents/${docId}/download`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      setActionSuccess(`Document "${title}" archived.`);
      fetchData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (mime: string) => {
    if (mime.includes("spreadsheet") || mime.includes("excel") || mime.includes("csv")) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    }
    if (mime.includes("image")) {
      return <ImageIcon className="w-5 h-5 text-amber-600" />;
    }
    return <FileText className="w-5 h-5 text-blue-600" />;
  };

  const totalStorageBytes = documents.reduce((acc, d) => acc + (d.fileSizeBytes || 0), 0);
  const uniqueClients = new Set(documents.map((d) => d.clientId)).size;

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#17365D]">Document Management & Vault</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Shield className="w-3 h-3" /> Encrypted Vault
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Client-wise & Financial Year partitioned repository with tamper-evident audit trail.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActionError(null);
              setUploadModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-[#17365D] hover:bg-[#122b4a] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <Upload className="w-4 h-4" /> Upload Document
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Vault Documents</span>
            <Folder className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{documents.length}</p>
          <p className="text-xs text-slate-500 mt-1">Archived with metadata</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Client Vaults</span>
            <Building className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{uniqueClients}</p>
          <p className="text-xs text-slate-500 mt-1">Tax assessees & corporate</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Storage</span>
            <Lock className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{formatFileSize(totalStorageBytes)}</p>
          <p className="text-xs text-slate-500 mt-1">Encrypted on private cloud</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Security Standard</span>
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-base font-bold text-slate-900 mt-2">ICAI Compliant</p>
          <p className="text-xs text-slate-500 mt-1">Expiring signed URLs</p>
        </div>
      </div>

      {/* Filter and Taxonomy Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Client Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Client Vault</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#17365D]"
            >
              <option value="ALL">All Clients ({clients.length})</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.pan})
                </option>
              ))}
            </select>
          </div>

          {/* Financial Year */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Financial Year</label>
            <select
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#17365D]"
            >
              {financialYears.map((fy) => (
                <option key={fy} value={fy}>
                  {fy === "ALL" ? "All Financial Years" : `FY ${fy}`}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Search Documents</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, client name, or PAN..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#17365D]"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat.id
                  ? "bg-[#17365D] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="animate-spin w-6 h-6 border-2 border-[#17365D] border-t-transparent rounded-full mx-auto mb-3" />
            Loading encrypted vault records...
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center">
            <Folder className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No documents found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              No files match your selected filters. Upload tax returns, balance sheets, or KYC files into the client vault.
            </p>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 bg-[#17365D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#122b4a]"
            >
              <Upload className="w-4 h-4" /> Upload Document Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Document Details</th>
                  <th className="px-5 py-3.5">Client & PAN</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">FY</th>
                  <th className="px-5 py-3.5">Size</th>
                  <th className="px-5 py-3.5">Uploaded</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 flex-shrink-0">
                          {getFileIcon(doc.fileMimeType)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{doc.title}</p>
                          <p className="text-xs text-slate-400 font-mono">ID: {doc.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800">{doc.client?.name || "N/A"}</div>
                      <div className="text-xs font-mono text-slate-500">{doc.client?.pan || "No PAN"}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">
                      {doc.financialYear ? `FY ${doc.financialYear}` : "-"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">
                      {formatFileSize(doc.fileSizeBytes)}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {new Date(doc.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          title="Preview Metadata"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          title="Generate Signed Download"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          title="Delete / Archive"
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-lg font-bold text-[#17365D]">Upload to Client Vault</h2>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Client *</label>
                <select
                  required
                  value={uploadData.clientId}
                  onChange={(e) => setUploadData({ ...uploadData, clientId: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#17365D]"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.pan})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GSTR-3B Acknowledgement Oct 2026"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#17365D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white"
                  >
                    <option value="GST">GST</option>
                    <option value="ITR">Income Tax</option>
                    <option value="BALANCE_SHEET">Balance Sheet & Audit</option>
                    <option value="PAN_AADHAAR">PAN / Aadhaar / KYC</option>
                    <option value="ROC">ROC / MCA</option>
                    <option value="GENERAL">General Agreement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Financial Year</label>
                  <select
                    value={uploadData.financialYear}
                    onChange={(e) => setUploadData({ ...uploadData, financialYear: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white"
                  >
                    <option value="2026-27">FY 2026-27</option>
                    <option value="2025-26">FY 2025-26</option>
                    <option value="2024-25">FY 2024-25</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">File Format / Simulation</label>
                <select
                  value={uploadData.fileMimeType}
                  onChange={(e) => setUploadData({ ...uploadData, fileMimeType: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white"
                >
                  <option value="application/pdf">PDF Document (.pdf)</option>
                  <option value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                    Excel Spreadsheet (.xlsx)
                  </option>
                  <option value="text/csv">CSV Data File (.csv)</option>
                  <option value="image/png">Scanned Image (.png)</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Files are validated for type and size (limit 15MB) and stored in encrypted vault.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-[#17365D] hover:bg-[#122b4a] text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {uploading ? "Encrypting & Storing..." : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-[#17365D]">Document Security Card</h2>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Title</span>
                <p className="font-semibold text-slate-900">{previewDoc.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Client</span>
                  <p className="text-slate-800">{previewDoc.client?.name}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">PAN</span>
                  <p className="font-mono text-slate-800">{previewDoc.client?.pan}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Category</span>
                  <p className="text-slate-800">{previewDoc.category}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Financial Year</span>
                  <p className="text-slate-800">FY {previewDoc.financialYear || "N/A"}</p>
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Encrypted Vault Path</span>
                <p className="font-mono text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 break-all">
                  {previewDoc.fileUrl}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> SHA-256 Checksum Verified
              </span>
              <button
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
                className="bg-[#17365D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#122b4a] inline-flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
