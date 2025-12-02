import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (
  query: string,
  currentMarketContext: string
): Promise<{ text: string; sources: { uri: string; title: string }[] }> => {
  try {
    const modelId = "gemini-2.5-flash"; // Excellent balance of speed and reasoning for this
    
    const prompt = `
      Context: ${currentMarketContext}
      
      User Question: ${query}
      
      You are an expert financial analyst. Answer the user's question about the stock market.
      If the user asks about real-world current events (news, reasons for price drops/spikes), use the Search tool to find the latest information.
      Be concise, professional, and data-driven.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Use Grounding for real news
        systemInstruction: "You are a helpful, senior financial analyst assistant.",
      },
    });

    const text = response.text || "I couldn't analyze that right now.";
    
    // Extract grounding chunks (sources)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ uri: web.uri, title: web.title }));

    return { text, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      text: "I'm having trouble connecting to the market analysis server. Please check your API key configuration.", 
      sources: [] 
    };
  }
};
