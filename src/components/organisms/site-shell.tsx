import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}
