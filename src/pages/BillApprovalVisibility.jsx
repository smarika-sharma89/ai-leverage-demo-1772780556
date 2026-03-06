import { useState, useEffect } from "react";

const APPROVERS = [
  { id: "a1", name: "Sarah Mitchell", role: "Project Manager" },
  { id: "a2", name: "James Thornton", role: "Commercial Manager" },
  { id: "a3", name: "Linda Park", role: "Finance Director" },
];

const APPROVAL_STAGES = [
  "Awaiting Approval",
  "Partially Approved – Awaiting 2nd Approver",
  "Partially Approved – Awaiting Final Approval",
  "Fully Approved",
];

const initialBills = [
  {
    id: "BILL-001",
    description: "Earthworks – Zone A Excavation",
    supplier: "Grantham Civil Pty Ltd",
    amount: 48200,
    gst: 4820,
    stage: "Awaiting Approval",
    wbs: "WBS-001-A",
    approvals: [
      { approverId: "a1", status: "pending", timestamp: null, comment: "" },
      { approverId: "a2", status: "pending", timestamp: null, comment: "" },
      { approverId: "a3", status: "pending", timestamp: null, comment: "" },
    ],
    xeroSynced: false,
    lastSyncAttempt: null,
  },
  {
    id: "BILL-002",
    description: "Concrete Pour – Footings Block B",
    supplier: "Apex Ready Mix Concrete",
    amount: 31500,
    gst: 3150,
    stage: "Partially Approved – Awaiting 2nd Approver",
    wbs: "WBS-002-B",
    approvals: [
      { approverId: "a1", status: "approved", timestamp: "2024-06-10T09:15:00", comment: "Looks good" },
      { approverId: "a2", status: "pending", timestamp: null, comment: "" },
      { approverId: "a3", status: "pending", timestamp: null, comment: "" },
    ],
    xeroSynced: false,
    lastSyncAttempt: null,
  },
  {
    id: "BILL-003",
    description: "Steel Reinforcement Supply",
    supplier: "Northern Steel Solutions",
    amount: 72400,
    gst: 7240,
    stage: "Partially Approved – Awaiting Final Approval",
    wbs: "WBS-003-C",
    approvals: [
      { approverId: "a1", status: "approved", timestamp: "2024-06-08T14:30:00", comment: "Verified against PO" },
      { approverId: "a2", status: "approved", timestamp: "2024-06-09T10:00:00", comment: "Rates confirmed" },
      { approverId: "a3", status: "pending", timestamp: null, comment: "" },
    ],
    xeroSynced: false,
    lastSyncAttempt: null,
  },
  {
    id: "BILL-004",
    description: "Formwork Hire – Month of May",
    supplier: "TrussForm Hire Co.",
    amount: 19800,
    gst: 1980,
    stage: "Fully Approved",
    wbs: "WBS-001-A",
    approvals: [
      { approverId: "a1", status: "approved", timestamp: "2024-06-01T08:45:00", comment: "Approved" },
      { approverId: "a2", status: "approved", timestamp: "2024-06-02T11:20:00", comment: "All good" },
      { approverId: "a3", status: "approved", timestamp: "2024-06-03T09:00:00", comment: "Final approval granted" },
    ],
    xeroSynced: true,
    lastSyncAttempt: "2024-06-03T09:05:00",
  },
  {
    id: "BILL-005",
    description: "Site Surveying Services – June",
    supplier: "Precision Survey Group",
    amount: 8600,
    gst: 860,
    stage: "Awaiting Approval",
    wbs: "WBS-004-D",
    approvals: [
      { approverId: "a1", status: "pending", timestamp: null, comment: "" },
      { approverId: "a2", status: "pending", timestamp: null, comment: "" },
      { approverId: "a3", status: "pending", timestamp: null, comment: "" },
    ],
    xeroSynced: false,
    lastSyncAttempt: null,
  },
  {
    id: "BILL-006",
    description: "Electrical Rough-In – Levels 1–3",
    supplier: "Volt Masters Electrical",
    amount: 54300,
    gst: 5430,
    stage: "Partially Approved – Awaiting 2nd Approver",
    wbs: "WBS-005-E",
    approvals: [
      { approverId: "a1", status: "approved", timestamp: "2024-06-11T07:55:00", comment: "Scope matches contract" },
      { approverId: "a2", status: "pending", timestamp: null, comment: "" },
      { approverId: "a3", status: "pending", timestamp: null, comment: "" },
    ],
    xeroSynced: false,
    lastSyncAttempt: null,
  },
];

const initialDockets = [
  {
    id: "DKT-001",
    date: "2024-06-10",
    crew: "Crew Alpha",
    description: "Day Works – Bulk Excavation Unexpected Rock",
    hours: 8,
    lostTime: 1.5,
    lostTimeReason: "Equipment breakdown – excavator hydraulic failure",
    status: "Submitted",
    internalNotes: [
      {
        id: "n1",
        author: "Sarah Mitchell",
        timestamp: "2024-06-10T16:30:00",
        note: "Noted hydraulic issue – maintenance has been informed. Claim appears valid.",
      },
    ],
  },
  {
    id: "DKT-002",
    date: "2024-06-11",
    crew: "Crew Beta",
    description: "Day Works – Remediation of Unexpected Utilities",
    hours: 6,
    lostTime: 0,
    lostTimeReason: "",
    status: "Submitted",
    internalNotes: [],
  },
  {
    id: "DKT-003",
    date: "2024-06-12",
    crew: "Crew Alpha",
    description: "Day Works – Concrete Saw Cutting Additional Joints",
    hours: 4,
    lostTime: 2,
    lostTimeReason: "Wet weather stand-down – rain exceeded safe working threshold",
    status: "Draft",
    internalNotes: [],
  },
];

const initialChargeRates = [
  { id: "cr1", category: "Labour", description: "Site Supervisor", unit: "hr", rate: 125.0, lastUpdated: "2024-05-01" },
  { id: "cr2", category: "Labour", description: "Excavator Operator", unit: "hr", rate: 105.0, lastUpdated: "2024-05-01" },
  { id: "cr3", category: "Labour", description: "Labourer", unit: "hr", rate: 78.5, lastUpdated: "2024-05-01" },
  { id: "cr4", category: "Plant", description: "20T Excavator", unit: "hr", rate: 195.0, lastUpdated: "2024-05-15" },
  { id: "cr5", category: "Plant", description: "10T Tip Truck", unit: "hr", rate: 145.0, lastUpdated: "2024-05-15" },
  { id: "cr6", category: "Material", description: "Concrete – 32 MPa", unit: "m³", rate: 220.0, lastUpdated: "2024-04-20" },
  { id: "cr7", category: "Material", description: "Reinforcement Bar – 16mm", unit: "t", rate: 1450.0, lastUpdated: "2024-04-20" },
];

function formatCurrency(n) {
  return "$" + n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDateTime(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleString("en-AU", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function stageBadgeColor(stage) {
  switch (stage) {
    case "Awaiting Approval": return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Partially Approved – Awaiting 2nd Approver": return "bg-blue-100 text-blue-800 border-blue-300";
    case "Partially Approved – Awaiting Final Approval": return "bg-orange-100 text-orange-800 border-orange-300";
    case "Fully Approved": return "bg-green-100 text-green-800 border-green-300";
    default: return "bg-gray-100 text-gray-700 border-gray-300";
  }
}

function syncBadge(synced) {
  return synced
    ? "bg-green-100 text-green-700 border-green-300"
    : "bg-red-100 text-red-700 border-red-300";
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all ${
        type === "success" ? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-300 text-red-800"
      }`}
    >
      <span>{type === "success" ? "✓" : "✕"}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-xs opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

export default function BillApprovalVisibility() {
  const [activeTab, setActiveTab] = useState("bills");
  const [bills, setBills] = useState(initialBills);
  const [dockets, setDockets] = useState(initialDockets);
  const [chargeRates, setChargeRates] = useState(initialChargeRates);

  // Filter state
  const [filterStage, setFilterStage] = useState("All");
  const [filterApprover, setFilterApprover] = useState("All");

  // Selected bill modal
  const [selectedBill, setSelectedBill] = useState(null);
  const [approvalComment, setApprovalComment] = useState("");
  const [editingGst, setEditingGst] = useState(false);
  const [gstInput, setGstInput] = useState("");
  const [wbsAll, setWbsAll] = useState("");
  const [copyWbsMode, setCopyWbsMode] = useState(false);
  const [syncingBillId, setSyncingBillId] = useState(null);

  // Docket modal
  const [selectedDocket, setSelectedDocket] = useState(null);
  const [newNote, setNewNote] = useState("");

  // Charge rates state
  const [editingRate, setEditingRate] = useState(null);
  const [editRateValue, setEditRateValue] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [rateFilterCategory, setRateFilterCategory] = useState("All");

  // Toast
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  // Filtered bills
  const filteredBills = bills.filter((b) => {
    const stageMatch = filterStage === "All" || b.stage === filterStage;
    let approverMatch = true;
    if (filterApprover !== "All") {
      const ap = b.approvals.find((a) => a.approverId === filterApprover);
      approverMatch = ap && ap.status === "pending";
    }
    return stageMatch && approverMatch;
  });

  function openBill(bill) {
    setSelectedBill({ ...bill, approvals: bill.approvals.map((a) => ({ ...a })) });
    setApprovalComment("");
    setEditingGst(false);
    setGstInput(String(bill.gst));
    setCopyWbsMode(false);
    setWbsAll(bill.wbs);
  }

  function closeBill() {
    setSelectedBill(null);
  }

  function handleApprove(approverId) {
    if (!selectedBill) return;
    const updated = {
      ...selectedBill,
      approvals: selectedBill.approvals.map((a) =>
        a.approverId === approverId
          ? { ...a, status: "approved", timestamp: new Date().toISOString(), comment: approvalComment || "Approved" }
          : a
      ),
    };
    const allApproved = updated.approvals.every((a) => a.status === "approved");
    const approvedCount = updated.approvals.filter((a) => a.status === "approved").length;
    let newStage = updated.stage;
    if (allApproved) newStage = "Fully Approved";
    else if (approvedCount === 2) newStage = "Partially Approved – Awaiting Final Approval";
    else if (approvedCount === 1) newStage = "Partially Approved – Awaiting 2nd Approver";
    else newStage = "Awaiting Approval";
    updated.stage = newStage;
    setSelectedBill(updated);
    setBills((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setApprovalComment("");
    showToast("Approval recorded successfully.");
  }

  function handleSaveGst() {
    const val = parseFloat(gstInput);
    if (isNaN(val) || val < 0) { showToast("Invalid GST value.", "error"); return; }
    const updated = { ...selectedBill, gst: val };
    setSelectedBill(updated);
    setBills((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setEditingGst(false);
    showToast("GST amount updated.");
  }

  function handleCopyWbs() {
    if (!wbsAll.trim()) { showToast("Please enter a WBS code.", "error"); return; }
    const updated = { ...selectedBill, wbs: wbsAll };
    setSelectedBill(updated);
    setBills((prev) => prev.map((b) => (b.id === updated.id ? { ...b, wbs: wbsAll } : b)));
    setCopyWbsMode(false);
    showToast(`WBS '${wbsAll}' applied to all lines.`);
  }

  function handleXeroSync(billId) {
    setSyncingBillId(billId);
    setTimeout(() => {
      setBills((prev) =>
        prev.map((b) =>
          b.id === billId ? { ...b, xeroSynced: true, lastSyncAttempt: new Date().toISOString() } : b
        )
      );
      if (selectedBill && selectedBill.id === billId) {
        setSelectedBill((prev) => prev ? { ...prev, xeroSynced: true, lastSyncAttempt: new Date().toISOString() } : prev);
      }
      setSyncingBillId(null);
      showToast("Bill synced to Xero successfully.");
    }, 1800);
  }

  function openDocket(d) {
    setSelectedDocket({ ...d, internalNotes: d.internalNotes.map((n) => ({ ...n })) });
    setNewNote("");
  }

  function closeDocket() {
    setSelectedDocket(null);
  }

  function handleAddNote() {
    if (!newNote.trim()) return;
    const note = {
      id: "n" + Date.now(),
      author: "Sarah Mitchell",
      timestamp: new Date().toISOString(),
      note: newNote.trim(),
    };
    const updated = { ...selectedDocket, internalNotes: [...selectedDocket.internalNotes, note] };
    setSelectedDocket(updated);
    setDockets((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    setNewNote("");
    showToast("Internal note added.");
  }

  function handleRateEdit(rate) {
    setEditingRate(rate.id);
    setEditRateValue(String(rate.rate));
  }

  function handleRateSave(id) {
    const val = parseFloat(editRateValue);
    if (isNaN(val) || val < 0) { showToast("Invalid rate.", "error"); return; }
    setChargeRates((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, rate: val, lastUpdated: new Date().toISOString().slice(0, 10) } : r
      )
    );
    setEditingRate(null);
    showToast("Charge rate updated.");
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setUploadFileName(file.name);
      setTimeout(() => {
        setShowUploadModal(false);
        showToast(`Rates spreadsheet '${file.name}' uploaded successfully.`);
        setUploadFileName("");
      }, 1200);
    }
  }

  const filteredRates = rateFilterCategory === "All"
    ? chargeRates
    : chargeRates.filter((r) => r.category === rateFilterCategory);

  const totalLostHours = dockets.reduce((sum, d) => sum + (d.lostTime || 0), 0);

  const tabs = [
    { id: "bills", label: "Bill Approvals" },
    { id: "dockets", label: "Day Works Dockets" },
    { id: "rates", label: "Charge Rates" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <div className="bg-[#0a0a0a] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#0ea5e9] flex items-center justify-center text-white font-bold text-sm">V</div>
          <div>
            <div className="text-base font-semibold tracking-tight">Varicon</div>
            <div className="text-xs text-gray-400">Project Financials Platform</div>
          </div>
        </div>
        <div className="text-xs text-gray-400">Logged in as: Sarah Mitchell &nbsp;|&nbsp; Project Manager</div>
      </div>

      {/* Tab Nav */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === t.id
                  ? "border-[#0ea5e9] text-[#0ea5e9]"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* BILLS TAB */}
      {activeTab === "bills" && (
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Bill Approval Tracker</h1>
              <p className="text-sm text-gray-500 mt-0.5">Three-phase approval workflow with real-time status visibility</p>
            </div>
            <div className="text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
              {filteredBills.length} of {bills.length} bills shown
            </div>
          </div>

          {/* Filter Panel */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-5 flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Filter by Approval Stage</label>
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] min-w-[220px]"
              >
                <option value="All">All Stages</option>
                {APPROVAL_STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Filter by Pending Approver</label>
              <select
                value={filterApprover}
                onChange={(e) => setFilterApprover(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] min-w-[200px]"
              >
                <option value="All">All Approvers</option>
                {APPROVERS.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            {(filterStage !== "All" || filterApprover !== "All") && (
              <button
                onClick={() => { setFilterStage("All"); setFilterApprover("All"); }}
                className="text-xs text-[#0ea5e9] hover:underline mt-4"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {APPROVAL_STAGES.map((stage) => {
              const count = bills.filter((b) => b.stage === stage).length;
              return (
                <div
                  key={stage}
                  onClick={() => setFilterStage(filterStage === stage ? "All" : stage)}
                  className={`bg-white border rounded-lg p-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                    filterStage === stage ? "border-[#0ea5e9] ring-2 ring-[#0ea5e9]/20" : "border-gray-200"
                  }`}
                >
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-tight">{stage}</div>
                </div>
              );
            })}
          </div>

          {/* Bills Table */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Bill ID</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Supplier</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Amount (excl. GST)</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">GST</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">WBS</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Approval Stage</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Xero Sync</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-10 text-gray-400 text-sm">
                      No bills match the current filters.
                    </td>
                  </tr>
                )}
                {filteredBills.map((bill) => (
                  <tr
                    key={bill.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => openBill(bill)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{bill.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{bill.description}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{bill.supplier}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{formatCurrency(bill.amount)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(bill.gst)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{bill.wbs}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stageBadgeColor(bill.stage)}`}>
                        {bill.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${syncBadge(bill.xeroSynced)}`}>
                        {bill.xeroSynced ? "Synced" : "Not Synced"}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openBill(bill)}
                          className="text-xs px-2.5 py-1 rounded-md bg-[#0ea5e9]/10 text-[#0ea5e9] font-medium hover:bg-[#0ea5e9]/20 transition"
                        >
                          View
                        </button>
                        {!bill.xeroSynced && bill.stage === "Fully Approved" && (
                          <button
                            onClick={() => handleXeroSync(bill.id)}
                            disabled={syncingBillId === bill.id}
                            className="text-xs px-2.5 py-1 rounded-md bg-green-50 text-green-700 font-medium hover:bg-green-100 transition disabled:opacity-50"
                          >
                            {syncingBillId === bill.id ? "Syncing…" : "Sync Xero"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DOCKETS TAB */}
      {activeTab === "dockets" && (
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Day Works Dockets</h1>
              <p className="text-sm text-gray-500 mt-0.5">Internal notes and lost time tracking for submitted dockets</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm text-sm text-gray-600">
              Total Lost Time: <span className="font-semibold text-orange-600">{totalLostHours} hrs</span>
            </div>
          </div>

          {/* Lost Time Summary */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: "Total Dockets", value: dockets.length, color: "text-gray-900" },
              { label: "Submitted Dockets", value: dockets.filter(d => d.status === "Submitted").length, color: "text-[#0ea5e9]" },
              { label: "Total Lost Time Hours", value: `${totalLostHours} hrs`, color: "text-orange-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div