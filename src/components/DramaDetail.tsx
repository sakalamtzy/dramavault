import { Clock, Globe, Film, Play, Bookmark, Share2 } from "lucide-react";
import StarRating from "./StarRating";
import type { Drama, CastMember } from "../data/dramas";

interface Props {
  drama: Drama;
  cast: CastMember[];
  onBack: () => void;
  onCastClick: (id: number) => void;
  onWatch: (id: number, episode: number) => void;
}

export default function DramaDetail({ drama, cast, onCastClick, onWatch }: Props) {
  const hasImage = drama.image && drama.image.trim() !== "";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top section */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-10">
        {/* Poster */}
        <div className="shrink-0">
          <div className="w-36 h-52 sm:w-44 sm:h-64 rounded-md overflow-hidden border border-[#D4AF37]/20 shadow-lg">
            {hasImage ? (
              <img
                src={drama.image}
                alt={drama.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${drama.color} flex items-center justify-center relative`}>
                <div className="w-16 h-16 border border-white/20 rounded-full opacity-30" />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-[#C41E3A] text-white rounded-sm">
                {drama.type}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-medium tracking-wider rounded-sm ${
                drama.status === "Airing"
                  ? "bg-green-900/50 text-green-400 border border-green-500/30"
                  : "bg-[#1B2A4A]/50 text-gray-400 border border-[#D4AF37]/10"
              }`}>
                {drama.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{drama.title}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <StarRating rating={drama.rating} />
            <span className="text-[#D4AF37] font-bold text-lg">{drama.rating}</span>
            <span className="text-gray-500 text-xs">({drama.ratingCount.toLocaleString()} ratings)</span>
          </div>

          {/* Quick info */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5 text-gray-400">
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              {drama.country}
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
              {drama.year}
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              {drama.episodes} {drama.episodes === 1 ? "episode" : "episodes"}
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {drama.genres.map((g) => (
              <span key={g} className="px-2.5 py-0.5 text-[11px] font-medium text-[#D4AF37] border border-[#D4AF37]/25 rounded-full">
                {g}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={() => onWatch(drama.id, 1)}
              className="flex items-center gap-2 bg-[#C41E3A] hover:bg-[#C41E3A]/90 text-white px-6 py-2.5 rounded-sm text-sm font-medium tracking-wide transition-all cursor-pointer shadow-lg shadow-[#C41E3A]/10"
            >
              <Play className="w-4 h-4" fill="white" />
              Watch Now
            </button>
            <button className="flex items-center gap-2 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 px-5 py-2.5 rounded-sm text-sm font-medium tracking-wide transition-all cursor-pointer">
              <Bookmark className="w-4 h-4" />
              Watchlist
            </button>
            <button className="flex items-center gap-2 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 px-5 py-2.5 rounded-sm text-sm font-medium tracking-wide transition-all cursor-pointer">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Synopsis */}
      <div className="mb-10">
        <h2 className="text-[#D4AF37] text-[11px] font-bold tracking-[0.15em] uppercase mb-3">Synopsis</h2>
        <p className="text-gray-300 leading-relaxed text-sm">{drama.synopsis}</p>
      </div>

      {/* Cast */}
      {cast.length > 0 && (
        <div>
          <h2 className="text-[#C41E3A] text-[11px] font-bold tracking-[0.15em] uppercase mb-4">Cast</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cast.map((member) => {
              const hasPhoto = member.photo && member.photo.trim() !== "";
              return (
                <button
                  key={member.id}
                  onClick={() => onCastClick(member.id)}
                  className="group flex items-center gap-4 p-3 bg-[#0F0F0F] border border-white/5 rounded-md hover:border-[#D4AF37]/25 transition-all cursor-pointer text-left"
                >
                  <div className="w-12 h-12 rounded-full shrink-0 border border-[#D4AF37]/15 overflow-hidden">
                    {hasPhoto ? (
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#C41E3A] to-[#1B2A4A] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{member.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm group-hover:text-[#D4AF37] transition-colors truncate">
                      {member.name}
                    </p>
                    <p className="text-gray-500 text-xs truncate">{member.nationality} · {member.gender}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
