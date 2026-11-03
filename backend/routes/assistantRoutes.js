const express = require('express');
const { tools, executeTool } = require('../services/hospitalTools');

const router = express.Router();
const ollamaBaseUrl = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/+$/, '');
const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2:3b';

router.get('/status', async (req, res) => {
  try {
    const response = await fetch(`${ollamaBaseUrl}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) {
      return res.status(503).json({ status: 'unavailable', model: ollamaModel, message: `Ollama returned HTTP ${response.status}.` });
    }
    const data = await response.json();
    const installed = (data.models || []).some((model) => model.name === ollamaModel || model.name?.startsWith(`${ollamaModel}:`));
    return res.status(installed ? 200 : 503).json({
      status: installed ? 'ready' : 'model_missing',
      model: ollamaModel,
      message: installed ? 'Ollama is ready.' : `Model ${ollamaModel} is not installed. Run: ollama pull ${ollamaModel}`,
    });
  } catch (error) {
    console.error('Ollama status check failed:', error.message);
    return res.status(503).json({
      status: 'unavailable',
      model: ollamaModel,
      message: `Cannot reach Ollama at ${ollamaBaseUrl}. Start Ollama and try again.`,
    });
  }
});

router.post('/chat', async (req, res) => {
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return res.status(400).json({ success: false, message: 'Provide between 1 and 20 chat messages.' });
  }
  if (messages.some((message) => !message || !['user', 'assistant'].includes(message.role)
    || typeof message.content !== 'string' || message.content.length > 4000)) {
    return res.status(400).json({
      success: false,
      message: 'Each message must have a user or assistant role and contain at most 4,000 characters.',
    });
  }
  if (messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ success: false, message: 'The final chat message must be from the user.' });
  }

  const conversation = [
    {
      role: 'system',
      content: 'You are MediPulse, a hospital administration assistant. Use the provided read-only tools when asked about hospital statistics or patient care-coordination records. Only state facts returned by tools; do not infer missing information. Never diagnose, recommend treatment, or replace a clinician. Patient data is sensitive: share only the minimum fields needed to answer the question. If no tool is needed, answer helpfully and concisely.',
    },
    ...messages,
  ];

  try {
    for (let round = 0; round < 5; round += 1) {
      const response = await fetch(`${ollamaBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ollamaModel,
          messages: conversation,
          tools: tools.map((tool) => ({
            type: 'function',
            function: {
              name: tool.name,
              description: tool.description,
              parameters: tool.inputSchema,
            },
          })),
          stream: false,
        }),
        signal: AbortSignal.timeout(90000),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Ollama returned HTTP ${response.status}: ${detail.slice(0, 500)}`);
      }
      const data = await response.json();
      const assistantMessage = data.message;
      if (!assistantMessage || typeof assistantMessage !== 'object') {
        throw new Error('Ollama returned an invalid chat response.');
      }

      const toolCalls = assistantMessage.tool_calls || [];
      if (toolCalls.length === 0) {
        return res.status(200).json({ success: true, message: assistantMessage.content || '' });
      }
      if (round === 4) {
        throw new Error('The assistant exceeded the maximum number of tool calls.');
      }

      conversation.push(assistantMessage);
      for (const call of toolCalls) {
        const toolName = call.function?.name;
        const tool = tools.find((candidate) => candidate.name === toolName);
        if (!tool) throw new Error(`Ollama requested an unsupported tool: ${toolName || 'unknown'}`);
        const result = await executeTool(toolName, call.function.arguments || {});
        conversation.push({ role: 'tool', content: JSON.stringify(result) });
      }
    }
    throw new Error('The assistant did not finish its response.');
  } catch (error) {
    console.error('Ollama assistant request failed:', error.message);
    const status = error.name === 'TimeoutError' || error.name === 'AbortError' ? 504 : 502;
    return res.status(status).json({
      success: false,
      message: error.message || 'Could not complete the Ollama assistant request.',
    });
  }
});

module.exports = router;
