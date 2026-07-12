import cosineSimilarity from "./cosine_similarity_calc.js";

export function retrieveTopK(
    queryEmbedding,
    knowledgeBase,
    topK = 2
) {

    const scoredChunks = [];

    for (const chunk of knowledgeBase) {

        const score = cosineSimilarity(
            queryEmbedding,
            chunk.embedding
        );

        scoredChunks.push({
            text: chunk.text,
            score
        });

    }

    scoredChunks.sort((a, b) => b.score - a.score);

    const retrievedChunks = scoredChunks.slice(0, topK);

    return retrievedChunks;
}