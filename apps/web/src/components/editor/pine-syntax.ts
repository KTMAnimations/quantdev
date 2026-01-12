import type * as Monaco from "monaco-editor";

export const PINE_LANGUAGE_ID = "pinescript";

export function registerPineLanguage(monaco: typeof Monaco) {
  const alreadyRegistered = monaco.languages
    .getLanguages()
    .some((l) => l.id === PINE_LANGUAGE_ID);
  if (!alreadyRegistered) {
    monaco.languages.register({ id: PINE_LANGUAGE_ID });
  }

  monaco.languages.setLanguageConfiguration(PINE_LANGUAGE_ID, {
    comments: { lineComment: "//", blockComment: ["/*", "*/"] },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
    ],
  });

  monaco.languages.setMonarchTokensProvider(PINE_LANGUAGE_ID, {
    keywords: [
      "strategy",
      "indicator",
      "plot",
      "plotshape",
      "plotchar",
      "hline",
      "fill",
      "if",
      "else",
      "for",
      "while",
      "var",
      "input",
      "true",
      "false",
      "na",
      "close",
      "open",
      "high",
      "low",
      "volume",
    ],
    operators: ["=", ">", "<", "!", "~", "?", ":", "==", "<=", ">=", "!=", "&&", "||", "+", "-", "*", "/", "%"],
    symbols: /[=><!~?:&|+\-*/%]+/,
    tokenizer: {
      root: [
        [/\/\/.*$/, "comment"],
        [/\/\*/, "comment", "@comment"],
        [/[a-zA-Z_][\\w.]*/, { cases: { "@keywords": "keyword", "@default": "identifier" } }],
        [/[0-9]+(\.[0-9]+)?/, "number"],
        [/"/, "string", "@string"],
        [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
      ],
      comment: [
        [/[^\/*]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/[\/*]/, "comment"],
      ],
      string: [
        [/[^"]+/, "string"],
        [/"/, "string", "@pop"],
      ],
    },
  });

  monaco.editor.defineTheme("openquant-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "64748b" },
      { token: "keyword", foreground: "a78bfa" },
      { token: "number", foreground: "22c55e" },
      { token: "string", foreground: "06b6d4" },
      { token: "operator", foreground: "94a3b8" },
      { token: "identifier", foreground: "f8fafc" },
    ],
    colors: {
      "editor.background": "#111118",
      "editor.foreground": "#f8fafc",
      "editorLineNumber.foreground": "#475569",
      "editorLineNumber.activeForeground": "#94a3b8",
      "editorCursor.foreground": "#a78bfa",
      "editor.selectionBackground": "#8b5cf640",
      "editor.inactiveSelectionBackground": "#8b5cf620",
    },
  });
}

