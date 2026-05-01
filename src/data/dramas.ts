// ═══════════════════════════════════════════════════════════
//  DRAMAVAULT — YOUR CONTENT DATABASE
//  Edit this file to add/remove dramas and cast members.
//  Then: git add . → git commit -m "message" → git push
// ═══════════════════════════════════════════════════════════

export interface VideoEpisode {
  season: number;     // season number, e.g. 1
  number: number;     // episode number, e.g. 1
  title: string;
  videoUrl: string;
  duration: string;
}

export interface CastMember {
  id: number;
  name: string;
  nationality: string;
  birthdate: string;
  gender: string;
  description: string;
  photo: string; // image URL e.g. "https://i.imgur.com/xxxxx.jpg"
}

export interface Drama {
  id: number;
  title: string;
  type: "Movie" | "TV Series" | "Short Play";
  year: number;
  country: string;
  genres: string[];
  rating: number;
  ratingCount: number;
  synopsis: string;
  castIds: number[];
  episodes: number;
  status: string;
  color: string;
  image: string; // poster image URL e.g. "https://i.imgur.com/xxxxx.jpg"
  videoEpisodes: VideoEpisode[];
}

// ─── CAST MEMBERS ───────────────────────────────────────────
export const castMembers: CastMember[] = [
  {
    id: 1,
    name: "Li Keyi",
    nationality: "Chinese",
    birthdate: "December 13, 2000",
    gender: "Female",
    description: "Li Keyi, a Chinese actress. Born on December 13, 2000 in Luoyang, Henan, Sagittarius.",
    photo: "https://image.tmdb.org/t/p/original/jG9115Hmq6XwXDKbQeuQsrou41v.jpg", // paste image URL here, e.g. "https://i.imgur.com/xxxxx.jpg"
  },
];

// ─── DRAMAS ─────────────────────────────────────────────────
// ⚠️ Add at least one drama with castIds: [1] so Li Keyi shows up!
export const dramas: Drama[] = [
  // ────── COPY & PASTE THIS TEMPLATE ──────
   {
     id: 1,
     title: "Wrapped the Playboy Around My Finger",
     type: "Short Play",            // "Movie" | "TV Series" | "Short Play"
     year: 2025,
     country: "China",
     genres: ["Romance", "Comedy"],
     rating: 8.3,                  // 1.0 to 10.0
     ratingCount: 12000,
     synopsis: "To reclaim her mother’s company, Shen Qing Ci transforms herself from a mysterious assassin into a seemingly aloof and innocent “white flower.” According to the agreement, she enters a flash marriage with Xi Xing Ye. At their first meeting, Xi Xing Ye is stunned by Shen Qing Ci’s delicate appearance, and as they spend more time together, he falls ever deeper for the mysterious and powerful woman behind the façade.",
     castIds: [1],                  // e.g. [1, 2] to link to cast members
     episodes: 69,
     status: "Completed",          // "Completed" | "Airing"
     color: "from-red-900 via-rose-800 to-red-950",
     image: "https://image.tmdb.org/t/p/w1280/17M32lvVjkxf6SV5UWg0hepkCNc.jpg",                    // poster image URL
     videoEpisodes: [
       {
         season: 1,       // season number
         number: 1,       // episode number
         title: "Full Episode",
         videoUrl: "https://msacdn.hakunaymatata.com/flickReel/6117e9ca468f24b5d2fe5bd4b8256928.mp4?Expires=1778224643&Signature=RsfEo3A47Xuv~gt1fBWPo7bZjgLt54Ox9TE31yz3YYPcZM8JjG1pd7yLBSOmqyhQ23bLBBKzAiiQ7aPszxoC5TDuoph4lxMs181d7DcX2amhaEmKmgc-kZ8PQKv5JXr18b81fzI2xmzGOeeiBUejqPWBz-aotdnLjElK38JEMQQ4Epz7vNktGSFyjWuWE8mn7S~33RInB371Gy0mabhQNLLp2DdQbCjqUNTUSKVEmtRb2OG9Yz0e-MlZbC4D1hg9QVRnaH133qRk1EJME-iP6PZmtqPui3MSTRSb2WnAq4fRByJooAx8nEGeIOP-Xf5tgctaTL0kSO0ILpuncl3AdA__&Key-Pair-Id=KMHN1LQ1HEUPL" // "https://rumble.com/embed/v6vlomi/?pub=4",
         duration: "1:43:15",
       },
     ],
   },
  // ─────────────────────────────────────────
  {
     id: 2,
     title: "Wrapped the Playboy Around My Finger Season 2",
     type: "Short Play",            // "Movie" | "TV Series" | "Short Play"
     year: 2025,
     country: "China",
     genres: ["Romance", "Comedy"],
     rating: 8.0,                  // 1.0 to 10.0
     ratingCount: 12000,
     synopsis: "An enigmatic powerhouse enters a flash marriage with the most notorious playboy in the capital, determined to reclaim her late mother’s company. Within a year, the groom’s influential grandfather falls critically ill, plunging the prestigious family into turmoil.",
     castIds: [1],                  // e.g. [1, 2] to link to cast members
     episodes: 79,
     status: "Completed",          // "Completed" | "Airing"
     color: "from-red-900 via-rose-800 to-red-950",
     image: "https://preview.redd.it/wrapped-the-playboy-around-my-finger-season-2-v0-mpbasidj213g1.jpeg?auto=webp&s=e242cffda40a9841a6ffed0f844e5164e32771f5",                    // poster image URL
     videoEpisodes: [
       {
         season: 2,       // season number
         number: 1,       // episode number
         title: "Full Episode",
         videoUrl: "https://embed.reely.live/embed?v=32dabeba-b2c6-484b-b199-4e2859546510",
         duration: "2:26:36",
       },
     ],
   },
  // ─────────────────────────────────────────
  {
     id: 3,
     title: "Snatching A Playboy Husband",
     type: "Short Play",            // "Movie" | "TV Series" | "Short Play"
     year: 2025,
     country: "China",
     genres: ["Romance", "Comedy"],
     rating: 8.2,                  // 1.0 to 10.0
     ratingCount: 12000,
     synopsis: "In a twist of fate, she awakens on the very day of her wedding—only to find herself reborn into a life she once fled. The man who once dared to steal her heart in a reckless jest now stands before her once more: the infamous heir of the capital, a man known not for honor, but for his wild nights, gambling dens, and whispered scandals.",
     castIds: [1],                  // e.g. [1, 2] to link to cast members
     episodes: 79,
     status: "Completed",          // "Completed" | "Airing"
     color: "from-red-900 via-rose-800 to-red-950",
     image: "https://zshipubcdn.farsunpteltd.com/playlet/1766741588_nfJ72pD7Pa.jpg?x-oss-process=image/resize,w_400,image/format,webp",                    // poster image URL
     videoEpisodes: [
       {
         season: 3,       // season number
         number: 1,       // episode number
         title: "Full Episode",
         videoUrl: "https://embed.reely.live/embed?v=003ad3dc-accd-48ba-a303-35f765699405",
         duration: "2:26:36",
       },
     ],
   },
  // ─────────────────────────────────────────
];

// ─── HELPERS (do not edit below) ────────────────────────────

export function getCastById(id: number): CastMember | undefined {
  return castMembers.find((c) => c.id === id);
}

export function getCastWorks(castId: number): Drama[] {
  return dramas
    .filter((d) => d.castIds.includes(castId))
    .sort((a, b) => b.year - a.year);
}

export type VideoType = "direct" | "hls" | "youtube" | "vimeo" | "rumble" | "embed";

export function detectVideoType(url: string): VideoType {
  if (url.match(/\.m3u8(\?|$)/i)) return "hls";
  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) return "direct";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.includes("rumble.com")) return "rumble";
  return "embed";
}

export function toEmbedUrl(url: string): string {
  // YouTube
  let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;

  match = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;

  if (url.includes("youtube.com/embed/")) return url;

  // Vimeo
  match = url.match(/vimeo\.com\/(\d+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;

  // Rumble — already an embed URL
  if (url.includes("rumble.com/embed/")) return url;

  // Rumble — regular page → can't auto-convert, use as-is
  if (url.includes("rumble.com")) return url;

  return url;
}
