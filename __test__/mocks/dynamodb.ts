// proxy dynamodb with test env
import AWS from "aws-sdk";

const testConfig = {
  convertEmptyValues: true,
  endpoint: "localhost:8000",
  sslEnabled: false,
  region: "local-env",
};

const DocumentClient = AWS.DynamoDB.DocumentClient;
const DynamoDB = AWS.DynamoDB;

class MockDynamoDB__DockumentClient {
  constructor(config: any) {
    return new DocumentClient({ ...config, ...testConfig });
  }
}

class MockDynamoDB {
  constructor(config: any) {
    return new DynamoDB({ ...config, ...testConfig });
  }
}

// @ts-ignore
AWS.DynamoDB = MockDynamoDB;
// @ts-ignore
AWS.DynamoDB.DocumentClient = MockDynamoDB__DockumentClient;
