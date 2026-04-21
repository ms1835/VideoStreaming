import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION
});

export const getBedrockEmbedding = async(text) => {
    try{
        const command = new InvokeModelCommand({
            modelId: "amazon.titan-embed-text-v1",
            contentType: "application/json",
            body: JSON.stringify({
                inputText: text
            })
        });
        const response = await client.send(command);
        const responseBody = await new Response(response.body).json();
        return responseBody?.embedding || [];

    } catch (error) {
        console.error("Error fetching embedding:", error);
        return [];
    }
}