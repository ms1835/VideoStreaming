import dotenv from 'dotenv';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

dotenv.config();

const config = {
    region: process.env.AWS_REGION
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    };
}

const client = new BedrockRuntimeClient(config);

const BEDROCK_MODEL_ID =
  process.env.BEDROCK_MODEL_ID || "amazon.titan-embed-text-v2:0";

export const getBedrockEmbedding = async (text) => {
  try {
    const command = new InvokeModelCommand({
      modelId: BEDROCK_MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: text
      })
    });

    const response = await client.send(command);

    const responseBody = JSON.parse(
      new TextDecoder().decode(response.body)
    );

    return responseBody.embedding || [];

  } catch (error) {
    console.error("Error fetching embedding:", error);
    return [];
  }
};