import fs from "fs/promises";
import dotenv from "dotenv";
import readline from "node:readline/promises";
import { retrieveTopK } from "./retriever.js"
import { getQueryEmbedding } from "./embeddings.js";
import { generateAnswer } from "./llm.js";
import { generateGraphData } from "./visualize.js";
import { stdin as input, stdout as output } from "node:process";
import { log } from "node:console";

dotenv.config();

const knowledgeBaseFile = JSON.parse(
  await fs.readFile("./knowledgeBase.json", "utf8")
);

const rl = readline.createInterface({ input, output });

const userQuery = await rl.question("Ask a question: ");

export const embeddingVector = await getQueryEmbedding(userQuery);

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

await generateGraphData(knowledgeBaseFile, embeddingVector, userQuery);





