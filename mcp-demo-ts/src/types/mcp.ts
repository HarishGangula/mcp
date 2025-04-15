
// Generic key-value structure for the context
export interface MCPContext {
    [key: string]: string | number | boolean | object | null;
  }
  
  // The request structure sent from client to server
  export interface MCPRequest {
    requestId: string;
    model: string;           // Name or ID of the model to use
    input: string;           // The user's input/prompt/query
    context: MCPContext;     // Any context about the user, session, etc.
    timestamp: string;       // ISO string timestamp
  }
  
  // The response structure sent back from the server
  export interface MCPResponse {
    requestId: string;
    output: string;          // Model-generated response
    updatedContext?: MCPContext;  // Optional updated context
    success: boolean;
    error?: string;          // Optional error message
    timestamp: string;       // Server response time
  }
  