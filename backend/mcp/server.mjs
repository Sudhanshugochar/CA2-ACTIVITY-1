import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import dotenv from 'dotenv';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const require = createRequire(import.meta.url);

function getHospitalModule() {
  const modPath = require.resolve('../services/hospitalTools.js');
  delete require.cache[modPath];
  return require(modPath);
}

const server = new Server(
  { name: 'medipulse-hospital', version: '2.1.0' },
  { capabilities: { tools: {} } },
);

// Dynamically refresh tools on each request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const { getTools } = getHospitalModule();
  return { tools: getTools() };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const { executeTool } = getHospitalModule();
    const result = await executeTool(name, args || {});
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (error) {
    return { isError: true, content: [{ type: 'text', text: error.message }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('=============================================================');
console.error('  MediPulse MCP Server v2.1 — connected over stdio');
console.error('  Tools: 10 total (including test_render_cloud_api)');
console.error('=============================================================');

// Redirect console.log to stderr so it does not pollute the MCP stdio stream
console.log = (...args) => console.error(...args);

require('../config/database.js')().catch((error) => {
  console.error('MediPulse MCP: MongoDB connection failed:', error.message);
});
