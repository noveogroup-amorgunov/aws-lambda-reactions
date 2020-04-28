import { PostReaction, PostReactionName } from './types';

export function respondJson(body: object, statusCode = 200) {
    return {
        statusCode,
        body: JSON.stringify(body),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
    };
}

export function respondError(errorText: string) {
    return respondJson({ error: true, msg: errorText });
}

export function generateReactionMap() {
    const names = Object.values(PostReactionName);

    return names.reduce((acc, name) => {
        acc[name] = 0;

        return acc;
    }, {} as Record<string, number>);
}

export function prepareReactions(reactions: PostReaction[] = []) {
    const reactionMap = generateReactionMap();

    reactions.forEach(reaction => {
        reactionMap[reaction.name] += 1;
    });

    return reactionMap;
}
