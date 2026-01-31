
import { GoogleGenAI } from "@google/genai";
import { WeeklyReport, LGA } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getReportInsights(reports: WeeklyReport[], lgas: LGA[]) {
  const prompt = `
    Analyze the following weekly reporting data for Katsina State Digital Learning Centres (DLC).
    Data Summary:
    - Total Reports: ${reports.length}
    - LGAs Covered: ${lgas.map(l => l.name).join(', ')}
    - Total Trainees (all time): ${reports.reduce((sum, r) => sum + r.traineesTrained, 0)}

    Status definitions:
    - NDB: No Data Brought
    - NT: Not Trained
    - ABS: Absent
    - P: Present

    Please provide a short, professional executive summary (max 150 words) including:
    1. Overall performance trend.
    2. A brief recommendation for underperforming areas.
    3. An observation on attendance patterns (ABS vs P).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Unable to generate AI insights at this time.";
  }
}
