import { SocialIcon } from "@/components/SocialIcon";
import type { SocialIconName } from "@/lib/socialIcons";

const socialLinks: Array<{ name: SocialIconName; href: string; label: string }> = [
  {
    name: "facebook",
    href: "https://www.facebook.com",
    label: "Visit our Facebook page",
  },
  {
    name: "linkedin",
    href: "https://www.linkedin.com",
    label: "Visit our LinkedIn page",
  },
  {
    name: "x",
    href: "https://x.com",
    label: "Visit our X profile",
  },
  {
    name: "instagram",
    href: "https://www.instagram.com",
    label: "Visit our Instagram profile",
  },
  {
    name: "youtube",
    href: "https://www.youtube.com",
    label: "Visit our YouTube channel",
  },
  {
    name: "telegram",
    href: "https://t.me",
    label: "Join our Telegram",
  },
];

export function ConnectWithUs() {
  return (
    <section className="ui-card p-5 sm:p-6">
      <h3 className="ui-card-title">Connect With Us</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Follow SeekJobsLk on social channels for hiring tips and daily job updates.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {socialLinks.map((socialLink) => (
          <SocialIcon
            key={socialLink.name}
            name={socialLink.name}
            href={socialLink.href}
            label={socialLink.label}
          />
        ))}
      </div>
    </section>
  );
}
