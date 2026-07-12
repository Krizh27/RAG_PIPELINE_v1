import OpenAI from "openai";
import chunksArray from "./ingest.js";
import dotenv from "dotenv";
import fs from "fs/promises";
dotenv.config();

// const openai = new OpenAI({apiKey : process.env.YOUR_OPENAI_API_KEY});
async function getEmbeddings(){
    try{
        const response = await openai.embeddings.create({
            model:"text-embedding-3-small",
            input:chunksArray,
            encoding_format:"float"
        })
        const buildKnowledgeBase = response.data.map((item, index) => ({
            text: chunksArray[index],
            embedding: item.embedding
        }));
        return buildKnowledgeBase;
    }catch(err){    
        console.error("Error ", err)
    }
}

const knowledgeBase = await getEmbeddings();
console.log(knowledgeBase);

async function saveKnowledgeBase(){
    try{
        await fs.writeFile("./knowledgeBase.json",JSON.stringify(knowledgeBase,null,2));
        console.log("Knowledge base saved successfully");
    }catch(err){
        console.error("Error saving knowledge base",err);
    }
}
saveKnowledgeBase();

