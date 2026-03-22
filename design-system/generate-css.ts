#!/usr/bin/env tsx
/**
 * Generates CSS custom properties in globals.css from design-system/tokens.ts.
 * Usage:
 *   npm run tokens          — generate/update :root block
 *   npm run tokens:check    — verify globals.css is in sync (CI)
 */
import * as fs from "fs"
import * as path from "path"
import { tokens } from "./tokens"
import { tokenKeyToCssVar, sidebarKeyToCssVar } from "./utils"

const GLOBALS_CSS_PATH = path.resolve(__dirname, "../app/globals.css")
const START_MARKER = "/* TOKENS:START */"
const END_MARKER = "/* TOKENS:END */"

function generateRootBlock(): string {
  const lines: string[] = [
    `  ${START_MARKER}`,
    "  :root {",
  ]

  // Colors
  for (const [key, value] of Object.entries(tokens.colors)) {
    lines.push(`    ${tokenKeyToCssVar(key)}: ${value};`)
  }

  // Radius
  for (const [key, value] of Object.entries(tokens.radius)) {
    lines.push(`    --radius-${key}: ${value};`)
  }
  lines.push(`    --radius: ${tokens.radius.md};`)

  lines.push("  }")

  // Dark mode (sidebar vars double as dark bg)
  lines.push("")
  lines.push("  .dark {")
  lines.push("    --background: 222.2 84% 4.9%;")
  lines.push("    --foreground: 210 40% 98%;")
  lines.push("    --card: 222.2 84% 4.9%;")
  lines.push("    --card-foreground: 210 40% 98%;")
  lines.push("    --popover: 222.2 84% 4.9%;")
  lines.push("    --popover-foreground: 210 40% 98%;")
  lines.push("    --primary: 217.2 91.2% 59.8%;")
  lines.push("    --primary-foreground: 222.2 47.4% 11.2%;")
  lines.push("    --secondary: 217.2 32.6% 17.5%;")
  lines.push("    --secondary-foreground: 210 40% 98%;")
  lines.push("    --muted: 217.2 32.6% 17.5%;")
  lines.push("    --muted-foreground: 215 20.2% 65.1%;")
  lines.push("    --accent: 217.2 32.6% 17.5%;")
  lines.push("    --accent-foreground: 210 40% 98%;")
  lines.push("    --destructive: 0 62.8% 30.6%;")
  lines.push("    --destructive-foreground: 210 40% 98%;")
  lines.push("    --border: 217.2 32.6% 17.5%;")
  lines.push("    --input: 217.2 32.6% 17.5%;")
  lines.push("    --ring: 224.3 76.3% 48%;")
  lines.push("  }")

  // Sidebar vars
  lines.push("")
  lines.push("  :root, .dark {")
  for (const [key, value] of Object.entries(tokens.sidebar)) {
    lines.push(`    ${sidebarKeyToCssVar(key)}: ${value};`)
  }
  lines.push("  }")

  lines.push(`  ${END_MARKER}`)

  return lines.join("\n")
}

function run() {
  const isCheck = process.argv.includes("--check")

  const currentContent = fs.readFileSync(GLOBALS_CSS_PATH, "utf-8")
  const startIdx = currentContent.indexOf(START_MARKER)
  const endIdx = currentContent.indexOf(END_MARKER)

  const newBlock = generateRootBlock()

  let newContent: string

  if (startIdx !== -1 && endIdx !== -1) {
    // Replace existing block
    newContent =
      currentContent.substring(0, startIdx) +
      newBlock +
      currentContent.substring(endIdx + END_MARKER.length)
  } else {
    // Append before @layer base or at end
    const layerIdx = currentContent.indexOf("@layer base")
    if (layerIdx !== -1) {
      newContent =
        currentContent.substring(0, layerIdx) +
        newBlock +
        "\n\n" +
        currentContent.substring(layerIdx)
    } else {
      newContent = currentContent + "\n\n" + newBlock
    }
  }

  if (isCheck) {
    if (currentContent !== newContent) {
      console.error("❌ globals.css is out of sync with tokens.ts. Run `npm run tokens`.")
      process.exit(1)
    } else {
      console.log("✅ globals.css is in sync with tokens.ts.")
    }
    return
  }

  fs.writeFileSync(GLOBALS_CSS_PATH, newContent, "utf-8")
  console.log("✅ globals.css updated with design tokens.")
}

run()
