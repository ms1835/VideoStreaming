import { getBedrockEmbedding } from "./bedrock.js";
import { openSearchClient } from "./openSearch.js";

export const indexOSVideo = async(video) => {
    try {
        const text = `${video.title} ${video.description}`;
        const embedding = await getBedrockEmbedding(text);
        await openSearchClient.index({
            index: 'videos',
            body: {
                videoId: video._id,
                title: video.title,
                embedding
            }
        });
        console.log(`Video ${video._id} indexed successfully.`);
    } catch (error) {
        console.error(`Error indexing video ${video._id}:`, error);
    }
};

