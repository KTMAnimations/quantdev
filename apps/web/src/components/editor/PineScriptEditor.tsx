"use client";

import { useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

import { PINE_LANGUAGE_ID, registerPineLanguage } from "@/components/editor/pine-syntax";

export function PineScriptEditor({
  value,
  onChange,
  height = 520,
}: {
  value: string;
  onChange: (value: string) => void;
  height?: number;
}) {
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;
    registerPineLanguage(monaco);
  }, [monaco]);

  return (
    <Editor
      height={height}
      language={PINE_LANGUAGE_ID}
      theme="openquant-dark"
      value={value}
      onChange={(v) => onChange(v ?? "")}
      options={{
        minimap: { enabled: false },
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        lineHeight: 20,
        scrollBeyondLastLine: false,
        wordWrap: "on",
        smoothScrolling: true,
        padding: { top: 12, bottom: 12 },
      }}
    />
  );
}

