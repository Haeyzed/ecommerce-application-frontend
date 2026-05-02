import { VerifyEmailForm } from "@/components/auth/verify-email-form"
import { VerifyEmailProcessor } from "@/components/auth/verify-email-processor"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Verify Email | Acme Inc.",
  description: "Check your inbox to verify your account.",
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const params = await searchParams

  const email = typeof params.email === "string" ? params.email : ""
  const verifyUrl =
    typeof params.verify_url === "string" ? params.verify_url : ""

  return (
    <div className="animate-slide-up-fade">
      {verifyUrl ? (
        <VerifyEmailProcessor verifyUrl={verifyUrl} />
      ) : (
        <VerifyEmailForm email={email} />
      )}
    </div>
  )
}
