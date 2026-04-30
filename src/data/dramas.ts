// ═══════════════════════════════════════════════════════════
//  DRAMAVAULT — YOUR CONTENT DATABASE
//  Edit this file to add/remove dramas and cast members.
//  Then: git add . → git commit -m "message" → git push
// ═══════════════════════════════════════════════════════════

export interface VideoEpisode {
  number: number;
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
    description: "Write a short biography about this person...",
    photo: "", // paste image URL here, e.g. "https://i.imgur.com/xxxxx.jpg"
  },
];

// ─── DRAMAS ─────────────────────────────────────────────────
// ⚠️ Add at least one drama with castIds: [1] so Li Keyi shows up!
export const dramas: Drama[] = [
  // ────── COPY & PASTE THIS TEMPLATE ──────
  // {
  //   id: 1,
  //   title: "Drama Title",
  //   type: "TV Series",            // "Movie" | "TV Series" | "Short Play"
  //   year: 2024,
  //   country: "South Korea",
  //   genres: ["Romance", "Comedy"],
  //   rating: 8.5,                  // 1.0 to 10.0
  //   ratingCount: 12000,
  //   synopsis: "Write your synopsis here...",
  //   castIds: [],                  // e.g. [1, 2] to link to cast members
  //   episodes: 16,
  //   status: "Completed",          // "Completed" | "Airing"
  //   color: "from-red-900 via-rose-800 to-red-950",
  //   image: "",                    // poster image URL
  //   videoEpisodes: [
  //     {
  //       number: 1,
  //       title: "Episode 1",
  //       videoUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  //       duration: "1:05:30",
  //     },
  //   ],
  // },
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

export type VideoType = "direct" | "youtube" | "vimeo" | "rumble" | "embed";

export function detectVideoType(url: string): VideoType {
  if (url.match(/\.(mp4|webm|ogg|m3u8)(\?|$)/i)) return "direct";
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
