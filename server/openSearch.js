import { Client } from '@opensearch-project/opensearch';

export const openSearchClient = new Client({
    node: process.env.OPENSEARCH_NODE
});

export const initializeOpenSearch = async () => {
    try {
        const indexExists = await openSearchClient.indices.exists({ index: 'videos' });
        if(!indexExists.body) {
            await openSearchClient.indices.create({
                index: 'videos',
                body: {
                    mappings: {
                        properties: {
                            videoId: { type: "keyword" },
                            title: { type: "text" },
                            embedding: {
                                type: "knn_vector",
                                dimension: 1536
                            }
                        }
                    },
                    settings: {
                        index: {
                            knn: true
                        }
                    }
                }
            });
            console.log("OpenSearch index 'videos' created successfully.");
        }
    } catch(err) {
        console.error("Error initializing OpenSearch:", err);
    }
};