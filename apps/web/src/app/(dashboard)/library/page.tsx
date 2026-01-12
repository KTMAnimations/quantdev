import { LibraryBrowser } from "@/components/library/LibraryBrowser";

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

      <LibraryBrowser />
    </div>
  );
}
