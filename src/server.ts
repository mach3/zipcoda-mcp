#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "Zipcoda MCP",
  version: "0.1.0",
});

const ZIPCODA_API_URL = "https://zipcoda.net/api";

interface ZipcodaItem {
  zipcode: string;
  pref: string;
  address: string;
}

interface ZipcodaResponse {
  items: Array<ZipcodaItem>;
  length: number;
}

server.tool(
  "search_by_zipcode",
  "郵便番号から住所を検索するツール",
  {
    zipcode: z.string().describe("郵便番号"),
  },
  async ({ zipcode }) => {
    const value = encodeURIComponent(zipcode);
    const response = await fetch(`${ZIPCODA_API_URL}?zipcode=${value}`);
    if (!response.ok) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${response.statusText}`,
          },
        ],
      };
    }
    const data: ZipcodaResponse = await response.json();
    data.items = data.items.map((it: ZipcodaItem) => ({
      zipcode: it.zipcode,
      address: `${it.pref} ${it.address}`,
      pref: it.pref,
    }));
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data),
        },
      ],
    };
  },
);

server.tool(
  "search_by_address",
  "住所から郵便番号を検索するツール",
  {
    address: z.string().describe("住所"),
  },
  async ({ address }) => {
    const value = encodeURIComponent(address);
    const response = await fetch(`${ZIPCODA_API_URL}?address=${value}`);
    if (!response.ok) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${response.statusText}`,
          },
        ],
      };
    }
    const data: ZipcodaResponse = await response.json();
    data.items = data.items.map((it: ZipcodaItem) => ({
      zipcode: it.zipcode,
      address: `${it.pref} ${it.address}`,
      pref: it.pref,
    }));
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data),
        },
      ],
    };
  },
);

server.resource(
  "zipcode_address_api",
  "postal://zipcode-address/api",
  { mimeType: "application/json" },
  async () => {
    return {
      contents: [
        {
          uri: "postal://zipcode-address/api",
          text: JSON.stringify({
            description: "郵便番号と住所の相互変換APIです",
            service: "zipcoda API",
            endpoints: {
              search_by_zipcode: "郵便番号から住所を検索",
              search_by_address: "住所から郵便番号を検索",
            },
          }),
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);

console.log("Server started. Waiting for messages...");
