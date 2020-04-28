import * as AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

const isOffline = process.env.IS_OFFLINE === 'true';
const dynamoDbOptions = isOffline && { region: 'localhost', endpoint: 'http://localhost:8000' };
const client = new AWS.DynamoDB.DocumentClient(dynamoDbOptions as ServiceConfigurationOptions);

type TKey = Record<string, unknown>;
type TUpdateField = [string, unknown];
type TPutFields = any;

class Dynamo {
    static tables = {
        REACTIONS: process.env.REACTIONS_TABLE
    };

    // DocumentClient.UpdateItemInput

    static async update(TableName: string, Key: TKey, [attributeName, value]: TUpdateField) {
        return await new Promise(resolve => {
            client.update({
                TableName,
                Key,
                UpdateExpression: 'SET #name = :value',
                ExpressionAttributeNames: { '#name': attributeName },
                ExpressionAttributeValues: { ':value': value }
            }, (error: Error) => {
                if (error) {
                    console.error(error);
                }
                resolve();
            });
        });
    }

    static async put(TableName: string, Item: TPutFields) {
        return await new Promise(resolve => {
            client.put({ TableName, Item }, (error, data) => {
                if (error) {
                    console.error(error);
                }
                resolve(data);
            });
        });
    }

    static async get<T>(TableName: string, Key: TKey): Promise<T | null> {
        return await new Promise(resolve => {
            client.get({ TableName, Key }, (error, result) => {
                if (error) {
                    console.error(error); // Could not get message

                    return resolve(null);
                }

                if (!result.Item) {
                    return resolve(null); // Item not found
                }

                resolve(result.Item as T);
            });
        });
    }
}

export { Dynamo };
