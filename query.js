import OpenAI from "openai";
import fs from "fs/promises";
import dotenv from "dotenv";
import readline from "node:readline/promises";
import { retrieveTopK } from "./Retriever.js"
import { generateAnswer } from "./llm.js";
import { stdin as input, stdout as output } from "node:process";
import { log } from "node:console";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.YOUR_OPENAI_API_KEY });

async function getQueryEmbedding(userQuery) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: userQuery,
      encoding_format: "float",
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

const knowledgeBaseFile = JSON.parse(
  await fs.readFile("./knowledgeBase.json", "utf8")
);

const rl = readline.createInterface({ input, output });

const userQuery = await rl.question("Ask a question: ");

const embeddingVector = await getQueryEmbedding(userQuery);

rl.close();


// console.log(knowledgeBaseFile);

// const score = cosineSimilarity(
//     embeddingVector,
//     knowledgeBaseFile[0].embedding
// );

const retrievedChunks = retrieveTopK(
    embeddingVector,
    knowledgeBaseFile
);

const answer = await generateAnswer(
    userQuery,
    retrievedChunks
);

console.log("\nAnswer:\n");
console.log(answer);





