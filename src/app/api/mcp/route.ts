import { NextRequest } from "next/server";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createCinePulseMcpServer } from "@/mcp/server";
import { extractBearerToken } from "@/mcp/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Normalizes incoming request headers to guarantee seamless compatibility
 * with MCP Streamable HTTP specifications across varied clients.
 */
function normalizeMcpRequest(req: Request): Request {
  const accept = req.headers.get("accept") || "";
  if (!accept || (!accept.includes("application/json") && !accept.includes("text/event-stream"))) {
    const headers = new Headers(req.headers);
    headers.set("accept", "application/json, text/event-stream");
    return new Request(req.url, {
      method: req.method,
      headers,
      body: req.body,
      // @ts-ignore
      duplex: "half",
    });
  }
  return req;
}

export async function GET(req: NextRequest) {
  const normalizedReq = normalizeMcpRequest(req);
  const bearerToken = extractBearerToken(req.headers.get("authorization"));

  const server = createCinePulseMcpServer(bearerToken);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);
  return transport.handleRequest(normalizedReq);
}

export async function POST(req: NextRequest) {
  const normalizedReq = normalizeMcpRequest(req);
  const bearerToken = extractBearerToken(req.headers.get("authorization"));

  const server = createCinePulseMcpServer(bearerToken);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);
  return transport.handleRequest(normalizedReq);
}
