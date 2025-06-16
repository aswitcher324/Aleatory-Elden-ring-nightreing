
import { CorsProxy } from './types';

export const FALLBACK_PAGES: string[] = [
  "Elden_Ring_Nightreign",
  "Category:Nightreign_Bosses",
  "Category:Nightreign_Characters",
  "Category:Nightreign_Enemies",
  "Category:Nightreign_Items",
  "Category:Nightreign_Locations",
  "Nightlords",
  "Nightfarer",
  "Limveld",
  "Night%27s_Tide",
  "Spectral_Hawk",
  "Garb"
];

export const EXPANDED_FALLBACK_PAGES: string[] = [
  ...FALLBACK_PAGES,
  "Category:Nightreign_Achievements",
  "Category:Nightreign_Gameplay",
  "Category:Nightreign_Images",
  "Category:Nightreign_Objects",
  "Category:Heroes",
  "Category:Nightreign_dialogue",
  "Category:Trophy_Images_-_Nightreign",
  "Nightreign_Bosses",
  "Nightreign_Characters",
  "Nightreign_Enemies",
  "Nightreign_Items",
  "Nightreign_Locations",
  "Nightreign_Achievements",
  "Nightreign_Updates",
  "Nightreign_Network_Test",
  "Nightreign_Map"
];

export const BASE_URL: string = "https://eldenring.fandom.com/wiki/";
export const CATEGORY_URL: string = "https://eldenring.fandom.com/wiki/Category:Elden_Ring_Nightreign";

export const CORS_PROXIES: CorsProxy[] = [
    { url: (targetUrl: string): string => `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`, method: 1 },
    { url: (targetUrl: string): string => `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`, method: 2, needsJsonParse: true },
    { url: (targetUrl: string): string => `https://thingproxy.freeboard.io/fetch/${targetUrl}`, method: 3 }
];
