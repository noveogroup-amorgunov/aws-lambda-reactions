import { Dynamo } from './dynamo';
import { catchError } from './middlewares';
import { isValidReactionId, isValidSlug, assert, isValidBody } from './validators';
import { HttpEvent, Post, PostReactionName } from './types';
import { prepareReactions, respondJson } from './helpers';

type Params = {
    slug: string;
};

type Body = {
    reactionId: PostReactionName;
    testSourceIp?: string;
};

const getReactions = catchError(async function(event: HttpEvent<Params>) {
    const { slug } = event.pathParameters;

    assert(isValidSlug(slug), 'INVALID_SLUG');

    const post = await Dynamo.get<Post>(Dynamo.tables.REACTIONS!, { id: slug });
    const reactions = post ? post.reactions : [];

    return respondJson(prepareReactions(reactions));
});

const setReaction = catchError(async function(event: HttpEvent<Params>) {
    const { slug } = event.pathParameters;

    assert(isValidBody(event.body), 'INVALID_BODY');

    const { reactionId, testSourceIp } = JSON.parse(event.body as string) as Body;
    const { sourceIp } = event.requestContext.identity;

    assert(isValidSlug(slug), 'INVALID_SLUG');
    assert(isValidReactionId(reactionId), 'INVALID_REACTION');

    const post = await Dynamo.get<Post>(Dynamo.tables.REACTIONS!, { id: slug });

    const reactions = post ? post.reactions: [];
    const nextReactions = [...reactions, { name: reactionId, ip: sourceIp }];
    const userAlreadyVoted = reactions.find(({ ip }) => ip === (testSourceIp || sourceIp));

    assert(!userAlreadyVoted, 'HAS_ALREADY_VOTED');

    if (!post) {
        await Dynamo.put(Dynamo.tables.REACTIONS!, { id: slug, reactions: nextReactions });
    } else {
        await Dynamo.update(Dynamo.tables.REACTIONS!, { id: slug }, ['reactions', nextReactions]);
    }

    return respondJson(prepareReactions(nextReactions));
});

export {
    getReactions,
    setReaction
};
