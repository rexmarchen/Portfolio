export type VideoItem = {
  id: string;
  title: string;
  category: string;
  clientType: string;
  video: string;
  poster: string;
  featured: boolean;
  type?: "motion" | "reel";
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
  "socials": {
    "email": "mailto:anshuar9065@gmail.com",
    "instagram": "https://www.instagram.com/anshu_.zo?igsh=bDlsZ3RiZzVqZGRw",
    "whatsapp": "https://wa.me/919317932859"
  },
  "videos": [
    {
      "id": "cinematic-brand-film",
      "title": "Cinematic Brand Film",
      "category": "Commercial ",
      "clientType": "Brands",
      "video": "/videos/updated-editing.mov",
      "poster": "",
      "featured": true,
      "type": "motion"
    },
    {
      "id": "motion-launch",
      "title": "Motion Launch Visuals",
      "category": "Motion Graphics",
      "clientType": "Product Teams",
      "video": "/videos/WhatsApp_Video_2026-06-07_at_9.26.45_PM.mp4",
      "poster": "",
      "featured": true,
      "type": "motion"
    },
    {
      "id": "reels-pack",
      "title": "High-Retention Reels Pack",
      "category": "Short Form",
      "clientType": "Creators",
      "video": "/videos/WhatsApp_Video_2026-06-08_at_7.13.49_PM.mp4",
      "poster": "",
      "featured": true,
      "type": "motion"
    },
    {
      "id": "thumbnail-breakdown",
      "title": "Thumbnail Breakdown",
      "category": "Creator System",
      "clientType": "YouTube",
      "video": "",
      "poster": "",
      "featured": false,
      "type": "reel"
    },
    {
      "id": "edit-1781270575793",
      "title": "motion for reel",
      "category": "motion graphics for reel",
      "clientType": "content creator",
      "video": "/videos/editing_day_555.mp4",
      "poster": "",
      "featured": true,
      "type": "motion"
    },
    {
      "id": "social-ad-campaign",
      "title": "Social Ad Campaign",
      "category": "motivation ",
      "clientType": "E-commerce",
      "video": "/videos/edit_day_5.mp4",
      "poster": "",
      "featured": true,
      "type": "motion"
    },
    {
      "id": "product-3d-visual",
      "title": "Product 3D Visuals",
      "category": "Motion Graphics",
      "clientType": "Tech Brands",
      "video": "",
      "poster": "",
      "featured": true,
      "type": "motion"
    },
    {
      "id": "edit-1782293190143",
      "title": "Insta Reel ",
      "category": "comedy",
      "clientType": "",
      "video": "/videos/0624_1_.mp4",
      "poster": "",
      "featured": true,
      "type": "reel"
    },
    {
      "id": "edit-1782293191772",
      "title": "New Client Edit",
      "category": "Video Edit",
      "clientType": "Client",
      "video": "",
      "poster": "",
      "featured": true,
      "type": "reel"
    }
  ],
  "brand": "REXEDITZZ",
  "studioTag": "Video Editing / Motion Graphics / Ad Creatives",
  "headline": "Premium edits built to make clients stop scrolling.",
  "subheadline": "Cinematic reels, launch visuals, motion graphics, thumbnails, and brand edits crafted for creators, brands, and agencies.",
  "availability": "Open for premium client work",
  "location": "Remote worldwide",
  "email": "anshuar9065@gmail.com",
  "instagram": "https://www.instagram.com/anshu_.zo?igsh=bDlsZ3RiZzVqZGRw",
  "whatsapp": "https://wa.me/919317932859"
};
