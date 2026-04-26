import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION
});

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