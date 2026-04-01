"use client"

import React, { useState, useMemo, memo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark as atomOneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import js from "react-syntax-highlighter/dist/esm/languages/prism/javascript"
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript"
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx"
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx"
import python from "react-syntax-highlighter/dist/esm/languages/prism/python"
import json from "react-syntax-highlighter/dist/esm/languages/prism/json"
import css from "react-syntax-highlighter/dist/esm/languages/prism/css"
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown"
import html from "react-syntax-highlighter/dist/esm/languages/prism/markup"
// Register common languages for light build
SyntaxHighlighter.registerLanguage("javascript", js)
SyntaxHighlighter.registerLanguage("typescript", ts)
SyntaxHighlighter.registerLanguage("ts", ts)
SyntaxHighlighter.registerLanguage("tsx", tsx)
SyntaxHighlighter.registerLanguage("jsx", jsx)
SyntaxHighlighter.registerLanguage("python", python)
SyntaxHighlighter.registerLanguage("json", json)
SyntaxHighlighter.registerLanguage("css", css)
SyntaxHighlighter.registerLanguage("markdown", markdown)
SyntaxHighlighter.registerLanguage("HTMl", html)

import hljs from "highlight.js"
import { Copy, Check, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MessageContentProps {
  content: string
  isSent: boolean
}

function detectRawCode(text: string): { isCode: boolean; language: string } {
  const trimmed = text.trim()

  if (!trimmed || trimmed.startsWith("```")) return { isCode: false, language: "" }

  try {
    const result = hljs.highlightAuto(trimmed)

    // Line count helps weight the decision
    const lineCount = trimmed.split("\n").length

    const isCodeBlock = lineCount > 1
      ? result.relevance > 5 || result.language === "jsx" || result.language === "typescript"
      : result.relevance > 10


    const hasBracesOrControl = /[{};[\]()|]/.test(trimmed) || /^(if|for|while|import|export|class|function|def|fn|const|let)\s/.test(trimmed)

    if (isCodeBlock || (result.relevance > 2 && hasBracesOrControl)) {
      return {
        isCode: true,
        language: result.language || "text"
      }
    }
  } catch (err) {
    console.error("Language detection error:", err)
  }

  return { isCode: false, language: "" }
}

export const MessageContent = memo(({ content, isSent }: MessageContentProps) => {
  const { isCode, language } = detectRawCode(content)

  // 1. If raw code detected, skip ReactMarkdown entirely and render directly
  if (isCode) {
    return <CodeBlock language={language} value={content.trim()} />
  }

  // 2. Skip Markdown for Plain Text (Performance improvement)
  const isMarkdown = /[`*_#>-]/.test(content)
  if (!isMarkdown) {
    return (
      <div className={cn(isSent ? "text-white" : "text-foreground")}>
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    )
  }

  const renderedMarkdown = useMemo(() => {
    return (
      <div
        className={cn(
          "prose prose-sm max-w-none dark:prose-invert",
          "prose-p:leading-relaxed prose-pre:my-2 prose-pre:p-0 prose-pre:bg-transparent",
          "prose-code:text-inherit prose-code:bg-black/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",
          isSent ? "text-white prose-p:text-white/95" : "text-foreground"
        )}
        suppressHydrationWarning
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "")
              const language = match ? match[1] : ""

              if (match) {
                return (
                  <CodeBlock
                    language={language}
                    value={String(children).replace(/\n$/, "")}
                  />
                )
              }

              // Inline code
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },

            // Remove the <pre> wrapper — CodeBlock owns its own container
            pre({ children }) {
              return <>{children}</>
            },

            p: ({ children }) => (
              <p className="mb-1 last:mb-0">{children}</p>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              >
                {children}
              </a>
            ),
            ul: ({ children }) => (
              <ul className="mb-2 list-disc pl-4 last:mb-0">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-2 list-decimal pl-4 last:mb-0">{children}</ol>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-primary/30 pl-3 italic opacity-80">
                {children}
              </blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }, [content, isSent])

  return renderedMarkdown
})

MessageContent.displayName = "MessageContent"

interface CodeBlockProps {
  language: string
  value: string
}

const CodeBlock = memo(({ language, value }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-3 overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e] shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">
            {language || "code"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className="h-7 w-7 rounded-md text-muted-foreground hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* Code */}
      <div
        ref={containerRef}
        className="min-h-[40px] max-h-[350px] overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {isVisible ? (
          <SyntaxHighlighter
            language={language || "text"}
            style={atomOneDark}
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "13px",
              background: "transparent",
              lineHeight: "1.6",
            }}
            codeTagProps={{
              style: {
                fontFamily: "var(--font-mono)",
              },
            }}
          >
            {value}
          </SyntaxHighlighter>
        ) : (
          <div className="p-4 text-xs text-muted-foreground/50 italic">
            Loading code...
          </div>
        )}
      </div>
    </div>
  )
})

CodeBlock.displayName = "CodeBlock"