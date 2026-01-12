import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-24">
      <Card className="w-full max-w-md bg-qp-bg-secondary border-qp-border">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-qp-text-primary">
              Sign up
            </h1>
            <p className="text-sm text-qp-text-secondary">
              Create your account to start building.
            </p>
          </div>

          <SignUpForm />

          <div className="text-sm text-qp-text-secondary">
            Already have an account?{" "}
            <Link className="text-qp-violet hover:underline" href="/sign-in">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

