#!/usr/bin/env node

import { SERVER_NAME, SERVER_VERSION } from "./constants.js";

const args = process.argv.slice(2);

if (args.includes("--check") || args.includes("-c")) {
  // Background checker mode: scan, write cache, exit
  // Dynamic import to keep the MCP server startup lean
  const { main } = await import("./checker.js");
} else if (args.includes("--version") || args.includes("-v")) {
  console.log(`${SERVER_NAME} v${SERVER_VERSION}`);
} else if (args.includes("--help") || args.includes("-h")) {
  console.log(`${SERVER_NAME} v${SERVER_VERSION}

Usage:
  depsonar              Start MCP server (for Cursor/Claude)
  depsonar --check      Run background scan (for cron/launchd)
  depsonar --version    Show version
  depsonar --help       Show this help

MCP Tools:
  depsonar_alerts           Show pending alerts from background scans
  depsonar_scan             Scan all projects for outdated deps
  depsonar_check            Check a specific project
  depsonar_update           Update a project's dependencies
  depsonar_update_all       Batch update all projects
  depsonar_health           Health score for a project
  depsonar_install          Fresh install dependencies
  depsonar_audit            Security vulnerability scan (npm/pip/cargo audit)
  depsonar_cve              Known framework CVE advisory check
  depsonar_live_cve         Real-time CVE scan via osv.dev API
  depsonar_changelog        Changelogs & breaking changes before updating
  depsonar_migrate          Framework migration detector (Svelte 4→5, etc.)
  depsonar_deprecated       Deprecated & replaced package detection
  depsonar_secrets          Secret & API key scanner
  depsonar_licenses         License compliance check (GPL/AGPL flags)
  depsonar_runtimes         Check runtime versions (Node, Python, Rust...)
  depsonar_toolchain        Check global tool versions (npm, pnpm, git...)
  depsonar_docker           Audit Docker images for outdated/EOL
  depsonar_actions          Audit GitHub Actions versions
  depsonar_envcheck         Validate .env, lockfiles, configs
  depsonar_infra            Full infrastructure report (everything)
  depsonar_setup_checker    Setup automatic background scanning
  depsonar_config           View/edit configuration

Supported: Node.js, Python, Rust, Go, PHP, Ruby, Dart/Flutter, Swift, Kotlin/Java
Frameworks: SvelteKit, React, Next.js, Solid.js, Vue/Nuxt, Astro, Django, Laravel, Express
`);
} else {
  // Default: MCP server mode
  const { McpServer } = await import("@modelcontextprotocol/sdk/server/mcp.js");
  const { StdioServerTransport } = await import("@modelcontextprotocol/sdk/server/stdio.js");
  const { registerTools } = await import("./tools/index.js");

  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  registerTools(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${SERVER_NAME} v${SERVER_VERSION} running on stdio`);
}
