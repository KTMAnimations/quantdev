import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          </div>

          <SignInForm />

          <div className="text-sm text-text-secondary">
            New here?{" "}
            <Link className="text-accent-primary hover:underline" href="/sign-up">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
