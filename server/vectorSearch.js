const normalizeText = (value) => {
    if (typeof value !== 'string') {
        return '';
    }

    return value.trim().replace(/\s+/g, ' ');
};

export const buildVideoSearchText = (video) => {
    const title = normalizeText(video?.title);
    const description = normalizeText(video?.description);
    const tags = Array.isArray(video?.tags)
        ? video.tags.filter((tag) => normalizeText(tag)).map((tag) => normalizeText(tag))
        : [];

    const creator = typeof video?.creator === 'object' && video.creator !== null
        ? normalizeText(video.creator?.name)
        : normalizeText(video?.creator);

    const parts = [
        title ? `Title: ${title}` : '',
        description ? `Description: ${description}` : '',
        tags.length > 0 ? `Tags: ${tags.join(', ')}` : '',
        creator ? `Creator: ${creator}` : ''
    ].filter(Boolean);

    return parts.join('\n');
};

const getCreatorId = (creator) => {
    if (typeof creator === 'object' && creator !== null) {
        if (creator._id) {
            return creator._id.toString();
        }

        if (creator.toString && creator.toString() !== '[object Object]') {
            return creator.toString();
        }
    }

    return String(creator || '');
};

export const scoreRecommendation = (currentVideo, candidateVideo, vectorScore) => {
    const currentTags = Array.isArray(currentVideo?.tags)
        ? currentVideo.tags.map((tag) => normalizeText(tag).toLowerCase()).filter(Boolean)
        : [];
    const candidateTags = Array.isArray(candidateVideo?.tags)
        ? candidateVideo.tags.map((tag) => normalizeText(tag).toLowerCase()).filter(Boolean)
        : [];

    const overlap = currentTags.filter((tag) => candidateTags.includes(tag));
    const union = new Set([...currentTags, ...candidateTags]);
    const tagOverlapRatio = union.size === 0 ? 0 : overlap.length / union.size;

    const currentCreator = getCreatorId(currentVideo?.creator);
    const candidateCreator = getCreatorId(candidateVideo?.creator);

    const sameCreator = currentCreator && candidateCreator && currentCreator === candidateCreator ? 1 : 0;
    const likesBoost = Math.min((Number(candidateVideo?.likes || 0)) / 100, 0.05);

    return 0.6 * vectorScore + 0.25 * tagOverlapRatio + 0.1 * sameCreator + likesBoost;
};

export const scoreSemanticSearch = (query, candidateVideo, vectorScore) => {
    const queryTokens = normalizeText(query)
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean);

    const candidateText = [
        candidateVideo?.title,
        candidateVideo?.description,
        Array.isArray(candidateVideo?.tags) ? candidateVideo.tags.join(' ') : '',
        typeof candidateVideo?.creator === 'object' && candidateVideo.creator !== null ? candidateVideo.creator?.name || '' : candidateVideo?.creator || ''
    ]
        .map((value) => normalizeText(value).toLowerCase())
        .join(' ');

    const matchedTokens = queryTokens.filter((token) => candidateText.includes(token));
    const lexicalOverlap = queryTokens.length === 0 ? 0 : matchedTokens.length / queryTokens.length;

    return 0.7 * vectorScore + 0.3 * lexicalOverlap;
};
