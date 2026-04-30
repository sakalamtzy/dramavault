import { Clock } from "lucide-react";
import StarRating from "./StarRating";
import type { Drama } from "../data/dramas";

interface Props {
  drama: Drama;
  onClick: () => void;
}

export default function DramaCard({ drama, onClick }: Props) {
  const hasImage = drama.image && drama.image.trim() !== "";

  return (
    <button
      onClick={onClick}
      className="group text-left w-full bg-[#0F0F0F] border border-white/5 rounded-md overflow-hidden hover:border-[#D4AF37]/25 transition-all duration-200 cursor-pointer"
    >
      {/* Poster */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {hasImage ? (
          <img
            src={drama.image}
            alt={drama.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${drama.color}`} />
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="w-20 h-20 border border-white/30 rounded-full" />
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/20 to-transparent" />

        {/* Type badge */}
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-[#C41E3A] text-white rounded-sm">
          {drama.type}
        </span>

        {/* Year */}
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-medium bg-black/40 text-gray-300 rounded-sm backdrop-blur-sm">
          {drama.year}
        </span>

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5">
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
            {drama.title}
          </h3>
          <p className="text-gray-400 text-[11px] mt-1">{drama.country}</p>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <StarRating rating={drama.rating} size="sm" />
          <span className="text-[#D4AF37] font-bold text-xs">{drama.rating}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{drama.episodes} {drama.episodes === 1 ? "ep" : "eps"}</span>
          <span className="text-gray-700">·</span>
          <span>{drama.genres[0]}</span>
        </div>
      </div>
    </button>
  );
}
