# MCP Project

This project demonstrates the implementation of an MCP (Model Context Protocol) server and client using TypeScript.

## Steps to Run the Project

1. **Install Dependencies**
   Navigate to the `mcp-demo-ts` folder and install the required dependencies:
   ```bash
   cd mcp-demo-ts
   npm install
   ```

2. **Build the Project**
   Compile the TypeScript code into JavaScript:
   ```bash
   npm run build
   ```

3. **Run the Server**
   Start the MCP server:
   ```bash
   npm start
   ```

4. **Client Interaction**
   Use the client code in `src/client/index.ts` to interact with the server. You can modify the client code as needed to test different scenarios.

## Project Structure

- `src/client/`: Contains the client-side code.
- `src/server/`: Contains the server-side code.
- `src/context/`: Includes shared context or state management logic.
- `src/types/`: Defines TypeScript types and interfaces used across the project.
- `src/utils/`: Utility functions and helpers.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Ollama with the Mistral model installed

## Notes

- Refer to the `README.md` inside the `mcp-demo-ts` folder for more specific details about the subproject.