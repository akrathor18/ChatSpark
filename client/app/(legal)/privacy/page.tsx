"use client"

import Link from "next/link"
import { Sparkles, ArrowLeft, Shield, Lock, Eye, Database, Globe, Bell, Trash2, Mail } from "lucide-react"

const sections = [
  {
    id: "information-collection",
    icon: Database,
    title: "Information We Collect",
    content: [
      {
        subtitle: "Account Information",
        text: "When you create an account, we collect your email address, username, profile picture, and any other information you choose to provide. This information is necessary to create and maintain your ChatSpark account."
      },
      {
        subtitle: "Messages and Content",
        text: "We store the messages you send and receive through ChatSpark. Your messages are encrypted in transit and at rest. We do not read or analyze your private messages for advertising purposes."
      },
      {
        subtitle: "Usage Data",
        text: "We automatically collect information about how you use ChatSpark, including features you use, time spent in the app, and interaction patterns. This helps us improve our service."
      },
      {
        subtitle: "Device Information",
        text: "We collect information about the devices you use to access ChatSpark, including device type, operating system, browser type, and IP address."
      }
    ]
  },
  {
    id: "how-we-use",
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      {
        subtitle: "Providing Services",
        text: "We use your information to operate, maintain, and improve ChatSpark, including delivering messages, syncing conversations across devices, and providing customer support."
      },
      {
        subtitle: "Security",
        text: "We use your information to protect the security of ChatSpark, detect and prevent fraud, and enforce our terms of service."
      },
      {
        subtitle: "Communication",
        text: "We may send you service-related emails, such as account verification, security alerts, and updates about our terms and policies."
      }
    ]
  },
  {
    id: "data-sharing",
    icon: Globe,
    title: "Data Sharing and Disclosure",
    content: [
      {
        subtitle: "Third-Party Services",
        text: "We may share information with third-party service providers who help us operate ChatSpark, such as cloud hosting providers and analytics services. These providers are bound by confidentiality agreements."
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose your information if required by law, such as in response to a subpoena, court order, or other legal process."
      },
      {
        subtitle: "Business Transfers",
        text: "If ChatSpark is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction."
      }
    ]
  },
  {
    id: "data-security",
    icon: Lock,
    title: "Data Security",
    content: [
      {
        subtitle: "Encryption",
        text: "All data transmitted between your device and our servers is encrypted using TLS 1.3. Messages are encrypted at rest using AES-256 encryption."
      },
      {
        subtitle: "Access Controls",
        text: "We implement strict access controls to limit who can access your data within our organization. Access is granted on a need-to-know basis."
      },
      {
        subtitle: "Regular Audits",
        text: "We conduct regular security audits and penetration testing to identify and address potential vulnerabilities."
      }
    ]
  },
  {
    id: "your-rights",
    icon: Shield,
    title: "Your Rights and Choices",
    content: [
      {
        subtitle: "Access and Portability",
        text: "You can access and download a copy of your data at any time through your account settings. We provide your data in a machine-readable format."
      },
      {
        subtitle: "Correction",
        text: "You can update or correct your account information at any time through your profile settings."
      },
      {
        subtitle: "Deletion",
        text: "You can delete your account and all associated data at any time. Once deleted, your data cannot be recovered."
      },
      {
        subtitle: "Opt-Out",
        text: "You can opt out of non-essential communications through your notification settings. You cannot opt out of service-related communications."
      }
    ]
  },
  {
    id: "cookies",
    icon: Bell,
    title: "Cookies and Tracking",
    content: [
      {
        subtitle: "Essential Cookies",
        text: "We use essential cookies to maintain your session and remember your preferences. These cookies are necessary for ChatSpark to function properly."
      },
      {
        subtitle: "Analytics",
        text: "We use analytics tools to understand how users interact with ChatSpark. You can opt out of analytics tracking through your browser settings."
      }
    ]
  },
  {
    id: "data-retention",
    icon: Trash2,
    title: "Data Retention",
    content: [
      {
        subtitle: "Active Accounts",
        text: "We retain your data for as long as your account is active. You can delete your messages individually, or delete your entire account to remove all data."
      },
      {
        subtitle: "Inactive Accounts",
        text: "Accounts that have been inactive for more than 24 months may be deleted. We will notify you before deleting an inactive account."
      },
      {
        subtitle: "Backup Retention",
        text: "Backup copies of your data may be retained for up to 90 days after deletion for disaster recovery purposes."
      }
    ]
  },
  {
    id: "contact",
    icon: Mail,
    title: "Contact Us",
    content: [
      {
        subtitle: "Privacy Questions",
        text: "If you have questions about this Privacy Policy or our data practices, please contact us at privacy@chatspark.app."
      },
      {
        subtitle: "Data Protection Officer",
        text: "Our Data Protection Officer can be reached at dpo@chatspark.app for any privacy-related concerns."
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
            Last updated: March 27, 2026
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            At ChatSpark, we take your privacy seriously. This policy explains how we collect,
            use, and protect your personal information when you use our service.
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
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
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
            <a href="mailto:privacy@chatspark.app" className="text-primary hover:underline">
              contact us
            </a>.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>&copy; 2026 ChatSpark. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/privacy" className="text-primary">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
