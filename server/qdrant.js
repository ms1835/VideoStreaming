import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";

dotenv.config();

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
});

export default qdrantClient;

export const initializeQdrant = async () => {
  try {
    await qdrantClient.recreateCollection("video_embeddings", {
      vectors: {
        size: 384,
        distance: "Cosine"
      },
      checkCompatibility: false
    });
    console.log("Qdrant collection 'video_embeddings' initialized successfully.");
  } catch (error) {
    console.error("Error initializing Qdrant collection:", error);
    throw new Error("Unable to initialize Qdrant. Ensure the Qdrant service is running and reachable.");
  }
}