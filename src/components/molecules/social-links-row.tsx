import { Instagram, Linkedin, Youtube, MessageCircle, Globe } from "lucide-react";
import type { SocialLinks } from "@/lib/types";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.6 5.82c-.7-.76-1.09-1.75-1.09-2.82h-3.05v13.44a2.6 2.6 0 1 1-1.83-2.48V10.9a5.63 5.63 0 1 0 4.88 5.58V9.4a7.15 7.15 0 0 0 4.19 1.34V7.7a4.16 4.16 0 0 1-3.1-1.88z" />
    </svg>
  );
}

const PLATFORMS: Array<{ key: keyof SocialLinks; icon: React.ElementType; color: string; label: string; hrefPrefix?: string }> = [
  { key: "whatsapp", icon: MessageCircle, color: "hover:text-[#25D366]", label: "WhatsApp", hrefPrefix: "https://wa.me/" },
  { key: "instagram", icon: Instagram, color: "hover:text-[#E1306C]", label: "Instagram" },
  { key: "linkedin", icon: Linkedin, color: "hover:text-[#0A66C2]", label: "LinkedIn" },
  { key: "youtube", icon: Youtube, color: "hover:text-[#FF0000]", label: "YouTube" },
  { key: "tiktok", icon: TikTokIcon, color: "hover:text-foreground", label: "TikTok" },
  { key: "website", icon: Globe, color: "hover:text-primary", label: "Sitio web" },
];

export function SocialLinksRow({ social }: { social: SocialLinks }) {
  const active = PLATFORMS.filter((p) => social[p.key]);
  if (active.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {active.map((p) => {
        const Icon = p.icon;
        return (
          <a
            key={p.key}
            href={p.hrefPrefix ? `${p.hrefPrefix}${social[p.key]}` : "#"}
            target="_blank"
            rel="noreferrer"
            title={`${p.label}: ${social[p.key]}`}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition-colors ${p.color}`}
          >
            <Icon size={17} />
          </a>
        );
      })}
    </div>
  );
}
