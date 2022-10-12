import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export type HttpEventRequest<T = null> = Omit<APIGatewayProxyEvent, 'pathParameters'> & {
    pathParameters: T
}

export type HttpResponse = Promise<APIGatewayProxyResult>;

export enum PostReactionName {
    Shocked = 'shocked',
    Love = 'love',
    Like = 'like',
    Dislike = 'dislike',
    Rage = 'rage',
    Party = 'party',
    PartyPopper = 'partyPopper',
}

export type PostReaction = {
    ip: string;
    name: PostReactionName;
}

export type Post = {
    id: string;
    reactions: PostReaction[];
}
