"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  RefreshCw,
  Terminal,
  Globe,
  Settings,
  Edit3,
  Check,
  Code,
  X,
} from "lucide-react";
import apiExample, { type Example } from "@/service/api-example";

export default function Home() {
  const [examples, setExamples] = useState<Example[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    version: 1.0,
    buildCount: 1,
  });

  const fetchExamples = async () => {
    setLoading(true);
    try {
      const result = await apiExample.getExamples();
      if (result.success) {
        setExamples(result.data);
      }
    } catch (error: any) {
      showNotification("Service unavailable", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamples();
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", version: 1.0, buildCount: 1 });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const result = await apiExample.updateExample(editingId, formData);
        if (result.success) {
          showNotification("PUT: Updated successfully", "success");
        }
      } else {
        const result = await apiExample.createExample(formData);
        if (result.success) {
          showNotification("POST: Created successfully", "success");
        }
      }
      fetchExamples();
      resetForm();
    } catch (error: any) {
      showNotification("Action failed", "error");
    }
  };

  const handleEdit = (ex: Example) => {
    setEditingId(ex.id);
    setFormData({
      name: ex.name,
      description: ex.description,
      version: ex.version,
      buildCount: ex.buildCount,
    });
    window.scrollTo({
      top: document.getElementById("playground-form")?.offsetTop
        ? document.getElementById("playground-form")!.offsetTop - 100
        : 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await apiExample.deleteExample(id);
      if (result.success) {
        fetchExamples();
        showNotification("DELETE: Unit removed", "success");
      }
    } catch (error: any) {
      showNotification("Deletion error", "error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      {/* Top Nav */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Globe size={18} className="text-white" />
          <span className="font-black tracking-tight text-lg uppercase italic">
            Pipeline.OS
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
          <a
            href="#"
            className="hover:text-white cursor-pointer transition-colors"
          >
            Documentation
          </a>
          <a
            href="#"
            className="hover:text-white cursor-pointer transition-colors"
          >
            Infrastructure
          </a>
          <a
            href="#playground-section"
            className="hover:text-white cursor-pointer transition-colors text-white"
          >
            API Test
          </a>
        </div>
        <button className="bg-white/5 border border-white/10 text-white px-5 py-2 rounded text-[11px] font-black uppercase tracking-widest hover:bg-white/10 cursor-pointer transition-all">
          Build v1.0.4
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto pt-24 pb-4 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl md:text-9xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent italic"
        >
          DevOps Init
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto mb-12 font-bold uppercase tracking-[0.1em]"
        >
          Clean Fullstack Boilerplate for registry automation
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-4 text-slate-500 font-mono text-xs border border-white/10 px-6 py-3 rounded bg-white/5 mb-32 select-all cursor-text"
        >
          <Terminal size={14} />
          <span>~ npx create-devops-pipeline@latest</span>
        </motion.div>

        {/* API INTERFACE SECTION */}
        <section
          id="playground-section"
          className="mt-40 text-left border-t border-white/10 pt-24 pb-40"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <div className="inline-flex items-center gap-2 text-primary text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4">
                <Code size={12} />
                Endpoint Testing
              </div>
              <h2 className="text-5xl font-black tracking-tighter mb-2 italic">
                API Playground
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                Direct integration with registries (H2 / PostgreSQL)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                Method: <span className="text-green-500">GET ALL</span>
              </span>
              <button
                onClick={fetchExamples}
                className="p-3 border border-white/10 rounded hover:bg-white/5 cursor-pointer transition-all"
              >
                <RefreshCw
                  size={20}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>

          {/* Form Area - Always visible now for better UX */}
          <div id="playground-form" className="mb-20">
            <div className="flex items-center gap-2 mb-6">
              <span
                className={cn(
                  "px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                  editingId
                    ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                    : "bg-blue-500/20 text-blue-500 border border-blue-500/30",
                )}
              >
                {editingId ? "PUT (Update)" : "POST (Create)"}
              </span>
              <span className="text-sm font-bold text-slate-400">
                {editingId
                  ? `Editing Instance ID: ${editingId}`
                  : "Submit new service to registry"}
              </span>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white/[0.03] border border-white/10 rounded p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Service Identifier
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. redis-cluster"
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm focus:border-white outline-none font-bold"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Configuration Meta
                  </label>
                  <input
                    type="text"
                    placeholder="Describe instance..."
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm focus:border-white outline-none font-bold"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Version Spec
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm focus:border-white outline-none font-bold"
                    value={formData.version}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        version: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Active Units
                  </label>
                  <input
                    type="number"
                    className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm focus:border-white outline-none font-bold"
                    value={formData.buildCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        buildCount: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className={cn(
                    "flex-1 h-14 rounded text-[11px] font-black uppercase tracking-[0.3em] cursor-pointer transition-all active:scale-95",
                    editingId
                      ? "bg-amber-500 text-black hover:opacity-90"
                      : "bg-white text-black hover:opacity-90 shadow-xl shadow-white/5",
                  )}
                >
                  {editingId ? "Commit Changes" : "Register Unit"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 border border-white/10 rounded hover:bg-white/5 font-black text-xs uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">
              Active Registry Units
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examples.length === 0 ? (
                <div className="col-span-full border border-dashed border-white/10 rounded py-20 text-center text-slate-700 font-black uppercase tracking-[0.3em] text-[10px]">
                  No registry data to display.
                </div>
              ) : (
                examples.map((ex) => (
                  <motion.div
                    key={ex.id}
                    layoutId={`ex-${ex.id}`}
                    className="group border border-white/10 rounded p-6 hover:border-white/20 transition-all flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-black px-1.5 py-0.5 border border-white/10 rounded-sm text-slate-500 uppercase tracking-tighter">
                          ID: {ex.id}
                        </span>
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      </div>
                      <h4 className="text-xl font-black italic">{ex.name}</h4>
                      <p className="text-xs text-slate-500 font-bold line-clamp-1">
                        {ex.description || "N/A"}
                      </p>

                      <div className="flex gap-4 pt-4">
                        <span className="text-[10px] font-black text-slate-600 uppercase">
                          v{ex.version.toFixed(1)}
                        </span>
                        <span className="text-[10px] font-black text-slate-600 uppercase">
                          {ex.buildCount} builds
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="text-[9px] font-black text-slate-800 uppercase tracking-widest text-right mb-1">
                        Actions
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(ex)}
                          className="p-2.5 border border-white/5 bg-white/5 text-slate-400 hover:text-amber-500 hover:border-amber-500/20 rounded cursor-pointer transition-all"
                          title="PUT Request"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(ex.id)}
                          className="p-2.5 border border-white/5 bg-white/5 text-slate-400 hover:text-red-500 hover:border-red-500/20 rounded cursor-pointer transition-all"
                          title="DELETE Request"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={cn(
              "fixed bottom-8 right-8 px-6 py-4 border rounded font-black text-[10px] uppercase tracking-[0.2em] z-50 shadow-2xl flex items-center gap-3",
              notification.type === "success"
                ? "bg-white text-black border-white"
                : "bg-red-600 text-white border-red-600",
            )}
          >
            {notification.type === "success" ? (
              <Check size={14} />
            ) : (
              <X size={14} />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-white/10 py-12 px-6 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]">
            <span>Registry.v1</span>
            <span className="h-1 w-1 bg-slate-800 rounded-full" />
            <span>2026</span>
          </div>
          <Settings size={16} />
        </div>
      </footer>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
