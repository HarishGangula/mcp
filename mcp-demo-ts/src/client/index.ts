import axios from 'axios';

interface MCPContext {
  [key: string]: string | number | boolean | object | null;
}

interface JSONRPCRequest<TParams = any> {
  jsonrpc: '2.0';
  method: string;
  params: TParams;
  id?: string | number | null;
}

interface JSONRPCSuccessResponse<TResult = any> {
  jsonrpc: '2.0';
  result: TResult;
  id: string | number | null;
}

interface JSONRPCErrorResponse {
  jsonrpc: '2.0';
  error: {
    code: number;
    message: string;
    data?: any;
  };
  id: string | number | null;
}

type InferParams = {
  model: string;
  input: string;
  context: MCPContext;
};

type InferResult = {
  output: string;
  updatedContext: MCPContext;
};

async function sendBatchRPCRequests() {
  const userContext = {
    userId: 'u101',
    name: 'Jordan',
  };

  const batchRequests: JSONRPCRequest<InferParams>[] = [
    {
      jsonrpc: '2.0',
      id: 'req-1',
      method: 'infer',
      params: {
        model: 'mistral',
        input: "What's the time?",
        context: userContext,
      },
    },
    {
      jsonrpc: '2.0',
      id: 'req-2',
      method: 'infer',
      params: {
        model: 'mistral',
        input: "Tell me a joke.",
        context: userContext,
      },
    },
    {
      jsonrpc: '2.0',
      id: 'req-3',
      method: 'infer',
      params: {
        model: 'mistral',
        input: "What’s the weather like?",
        context: userContext,
      },
    },
  ];

  try {
    const response = await axios.post<
      Array<JSONRPCSuccessResponse<InferResult> | JSONRPCErrorResponse>
    >('http://localhost:3000/rpc', batchRequests);

    console.log('Batch Response:');
    response.data.forEach((resp) => {
      if ('result' in resp) {
        console.log(`✅ ${resp.id}:`, resp.result.output);
      } else if (resp.error && resp.error.message) {
        console.error(`❌ ${resp.id}:`, resp.error.message);
      } else {
        console.error(`❌ ${resp.id}: Unknown error`);
      }
    });
  } catch (error) {
    console.error('Batch Request Error:', error);
  }
}

sendBatchRPCRequests();

async function getUserContext(userId: string) {
  const request: JSONRPCRequest<{ userId: string }> = {
    jsonrpc: '2.0',
    id: 'ctx-001',
    method: 'getContext',
    params: { userId },
  };

  try {
    const response = await axios.post<
      JSONRPCSuccessResponse<MCPContext> | JSONRPCErrorResponse
    >('http://localhost:3000/rpc', request);

    if ('result' in response.data) {
      console.log('🧠 Retrieved Context:', response.data.result);
    } else {
      console.error('❌ Error:', response.data.error.message);
    }
  } catch (err) {
    console.error('Request failed:', err);
  }
}

// Test it after sending batch messages
getUserContext('u101');
