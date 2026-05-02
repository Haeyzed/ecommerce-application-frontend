import { VerificationSuccess } from "@/components/auth/verification-success"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Email Verified | Acme Inc.",
  description: "Your account has been successfully success.",
}

export default function VerificationSuccessPage() {
  return (
    <div className="animate-slide-up-fade">
      <VerificationSuccess />
    </div>
  )
}
