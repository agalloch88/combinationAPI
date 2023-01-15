import { APIGatewayProxyEvent } from "aws-lambda";
import { formatJSONResponse } from "../../libs/apiGateway";

export const handler = async (event: APIGatewayProxyEvent) => {
  const { queryStringParameters = {} } = event;

  const { currency } = queryStringParameters;

  if (!currency) {
    return formatJSONResponse({
      statusCode: 400,
      data: {
        message: "Missing currency query parameter. Currency is required.",
      },
    });
  }

  return formatJSONResponse({ data: { message: "success" } });
};
