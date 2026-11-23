"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 bg-[#17365D] hover:bg-[#122b4a] text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
    >
      <Printer className="w-4 h-4" /> Print / Save PDF
    </button>
  );
}
