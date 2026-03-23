import OpenAI from "openai";
import { getVectorStore } from "../config/vectorDB.js";

let _openai = null;
const getOpenAI = () => {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
};

export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    // ----- 1. Validate input --------------------------------------------------
    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        error: "A non-empty 'question' field is required.",
      });
    }

    const trimmedQuestion = question.trim();

    const vectorStore = getVectorStore();

    if (!vectorStore) {
      return res.status(503).json({
        success: false,
        error:
          "No repository has been analyzed yet. Please analyze a repository first before asking questions.",
      });
    }

    const results = await vectorStore.similaritySearch(trimmedQuestion, 5);

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        answer:
          "I could not find any relevant information in the analyzed codebase to answer your question.",
        sources: [],
      });
    }

    const contextBlocks = results
      .map((doc, i) => {
        const filePath = doc.metadata?.path || doc.metadata?.fileName || "unknown";
        return `--- Chunk ${i + 1} | File: ${filePath} ---\n${doc.pageContent}`;
      })
      .join("\n\n");

    const sources = [
      ...new Set(
        results
          .map((doc) => doc.metadata?.path || doc.metadata?.fileName)
          .filter(Boolean)
      ),
    ];

    // ----- 6. Construct prompt -------------------------------------------------
    const systemPrompt = `You are an expert software engineer and code analyst. 
Your task is to answer questions about a GitHub repository based exclusively on the provided code chunks.

Formatting Guidelines for Readability:
- Use clear markdown structure. Use "##" or "###" for section headers.
- Always use proper bulleted lists with each item on its own NEW LINE (essential for readability).
- Be selective with **bolding**. Only bold extremely important terms or the first word of a list item. Do not bold entire sentences.
- Explain concepts thoroughly in multi-paragraph format, but keep the structure clean.
- If asked for a summary, break it down clearly: Purpose, Architecture, Key Modules, etc.
- If the context does not contain enough information, be honest and explain what is missing.
- Cite file paths using backticks like \`src/main.js\`.`;

    const userPrompt = `Here are relevant code chunks from the repository:

${contextBlocks}

---

Question: ${trimmedQuestion}

Please answer thoroughly and clearly, referencing the specific files and explaining the code in depth.`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const answer =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I was unable to generate an answer. Please try again.";

    return res.status(200).json({
      success: true,
      answer,
      sources,
    });
  } catch (error) {
    if (error?.status === 429) {
      return res.status(429).json({
        success: false,
        error: "OpenAI rate limit reached. Please try again in a moment.",
      });
    }
    if (error?.status === 401) {
      return res.status(401).json({
        success: false,
        error: "Invalid OpenAI API key. Check your .env configuration.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to process your question. " + error.message,
    });
  }
};
