import { CentralAuthProvider } from "@/components/providers/central-auth-provider"

export default function CentralLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CentralAuthProvider>{children}</CentralAuthProvider>
}
