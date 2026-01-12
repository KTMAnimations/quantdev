import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SubscribePage() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold">Subscribe</h1>
          <p className="text-qp-text-secondary">
            Pricing is not implemented yet. This page is a placeholder to match
            QuantPad’s routing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-qp-bg-secondary border-qp-border">
            <CardContent className="p-8 space-y-4">
              <div className="text-lg font-semibold">Free</div>
              <div className="text-qp-text-secondary text-sm">
                Explore the workflow and run sample analyses.
              </div>
              <Button asChild className="w-full bg-qp-violet hover:bg-qp-violet-dark">
                <Link href="/sign-up">Get started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-qp-bg-secondary border-qp-border">
            <CardContent className="p-8 space-y-4">
              <div className="text-lg font-semibold">Pro</div>
              <div className="text-qp-text-secondary text-sm">
                Stripe billing coming next (per recreation guide).
              </div>
              <Button className="w-full" disabled>
                Coming soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

