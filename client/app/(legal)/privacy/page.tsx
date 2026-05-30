"use client"

import Link from "next/link"
import { Sparkles, ArrowLeft, Shield, Lock, Eye, Database, Globe, Bell, Mail } from "lucide-react"

const sections = [
  {
    id: "information-collection",
    icon: Database,
    title: "Information We Collect",
    content: [
      {
        subtitle: "Account Information",
        text: "When you sign up using Email/Password, Google OAuth, or GitHub OAuth, we collect your email address, name, username, and profile picture. This is required to create your account and identify you to other users on ChatSpark."
      },
      {
        subtitle: "Messages and Code Snippets",
        text: "We store your one-to-one conversation history in our MongoDB database, which includes your text messages and shared code snippets. This allows you to access your chat history across different devices."
      },
      {
        subtitle: "Device and Connection Data",
        text: "When you connect to our real-time WebSocket servers, we temporarily process your IP address and connection details to maintain your active messaging session."
      }
    ]
  },
  {
    id: "how-we-use",
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      {
        subtitle: "Providing the Service",
        text: "We use your information exclusively to operate ChatSpark. This includes authenticating your login, delivering real-time messages via WebSockets, and securely syncing your conversation history."
      },
      {
        subtitle: "Communication",
        text: "We may use your email address to send essential service-related notices, such as account recovery instructions or password resets."
      }
    ]
  },
  {
    id: "data-sharing",
    icon: Globe,
    title: "Data Sharing and Disclosure",
    content: [
      {
        subtitle: "Infrastructure Providers",
        text: "We host ChatSpark on third-party cloud infrastructure providers (such as Vercel and cloud-hosted MongoDB). These providers process your encrypted data strictly on our behalf to keep the application running."
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose your information if legally required to do so in response to a valid court order, subpoena, or other legal process."
      }
    ]
  },
  {
    id: "data-security",
    icon: Lock,
    title: "Data Security",
    content: [
      {
        subtitle: "Encryption in Transit",
        text: "All data transmitted between your browser and our Node.js backend servers is protected using HTTPS/TLS encryption."
      },
      {
        subtitle: "Encryption at Rest",
        text: "Before being saved to our MongoDB database, the content of your messages and code snippets is securely encrypted using AES-256-GCM. We never store your message content in plain text."
      }
    ]
  },
  {
    id: "your-rights",
    icon: Shield,
    title: "Your Rights and Choices",
    content: [
      {
        subtitle: "Managing Messages",
        text: "You can unsend or delete your own messages within your conversations at any time."
      },
      {
        subtitle: "Account Deletion",
        text: "You can request the complete deletion of your account and associated data by contacting us. Once processed, your account and messages will be permanently removed from our active database."
      }
    ]
  },
  {
    id: "cookies",
    icon: Bell,
    title: "Cookies and Authentication",
    content: [
      {
        subtitle: "Authentication Cookies",
        text: "We use strictly necessary cookies to keep you logged in. These cookies are required for ChatSpark to securely verify your identity as you use the application. We do not use tracking or advertising cookies."
      }
    ]
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact Us",
    content: [
      {
        subtitle: "Questions and Requests",
        text: "If you have any questions about this Privacy Policy, the ChatSpark service, or if you would like to request account deletion, please contact:\n\nAshish Kumar\nEmail: ashishk.codes@gmail.com"
      }
    ]
  }
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
              <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">ChatSpark</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-secondary/30 to-background px-6 py-16 text-center md:py-24">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: May 30, 2026
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            At ChatSpark, we take your privacy seriously. ChatSpark is a real-time messaging application that allows users to engage in one-to-one conversations and share code snippets with syntax highlighting. This policy explains what information we collect, how we use it solely to provide the messaging service, and how your conversations are protected using AES-256-GCM encryption at rest and HTTPS/TLS encryption in transit.
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <nav className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Table of Contents
          </h2>
          <div className="grid gap-2 md:grid-cols-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground transition-all hover:bg-secondary"
              >
                <section.icon className="h-4 w-4 text-primary" />
                {section.title}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 pb-16">
        <div className="space-y-12">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 md:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              </div>
              <div className="space-y-6">
                {section.content.map((item, index) => (
                  <div key={index}>
                     <h3 className="mb-2 font-medium text-foreground">{item.subtitle}</h3>
                     <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            By using ChatSpark, you agree to the collection and use of information in accordance with this policy.
            If you have any questions, please{" "}
            <a href="mailto:ashishk.codes@gmail.com" className="text-primary hover:underline">
              contact us
            </a>.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} ChatSpark. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/privacy" className="text-primary">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
