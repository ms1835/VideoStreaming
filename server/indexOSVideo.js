import { getBedrockEmbedding } from "./bedrock.js";
// import { openSearchClient } from "./openSearch.js";
import { Video} from './models/Video.js';

// export const indexOSVideo = async(video) => {
//     try {
//         const text = `${video.title} ${video.description}`;
//         const embedding = await getBedrockEmbedding(text);
//         // await openSearchClient.index({
//         //     index: 'videos',
//         //     body: {
//         //         videoId: video._id,
//         //         title: video.title,
//         //         embedding
//             }
//         });
//         console.log(`Video ${video._id} indexed successfully.`);
//     } catch (error) {
//         console.error(`Error indexing video ${video._id}:`, error);
//     }
// };

export const indexVideoByAtlas = async(video) => {
    try {
        const text = `
            Title: ${video.title}
            Description: ${video.description}
        `;
        const embedding = await getBedrockEmbedding(text);
        await Video.findByIdAndUpdate(video._id, { embedding }, { new: true });
        console.log(`Video ${video._id} indexed successfully.`);
    } catch (error) {
        console.error(`Error indexing video ${video._id}:`, error);
    }
};

