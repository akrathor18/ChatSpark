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
        text: "By accessing or using ChatSpark, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service."
      },
      {
        text: "These Terms apply to all visitors, users, and others who access or use ChatSpark. We reserve the right to update or modify these Terms at any time without prior notice."
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
        text: "You must be at least 13 years old to use ChatSpark. By creating an account, you represent that you meet this age requirement and that all information you provide is accurate and complete."
      },
      {
        subtitle: "Account Security",
        text: "You are responsible for maintaining the security of your account and password. ChatSpark cannot and will not be liable for any loss or damage from your failure to comply with this security obligation."
      },
      {
        subtitle: "One Person, One Account",
        text: "Each user may maintain only one account. Creating multiple accounts may result in termination of all accounts."
      },
      {
        subtitle: "Account Transfer",
        text: "You may not transfer your account to another person without our written consent."
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
        text: "You may use ChatSpark for lawful purposes only. You agree to use the service in compliance with all applicable local, state, national, and international laws and regulations."
      },
      {
        subtitle: "Prohibited Activities",
        text: "You agree not to: (a) use the service for any unlawful purpose; (b) harass, abuse, or harm others; (c) send spam or unsolicited messages; (d) impersonate others; (e) interfere with or disrupt the service; (f) attempt to gain unauthorized access to any systems; (g) upload malicious code or viruses."
      },
      {
        subtitle: "Content Standards",
        text: "You are solely responsible for all content you send through ChatSpark. Content must not be illegal, threatening, defamatory, obscene, or otherwise objectionable."
      }
    ]
  },
  {
    id: "intellectual-property",
    icon: Shield,
    title: "Intellectual Property",
    content: [
      {
        subtitle: "Our Rights",
        text: "ChatSpark and its original content, features, and functionality are owned by ChatSpark and are protected by international copyright, trademark, and other intellectual property laws."
      },
      {
        subtitle: "Your Content",
        text: "You retain ownership of content you create and share through ChatSpark. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with providing the service."
      },
      {
        subtitle: "Feedback",
        text: "Any feedback, suggestions, or ideas you provide about ChatSpark may be used by us without any obligation to compensate you."
      }
    ]
  },
  {
    id: "privacy",
    icon: Shield,
    title: "Privacy and Data",
    content: [
      {
        text: "Your privacy is important to us. Please review our Privacy Policy, which also governs your use of ChatSpark, to understand our practices regarding the collection and use of your personal information."
      },
      {
        subtitle: "Data Processing",
        text: "By using ChatSpark, you consent to the collection, processing, and storage of your data as described in our Privacy Policy."
      }
    ]
  },
  {
    id: "termination",
    icon: AlertTriangle,
    title: "Termination",
    content: [
      {
        subtitle: "By You",
        text: "You may terminate your account at any time by deleting it through your account settings. Upon termination, your right to use the service will immediately cease."
      },
      {
        subtitle: "By Us",
        text: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms."
      },
      {
        subtitle: "Effect of Termination",
        text: "Upon termination, all provisions of these Terms which by their nature should survive will survive, including ownership provisions, warranty disclaimers, and limitations of liability."
      }
    ]
  },
  {
    id: "disclaimers",
    icon: Scale,
    title: "Disclaimers and Limitations",
    content: [
      {
        subtitle: "Service Provided \"As Is\"",
        text: "ChatSpark is provided on an \"as is\" and \"as available\" basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement."
      },
      {
        subtitle: "No Guarantee",
        text: "We do not guarantee that the service will be uninterrupted, timely, secure, or error-free. We do not guarantee any specific results from the use of the service."
      },
      {
        subtitle: "Limitation of Liability",
        text: "In no event shall ChatSpark, its directors, employees, partners, or suppliers be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses."
      }
    ]
  },
  {
    id: "changes",
    icon: RefreshCw,
    title: "Changes to Terms",
    content: [
      {
        text: "We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect."
      },
      {
        text: "By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the service."
      }
    ]
  },
  {
    id: "governing-law",
    icon: Gavel,
    title: "Governing Law",
    content: [
      {
        text: "These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions."
      },
      {
        text: "Any disputes arising out of or relating to these Terms or the service shall be resolved exclusively in the state or federal courts located in San Francisco, California."
      }
    ]
  }
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
            Last updated: March 27, 2026
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Please read these Terms of Service carefully before using ChatSpark.
            By using our service, you agree to be bound by these terms.
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
              You must be 13+ years old to use ChatSpark
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              Be respectful and follow our community guidelines
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              You own your content, but give us license to display it
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              We can terminate accounts that violate these terms
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

        {/* Contact */}
        <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-center">
          <h3 className="mb-2 font-semibold text-foreground">Questions about our Terms?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            If you have any questions about these Terms of Service, please contact us.
          </p>
          <a
            href="mailto:legal@chatspark.app"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
          >
            Contact Legal Team
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>&copy; 2026 ChatSpark. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-primary">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
