import "../__test__/mocks/dynamodb";
import AWS from "aws-sdk";

it("should get/put item", async () => {
  const docclient = new AWS.DynamoDB.DocumentClient();
  await docclient
    .put({
      TableName: "sample-table",
      Item: {
        id: "hello",
        value: "world",
      },
    })
    .promise();

  const { Item: item } = await docclient
    .get({ TableName: "sample-table", Key: { id: "hello" } })
    .promise();
  expect(item).toBeDefined();
  expect((item as any).value).toEqual("world");
});

it("should roleback", async () => {
  const docclient = new AWS.DynamoDB.DocumentClient();
  const transactWriteParam: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput = {
    TransactItems: [
      {
        Put: {
          TableName: "sample-table",
          Item: { id: "hello-transaction" },
        },
      },
      {
        Put: {
          TableName: "sample-table",
          Item: { invalidHashKey: "hogehoge" },
        },
      },
    ],
  };

  const transactWriteOutput = await docclient
    .transactWrite(transactWriteParam)
    .promise()
    .catch(console.error);

  const { Items: items = [] } = await docclient
    .scan({ TableName: "sample-table" })
    .promise();

  expect(items).toHaveLength(1);
  expect(items[0].id).not.toEqual("hello-transaction");
});
