import { APIGatewayEvent } from 'aws-lambda';

export enum PostReactionName {
    Shocked = 'shocked',
    Love = 'love',
    Like = 'like',
    Dislike = 'dislike',
    Rage = 'rage',
}

export type PostReaction = {
    ip: string;
    name: PostReactionName;
}

export type Post = {
    id: string;
    reactions: PostReaction[];
}

export type HttpEvent<T = null> = APIGatewayEvent & {
    pathParameters: T
}
