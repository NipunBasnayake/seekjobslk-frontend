export const socialIconRegistry = {
  facebook: {
    label: "Facebook",
    src: "/assets/social-icons/facebook.svg",
  },
  instagram: {
    label: "Instagram",
    src: "/assets/social-icons/instagram.svg",
  },
  linkedin: {
    label: "LinkedIn",
    src: "/assets/social-icons/linkedin.svg",
  },
  twitter: {
    label: "Twitter",
    src: "/assets/social-icons/twitter.svg",
  },
  x: {
    label: "X",
    src: "/assets/social-icons/x.svg",
  },
  youtube: {
    label: "YouTube",
    src: "/assets/social-icons/youtube.svg",
  },
  tiktok: {
    label: "TikTok",
    src: "/assets/social-icons/tiktok.svg",
  },
  whatsapp: {
    label: "WhatsApp",
    src: "/assets/social-icons/whatsapp.svg",
  },
  telegram: {
    label: "Telegram",
    src: "/assets/social-icons/telegram.svg",
  },
  website: {
    label: "Website",
    src: "/assets/social-icons/website.svg",
  },
  email: {
    label: "Email",
    src: "/assets/social-icons/email.svg",
  },
  phone: {
    label: "Phone",
    src: "/assets/social-icons/phone.svg",
  },
} as const;

export type SocialIconName = keyof typeof socialIconRegistry;
