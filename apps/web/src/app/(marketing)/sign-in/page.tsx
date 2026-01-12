import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-24">
      <Card className="w-full max-w-md bg-qp-bg-secondary border-qp-border">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-qp-text-primary">
              Sign in
            </h1>
            <p className="text-sm text-qp-text-secondary">
              Continue to the OpenQuant workspace.
            </p>
          </div>

          <SignInForm />

          <div className="text-sm text-qp-text-secondary">
            New here?{" "}
            <Link className="text-qp-violet hover:underline" href="/sign-up">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

