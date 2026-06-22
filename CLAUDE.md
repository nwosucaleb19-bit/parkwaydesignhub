# Parkway Design System Hub

A developer-facing component hub for Parkway's design system. Devs browse
foundations and components, preview them live, and copy code snippets for
**Vue 3**, **React**, and **Flutter**. The single source of truth is the
Parkway Figma library — no production component libraries exist yet, so the
snippets in this hub ARE the reference implementations.

## Source of truth (Figma)

File: https://www.figma.com/design/awFCtNVY5J46nHLu73MdLH/Parkway-Website-and-Rails

Implemented nodes:
- Colors — node 87:32 (Atomic Tangerine primary #F9956B, Rich Grey secondary
  #121212, Buff alternative #F2DC8E, success #36CC4F, error #FF0000)
- Typography Desktop — node 88:140 (H1–H4 PP Right Gothic Wide Medium;
  H5/H6 + P21/P18/P16/P14/P12 in Manrope)
- Typography Mobile — node 530:6673 (scaled ramp; drives the Flutter TextTheme)
- Spacing — node 95:75 (8px base unit: 8,16,24,32,40,48,56,64)
- Buttons — node 95:97 (Primary/Alternative × Small/Icon/Medium/Large/XLarge
  × Default/Hover/Disabled; 54px tall, 27px pill radius, Manrope SemiBold 14;
  widths 98/200/275/325px, xlarge fluid)

To keep pulling from Figma in Claude Code, add the Dev Mode MCP server
(Figma desktop app must be running with the file open):
  claude mcp add --transport http figma http://127.0.0.1:3845/mcp

## Architecture

- Single-page React app, Vite. Everything currently lives in
  src/ParkwayHub.jsx: token data (extracted from Figma), snippet-generator
  strings for the three frameworks, page components, and the shell.
- Styling is inline + a small <style> block, using Parkway's own tokens
  (the hub dogfoods the design system).
- PP Right Gothic is licensed; the hub previews display type with Archivo
  (font-stretch 125%) as a stand-in. Production consumers must bundle the
  real font. Do not "fix" this by substituting another font in snippets.

## Conventions

- All snippets reference tokens (--pk-* CSS vars / PkColors in Dart),
  never raw hex.
- Component snippet sets always cover Vue 3 (script setup), React
  (function components), and Flutter (WidgetState-based styling).
- Framework choice is global state in the header; new pages must respect it.
- Every page deep-links to its exact Figma node with ?m=dev.

## Roadmap (in priority order)

1. Split ParkwayHub.jsx into modules (tokens.js, snippets/, pages/, shell).
2. Add components from the Figma file: inputs, cards, nav (pull via the
   Figma MCP, follow the Buttons page pattern: playground + usage snippet +
   full implementation + props table + do/don't).
3. Extract the snippet strings into real packages (@parkway/vue,
   @parkway/react, parkway_flutter) and set up Figma Code Connect.
4. Add a changelog page driven by Figma file version history.

## Commands

- npm install
- npm run dev — local hub at http://localhost:5173
- npm run build — static build (deployable anywhere)
