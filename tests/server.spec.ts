import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { describe, expect, it } from "vitest";

interface ResultContentItem {
  type: string;
  text: string;
}

interface ZipcodaResponse {
  items: Array<ZipcodaItem>;
  length: number;
}

interface ZipcodaItem {
  zipcode: string;
  pref: string;
  address: string;
}

type ResultContent = Array<ResultContentItem>;

async function createClient() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["bin/server.js"],
  });

  const client = new Client({
    name: "test-client",
    version: "1.0.0",
  });

  await client.connect(transport);
  return { client, transport };
}

describe("Zipcoda MCP Server", () => {
  it("should search by zipcode", async () => {
    const { client, transport } = await createClient();

    try {
      const result = await client.callTool({
        name: "search_by_zipcode",
        arguments: {
          zipcode: "1000001",
        },
      });

      const data = (result.content as ResultContent)[0];
      expect(data.type).toBe("text");

      const response: ZipcodaResponse = JSON.parse(data.text);
      expect(response.items).toBeDefined();
      expect(response.length).toBeGreaterThan(0);

      const item = response.items[0];
      expect(item.zipcode).toBe("1000001");
      expect(item.address).toContain("東京都");
    } finally {
      await transport.close?.();
    }
  });

  it("should search by address", async () => {
    const { client, transport } = await createClient();

    try {
      const result = await client.callTool({
        name: "search_by_address",
        arguments: {
          address: "千代田区",
        },
      });

      const data = (result.content as ResultContent)[0];
      expect(data.type).toBe("text");

      const response: ZipcodaResponse = JSON.parse(data.text);
      expect(response.items).toBeDefined();
      expect(response.length).toBeGreaterThan(0);

      const item = response.items[0];
      expect(item.address).toContain("千代田区");
    } finally {
      await transport.close?.();
    }
  });
});
