// src/context/store.ts

import { MCPContext } from '../types/mcp';

// In-memory store
const contextStore = new Map<string, MCPContext>();

/**
 * Get context by key
 * @param key Unique ID (e.g., userId or sessionId)
 */
export function getContext(key: string): MCPContext {
  return contextStore.get(key) || {};
}

/**
 * Set context by key (overwrite)
 * @param key 
 * @param context 
 */
export function setContext(key: string, context: MCPContext): void {
  contextStore.set(key, context);
}

/**
 * Update (merge) context by key
 * @param key 
 * @param updates 
 */
export function updateContext(key: string, updates: MCPContext): void {
  const current = contextStore.get(key) || {};
  contextStore.set(key, { ...current, ...updates });
}
