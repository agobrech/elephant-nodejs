const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    switch (event.routeKey) {
      case "DELETE /node/{id}":
        await dynamo
          .delete({
            TableName: "elephant-3d-node",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case "GET /node/{id}":
        body = await dynamo
          .get({
            TableName: "elephant-3d-graph",
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        break;
      case "GET /nodes":
        body = await dynamo.scan({ TableName: "elephant-3d-node" }).promise();
        break;
      case "PUT /node":
        let requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: "elephant-3d-node",
            Item: {
              id: requestJSON.id,
              name: requestJSON.name
            }
          })
          .promise();
        body = `Put item ${requestJSON.active}`;
        break;
        case "DELETE /link/{id}":
            await dynamo
              .delete({
                TableName: "elephant-3d-link",
                Key: {
                  id: event.pathParameters.id
                }
              })
              .promise();
            body = `Deleted item ${event.pathParameters.id}`;
            break;
          case "GET /link/{id}":
            body = await dynamo
              .get({
                TableName: "elephant-3d-link",
                Key: {
                  id: event.pathParameters.id
                }
              })
              .promise();
            break;
          case "GET /links":
            body = await dynamo.scan({ TableName: "elephant-3d-link" }).promise();
            break;
          case "PUT /link":
            let requestJSON = JSON.parse(event.body);
            await dynamo
              .put({
                TableName: "elephant-3d-link",
                Item: {
                  id: requestJSON.id,
                  target: requestJSON.target,
                  source: requestJSON.source
                }
              })
              .promise();
            body = `Put item ${requestJSON.active}`;
            break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};