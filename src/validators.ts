import { PostReactionName } from './types';

export function isValidSlug(slug: string) {
    // example: 2020-04-12-use-redux-with-react-hooks
    return /^[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9-_]+$/.test(slug);
}

export function isValidReactionId(reactionId: PostReactionName) {
    return Object.values(PostReactionName).includes(reactionId);
}

export function isValidBody(body: string | null) {
    if (!body) {
        return false;
    }

    try {
        JSON.parse(body);

        return true;
    } catch(err) {
        return false;
    }
}

export function assert(value: unknown, errorMessage: string) {
    if (!value) {
        throw new Error(errorMessage);
    }
}
