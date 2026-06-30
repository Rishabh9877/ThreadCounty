import { GoogleGenerativeAI } from "@google/generative-ai";

// Instantiation moved inside the function

export interface FabricAnalysisResult {
  threadDensity: string;
  warpCount: number;
  weftCount: number;
  fabricType: string;
  confidence: number;
  aiSuggestions: Array<{ type: string; text: string }>;
}

/**
 * Analyzes a fabric image using Gemini 1.5 Flash Vision.
 * Requires the image to be fetched as a buffer or base64.
 */
export async function analyzeFabricImage(imageUrl: string): Promise<FabricAnalysisResult | null> {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not configured.");
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // 1. Fetch the image from the URL (Supabase Storage)
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    
    // Determine mime type from URL or default to jpeg
    let mimeType = "image/jpeg";
    if (imageUrl.toLowerCase().endsWith(".png")) mimeType = "image/png";
    if (imageUrl.toLowerCase().endsWith(".webp")) mimeType = "image/webp";

    // 2. Initialize Gemini Model (Using gemini-2.5-flash for speed and vision capabilities)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Define the prompt expecting JSON output
    const prompt = `You are an expert AI fabric analyzer. Analyze this microscopic or macro fabric image.
Please extract the following information and return ONLY a valid JSON object without any markdown wrapping (no \`\`\`json).
Structure:
{
  "threadDensity": "120-150" (estimate threads per cm as a string range or exact number),
  "warpCount": 60 (estimate the warp threads as a number),
  "weftCount": 70 (estimate the weft threads as a number),
  "fabricType": "Cotton / Denim / Silk / etc" (guess the fabric type based on texture),
  "confidence": 95 (your confidence level as a percentage number 0-100),
  "aiSuggestions": [
    { "type": "quality", "text": "Suggestion about the fabric quality" },
    { "type": "improvement", "text": "Suggestion for production improvement" }
  ]
}`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType
      }
    };

    // 4. Call the API
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting if the model disobeys
    const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const analysis: FabricAnalysisResult = JSON.parse(jsonString);
    return analysis;

  } catch (error) {
    console.error("Error analyzing fabric with Gemini:", error);
    return null;
  }
}
