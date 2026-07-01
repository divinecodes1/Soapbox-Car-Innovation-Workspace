import React, { useState } from "react";
import { 
  soapboxData, 
  lectureNotes, 
  TeamInput, 
  FunctionalRequirement, 
  NonFunctionalRequirement, 
  ScoringOption, 
  MoSCoWItem, 
  RoadmapPhase, 
  RiskItem 
} from "./data";
import { 
  Wrench, 
  Users, 
  Shield, 
  Compass, 
  Activity, 
  Cpu, 
  Eye, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  Send, 
  BookOpen, 
  Award, 
  FileText, 
  Sliders, 
  Map, 
  Check, 
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Search,
  Maximize2
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "canvas" | "scoring" | "moscow" | "roadmap" | "learning" | "advisor">("dashboard");
  
  // Scoring Matrix State
  const [weights, setWeights] = useState({
    control: 30,
    safety: 25,
    feasibility: 20,
    cost: 15,
    test: 10
  });
  const [editingWeights, setWeightsEditing] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string>("C");

  // Checklist State for Roadmap
  const [checkedRoadmapActions, setCheckedRoadmapActions] = useState<Record<string, boolean>>({
    "1-Complete brake test": true,
    "1-Check fasteners": true,
    "1-Review seat fixation": true,
    "1-Review body edges for sharpness": false,
    "2-Build rigid joystick mount": false,
    "2-Reinforce steering mount": false
  });

  // Hype Cycle State
  const [hoveredTech, setHoveredTech] = useState<any>(null);

  // Chat Advisor State
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hello Parth! I am your Academic Advisor for the Digital Car & Customer Centric Design course. I have read your complete Group B Soapbox Car report and the lecture slides by Prof. Dr. Markus Straßberger. Ask me anything about your Innovation Plan, Design Thinking principles, the d.school gift-giving exercise, or Vehicle 4.0!"
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Toggle checklist
  const toggleRoadmapAction = (key: string) => {
    setCheckedRoadmapActions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Chat message submission
  const sendChatMessage = async (text: string) => {
    if (!text.trim() || isSending) return;

    const updatedMessages = [...chatMessages, { role: "user" as const, content: text }];
    setChatMessages(updatedMessages);
    setUserInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages })
      });
      const data = await response.json();
      if (data.reply) {
        setChatMessages(prev => [...prev, { role: "assistant" as const, content: data.reply }]);
      } else if (data.error) {
        setChatMessages(prev => [...prev, { role: "assistant" as const, content: `Error: ${data.error}` }]);
      }
    } catch (error) {
      console.error("Failed to query advisor:", error);
      setChatMessages(prev => [...prev, { role: "assistant" as const, content: "Sorry, I had trouble reaching the AI server. Make sure your GEMINI_API_KEY is configured." }]);
    } finally {
      setIsSending(false);
    }
  };

  // Re-calculate Weighted Scores based on current Weights
  const calculateOptionScore = (opt: ScoringOption) => {
    const totalWeight = weights.control + weights.safety + weights.feasibility + weights.cost + weights.test;
    if (totalWeight === 0) return 0;
    
    // Normalize weights if not summing to 100, though we display out of 100
    const wControl = weights.control / totalWeight;
    const wSafety = weights.safety / totalWeight;
    const wFeas = weights.feasibility / totalWeight;
    const wCost = weights.cost / totalWeight;
    const wTest = weights.test / totalWeight;

    const score = (
      opt.control * wControl +
      opt.safety * wSafety +
      opt.feasibility * wFeas +
      opt.cost * wCost +
      opt.test * wTest
    ) * 1.0; // scale appropriately

    return parseFloat(score.toFixed(2));
  };

  // Find Option C score dynamically
  const currentScores = soapboxData.options.map(opt => ({
    ...opt,
    dynamicScore: calculateOptionScore(opt)
  }));

  const winningOption = [...currentScores].sort((a, b) => b.dynamicScore - a.dynamicScore)[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Premium Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-50 px-6 flex items-center justify-between gap-4 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold font-sans">
            D
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 tracking-tight leading-none">
              DocuIntel Pro &bull; Soapbox Innovation
            </h1>
            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase font-mono mt-0.5">
              Technische Hochschule Deggendorf
            </p>
          </div>
        </div>
        
        {/* Banner details */}
        <div className="hidden md:flex items-center gap-3 text-xs text-slate-600 font-mono">
          <div className="px-3 py-1 rounded bg-slate-100 border border-slate-200">
            <span className="text-blue-600 font-semibold">Course:</span> Digital Car
          </div>
          <div className="px-3 py-1 rounded bg-slate-100 border border-slate-200">
            <span className="text-blue-600 font-semibold">Manager:</span> Parth Goswami (12611068)
          </div>
          <div className="px-3 py-1 rounded bg-slate-100 border border-slate-200">
            <span className="text-blue-600 font-semibold">Supervisor:</span> Prof. Dr. Straßberger
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Left Interactive Sidebar - Navigation Menu */}
        <aside className="w-full lg:w-64 border-r border-slate-200 bg-white p-6 flex flex-col justify-between gap-6 shrink-0">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Group B Soapbox Car
              </p>
              <h2 className="text-base font-bold text-slate-800 tracking-tight mt-1">
                Innovation Workspace
              </h2>
            </div>

            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "dashboard" ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <Sliders className="h-4 w-4 text-blue-600" />
                Car Dashboard & Spec
              </button>

              <button 
                onClick={() => setActiveTab("canvas")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "canvas" ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <Compass className="h-4 w-4 text-blue-600" />
                Driver Canvas & FRs
              </button>

              <button 
                onClick={() => setActiveTab("scoring")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "scoring" ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <Activity className="h-4 w-4 text-blue-600" />
                Scoring Playground
              </button>

              <button 
                onClick={() => setActiveTab("moscow")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "moscow" ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <Shield className="h-4 w-4 text-blue-600" />
                MoSCoW Prioritisation
              </button>

              <button 
                onClick={() => setActiveTab("roadmap")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "roadmap" ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <Map className="h-4 w-4 text-blue-600" />
                Roadmap & Risk Matrix
              </button>

              <button 
                onClick={() => setActiveTab("learning")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "learning" ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <BookOpen className="h-4 w-4 text-blue-600" />
                Lecture Learning Lab
              </button>

              <button 
                onClick={() => setActiveTab("advisor")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "advisor" ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <MessageSquare className="h-4 w-4 text-blue-600" />
                AI Study Advisor
                <span className="ml-auto inline-flex items-center rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 uppercase tracking-wider font-mono">
                  Gemini
                </span>
              </button>
            </nav>
          </div>

          {/* Quick Academic Context Card */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-800">SS2026 Academic Spec</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Based on Parth's portfolio report for <strong>Group B</strong>. Integrates customer concern models with advanced automotive software lifecycle practices.
            </p>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: "70%" }}></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Maturity</span>
              <span>70% (Incremental)</span>
            </div>
          </div>
        </aside>

        {/* Right Dynamic Area - Content Panel */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
          
          {/* TAB 1: DASHBOARD & SPEC */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Heading */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-800">Car Dashboard & Specification</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Current prototype overview and system observations from Parth's Group B portfolio.
                  </p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Build Phase 2: Steering & Chassis MVP
                </div>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Visual Overview Card */}
                <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between gap-6 relative overflow-hidden shadow-xs">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider font-mono">
                        Prototype Assembly Specs
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">ID: GP-B-2026</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <div className="text-slate-400 text-[10px]">CHASSIS</div>
                        <div className="text-slate-700 font-bold mt-0.5">Wooden Base Frame</div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <div className="text-slate-400 text-[10px]">WHEELS</div>
                        <div className="text-slate-700 font-bold mt-0.5">4x Metal Axle Mounts</div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <div className="text-slate-400 text-[10px]">COCKPIT</div>
                        <div className="text-slate-700 font-bold mt-0.5">Black Seating Unit</div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <div className="text-slate-400 text-[10px]">STEERING</div>
                        <div className="text-slate-700 font-bold mt-0.5">Vertical post (Tuning required)</div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <div className="text-slate-400 text-[10px]">BRAKE SYSTEM</div>
                        <div className="text-slate-700 font-bold mt-0.5">Rubber Friction Pads</div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <div className="text-slate-400 text-[10px]">AESTHETICS</div>
                        <div className="text-slate-700 font-bold mt-0.5">Tall Rear Wing (Rigid)</div>
                      </div>
                    </div>

                    {/* Schematic Representation */}
                    <div className="border border-slate-200 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center min-h-[200px] relative">
                      <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-mono">VEHICLE COMPONENT SCHEMATIC (GROUP B)</div>
                      
                      {/* Simple custom vector drawing representing the soapbox car layout */}
                      <svg viewBox="0 0 400 150" className="w-full max-w-[320px] h-auto">
                        {/* Wooden Chassis */}
                        <rect x="80" y="60" width="240" height="20" rx="3" fill="#ca8a04" stroke="#a16207" strokeWidth="2" />
                        {/* Axles */}
                        <line x1="120" y1="70" x2="120" y2="95" stroke="#94a3b8" strokeWidth="4" />
                        <line x1="280" y1="70" x2="280" y2="95" stroke="#94a3b8" strokeWidth="4" />
                        {/* Wheels */}
                        <circle cx="120" cy="95" r="22" fill="#334155" stroke="#475569" strokeWidth="3" />
                        <circle cx="120" cy="95" r="8" fill="#f1f5f9" />
                        <circle cx="280" cy="95" r="22" fill="#334155" stroke="#475569" strokeWidth="3" />
                        <circle cx="280" cy="95" r="8" fill="#f1f5f9" />
                        
                        {/* Driver Seat */}
                        <path d="M 180,60 L 180,35 L 205,35 L 215,60 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                        
                        {/* Steering Column (Option C Joystick highlight) */}
                        <line x1="170" y1="60" x2="155" y2="30" stroke="#2563eb" strokeWidth="3" strokeDasharray="2,2" />
                        <circle cx="155" cy="30" r="4" fill="#2563eb" />
                        
                        {/* Spoiler / Rear Wing */}
                        <line x1="300" y1="60" x2="300" y2="15" stroke="#dc2626" strokeWidth="3" />
                        <rect x="280" y="10" width="40" height="8" fill="#dc2626" rx="1" />
                        
                        {/* Brake Lever */}
                        <line x1="220" y1="60" x2="230" y2="40" stroke="#16a34a" strokeWidth="3" />
                        
                        {/* Annotations */}
                        <text x="140" y="20" fill="#2563eb" fontSize="8" fontFamily="monospace">Joystick Post (Option C)</text>
                        <text x="260" y="5" fill="#dc2626" fontSize="8" fontFamily="monospace">Rear Wing</text>
                        <text x="235" y="38" fill="#16a34a" fontSize="8" fontFamily="monospace">Friction Lever</text>
                        <text x="60" y="135" fill="#475569" fontSize="8" fontFamily="monospace">Axle Base</text>
                        <text x="290" y="135" fill="#475569" fontSize="8" fontFamily="monospace">Aligned Geometry</text>
                      </svg>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 italic mt-4">
                    "The soapbox is already a recognisable working prototype with a wooden chassis, cockpit, body panels, wheels, braking concept, and steering arrangement." — Parth's Main Observation
                  </p>
                </div>

                {/* Priority System Levels card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-xs">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider font-mono">
                      System-level Priorities
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="text-xs font-semibold text-slate-700">Steering interface & mount</div>
                        <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 uppercase">
                          Critical
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="text-xs font-semibold text-slate-700">Chassis torsional structure</div>
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                          High
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="text-xs font-semibold text-slate-700">Friction braking system</div>
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                          High
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="text-xs font-semibold text-slate-700">Wheels and axle alignment</div>
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                          High
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="text-xs font-semibold text-slate-700">Driver cockpit ergonomics</div>
                        <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase bg-amber-100/60">
                          Medium-High
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-700">Digital speed HMI (ESP32)</div>
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 uppercase">
                          Medium
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab("scoring")}
                    className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-semibold text-white shadow-xs transition-all cursor-pointer"
                  >
                    View Selection Evaluation
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Team Inputs Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-800 tracking-tight">Team Roles & Inputs Portfolio</h4>
                <p className="text-sm text-slate-500">
                  Parth's compiled innovation-management overview of subsystems designed by each team role.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {soapboxData.teamInputs.map((t, index) => (
                    <div 
                      key={index}
                      className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 hover:border-blue-400 transition-all flex flex-col justify-between shadow-xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                            <Users className="h-3 w-3" />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{t.role}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic">
                          "{t.input}"
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <div className="text-[9px] uppercase tracking-wider text-blue-600 font-bold font-mono">Meaning for Plan</div>
                        <p className="text-[11px] text-slate-700 font-medium mt-1 leading-snug">{t.meaning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CANVAS & FRs */}
          {activeTab === "canvas" && (
            <div className="space-y-8">
              {/* Heading */}
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-800">Driver Canvas & Requirements</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Value proposition design focused on Driver's concern mapping and derived technical requirements.
                </p>
              </div>

              {/* Empathy/Value Canvas Block */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-blue-600" />
                    <h4 className="text-base font-bold text-slate-800">Customer Value & Concern Canvas: The Driver</h4>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">THD Lecture SS26 Template</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Driver Jobs Card */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono uppercase text-blue-600">Customer Jobs</span>
                      <span className="text-[10px] text-slate-400 font-mono">🎯 Goal</span>
                    </div>
                    <ul className="space-y-2">
                      {soapboxData.userNeeds.jobs.map((job, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                          {job}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Driver Pains */}
                  <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono uppercase text-rose-700">Pains & Obstacles</span>
                      <span className="text-[10px] text-rose-400 font-mono">⚡ Frustrations</span>
                    </div>
                    <ul className="space-y-2">
                      {soapboxData.userNeeds.pains.map((pain, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Driver Fears */}
                  <div className="rounded-xl border border-red-100 bg-red-50/40 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono uppercase text-red-700">Severe Fears / Risks</span>
                      <span className="text-[10px] text-red-400 font-mono">🚨 Safety Threats</span>
                    </div>
                    <ul className="space-y-2">
                      {soapboxData.userNeeds.fears.map((fear, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                          {fear}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Desired Gains */}
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono uppercase text-emerald-700">Desired Gains</span>
                      <span className="text-[10px] text-emerald-500 font-mono">💎 Added Value</span>
                    </div>
                    <ul className="space-y-2">
                      {soapboxData.userNeeds.gains.map((gain, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          {gain}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pain Relievers */}
                  <div className="col-span-1 lg:col-span-2 rounded-xl border border-blue-100 bg-blue-50/40 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono uppercase text-blue-700">Proposed Pain Relievers</span>
                      <span className="text-[10px] text-blue-500 font-mono">🛠️ Concrete Features</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {soapboxData.userNeeds.painRelievers.map((reliever, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-white border border-blue-100 rounded-lg text-xs text-slate-700">
                          <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          {reliever}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Requirement Specifications Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Functional Requirements Table */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
                  <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Functional Specifications (FR)
                  </h4>
                  <div className="overflow-hidden border border-slate-200 rounded-lg bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-mono border-b border-slate-200">
                          <th className="p-3 w-16">ID</th>
                          <th className="p-3">Requirement</th>
                          <th className="p-3">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {soapboxData.functionalRequirements.map((fr) => (
                          <tr key={fr.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-mono font-bold text-blue-600">{fr.id}</td>
                            <td className="p-3 text-slate-700 font-medium">{fr.requirement}</td>
                            <td className="p-3 text-slate-500 italic">{fr.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Non-Functional Requirements Table */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
                  <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Non-Functional Specifications (NFR)
                  </h4>
                  <div className="overflow-hidden border border-slate-200 rounded-lg bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-mono border-b border-slate-200">
                          <th className="p-3 w-16">ID</th>
                          <th className="p-3">Requirement</th>
                          <th className="p-3">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {soapboxData.nonFunctionalRequirements.map((nfr) => (
                          <tr key={nfr.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-mono font-bold text-blue-600">{nfr.id}</td>
                            <td className="p-3 text-slate-700 font-medium">{nfr.requirement}</td>
                            <td className="p-3 text-slate-500 italic">{nfr.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: SCORING PLAYGROUND */}
          {activeTab === "scoring" && (
            <div className="space-y-6">
              {/* Heading */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-800">Weighted Scoring Matrix Playground</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Adjust criteria weights to evaluate the optimal soapbox system options in real-time.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setWeights({ control: 30, safety: 25, feasibility: 20, cost: 15, test: 10 });
                    setWeightsEditing(false);
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  Reset Weights
                </button>
              </div>

              {/* Adjust Weights Slider Board */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider font-mono text-blue-600 flex items-center gap-1.5">
                    <Sliders className="h-4 w-4" />
                    Configure Metric Importance Weights
                  </h4>
                  <span className="text-xs font-mono bg-slate-50 border border-slate-150 px-3 py-1 rounded-full text-slate-600">
                    Total Weight: <strong className="text-blue-600">{weights.control + weights.safety + weights.feasibility + weights.cost + weights.test}%</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {/* Slider Control */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">Driver Control</span>
                      <span className="font-mono text-blue-600 font-bold">{weights.control}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={weights.control}
                      onChange={(e) => setWeights({ ...weights, control: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <p className="text-[10px] text-slate-400 leading-normal">Steering response, feel & confidence.</p>
                  </div>

                  {/* Slider Safety */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">Safety & Reliability</span>
                      <span className="font-mono text-blue-600 font-bold">{weights.safety}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={weights.safety}
                      onChange={(e) => setWeights({ ...weights, safety: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <p className="text-[10px] text-slate-400 leading-normal">Risk of mechanical/fastener failure.</p>
                  </div>

                  {/* Slider Feasibility */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">Feasibility / Build</span>
                      <span className="font-mono text-blue-600 font-bold">{weights.feasibility}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={weights.feasibility}
                      onChange={(e) => setWeights({ ...weights, feasibility: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <p className="text-[10px] text-slate-400 leading-normal">Workshop build and tools effort.</p>
                  </div>

                  {/* Slider Cost */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">Cost Efficiency</span>
                      <span className="font-mono text-blue-600 font-bold">{weights.cost}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={weights.cost}
                      onChange={(e) => setWeights({ ...weights, cost: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <p className="text-[10px] text-slate-400 leading-normal">Remaining project budget limits.</p>
                  </div>

                  {/* Slider Testability */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">Maintenance & Test</span>
                      <span className="font-mono text-blue-600 font-bold">{weights.test}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={weights.test}
                      onChange={(e) => setWeights({ ...weights, test: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <p className="text-[10px] text-slate-400 leading-normal">Quick inspection and adjustments.</p>
                  </div>

                </div>
              </div>

              {/* Dynamic Score Chart Output */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Bar Chart (Dynamic scoring recalculation) */}
                <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider font-mono">
                    Live Score Comparison
                  </h4>

                  <div className="space-y-4 pt-2">
                    {currentScores.map((opt) => {
                      const totalWeight = weights.control + weights.safety + weights.feasibility + weights.cost + weights.test;
                      const controlShare = (opt.control * (weights.control / (totalWeight || 1)));
                      const safetyShare = (opt.safety * (weights.safety / (totalWeight || 1)));
                      const feasibilityShare = (opt.feasibility * (weights.feasibility / (totalWeight || 1)));
                      const costShare = (opt.cost * (weights.cost / (totalWeight || 1)));
                      const testShare = (opt.test * (weights.test / (totalWeight || 1)));
                      const normalizedScore = parseFloat((controlShare + safetyShare + feasibilityShare + costShare + testShare).toFixed(2));
                      const percentBar = (normalizedScore / 5) * 100;

                      return (
                        <div 
                          key={opt.id}
                          onClick={() => setSelectedOptionId(opt.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedOptionId === opt.id ? "bg-blue-50/40 border-blue-500" : "bg-white border-slate-200 hover:border-slate-300"}`}
                        >
                          <div className="flex justify-between items-center gap-4 mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-xs ${selectedOptionId === opt.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                  {opt.id}
                                </span>
                                <span className="text-xs font-bold text-slate-700">{opt.option}</span>
                                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 font-mono border border-slate-200/60">
                                  {opt.type}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm font-bold text-slate-800 font-mono">
                              {normalizedScore} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                            </div>
                          </div>
                          
                          {/* Segmented/Colored bar representing the weights breakdown dynamically */}
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-orange-500" style={{ width: `${(controlShare / 5) * 100}%` }} title="Control Contribution"></div>
                            <div className="h-full bg-emerald-500" style={{ width: `${(safetyShare / 5) * 100}%` }} title="Safety Contribution"></div>
                            <div className="h-full bg-yellow-500" style={{ width: `${(feasibilityShare / 5) * 100}%` }} title="Feasibility Contribution"></div>
                            <div className="h-full bg-blue-500" style={{ width: `${(costShare / 5) * 100}%` }} title="Cost Contribution"></div>
                            <div className="h-full bg-purple-500" style={{ width: `${(testShare / 5) * 100}%` }} title="Test Contribution"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chart Legend */}
                  <div className="flex flex-wrap gap-4 pt-3 text-[10px] font-mono text-slate-500 justify-center">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-orange-500"></span> Control
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500"></span> Safety
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-yellow-500"></span> Feasibility
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-blue-500"></span> Cost
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-purple-500"></span> Testability
                    </div>
                  </div>
                </div>

                {/* Option Specification details */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-xs">
                  {(() => {
                    const selectedOpt = soapboxData.options.find(o => o.id === selectedOptionId)!;
                    const isWinner = selectedOptionId === winningOption.id;
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-blue-600 uppercase font-mono tracking-widest">
                              Option {selectedOpt.id} Specifications
                            </span>
                            <h4 className="text-base font-bold text-slate-800 tracking-tight mt-1">{selectedOpt.option}</h4>
                          </div>
                          {isWinner && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200 uppercase flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              Optimal
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-150">
                          {selectedOpt.description}
                        </p>

                        <div className="space-y-2 pt-2">
                          <h5 className="text-xs font-bold text-slate-500 font-mono">Subsystem Ratings (1 - 5):</h5>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                              <span className="text-slate-400 text-[10px]">DRIVER CONTROL</span>
                              <div className="text-slate-800 font-bold mt-0.5">{selectedOpt.control} / 5</div>
                            </div>
                            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                              <span className="text-slate-400 text-[10px]">SAFETY RATING</span>
                              <div className="text-slate-800 font-bold mt-0.5">{selectedOpt.safety} / 5</div>
                            </div>
                            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                              <span className="text-slate-400 text-[10px]">FEASIBILITY</span>
                              <div className="text-slate-800 font-bold mt-0.5">{selectedOpt.feasibility} / 5</div>
                            </div>
                            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                              <span className="text-slate-400 text-[10px]">COST EFFICIENCY</span>
                              <div className="text-slate-800 font-bold mt-0.5">{selectedOpt.cost} / 5</div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase font-mono">Parth's Assessment:</div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {selectedOpt.id === "C" ? (
                              "Selected core concept because it offers an optimal balance between driver trust, minimal play, and affordable workshop execution."
                            ) : selectedOpt.id === "D" ? (
                              "A rigid steel linkage could give higher mechanical precision, but is far more complex to build under tight time/budget limits."
                            ) : (
                              "Provides insufficient safety margin or poor turning confidence under rapid cornering test maneuvers."
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  <button 
                    onClick={() => setActiveTab("moscow")}
                    className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 py-3 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer"
                  >
                    Prioritise Plan Requirements
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: MOSCOW PRIORITISATION */}
          {activeTab === "moscow" && (
            <div className="space-y-6">
              {/* Heading */}
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-800">MoSCoW Prioritisation Workspace</h3>
                <p className="text-sm text-slate-500 mt-1">
                  System requirements parsed into Must, Should, Could, and Won't segments to focus the Group B build sessions.
                </p>
              </div>

              {/* MoSCoW Grid columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* MUST HAVE */}
                <div className="rounded-2xl border border-red-250 bg-red-50/40 p-6 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center border-b border-red-100 pb-3">
                    <h4 className="text-base font-bold text-red-700 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Must Have (Safety/Core)
                    </h4>
                    <span className="rounded bg-red-100 border border-red-200 px-2.5 py-1 text-xs font-mono font-bold text-red-800">
                      8 Items
                    </span>
                  </div>
                  <div className="space-y-3">
                    {soapboxData.moscow.filter(m => m.category === "Must").map((m, idx) => (
                      <div key={idx} className="p-3.5 bg-white border border-red-100 rounded-xl space-y-1 shadow-xs hover:border-red-300 transition-all">
                        <div className="text-xs font-bold text-slate-800">{m.item}</div>
                        <p className="text-[11px] text-slate-500 italic">"{m.reason}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SHOULD HAVE */}
                <div className="rounded-2xl border border-emerald-250 bg-emerald-50/40 p-6 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
                    <h4 className="text-base font-bold text-emerald-700 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Should Have (High Value)
                    </h4>
                    <span className="rounded bg-emerald-100 border border-emerald-200 px-2.5 py-1 text-xs font-mono font-bold text-emerald-800">
                      7 Items
                    </span>
                  </div>
                  <div className="space-y-3">
                    {soapboxData.moscow.filter(m => m.category === "Should").map((m, idx) => (
                      <div key={idx} className="p-3.5 bg-white border border-emerald-100 rounded-xl space-y-1 shadow-xs hover:border-emerald-300 transition-all">
                        <div className="text-xs font-bold text-slate-800">{m.item}</div>
                        <p className="text-[11px] text-slate-500 italic">"{m.reason}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COULD HAVE */}
                <div className="rounded-2xl border border-blue-250 bg-blue-50/40 p-6 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center border-b border-blue-100 pb-3">
                    <h4 className="text-base font-bold text-blue-700 flex items-center gap-2">
                      <Compass className="h-5 w-5" />
                      Could Have (Desirable)
                    </h4>
                    <span className="rounded bg-blue-100 border border-blue-200 px-2.5 py-1 text-xs font-mono font-bold text-blue-800">
                      4 Items
                    </span>
                  </div>
                  <div className="space-y-3">
                    {soapboxData.moscow.filter(m => m.category === "Could").map((m, idx) => (
                      <div key={idx} className="p-3.5 bg-white border border-blue-100 rounded-xl space-y-1 shadow-xs hover:border-blue-300 transition-all">
                        <div className="text-xs font-bold text-slate-800">{m.item}</div>
                        <p className="text-[11px] text-slate-500 italic">"{m.reason}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WON'T HAVE / NOT PLANNED */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <h4 className="text-base font-bold text-slate-500 flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Not Planned For This Phase
                    </h4>
                    <span className="rounded bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-mono font-bold text-slate-600">
                      4 Items
                    </span>
                  </div>
                  <div className="space-y-3">
                    {soapboxData.moscow.filter(m => m.category === "Won't").map((m, idx) => (
                      <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs hover:border-slate-300 transition-all opacity-80">
                        <div className="text-xs font-bold text-slate-400 line-through">{m.item}</div>
                        <p className="text-[11px] text-slate-500 italic">"{m.reason}"</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: ROADMAP & RISK GRID */}
          {activeTab === "roadmap" && (
            <div className="space-y-8">
              {/* Heading */}
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-800">Roadmap Tracker & Risk Register</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Follow the 5-phase structured development plan and analyze mitigation actions for critical project risks.
                </p>
              </div>

              {/* 5-Phase Roadmap Checklist */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Map className="h-5 w-5 text-blue-600" />
                  <h4 className="text-base font-bold text-slate-800">Interactive 5-Phase Development Roadmap</h4>
                </div>

                <div className="space-y-6">
                  {soapboxData.roadmap.map((r) => (
                    <div key={r.phase} className="flex flex-col md:flex-row gap-4 border-l-2 border-blue-600 pl-4 ml-2">
                      <div className="md:w-48 shrink-0">
                        <span className="text-[10px] font-mono font-bold uppercase text-blue-600 tracking-wider">
                          Phase {r.phase} Focus
                        </span>
                        <h5 className="text-sm font-bold text-slate-800 mt-0.5">{r.focus}</h5>
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {r.actions.map((act, index) => {
                            const uniqueKey = `${r.phase}-${act}`;
                            const isChecked = !!checkedRoadmapActions[uniqueKey];
                            return (
                              <div 
                                key={index}
                                onClick={() => toggleRoadmapAction(uniqueKey)}
                                className={`flex items-center gap-2.5 p-3 rounded-lg border transition-all cursor-pointer select-none text-xs ${isChecked ? "bg-slate-50/70 border-slate-150 text-slate-400 line-through" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"}`}
                              >
                                <div className={`h-4.5 w-4.5 rounded flex items-center justify-center border transition-all ${isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-slate-50"}`}>
                                  {isChecked && <Check className="h-3 w-3" />}
                                </div>
                                {act}
                              </div>
                            );
                          })}
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-150 text-xs text-slate-600">
                          <strong className="text-slate-700">Success Criteria:</strong> {r.successCheck}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Heatmap Mapping */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 5x5 Matrix Diagram representation */}
                <div className="col-span-1 lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider font-mono">
                    Interactive Risk Heatmap Matrix
                  </h4>
                  <p className="text-xs text-slate-500">
                    Hover over or tap a numbered risk bubble inside the matrix coordinates to view complete mitigation actions.
                  </p>

                  <div className="flex flex-col items-center pt-2">
                    <div className="relative border border-slate-200 rounded-xl p-4 bg-slate-50/50 w-full max-w-lg">
                      
                      {/* Grid representation */}
                      <div className="grid grid-cols-6 gap-2">
                        {/* Empty corner */}
                        <div></div>
                        <div className="text-center text-[10px] font-mono text-slate-400 pb-1">Sev 1</div>
                        <div className="text-center text-[10px] font-mono text-slate-400 pb-1">Sev 2</div>
                        <div className="text-center text-[10px] font-mono text-slate-400 pb-1">Sev 3</div>
                        <div className="text-center text-[10px] font-mono text-slate-400 pb-1">Sev 4</div>
                        <div className="text-center text-[10px] font-mono text-slate-400 pb-1">Sev 5</div>

                        {/* Likelihood 5 */}
                        <div className="text-right pr-2 text-[10px] font-mono text-slate-400 flex items-center justify-end">Like 5</div>
                        <div className="h-12 bg-yellow-500/10 rounded border border-slate-200/40 flex items-center justify-center"></div>
                        <div className="h-12 bg-orange-500/10 rounded border border-slate-200/40 flex items-center justify-center"></div>
                        <div className="h-12 bg-rose-500/10 rounded-lg flex items-center justify-center"></div>
                        <div className="h-full bg-rose-500/20 rounded-lg flex"></div>
                        <div className="h-full bg-rose-600/30 rounded-lg flex"></div>

                        {/* Likelihood 4 */}
                        <div className="text-right pr-2 text-[10px] font-mono text-slate-400 flex items-center justify-end">Like 4</div>
                        <div className="h-12 bg-yellow-500/10 rounded border border-slate-200/40 flex items-center justify-center"></div>
                        <div className="h-12 bg-yellow-500/20 rounded border border-slate-200/40 flex items-center justify-center"></div>
                        <div className="h-12 bg-orange-500/20 rounded border border-slate-200/40 flex items-center justify-center"></div>
                        <div className="h-12 bg-rose-500/20 rounded border border-slate-200/40 flex items-center justify-center relative">
                          <span className="absolute h-7 w-7 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer animate-pulse" title="R2: Rope delay">R2</span>
                        </div>
                        <div className="h-12 bg-rose-600/30 rounded border border-slate-200/40 flex items-center justify-center relative">
                          <span className="absolute h-7 w-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer" title="R1: Steering Mount Flex">R1</span>
                        </div>

                        {/* Likelihood 3 */}
                        <div className="text-right pr-2 text-[10px] font-mono text-slate-400 flex items-center justify-end">Like 3</div>
                        <div className="h-12 bg-emerald-500/10 rounded border border-slate-200/40"></div>
                        <div className="h-12 bg-yellow-500/10 rounded border border-slate-200/40"></div>
                        <div className="h-12 bg-yellow-500/20 rounded border border-slate-200/40"></div>
                        <div className="h-12 bg-orange-500/20 rounded border border-slate-200/40 flex items-center justify-center relative">
                          <span className="absolute h-7 w-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer" title="R4: Seat shift">R4</span>
                        </div>
                        <div className="h-12 bg-rose-500/20 rounded border border-slate-200/40 flex items-center justify-center relative">
                          <span className="absolute h-7 w-7 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer" title="R3: Brake fails / R5: Fastener loose">R3,5</span>
                        </div>

                        {/* Likelihood 2 */}
                        <div className="text-right pr-2 text-[10px] font-mono text-slate-400 flex items-center justify-end">Like 2</div>
                        <div className="h-12 bg-emerald-500/10 rounded border border-slate-200/40"></div>
                        <div className="h-12 bg-emerald-500/20 rounded border border-slate-200/40"></div>
                        <div className="h-12 bg-yellow-500/10 rounded border border-slate-200/40 flex items-center justify-center relative">
                          <span className="absolute h-7 w-7 rounded-full bg-yellow-500 text-slate-900 flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer" title="R6: Spoiler wing flex / R7: HMI distract">R6,7</span>
                        </div>
                        <div className="h-12 bg-yellow-500/20 rounded border border-slate-200/40"></div>
                        <div className="h-12 bg-orange-500/15 rounded border border-slate-200/40"></div>

                        {/* Likelihood 1 */}
                        <div className="text-right pr-2 text-[10px] font-mono text-slate-400 flex items-center justify-end">Like 1</div>
                        <div className="h-12 bg-emerald-500/10 rounded border border-slate-200/40"></div>
                        <div className="h-12 bg-emerald-500/15 rounded border border-slate-200/40"></div>
                        <div className="h-12 bg-emerald-500/20 rounded border border-slate-200/40"></div>
                        <div className="h-12 bg-yellow-500/10 rounded border border-slate-200/40"></div>
                        <div className="h-12 bg-yellow-500/15 rounded border border-slate-200/40"></div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Risk descriptions list */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 overflow-y-auto max-h-[420px] shadow-xs">
                  <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider font-mono">
                    Group B Mitigation Index
                  </h4>

                  <div className="space-y-3.5">
                    {soapboxData.risks.map((r, index) => (
                      <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <div className="text-xs font-bold text-slate-800">
                            <span className="text-blue-600 font-mono mr-1">R{index + 1}:</span> {r.risk}
                          </div>
                          <span className="shrink-0 font-mono text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                            L{r.likelihood} x S{r.severity}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 leading-normal">
                          <strong className="text-emerald-600">Mitigation:</strong> {r.mitigation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: LECTURE LEARNING LAB */}
          {activeTab === "learning" && (
            <div className="space-y-8">
              {/* Heading */}
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-800">THD Digital Car Learning Lab</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Interactive lecture reference companion mapping theoretical principles with real applications.
                </p>
              </div>

              {/* Gartner Hype Cycle Diagram Visualizer */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <h4 className="text-base font-bold text-slate-800">Interactive Hype Cycle Matrix</h4>
                  </div>
                  <span className="text-xs font-mono text-slate-400">THD Lecture Slide Spec</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Visual SVG plot curve of the cycle */}
                  <div className="col-span-1 lg:col-span-2 border border-slate-200 bg-slate-50/50 p-6 rounded-xl flex flex-col justify-between relative min-h-[300px]">
                    <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-mono">GARTNER HYPE CYCLE FOR AUTOMOTIVE AI</div>
                    
                    {/* Hype Cycle SVG Path */}
                    <svg viewBox="0 0 500 220" className="w-full h-auto">
                      {/* Grid Guide lines */}
                      <line x1="50" y1="180" x2="450" y2="180" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" />
                      <line x1="50" y1="180" x2="50" y2="20" stroke="#cbd5e1" strokeWidth="1" />
                      
                      {/* Main Hype Curve */}
                      <path d="M 50,180 C 100,160 110,30 140,40 C 170,50 190,195 240,175 C 290,155 350,110 450,100" fill="none" stroke="#2563eb" strokeWidth="3" />
                      
                      {/* Placed Interactive Hotspots */}
                      {lectureNotes.hypeCycle.technologies.map((tech, idx) => {
                        // Plot coordinates derived mathematically to align with curve
                        const x = tech.name.includes("Autonomic") ? 80 
                                : tech.name.includes("Generative") ? 135
                                : tech.name.includes("Valet") ? 185
                                : tech.name.includes("Level 3") ? 310
                                : 410;
                        const y = tech.name.includes("Autonomic") ? 150 
                                : tech.name.includes("Generative") ? 38
                                : tech.name.includes("Valet") ? 115
                                : tech.name.includes("Level 3") ? 130
                                : 101;
                        
                        return (
                          <g 
                            key={idx} 
                            className="cursor-pointer" 
                            onMouseEnter={() => setHoveredTech(tech)}
                            onClick={() => setHoveredTech(tech)}
                          >
                            <circle cx={x} cy={y} r="7" fill={hoveredTech?.name === tech.name ? "#2563eb" : "#94a3b8"} stroke="#ffffff" strokeWidth="1.5" className="transition-all" />
                            <text x={x + 10} y={y + 3} fill="#64748b" fontSize="7" fontFamily="monospace" className="pointer-events-none">{tech.name.split(" ")[0]}...</text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Curve Legend stages labels */}
                    <div className="grid grid-cols-5 text-[9px] text-center text-slate-400 font-mono pt-3 border-t border-slate-200">
                      <div>Trigger</div>
                      <div>Peak</div>
                      <div>Trough</div>
                      <div>Slope</div>
                      <div>Plateau</div>
                    </div>
                  </div>

                  {/* Active Hype info Box */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-xs">
                    {hoveredTech ? (
                      <div className="space-y-3">
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {hoveredTech.phase}
                        </span>
                        <h5 className="text-sm font-bold text-slate-800 tracking-tight mt-1">{hoveredTech.name}</h5>
                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-150">
                          {hoveredTech.impact}
                        </p>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-2">
                        <TrendingUp className="h-8 w-8 text-slate-300" />
                        <p className="text-xs">Hover or tap on any coordinate bubble on the Hype curve plot to view research details.</p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-mono mt-3">
                      "We tend to overestimate the effect of a technology in the short run and underestimate the effect in the long run" — Roy Charles Amara
                    </div>
                  </div>
                </div>
              </div>

              {/* Design Thinking Steps Grid */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-800 tracking-tight">Stanford d.school Design Thinking Model</h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {lectureNotes.designThinking.phases.map((p, index) => (
                    <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 hover:border-slate-300 transition-all shadow-xs">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">
                        Phase {index + 1}
                      </span>
                      <h5 className="text-sm font-bold text-slate-800 tracking-tight">{p.name}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                      
                      <div className="pt-2.5 border-t border-slate-100">
                        <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono">Actions</div>
                        <ul className="space-y-1.5 mt-1.5">
                          {p.actions.slice(0, 2).map((act, i) => (
                            <li key={i} className="text-[11px] text-slate-600 leading-tight flex items-start gap-1">
                              <span className="text-blue-500">•</span>
                              {act}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle Generations Grid */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-800 tracking-tight">Vehicle Generations Evolution path</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.entries(lectureNotes.devOps.contrast).map(([key, v]) => (
                    <div key={key} className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">
                        Evolution Model
                      </span>
                      <h5 className="text-sm font-bold text-slate-800 tracking-tight">{v.name}</h5>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {v.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-1 leading-snug">
                            <span className="text-slate-300 font-mono">•</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: AI STUDY ADVISOR */}
          {activeTab === "advisor" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col h-[calc(100vh-140px)] min-h-[500px] shadow-xs">
              
              {/* Box Heading */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">THD Digital Car Chat Advisor</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Powered by server-side Gemini 3.5 Flash</p>
                  </div>
                </div>

                <button 
                  onClick={() => setChatMessages([{
                    role: "assistant",
                    content: "Hello Parth! Chat was reset. Ask me any question regarding your Group B Soapbox Car report or lecture topics!"
                  }])}
                  className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded text-xs font-semibold font-mono flex items-center gap-1 transition-all cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  Clear
                </button>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index}
                    className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                  >
                    <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 border border-slate-200 text-blue-600"}`}>
                      {msg.role === "user" ? "P" : "AI"}
                    </div>
                    
                    <div className={`rounded-2xl p-4 text-xs leading-relaxed space-y-1 ${msg.role === "user" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-50 border border-slate-200 text-slate-800 shadow-xs"}`}>
                      {msg.content.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
                
                {isSending && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="h-8 w-8 rounded-full bg-slate-150 border border-slate-200 text-blue-600 flex items-center justify-center text-xs animate-pulse font-bold">
                      ...
                    </div>
                    <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200 text-slate-500 text-xs italic flex items-center gap-2">
                      <RefreshCw className="h-3 w-3 animate-spin text-blue-600" />
                      Advisor is checking slide notes...
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Helper Quick suggestions list */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 mt-4">
                <button 
                  onClick={() => sendChatMessage("Why was Option C selected over Option D?")}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-500 hover:text-slate-700 transition-all text-left cursor-pointer"
                >
                  "Why was Option C selected?"
                </button>
                <button 
                  onClick={() => sendChatMessage("What are the Must-Haves and priorities for Phase 1?")}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-500 hover:text-slate-700 transition-all text-left cursor-pointer"
                >
                  "Explain Phase 1 requirements"
                </button>
                <button 
                  onClick={() => sendChatMessage("Explain the difference between Vehicle 3.0 and Vehicle 4.0")}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-500 hover:text-slate-700 transition-all text-left cursor-pointer"
                >
                  "Explain Vehicle 4.0 evolution"
                </button>
                <button 
                  onClick={() => sendChatMessage("What are the 5 phases of Design Thinking in the Stanford playbook?")}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-500 hover:text-slate-700 transition-all text-left cursor-pointer"
                >
                  "What is Design Thinking?"
                </button>
              </div>

              {/* Chat Input form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  sendChatMessage(userInput);
                }}
                className="flex items-center gap-2 pt-3 mt-2"
              >
                <input 
                  type="text"
                  placeholder="Ask advisor about any aspect of your report or course lectures..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isSending}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={!userInput.trim() || isSending}
                  className="h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 text-white flex items-center justify-center shrink-0 transition-all shadow-xs cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

            </div>
          )}

        </main>
      </div>

      {/* Elegant minimalist academic footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-mono text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} Parth Goswami &amp; Prof. Dr. Markus Straßberger. All Rights Reserved.
        </div>
        <div>
          Technische Hochschule Deggendorf &bull; TC Plattling
        </div>
      </footer>
    </div>
  );
}
