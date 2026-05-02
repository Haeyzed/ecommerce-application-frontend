import { LoginForm } from "@/components/auth/login-form"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Login | Acme Inc.",
  description: "Access your enterprise e-commerce dashboard-old.",
}

export default function LoginPage() {
  return (
    <div className="animate-slide-up-fade">
      <Suspense fallback={<div>Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
