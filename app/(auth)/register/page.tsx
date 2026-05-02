import { RegisterForm } from "@/components/auth/register-form"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Create an Account | Acme Inc.",
  description: "Join our enterprise e-commerce platform.",
}

export default function RegisterPage() {
  return (
    <div className="animate-slide-up-fade">
      <Suspense fallback={<div>Loading form...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
