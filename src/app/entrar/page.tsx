import { AuthForm } from "@/components/trico/auth-form";
import { getAuthFlags } from "@/lib/modules/auth/config";

export const metadata = {
  title: "Entrar",
};

export default function EntrarPage() {
  const flags = getAuthFlags();
  return (
    <AuthForm googleEnabled={flags.google} appleEnabled={flags.apple} />
  );
}
