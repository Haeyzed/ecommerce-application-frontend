import { CentralRegisterForm } from "@/components/central/auth/register-form"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Register | Central Admin",
  description: "Create a central administration account.",
}

export default function CentralRegisterPage() {
  return (
    <div className="animate-slide-up-fade">
      <Suspense fallback={<div>Loading form...</div>}>
        <CentralRegisterForm />
      </Suspense>
    </div>
  )
}
