import dotenv from 'dotenv';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

dotenv.config();

const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const MODEL_ID = "arn:aws:bedrock:ap-south-1:596571386214:inference-profile/apac.amazon.nova-lite-v1:0";

export const generateVideoMetaData = async(title) => {
    try {
        const prompt = `You are a helpful assistant that generates video metadata. 
        Given the title of a video, generate:
        1. A concise description (2-3 lines) that captures the essence of the video content.
        2. A list of 5 relevant tags that describe the video content.
        Return the description and tags in a JSON format as follows:
        {
        "description": "Generated description here",
        "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
        }

        Title: ${title} `;

        const command = new InvokeModelCommand({
            modelId: MODEL_ID,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                inferenceConfig: {
                    max_new_tokens: 300,
                    temperature: 0.7
                },
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        });
        const response = await client.send(command);
        const result = await new Response(response.body).json();
        const text = result.output.message.content[0].text;
        const metadata = JSON.parse(text);
        return metadata;

    } catch(err) {
        console.error("Error generating video metadata:", err);
        throw new Error("Failed to generate video metadata. Please try again later.");
    }
}