import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { soapboxData, lectureNotes } from "./src/data"; // note: using relative import

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("Warning: GEMINI_API_KEY environment variable is not defined.");
  }

  // API endpoint for AI Advisor chat
  app.post("/api/advisor", async (req, res) => {
    if (!ai) {
      return res.status(500).json({ 
        error: "Gemini API client is not initialized. Please verify that GEMINI_API_KEY is configured in your secrets." 
      });
    }

    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request. 'messages' array is required." });
      }

      // Prepare system instructions with all Soapbox Car project data and lecture notes
      const systemInstruction = `You are the Expert Automotive Innovation & Design Thinking Advisor for TH Deggendorf (SS2026).
Your primary user is Parth Goswami, the Innovation Manager of Group B's Soapbox Car Project.
You have access to the complete Group B project report and course lecture notes. Use this knowledge to answer questions in a professional, precise, and supportive academic tone.

Here is the Soapbox Car Group B Report context:
- Project Title: "${soapboxData.title}"
- Author: "${soapboxData.author}"
- Semester: "${soapboxData.semester}"
- Course: "${soapboxData.course}"
- Supervisor: "${soapboxData.supervisor}"
- Current State: Wooden base frame, four wheels, black cockpit seat, painted panels, tall rear wing, visible steering post.
- Team Roles and Observations:
${soapboxData.teamInputs.map(t => `  * ${t.role}: ${t.input} -> Plan Meaning: ${t.meaning}`).join("\n")}
- Driver Pains & Gains (Canvas):
  * Jobs: ${soapboxData.userNeeds.jobs.join(", ")}
  * Pains: ${soapboxData.userNeeds.pains.join(", ")}
  * Fears: ${soapboxData.userNeeds.fears.join(", ")}
  * Gains: ${soapboxData.userNeeds.gains.join(", ")}
  * Pain Relievers: ${soapboxData.userNeeds.painRelievers.join(", ")}
- Requirements:
  * Functional: ${soapboxData.functionalRequirements.map(f => `${f.id}: ${f.requirement} (${f.reason})`).join("; ")}
  * Non-Functional: ${soapboxData.nonFunctionalRequirements.map(n => `${n.id}: ${n.requirement} (${n.reason})`).join("; ")}
- Scoring Options Evaluation (Option C is selected as the winner with score 4.00):
${soapboxData.options.map(o => `  * Option ${o.id} [${o.type}]: "${o.option}" - ${o.description} (Control: ${o.control}, Safety: ${o.safety}, Feasibility: ${o.feasibility}, Cost: ${o.cost}, Test: ${o.test})`).join("\n")}
- MoSCoW Prioritisation Board:
  * Must Have: ${soapboxData.moscow.filter(m => m.category === 'Must').map(m => m.item).join(", ")}
  * Should Have: ${soapboxData.moscow.filter(m => m.category === 'Should').map(m => m.item).join(", ")}
  * Could Have: ${soapboxData.moscow.filter(m => m.category === 'Could').map(m => m.item).join(", ")}
  * Won't Have / Deferred: ${soapboxData.moscow.filter(m => m.category === "Won't").map(m => m.item).join(", ")}
- Implementation Roadmap Phases:
${soapboxData.roadmap.map(r => `  * Phase ${r.phase} [${r.focus}]: Actions: [${r.actions.join(", ")}]. Success check: ${r.successCheck}`).join("\n")}
- Risk Register (Likelihood vs Severity):
${soapboxData.risks.map(r => `  * Risk: "${r.risk}" (Likelihood: ${r.likelihood}/5, Severity: ${r.severity}/5) -> Mitigation: ${r.mitigation}`).join("\n")}

Here is the Design Thinking Lecture and d.school context:
- Design Thinking Steps: ${lectureNotes.designThinking.phases.map(p => `${p.name}: ${p.description}`).join(" | ")}
- 70-20-10 Innovation Funnel: 70% Incremental (e.g. rope tensioning/braking checks), 20% Adjacent (e.g. joystick steering), 10% Disruptive (e.g. fully electronic/differential steering).
- Gartner Hype Cycle tech status:
${lectureNotes.hypeCycle.technologies.map(t => `  * ${t.name}: in "${t.phase}" (impact: ${t.impact})`).join("\n")}
- Vehicle Generations: Vehicle 1.0 (FunctionalCAN), 2.0 (Digital Cloud), 3.0 (Updateable HMI), 4.0 (Software-Defined compute sharing).

Respond to Parth's queries concisely and informatively. Reference his specific team members, requirements (like FR-01), risks, or scoring matrix where applicable. Ensure that you sound like a knowledgeable peer or mentor who has carefully read his entire project report! Do not use flowery or self-praising words. Keep it clear, professional, and directly useful for his coursework.`;

      // Extract the latest message and chat history
      const history = messages.slice(0, messages.length - 1).map((m: any) => ({
        role: m.role === "assistant" ? "model" as const : "user" as const,
        parts: [{ text: m.content }]
      }));

      const latestMessage = messages[messages.length - 1].content;

      // Use chats API to support history and system instructions
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7
        },
        history: history
      });

      const result = await chat.sendMessage({ message: latestMessage });
      res.json({ reply: result.text });
    } catch (error: any) {
      console.error("Gemini API Error in Advisor API:", error);
      res.status(500).json({ error: error.message || "An error occurred while calling the Gemini API." });
    }
  });

  // Vite middleware setup for Development/Production
  if (process.env.NODE_ENV !== "production") {
    // Dynamic import of createServer to prevent it from loading in production CJS bundle
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
