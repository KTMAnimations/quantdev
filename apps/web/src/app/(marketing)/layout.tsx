import { Navbar } from "@/components/Navbar";
import { FloatingFormulas } from "@/components/landing/FloatingFormulas";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-qp-bg-primary text-qp-text-primary">
      <Navbar />
      <FloatingFormulas />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

