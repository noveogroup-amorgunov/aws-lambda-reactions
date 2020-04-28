import { getReactions, setReaction } from '../handlers';
import { respondError, respondJson } from '../helpers';
import { Dynamo } from '../dynamo';
import * as httpEventMock from './http-event-mock.json';

const defaultEvent = {
    ...httpEventMock,
    pathParameters: { slug: '2020-04-12-use-redux-with-react-hooks' },
    requestContext: { identity: { sourceIp: '127.0.0.1' } },
    body: "{\"reactionId\":\"like\"}",
} as any;

const defaultRecord = {
    id: '2020-04-12-use-redux-with-react-hooks',
    reactions: [
        { name: 'shocked', ip: '192.168.0.1' },
        { name: 'shocked', ip: '192.168.0.2' },
        { name: 'like', ip: '192.168.0.3' }
    ]
};

beforeEach(() => {
    jest.clearAllMocks();
})

describe('getReactions', () => {
    it('should respond reactions by post slug', async () => {
        const dynamoSpy = jest
            .spyOn(Dynamo, 'get')
            .mockImplementation(async () => defaultRecord);

        const actual = await getReactions(defaultEvent);
        const expected = respondJson({
            shocked: 2,
            love: 0,
            like: 1,
            dislike: 0,
            rage: 0
        });

        expect(actual).toEqual(expected);
        expect(dynamoSpy).toHaveBeenCalled();
    });

    it('should respond reactions anyway even if post is not exist', async () => {
        const dynamoSpy = jest
            .spyOn(Dynamo, 'get')
            .mockImplementation(async () => null);

        const actual = await getReactions(defaultEvent);
        const expected = respondJson({
            shocked: 0,
            love: 0,
            like: 0,
            dislike: 0,
            rage: 0
        });

        expect(actual).toEqual(expected);
        expect(dynamoSpy).toHaveBeenCalled();
    });

    it('should respond error if slug is invalid', async () => {
        const event = { ...defaultEvent, pathParameters: { slug: 'invalid' } };

        const actual = await getReactions(event);
        const expected = respondError('INVALID_SLUG');

        expect(actual).toEqual(expected);
    });
});

describe('setReaction', () => {
    it('should set reaction and respond actual reactions', async () => {
        const dynamoGetSpy = jest
            .spyOn(Dynamo, 'get')
            .mockImplementation(async () => defaultRecord);
        const dynamoUpdateSpy = jest
            .spyOn(Dynamo, 'update')
            .mockImplementation(async () => null);

        const actual = await setReaction(defaultEvent);
        const expected = respondJson({
            shocked: 2,
            love: 0,
            like: 1 + 1,
            dislike: 0,
            rage: 0
        });

        expect(actual).toEqual(expected);
        expect(dynamoGetSpy).toHaveBeenCalled();
        expect(dynamoUpdateSpy).toHaveBeenCalled();
    });

    it('should set first reaction, create post and respond actual reactions', async () => {
        const dynamoGetSpy = jest
            .spyOn(Dynamo, 'get')
            .mockImplementation(async () => null);
        const dynamoUpdateSpy = jest
            .spyOn(Dynamo, 'put')
            .mockImplementation(async () => null);

        const actual = await setReaction(defaultEvent);
        const expected = respondJson({
            shocked: 0,
            love: 0,
            like: 1,
            dislike: 0,
            rage: 0
        });

        expect(actual).toEqual(expected);
        expect(dynamoGetSpy).toHaveBeenCalled();
        expect(dynamoUpdateSpy).toHaveBeenCalled();
    });

    it('should respond error if slug is invalid', async () => {
        const event = { ...defaultEvent, pathParameters: { slug: 'invalid' } };

        const actual = await setReaction(event);
        const expected = respondError('INVALID_SLUG');

        expect(actual).toEqual(expected);
    });

    it('should respond error if reaction id is invalid', async() => {
        const event = { ...defaultEvent, body: '{"reactionId":"unknown"}' };

        const actual = await setReaction(event);
        const expected = respondError('INVALID_REACTION');

        expect(actual).toEqual(expected);
    });

    it('should respond error if body is invalid', async () => {
        const event = { ...defaultEvent, body: '{invalid}' };

        const actual = await setReaction(event);
        const expected = respondError('INVALID_BODY');

        expect(actual).toEqual(expected);
    });

    it('should respond error if user has already voted', async () => {
        const dynamoGetSpy = jest
            .spyOn(Dynamo, 'get')
            .mockImplementation(async () => defaultRecord);

        // deep cloning
        const event = {
            ...defaultEvent,
            requestContext: {
                ...defaultEvent.requestContext,
                identity: {
                    ...defaultEvent.requestContext.identity,
                    sourceIp: '192.168.0.1'
                }
            }
        };

        const actual = await setReaction(event);
        const expected = respondError('HAS_ALREADY_VOTED');

        expect(actual).toEqual(expected);
        expect(dynamoGetSpy).toHaveBeenCalled();
    });
});
