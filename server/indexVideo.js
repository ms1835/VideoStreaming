import { getEmbedding } from "./embedding.js";
import qdrantClient from "./qdrant.js";

const toUuidPointId = (id) => {
    const hex = id.toString().replace(/[^0-9a-fA-F]/g, "").padEnd(32, "0").slice(0, 32).toLowerCase().split("");
    hex[12] = "4";
    hex[16] = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
    const formatted = hex.join("");
    return `${formatted.slice(0, 8)}-${formatted.slice(8, 12)}-${formatted.slice(12, 16)}-${formatted.slice(16, 20)}-${formatted.slice(20)}`;
};

export const indexVideo = async (video) => {
    try {
        const text = `${video.title} ${video.description}`;
        const embedding = await getEmbedding(text);
        const pointId = toUuidPointId(video.id || video._id);

        await qdrantClient.upsert("video_embeddings", {
            points: [
                {
                    id: pointId,
                    vector: embedding,
                    payload: {
                        id: video._id.toString(),
                        title: video.title,
                        creator: video.creator.toString()
                    }
                }
            ]
        });
        console.log(`Video ${video.id} indexed successfully.`);
    } catch (error) {
        console.error(`Error indexing video ${video.id}:`, error);
    }
};

export const deleteVideoFromIndex = async (videoID) => {
    try {
        const pointId = toUuidPointId(videoID);
        await qdrantClient.delete("video_embeddings", {
            points: [pointId]
        });
        console.log(`Video ${videoID} deleted from index successfully.`);
    } catch (error) {
        console.error(`Error deleting video ${videoID} from index:`, error);
    }
};