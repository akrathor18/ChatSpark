import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to sign-in by default (or chat if authenticated)
  redirect("/sign-in")
}
