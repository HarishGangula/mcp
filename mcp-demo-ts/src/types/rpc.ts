// src/types/rpc.ts

export interface JSONRPCRequest<TParams = any> {
    jsonrpc: '2.0';
    method: string;
    params: TParams;
    id: string | number | null;
  }
  
  export interface JSONRPCSuccessResponse<TResult = any> {
    jsonrpc: '2.0';
    result: TResult;
    id: string | number | null;
  }
  
  export interface JSONRPCError {
    code: number;
    message: string;
    data?: any;
  }
  
  export interface JSONRPCErrorResponse {
    jsonrpc: '2.0';
    error: JSONRPCError;
    id: string | number | null;
  }
  