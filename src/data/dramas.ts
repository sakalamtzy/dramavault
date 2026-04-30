// ═══════════════════════════════════════════════════════════
//  DRAMAVAULT — CONTENT DATABASE
//  Edit this file to add/remove dramas and cast members.
//  Push to GitHub → Vercel auto-deploys in 30 seconds.
// ═══════════════════════════════════════════════════════════

export interface VideoEpisode {
  number: number;
  title: string;
  videoUrl: string; // YouTube, Vimeo, or direct MP4 link
  duration: string;
}

export interface CastMember {
  id: number;
  name: string;
  nationality: string;
  birthdate: string;
  gender: string;
  description: string;
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
  videoEpisodes: VideoEpisode[];
}

// ─── CAST MEMBERS ───────────────────────────────────────────
// Add your cast members here
export const castMembers: CastMember[] = [
  // ────── COPY & PASTE THIS TEMPLATE ──────
  {
    id: 1,
    name: "Li Keyi",
    nationality: "Chinese",
    birthdate: "December 13, 2000",
    gender: "Female",
    description: "Write a short biography about this person...",
  },
  // ─────────────────────────────────────────
];

// ─── DRAMAS ─────────────────────────────────────────────────
// Add your dramas, movies, TV series, short plays here
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
    synopsis: "In order to get her mother's company back, Shen Celadon transformed herself from a mysterious killer disguised as a weak and helpless young white flower! As agreed, she married Xi Xingye. At first glance, Xi Xingye was amazed by Shen Celadon's small white flower appearance. As they got along more and more, he fell deeper and deeper into the mysterious and powerful Shen Celadon",
    castIds: [1],                  // e.g. [1, 2] to link to cast members
    episodes: 69,
    status: "Completed",          // "Completed" | "Airing"
    color: "from-red-900 via-rose-800 to-red-950",
    videoEpisodes: [
    {
      number: 1,
      title: "Episode 1",
      videoUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
      duration: "1:05:30",
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

export type VideoType = "direct" | "youtube" | "vimeo" | "embed";

export function detectVideoType(url: string): VideoType {
  if (url.match(/\.(mp4|webm|ogg|m3u8)(\?|$)/i)) return "direct";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  return "embed";
}

export function toEmbedUrl(url: string): string {
  let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;

  match = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;

  if (url.includes("youtube.com/embed/")) return url;

  match = url.match(/vimeo\.com\/(\d+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;

  return url;
}

// ─── COLOR OPTIONS ──────────────────────────────────────────
// Pick one for the "color" field:
//
//   "from-red-900 via-rose-800 to-red-950"          🔴 Red
//   "from-blue-900 via-slate-800 to-blue-950"       🔵 Blue
//   "from-emerald-900 via-green-900 to-teal-950"    🟢 Green
//   "from-purple-900 via-violet-900 to-purple-950"  🟣 Purple
//   "from-amber-900 via-yellow-900 to-amber-950"    🟡 Gold
//   "from-pink-900 via-rose-900 to-red-950"         🩷 Pink
//   "from-indigo-900 via-blue-900 to-violet-950"    🔵 Indigo
//   "from-teal-900 via-cyan-900 to-blue-950"        🔵 Teal
//   "from-stone-800 via-zinc-800 to-neutral-900"    ⬛ Dark
//   "from-sky-900 via-teal-900 to-cyan-950"         🔵 Sky
//   "from-fuchsia-900 via-pink-900 to-rose-950"     🩷 Fuchsia
//   "from-yellow-900 via-amber-900 to-orange-950"   🟠 Orange
//   "from-violet-900 via-indigo-900 to-blue-950"    🟣 Violet
//   "from-gray-800 via-slate-800 to-zinc-900"       ⬛ Gray
