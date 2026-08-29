import { Suspense } from "react";
import { AuthForm } from "@/components/trico/auth-form";
import { getAuthFlags } from "@/lib/modules/auth/config";

export const metadata = {
  title: "Entrar",
};

export default function EntrarPage() {
  const flags = getAuthFlags();
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center text-navy/60">
          A carregar…
        </div>
      }
    >
      <AuthForm
        googleEnabled={flags.google}
        appleEnabled={flags.apple}
        emailEnabled={flags.email}
      />
    </Suspense>
  );
}
