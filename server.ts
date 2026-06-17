import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API endpoint for Crop Disease Detection using Gemini AI
app.post("/api/gemini/disease-detect", async (req, res) => {
  try {
    const { imageBase64, mimeType, description, cropName, selectedLanguage, locale, userLanguagePreference } = req.body;
    const activeLang = selectedLanguage || userLanguagePreference || "en";

    let contents: any[] = [];
    let promptText = `You are an expert plant pathologist and agricultural AI assistant. 
Review the crop "${cropName || "Unknown Crop"}" disease inquiry.`;

    if (description) {
      promptText += `\nFarmer description of symptoms: "${description}"`;
    }

    promptText += `\nProvide a structured JSON diagnosis containing:
1. "diseaseName": (The identified crop disease name, or "Healthy" / "Deficiency")
2. "confidence": (Percentage score e.g., 85)
3. "symptoms": (List of key observed symptoms)
4. "cause": (Biological cause/organism)
5. "organicTreatment": (Detailed natural/organic control action steps)
6. "chemicalTreatment": (Detailed recommendation of safe pesticides/fungicides)
7. "prevention": (Preventative practices for next cycle)
8. "severity": ("Low", "Medium", "High")

You must respond with raw JSON ONLY. Valid JSON structure only, conforming to keys.`;

    let langInstruction = "";
    if (activeLang === "hi") {
      langInstruction = `
CRITICAL LANGUAGE REQUIREMENT: You MUST generate all text fields in the output JSON (diseaseName, symptoms, organicTreatment, chemicalTreatment, prevention, severity, cause) in HINDI language using Devanagari script (pure Hindi).
For example, diseaseName should be Hindi like "धान का झुलसा रोग (Blast)", symptoms list should be pure Hindi like ["पत्तियों पर भूरे धब्बे", "पत्तियों का सूखना"], organicTreatment should be full Hindi details, etc. Do not use English characters for Hindi words.`;
    } else if (activeLang === "hinglish") {
      langInstruction = `
CRITICAL LANGUAGE REQUIREMENT: You MUST generate all text fields in the output JSON (diseaseName, symptoms, organicTreatment, chemicalTreatment, prevention, severity, cause) in Conversational HINGLISH language (Hindi language written using English/Latin alphabet, combining English and Hindi terms naturally, as common in conversational Indian chat).
For example, "is crop par neem oil spray karein", "pattiyon par brown spots hain", "paani ka water supply check karein". DO NOT use Devanagari Hindi characters; write using Latin (English) characters but Hinglish phrasing.`;
    } else {
      langInstruction = `
CRITICAL LANGUAGE REQUIREMENT: You MUST generate all text fields in the output JSON in standard English language.`;
    }
    promptText += langInstruction;

    if (imageBase64 && mimeType) {
      contents.push({
        inlineData: {
          mimeType: mimeType,
          data: imageBase64,
        },
      });
    }
    contents.push(promptText);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diseaseName: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            cause: { type: Type.STRING },
            organicTreatment: { type: Type.STRING },
            chemicalTreatment: { type: Type.STRING },
            prevention: { type: Type.STRING },
            severity: { type: Type.STRING },
          },
          required: [
            "diseaseName",
            "confidence",
            "symptoms",
            "cause",
            "organicTreatment",
            "chemicalTreatment",
            "prevention",
            "severity",
          ],
        },
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error in disease detect:", error);
    const activeLang = req.body.selectedLanguage || req.body.userLanguagePreference || "en";
    if (activeLang === "hi") {
      res.status(500).json({
        error: "फसल बीमारी का पता लगाने के मॉडल लोड करने में त्रुटि।",
        diseaseName: "अनिर्धारित / चिकित्सीय त्रुटि",
        confidence: 0,
        symptoms: ["विश्लेषण विफल रहा। कृपया इंटरनेट कनेक्शन की जांच करें।"],
        cause: "कनेक्शन व्यस्त है",
        organicTreatment: "स्वच्छ जैविक खाद का प्रयोग करें तथा जड़ों में पानी का संचय रोकें।",
        chemicalTreatment: "सामान्य कीटनाशक के लिए पास की कृषि दुकान से परामर्श करें।",
        prevention: "बढ़ते पौधों में पर्याप्त दूरी बनाए रखें।",
        severity: "मध्यम",
      });
    } else if (activeLang === "hinglish") {
      res.status(500).json({
        error: "Crop disease detect karne ka API fail ho gaya.",
        diseaseName: "Doubtful Disease / Diagnosis Fail",
        confidence: 0,
        symptoms: ["Analysis nahi ho paya. Apna network check karein."],
        cause: "API Error / Server Busy",
        organicTreatment: "Saf organic khad daliye aur water drainage check karein.",
        chemicalTreatment: "General treatment ke liye paas ke chemical dealer se sampark karein.",
        prevention: "Sowing ke time gaps barabar rakhein.",
        severity: "Medium",
      });
    } else {
      res.status(500).json({
        error: error?.message || "Failed to analyze crop disease structure.",
        diseaseName: "Undetermined / Diagnostic Error",
        confidence: 0,
        symptoms: ["Analysis failed or key is missing. Check your connection."],
        cause: "API Error",
        organicTreatment: "Use clean organic manure, verify water supply.",
        chemicalTreatment: "Consult your nearby shop owner for general-purpose treatment.",
        prevention: "Proper spacing and aeration.",
        severity: "Medium",
      });
    }
  }
});

// API endpoint for general medicine recommendations
app.post("/api/gemini/medicine-rec", async (req, res) => {
  try {
    const { cropName, problem, selectedLanguage, locale, userLanguagePreference } = req.body;
    const activeLang = selectedLanguage || userLanguagePreference || "en";

    let prompt = `You are a certified agronomist. A farmer asks for medicine/fertilizer suggestions for:
Crop: ${cropName}
Problem description: ${problem}

Provide structured advice in JSON format with properties:
1. "diagnosis": Likely reason/disease.
2. "organicSolutions": List of organic or eco-friendly fertilizers/pesticides you suggest.
3. "chemicalSolutions": List of targeted chemical formulations or brand types (seeds, bio-fertilizers).
4. "usageInstructions": Step by step dosage, method of spraying, and dilution ratios.
5. "precautions": Protective measures while spraying/applying (e.g., masks, morning spray, interval periods).`;

    let langInstruction = "";
    if (activeLang === "hi") {
      langInstruction = `
CRITICAL LANGUAGE REQUIREMENT: You MUST generate all text fields in the output JSON (diagnosis, organicSolutions, chemicalSolutions, usageInstructions, precautions) in HINDI language using Devanagari script (pure Hindi).
For example, diagnosis should be like "पत्तियों का पीला पड़ना (नाइट्रोजन की कमी)", organicSolutions should be a list of pure Hindi instructions, and usageInstructions must be entirely in Hindi characters.`;
    } else if (activeLang === "hinglish") {
      langInstruction = `
CRITICAL LANGUAGE REQUIREMENT: You MUST generate all text fields in the output JSON (diagnosis, organicSolutions, chemicalSolutions, usageInstructions, precautions) in Conversational HINGLISH language (Hindi language written using English/Latin alphabet, combining English and Hindi terms naturally).
For example, "Fasal me calcium ki kami hai", "5ml neem oil use karein per liter water", "Evening time me spray karna sahi rahega". DO NOT use Devanagari Hindi characters; write in Hinglish with Latin alphabet.`;
    } else {
      langInstruction = `
CRITICAL LANGUAGE REQUIREMENT: You MUST generate all text fields in the output JSON in English.`;
    }
    prompt += langInstruction;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            organicSolutions: { type: Type.ARRAY, items: { type: Type.STRING } },
            chemicalSolutions: { type: Type.ARRAY, items: { type: Type.STRING } },
            usageInstructions: { type: Type.STRING },
            precautions: { type: Type.STRING },
          },
          required: [
            "diagnosis",
            "organicSolutions",
            "chemicalSolutions",
            "usageInstructions",
            "precautions",
          ],
        },
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error in medicine recommendation:", error);
    const activeLang = req.body.selectedLanguage || req.body.userLanguagePreference || "en";
    if (activeLang === "hi") {
      res.status(500).json({
        diagnosis: "सामान्य पोषक तत्वों की कमी या फसल में तनाव।",
        organicSolutions: ["नीम तेल का छिड़काव", "कम्पोस्ट खाद का मिश्रण"],
        chemicalSolutions: ["एनपीके 19:19:19 जैव घुलनशील उर्वरक", "जिंक सल्फेट घोल"],
        usageInstructions: "सुबह ठंडे मौसम में 5 मिलीलीटर नीम तेल प्रति लीटर पानी में मिलाकर छिड़काव करें।",
        precautions: "छिड़काव के समय मास्क और दस्ताने पहनें। तेज़ हवाओं से बचें।",
      });
    } else if (activeLang === "hinglish") {
      res.status(500).json({
        diagnosis: "General deficiency ya plant mechanical stress.",
        organicSolutions: ["Neem Oil spray 5ml per liter", "Gobar khad milayein"],
        chemicalSolutions: ["NPK 19:19:19 dynamic mix", "Micro-nutrients powder"],
        usageInstructions: "Dopehar ke dhoop se bachein. Subah spray karna best hai.",
        precautions: "Mask aur gloves zaroor pehnein. Tezz hawa chalne par spray na karein.",
      });
    } else {
      res.status(500).json({
        diagnosis: "General deficiency or plant stress.",
        organicSolutions: ["Neem Oil Spray", "Vermicompost mixture"],
        chemicalSolutions: ["NPK 19:19:19 bio fertilizing mix", "Chlorpyrifos (as recommended locally)"],
        usageInstructions: "Mix 5ml neem oil per liter of water. Spray during cool early morning hours.",
        precautions: "Wear mask and gloves. Avoid high winds.",
      });
    }
  }
});

// API endpoint for yield prediction
app.post("/api/gemini/yield-predict", async (req, res) => {
  try {
    const { farmSize, cropsGrown, state, village, soilType, waterSource, experience, selectedLanguage, locale, userLanguagePreference } = req.body;
    const activeLang = selectedLanguage || userLanguagePreference || "en";

    let prompt = `Predict crop yield and estimate output for a farm with following info:
Farm Size: ${farmSize} Acres
Crops Grown: ${cropsGrown}
Location: Village ${village}, State ${state}
Soil Type: ${soilType || "Not specified"}
Water Source: ${waterSource || "Rainfed"}
Experience of Farmer: ${experience || "Not specified"} Years

Predict realistic yields. Provide a detailed structured JSON response of yield predictions:
1. "estimatedYield": A string of estimated yield (e.g., "30-35 Quintals")
2. "monetaryValueEstimate": A string of estimated potential revenue in local currency based on average prices (e.g., "₹75,000 - ₹90,000")
3. "factorsInfluencing": A list of key elements impacting this harvest
4. "actionableTips": A list of 3-4 professional recommendations to maximize this yield
5. "potentialRisks": List of risks (e.g. pests, floods) to monitor`;

    let langInstruction = "";
    if (activeLang === "hi") {
      langInstruction = `
CRITICAL LANGUAGE REQUIREMENT: You MUST generate all text fields in the output JSON (estimatedYield, monetaryValueEstimate, factorsInfluencing, actionableTips, potentialRisks) in HINDI language using Devanagari script (pure Hindi).
For example, estimatedYield should be like "35 से 40 क्विंटल (अनुमानित)", monetaryValueEstimate should be in rupees using Hindi phrasing like "₹80,000 - ₹95,000", and tips should be completely in pure Hindi.`;
    } else if (activeLang === "hinglish") {
      langInstruction = `
CRITICAL LANGUAGE REQUIREMENT: You MUST generate all text fields in the output JSON (estimatedYield, monetaryValueEstimate, factorsInfluencing, actionableTips, potentialRisks) in Conversational HINGLISH language (Hindi language written using English/Latin alphabet, combining English and Hindi terms naturally).
For example, "Estimated yield lagbhag 25-30 quintal per acre hoga", "Market price accha milne par ₹90,000 revenue ho sakta hai". DO NOT use Devanagari characters; write in Hinglish with Latin alphabet.`;
    } else {
      langInstruction = `
CRITICAL LANGUAGE REQUIREMENT: You MUST generate all text fields in the output JSON in English.`;
    }
    prompt += langInstruction;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedYield: { type: Type.STRING },
            monetaryValueEstimate: { type: Type.STRING },
            factorsInfluencing: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            potentialRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            "estimatedYield",
            "monetaryValueEstimate",
            "factorsInfluencing",
            "actionableTips",
            "potentialRisks",
          ],
        },
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error in yield predict:", error);
    const activeLang = req.body.selectedLanguage || req.body.userLanguagePreference || "en";
    if (activeLang === "hi") {
      res.status(500).json({
        estimatedYield: "20-25 क्विंटल प्रति एकड़ (बेसलाइन)",
        monetaryValueEstimate: "₹50,000 - ₹65,000 लगभग",
        factorsInfluencing: ["मिट्टी में नमी", "खाद देने का सही समय"],
        actionableTips: [
          "मिट्टी परीक्षण के आधार पर उन्नत नाइट्रोजन उपचार करें।",
          "ड्रिप सिंचाई प्रणाली अपनाएं और खरपतवार नियंत्रण करें।"
        ],
        potentialRisks: ["देर से कीटों का आक्रमण", "अनियमित मानसून"],
      });
    } else if (activeLang === "hinglish") {
      res.status(500).json({
        estimatedYield: "20-25 Quintals/Acre (Baseline)",
        monetaryValueEstimate: "₹50,000 - ₹65,000 ke beech",
        factorsInfluencing: ["Soil moisture aur pani ka drainage", "Khad ka timing"],
        actionableTips: [
          "Micro-drip irrigation patterns ko apnayein.",
          "Satyawadi crop rotation karein mitti ki upaj badhane ke liye."
        ],
        potentialRisks: ["Late weather changes / tez barish", "Keede lagna"],
      });
    } else {
      res.status(500).json({
        estimatedYield: "20-25 Quintals/Acre (Baseline)",
        monetaryValueEstimate: "₹50,050 - ₹65,000 approx",
        factorsInfluencing: ["Soil moisture retention", "Fertilizer timings"],
        actionableTips: [
          "Use multi-soil nitrogen treatments.",
          "Transition to micro-drip irrigation"
        ],
        potentialRisks: ["Pest infestation in late growth stage", "Erratic rainfall patterns"],
      });
    }
  }
});

// API endpoint for AI chat translation and language detection
app.post("/api/gemini/translate", async (req, res) => {
  try {
    const { text, targetLanguage, selectedLanguage, locale, userLanguagePreference } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: "Text and targetLanguage are required." });
    }

    const prompt = `You are an expert real-time agricultural chat assistant.
Analyze this message content, detect its source language, and translate it into the target language.

Source text: "${text}"
Target language: "${targetLanguage}"

Provide structured output in JSON mapping:
1. "detectedLanguage": The full name of the detected source language (e.g., "English", "Hindi", "Spanish", "Punjabi", etc.).
2. "translatedText": The accurate, natural translation from the source language into the target language. If the source language is already the target language, return the original text untouched.
3. "confidence": Language detection confidence score (integer, e.g. 95)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedLanguage: { type: Type.STRING },
            translatedText: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
          },
          required: ["detectedLanguage", "translatedText", "confidence"],
        },
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error in chat translation:", error);
    res.status(500).json({
      error: "Translation failed or network is busy.",
      detectedLanguage: "Unknown",
      translatedText: req.body?.text || "",
      confidence: 0,
    });
  }
});

// API endpoint for AGRIVON AI Floating Chat Assistant conversations
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, selectedLanguage, history } = req.body;
    const activeLang = selectedLanguage || "en";

    let contextHistory = "";
    if (history && Array.isArray(history)) {
      contextHistory = history
        .slice(-6)
        .map((h: any) => `${h.sender === "user" ? "User" : "AGRIVON AI"}: ${h.text}`)
        .join("\n");
    }

    let prompt = `You are "AGRIVON AI", the intelligent floating assistant inside the Agrivon Agricultural Portal.
You assist Indian farmers, organic growers, crop dealers, and rural laborers.
Keep your answers brief, highly actionable, helpful, and directly related to farming or gardening or general assistant greetings. Since it's a chat widget bubble, keep answers to maximum 2-3 Sentences.

Language Selection:
- If target language is "hi", use pure Devanagari Hindi characters. For example: "नमस्कार! मैं एग्रीवोन एआई हूँ। मैं आपकी फसल, मौसम और उपज से जुड़े सवालों का जवाब दे सकता हूँ।"
- If target language is "hinglish", write Hindi phrased using standard English characters. For example: "Hello! Main Agrivon AI hoon. Main aapke crops, weather aur mandi rate check karne me help kar sakta hoon."
- If target language is "en", write in clear, simple English.

Context of recent conversation:
${contextHistory}

User's spoken or typed message: "${message}"

Generate a helpful, empathetic, and professional JSON response:
1. "reply": (The response text matching the selected language requirement)
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING }
          },
          required: ["reply"],
        },
      },
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Error in Agrivon AI chat:", error);
    const activeLang = req.body.selectedLanguage || "en";
    let fallbackReply = "How can I assist you with your farming needs today?";
    if (activeLang === "hi") {
      fallbackReply = "कृषि संबंधी सहायता के लिए आपका स्वागत है! मैं आपकी किस प्रकार मदद कर सकता हूँ?";
    } else if (activeLang === "hinglish") {
      fallbackReply = "Agrivon AI me aapka swagat hai! Main aapki kya help kar sakta hoon?";
    }
    res.json({ reply: fallbackReply });
  }
});

// Serve PWA manifest
app.get("/manifest.json", (req, res) => {
  res.sendFile(path.join(process.cwd(), "manifest.json"));
});

// Start listening and register Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
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
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
