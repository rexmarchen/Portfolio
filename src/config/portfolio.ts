export type VideoItem = {
  id: string;
  title: string;
  category: string;
  clientType: string;
  video: string;
  poster: string;
  featured: boolean;
};

export type PortfolioConfig = {
  brand: string;
  studioTag: string;
  headline: string;
  subheadline: string;
  availability: string;
  location: string;
  email: string;
  instagram: string;
  whatsapp: string;
  socials: {
    instagram: string;
    whatsapp: string;
    email: string;
  };
  videos: VideoItem[];
};

export const portfolio: PortfolioConfig = {
  brand: "REXEDITZZ",
  studioTag: "Video Editing / Motion Graphics / Ad Creatives",
  headline: "Premium edits built to make clients stop scrolling.",
  subheadline:
    "Cinematic reels, launch visuals, motion graphics, thumbnails, and brand edits crafted for creators, brands, and agencies.",
  availability: "Open for premium client work",
  location: "Remote worldwide",
  email: "anshuar9065@gmail.com",
  instagram: "https://www.instagram.com/anshu_.zo?igsh=bDlsZ3RiZzVqZGRw",
  whatsapp: "https://wa.me/919317932859",
  socials: {
    instagram: "https://www.instagram.com/anshu_.zo?igsh=bDlsZ3RiZzVqZGRw",
    whatsapp: "https://wa.me/919317932859",
    email: "mailto:anshuar9065@gmail.com",
  },
  videos: [
    {
      id: "cinematic-brand-film",
      title: "Cinematic Brand Film",
      category: "Commercial Edit",
      clientType: "Brands",
      video: "/videos/updated-editing.mov",
      poster: "",
      featured: true,
    },
    {
      id: "motion-launch",
      title: "Motion Launch Visuals",
      category: "Motion Graphics",
      clientType: "Product Teams",
      video: "",
      poster: "",
      featured: true,
    },
    {
      id: "reels-pack",
      title: "High-Retention Reels Pack",
      category: "Short Form",
      clientType: "Creators",
      video: "",
      poster: "",
      featured: true,
    },
    {
      id: "social-ad-campaign",
      title: "Social Ad Campaign",
      category: "Commercial Edit",
      clientType: "E-commerce",
      video: "",
      poster: "",
      featured: true,
    },
    {
      id: "product-3d-visual",
      title: "Product 3D Visuals",
      category: "Motion Graphics",
      clientType: "Tech Brands",
      video: "",
      poster: "",
      featured: true,
    },
    {
      id: "thumbnail-breakdown",
      title: "Thumbnail Breakdown",
      category: "Creator System",
      clientType: "YouTube",
      video: "",
      poster: "",
      featured: false,
    },
    {
      id: "vlog-cinematic-intro",
      title: "Vlog Cinematic Intro",
      category: "Short Form",
      clientType: "Influencers",
      video: "",
      poster: "",
      featured: false,
    },
    {
      id: "corporate-promo-reel",
      title: "Corporate Promo Reel",
      category: "Commercial Edit",
      clientType: "Agencies",
      video: "",
      poster: "",
      featured: false,
    },
  ],
};
