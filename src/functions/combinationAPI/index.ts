import { APIGatewayProxyEvent } from "aws-lambda";
import { formatJSONResponse } from "../../libs/apiGateway";
import axios from "axios";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const { queryStringParameters = {} } = event;

    // check the currency, and ensure it is on the query string

    const { currency } = queryStringParameters;

    if (!currency) {
      return formatJSONResponse({
        statusCode: 400,
        data: {
          message: "Missing currency query parameter. Currency is required.",
        },
      });
    }

    // get the deals from cheapshark, and convert the prices to the currency
    const deals = await axios.get(
      "www.cheapshark.com/api/1.0/deals?upperPrice=15&pageSize=5"
    );

    const currencyData = await axios.get(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/${currency}.json`
    );

    const currencyConversion = currencyData.data[currency];

    const repricedDeals = deals.data.map((deal) => {
      const {
        title,
        storeID,
        salePrice,
        normalPrice,
        metacriticScore,
        savings,
        steamRatingPercent,
        releaseDate,
      } = deal;

      return {
        title,
        storeID,
        steamRatingPercent,
        metacriticScore,

        salePrice: salePrice * currencyConversion,
        normalPrice: normalPrice * currencyConversion,
        savings: savings * currencyConversion,
        releaseDate: new Date(releaseDate * 1000).toDateString(),
      };
    });

    return formatJSONResponse({ data: repricedDeals });
  } catch (error) {}
};
