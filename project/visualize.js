import fs from "fs/promises";
import { PCA } from "ml-pca";
import { getQueryEmbedding } from "./embeddings.js";

export async function generateGraphData(knowledgeBase, queryEmbedding, userQuery) {
    const embeddings = knowledgeBase.map(item => item.embedding);
    
    // console.log("Number of chunks:", embeddings.length);
    // console.log("Dimensions per embedding:", embeddings[0].length);
    
    const pca = new PCA(embeddings);
    const reduced = pca.predict(embeddings, { nComponents: 3 });
    const reducedQuery = pca.predict([queryEmbedding], { nComponents: 3 });
    
    const coordinates = reduced.to2DArray();
    const graphData = knowledgeBase.map((chunk, index) => ({
        text: chunk.text,
        x: coordinates[index][0],
        y: coordinates[index][1],
        z: coordinates[index][2]
    }));
    
    const queryCoordinates = reducedQuery.to2DArray()[0];
    graphData.push({
        text: userQuery, 
        x: queryCoordinates[0],
        y: queryCoordinates[1],
        z: queryCoordinates[2],
        type: "query"
    });
    
    await fs.writeFile("./graphData.json", JSON.stringify(graphData, null, 2));
    console.log("graphData.json created/updated!");
}

if (process.argv[1].endsWith('visualize.js')) {
    const knowledgeBase = JSON.parse(await fs.readFile("./knowledgeBase.json", "utf8"));
    const query = "Who created JavaScript?";
    const queryEmbedding = await getQueryEmbedding(query);
    await generateGraphData(knowledgeBase, queryEmbedding, query);
}