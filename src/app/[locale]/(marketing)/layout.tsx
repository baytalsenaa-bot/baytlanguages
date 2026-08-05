import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div
        aria-hidden
        className="h-1 w-full bg-gradient-to-r from-brand-red via-brand-gold to-brand-red"
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
