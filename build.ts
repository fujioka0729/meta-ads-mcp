import { execSync } from "child_process";

execSync(
  'npx esbuild ./src/index.ts --bundle --platform=node --format=esm --outfile=./bin/meta-ads-mcp.js --banner:js="#!/usr/bin/env node" --minify',
  { stdio: "inherit" }
);

execSync("chmod +x ./bin/meta-ads-mcp.js");
console.log("Build complete: bin/meta-ads-mcp.js");
