
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const geminiService = {
  async analyzeTasks(tasks: Task[]): Promise<string> {
    if (tasks.length === 0) return "Initialize your pipeline with objectives to enable neural analysis.";
    
    const taskSummary = tasks.map(t => `- ${t.title} (Priority: ${t.priority}, Due: ${t.dueDate}, Status: ${t.completed ? 'Done' : 'Pending'})`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the PrismaFlow Intelligence Engine. Analyze this operational pipeline and provide a sophisticated, concise strategic summary (3 sentences max). Focus on immediate priorities and bottleneck risks.
      
      Operational Data:
      ${taskSummary}`,
      config: {
        temperature: 0.7,
      }
    });
    
    return response.text || "Neural synthesis failed. Re-attempting connection...";
  },

  async suggestSubtasks(task: Task): Promise<string[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Decompose the high-level objective "${task.title}" into exactly 4 actionable sub-directives. Context: ${task.description}. Return a clean list of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Neural parsing error:", e);
      return ["Establish initial parameters", "Execute core logic", "Validate outputs", "Finalize deployment"];
    }
  },

  createChat(tasks: Task[]) {
    const taskContext = tasks.map(t => `${t.title} [${t.priority}]`).join(', ');
    return ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are the PrismaFlow Neural Assistant. You have access to the user's current task list: ${taskContext}. 
        Help the user optimize their workflow, answer questions about their tasks, or provide motivation. 
        Maintain a professional, high-end "intelligent system" persona. Be concise and helpful.`,
      },
    });
  }
};
