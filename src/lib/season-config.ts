// Centralized season configuration for easy future rebrands
// Only copy, colors, and dates should change between seasons

export const CURRENT_SEASON = {
  name: "Valentine's",
  year: "'26",
  label: "VALENTINE'S '26",
  tagline: "Thoughtful gifts from small brands",
  countdownPrefix: "Valentine's Pop-Up",
  
  // Hero copy
  headline: "PopUp Lane",
  subheadline: "A seasonal digital pop-up for thoughtful gifts from small brands — curated, limited, and made to be discovered.",
  supportingLine: "We open soon. Early visitors get first access to Valentine's drops you won't find buried under ads.",
  livePill: "We're Live!",
  
  // CTAs
  primaryCTA: "Get Early Access",
  secondaryCTA: "Brands: Join the Valentine's Lane",
  shopCTA: "Shop Now",
  
  // Micro-copy
  microCopy: "Seasonal pop-ups. Limited drops. Real brands.",
  
  // Lane view
  laneLabel: "Valentine's Pop-Up Season",
  laneDescription: "Discover thoughtful Valentine's gifts from indie brands. Shop limited-time offers. Support founders.",
  laneClosedDescription: "The Valentine's Lane is currently closed. Sign up to be notified when we reopen.",
} as const;

export type SeasonConfig = typeof CURRENT_SEASON;
