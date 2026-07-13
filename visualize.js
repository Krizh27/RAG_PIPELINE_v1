import fs from "fs/promises";
import { PCA } from "ml-pca";
import { getQueryEmbedding } from "./embeddings.js";

const knowledgeBase = JSON.parse(
    await fs.readFile("./knowledgeBase.json", "utf8")
);
const queryEmbedding = await getQueryEmbedding(
    "Who created JavaScript?"
);


const embeddings = knowledgeBase.map(item => item.embedding);

console.log("Number of chunks:", embeddings.length);
console.log("Dimensions per embedding:", embeddings[0].length);
const pca = new PCA(embeddings);

const reduced = pca.predict(embeddings, {
    nComponents: 3
})
const reducedQuery = pca.predict(
    [queryEmbedding],
    {
        nComponents: 3
    }
);
console.log(reduced.to2DArray());
console.log(reducedQuery.to2DArray()[0]);

const coordinates = reduced.to2DArray();

const graphData = knowledgeBase.map((chunk, index) => ({
    text: chunk.text,
    x: coordinates[index][0],
    y: coordinates[index][1],
    z: coordinates[index][2]
}));

const queryCoordinates = reducedQuery.to2DArray()[0];

graphData.push({
    text: "Who created JavaScript?", 
    x: queryCoordinates[0],
    y: queryCoordinates[1],
    z: queryCoordinates[2],
    type: "query"
});




console.log(graphData);

await fs.writeFile(
    "./graphData.json",
    JSON.stringify(graphData, null, 2)
);

console.log("graphData.json created!");