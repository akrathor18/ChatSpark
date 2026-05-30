"use client"

import Link from "next/link"
import { Sparkles, ArrowLeft, FileText, Users, MessageSquare, Shield, AlertTriangle, Scale, RefreshCw, Gavel } from "lucide-react"

const sections = [
  {
    id: "acceptance",
    icon: FileText,
    title: "Acceptance of Terms",
    content: [
      {
        subtitle: "",
        text: "By accessing or using ChatSpark (the \"Service\"), a real-time messaging and code-sharing platform, you agree to be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using the Service."
      },
      {
        subtitle: "",
        text: "We reserve the right to update or modify these Terms at any time. Your continued use of ChatSpark after changes are posted constitutes your acceptance of the revised Terms."
      }
    ]
  },
  {
    id: "account-terms",
    icon: Users,
    title: "Account Terms",
    content: [
      {
        subtitle: "Account Creation",
        text: "You may create an account using Email/Password, Google OAuth, or GitHub OAuth. You are responsible for ensuring that the information you provide during registration is accurate."
      },
      {
        subtitle: "Account Security",
        text: "You are responsible for maintaining the security of your account credentials. ChatSpark cannot and will not be liable for any loss or damage resulting from your failure to protect your login information."
      }
    ]
  },
  {
    id: "acceptable-use",
    icon: MessageSquare,
    title: "Acceptable Use",
    content: [
      {
        subtitle: "Permitted Use",
        text: "You may use ChatSpark for lawful, one-to-one messaging and code sharing purposes only."
      },
      {
        subtitle: "Prohibited Activities",
        text: "You agree not to: (a) use the service for any unlawful purpose; (b) harass, abuse, or harm others; (c) send spam or unsolicited messages; (d) attempt to gain unauthorized access to our WebSocket servers, database, or other users' accounts; or (e) distribute malicious code or viruses."
      },
      {
        subtitle: "Content Standards",
        text: "You are solely responsible for all messages and code snippets you send through ChatSpark. Content must not be illegal, threatening, or designed to exploit vulnerabilities in the platform."
      }
    ]
  },
  {
    id: "intellectual-property",
    icon: Shield,
    title: "Intellectual Property and Content",
    content: [
      {
        subtitle: "Our Rights",
        text: "The ChatSpark application, including its source code, UI/UX, and underlying infrastructure, is owned by ChatSpark and protected by intellectual property laws."
      },
      {
        subtitle: "Your Messages and Code Snippets",
        text: "You retain ownership of the messages and code snippets you share through ChatSpark. By sending messages, you grant us a limited license to store, encrypt (via AES-256-GCM), and display your content solely for the purpose of operating the messaging service and delivering your messages to the intended recipient."
      }
    ]
  },
  {
    id: "termination",
    icon: AlertTriangle,
    title: "Suspension and Termination",
    content: [
      {
        subtitle: "By You",
        text: "You may stop using ChatSpark at any time. You can request full account deletion by contacting us, which will permanently remove your user data and messages from our active database."
      },
      {
        subtitle: "By Us",
        text: "We reserve the right to suspend or terminate your access to ChatSpark at any time, without prior notice, if we believe you have violated these Terms or are using the service maliciously."
      }
    ]
  },
  {
    id: "service-availability",
    icon: RefreshCw,
    title: "Service Availability",
    content: [
      {
        subtitle: "As Is / As Available",
        text: "ChatSpark is provided on an \"as is\" and \"as available\" basis. We do not offer Service Level Agreements (SLAs), guaranteed uptime, or guarantee that the service will be entirely error-free."
      },
      {
        subtitle: "Maintenance and Outages",
        text: "The real-time messaging service, MongoDB database, or underlying APIs may experience temporary outages for maintenance or due to unforeseen technical issues. We are not liable for any disruption in service or message delivery delays."
      }
    ]
  },
  {
    id: "disclaimers",
    icon: Scale,
    title: "Limitation of Liability",
    content: [
      {
        subtitle: "",
        text: "In no event shall ChatSpark or its operators be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data or profits, arising out of your use of or inability to use the Service."
      }
    ]
  },
]

export default function TermsOfServicePage() {
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
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: May 30, 2026
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Please read these Terms of Service carefully before using ChatSpark, a real-time messaging application for one-to-one conversations and code snippet sharing. By using our service, you agree to be bound by these terms.
          </p>
        </div>
      </section>

      {/* Quick Summary */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Quick Summary
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              Use ChatSpark for lawful, one-to-one messaging and code sharing
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              You own your messages, but give us a limited license to store and transmit them
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              We do not provide guaranteed uptime or Service Level Agreements (SLAs)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              We can suspend accounts that violate these terms or act maliciously
            </li>
          </ul>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="mx-auto max-w-4xl px-6 pb-8">
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
          {sections.map((section, sectionIndex) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 md:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Section {sectionIndex + 1}</span>
                  <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                </div>
              </div>
              <div className="space-y-6">
                {section.content.map((item, index) => (
                  <div key={index}>
                    {item.subtitle && (
                      <h3 className="mb-2 font-medium text-foreground">{item.subtitle}</h3>
                    )}
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} ChatSpark. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-primary">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
