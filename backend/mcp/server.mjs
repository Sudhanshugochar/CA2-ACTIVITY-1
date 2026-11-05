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
const { getTools, executeTool } = require('../services/hospitalTools.js');

const server = new Server(
  { name: 'medipulse-hospital', version: '2.0.0' },
  { capabilities: { tools: {} } },
);

// Call getTools() fresh on every ListTools request so that
// custom schema fields added via update_patient_schema appear immediately
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: getTools(),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = await executeTool(name, args || {});
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (error) {
    return { isError: true, content: [{ type: 'text', text: error.message }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('=============================================================');
console.error('  MediPulse MCP Server v2.0 — connected over stdio');
console.error('  Tools: 9 total (6 patient + 3 AI-powered)');
console.error('  change_website_theme | update_patient_schema | get_project_status');
console.error('=============================================================');

// Redirect console.log to stderr so it does not pollute the MCP stdio stream
console.log = (...args) => console.error(...args);

require('../config/database.js')().catch((error) => {
  console.error('MediPulse MCP: MongoDB connection failed:', error.message);
});
