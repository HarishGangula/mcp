import express from 'express';
import bodyParser from 'body-parser';
import { MCPContext } from '../types/mcp';
import { getContext, updateContext } from '../context/store';
import {
  JSONRPCRequest,
  JSONRPCSuccessResponse,
  JSONRPCErrorResponse,
} from '../types/rpc';
import { generateWithOllama } from '../utils/ollama';


const app = express();
const PORT = 3000;

app.use(bodyParser.json());

type InferParams = {
  model: string;
  input: string;
  context: MCPContext;
};

type InferResult = {
  output: string;
  updatedContext: MCPContext;
};

// Utility to handle individual JSON-RPC request
async function handleRPCRequest(rpcReq: JSONRPCRequest): Promise<JSONRPCSuccessResponse | JSONRPCErrorResponse | null> {
  const { id, method, params } = rpcReq;

  if (rpcReq.jsonrpc !== '2.0') {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32600,
        message: 'Invalid Request',
      },
    };
  }

  // Handle notifications (no id = no response)
  const isNotification = id === undefined || id === null;

  if (method === 'infer') {
    const { model, input, context } = params as InferParams;

    if (!context?.userId) {
      return !isNotification
        ? {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32602,
              message: 'Missing userId in context',
            },
          }
        : null;
    }

    const userId = String(context.userId);
    const stored = getContext(userId);
    const mergedContext = { ...stored, ...context };

    const contextPrompt = Object.entries(mergedContext)
  .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
  .join('\n');

const prompt = `You are a helpful assistant. User context:\n${contextPrompt}\n\nUser input: ${input}`;

const output = await generateWithOllama(model, prompt);

    const updates = {
      lastMessage: input,
      lastInteraction: new Date().toISOString(),
    };
    updateContext(userId, updates);

    const result: InferResult = {
      output,
      updatedContext: { ...mergedContext, ...updates },
    };

    return !isNotification
      ? {
          jsonrpc: '2.0',
          id,
          result,
        }
      : null;
  }

  if (method === 'getContext') {
    const { userId } = params as { userId: string };

    if (!userId) {
      return !isNotification
        ? {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32602,
              message: 'Missing userId in params',
            },
          }
        : null;
    }

    const context = getContext(userId);

    return !isNotification
      ? {
          jsonrpc: '2.0',
          id,
          result: context,
        }
      : null;
  }


  return !isNotification
    ? {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Method '${method}' not found`,
        },
      }
    : null;
}

// Main route: handles single + batch requests
app.post('/rpc', async (req, res) => {
  const body = req.body;

  if (Array.isArray(body)) {
    if (body.length === 0) {
      return res.status(400).json({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32600,
          message: 'Invalid Request (empty batch)',
        },
      });
    }

    const responses = await Promise.all(
      body.map(async (req: JSONRPCRequest) => {
        try {
          return await handleRPCRequest(req);
        } catch (err) {
          return {
            jsonrpc: '2.0',
            id: req.id || null,
            error: {
              code: -32603,
              message: 'Internal error',
            },
          };
        }
      })
    ).then((results) => results.filter((resp) => resp !== null));

    return res.json(responses);
  }

  try {
    const result = await handleRPCRequest(body);
    if (result === null) return res.status(204).send(); // Notification
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      jsonrpc: '2.0',
      id: body?.id || null,
      error: {
        code: -32603,
        message: 'Internal error',
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 JSON-RPC MCP server running at http://localhost:${PORT}/rpc`);
});
