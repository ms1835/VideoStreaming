
export const getEmbedding = async (text) => {
    try {
        const response = await fetch(`${process.env.EMBEDDING_SERVICE_URI}/embed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text }),
            credentials: 'include'
        });
        const data = await response.json();
        if (!data?.success) {
            throw new Error(data?.message || 'Failed to get embedding');
        }
        return data.embedding;
    } catch (error) {
        console.log(error);
        throw error;
    }
}