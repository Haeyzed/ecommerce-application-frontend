import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Set New Password | Acme Inc.",
  description: "Create a new password for your account.",
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams

  // Extract token and email from the Laravel reset link query string
  const token = typeof params.token === "string" ? params.token : ""
  const email = typeof params.email === "string" ? params.email : ""

  return (
    <div className="animate-slide-up-fade">
      <ResetPasswordForm token={token} email={email} />
    </div>
  )
}