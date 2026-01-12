import { Card, CardContent } from "@/components/ui/card";

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Strategy Library
        </h1>
        <p className="text-text-secondary">
          Browse and save strategies and indicators.
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="text-text-secondary">
            Prisma models + browse UI comes next.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

