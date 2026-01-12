import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>
          </div>

          <SignUpForm />

          <div className="text-sm text-text-secondary">
            Already have an account?{" "}
            <Link className="text-accent-primary hover:underline" href="/sign-in">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
