// llm.js

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.YOUR_OPENAI_API_KEY,
});

export async function generateAnswer(userQuery, retrievedChunks) {
  const context = retrievedChunks
    .map(chunk => chunk.text)
    .join("\n\n");

  const prompt = `
You are a helpful assistant.

Answer the user's question ONLY using the provided context.
If the answer is not present in the context, say:
"I couldn't find that information in the knowledge base."

Context:
${context}

Question:
${userQuery}
`;

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return response.output_text;
  } catch (error) {
    console.error("LLM Error:", error);
    throw error;
  }
}