import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {

    const { queryStringParameters = {} } = event;

    const { currency } = queryStringParameters;

    if (!currency) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing Query String of currency",
            }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Hello from combinationAPI",
            path: event.path,
        }),
    };
};