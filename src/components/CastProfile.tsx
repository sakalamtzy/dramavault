import { Globe, Calendar, User } from "lucide-react";
import StarRating from "./StarRating";
import type { CastMember, Drama } from "../data/dramas";

interface Props {
  person: CastMember;
  works: Drama[];
  onBack: () => void;
  onDramaClick: (id: number) => void;
}

export default function CastProfile({ person, works, onDramaClick }: Props) {
  const hasPhoto = person.photo && person.photo.trim() !== "";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row gap-6 mb-10">
        {/* Avatar */}
        <div className="shrink-0 flex justify-center sm:justify-start">
          <div className="w-28 h-28 rounded-full border-2 border-[#D4AF37]/25 shadow-lg overflow-hidden">
            {hasPhoto ? (
              <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#C41E3A] to-[#1B2A4A] flex items-center justify-center">
                <span className="text-white font-bold text-3xl">{person.name[0]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{person.name}</h1>

          <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1.5 text-sm">
            <span className="flex items-center gap-1.5 text-gray-400">
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              {person.nationality}
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              {person.birthdate}
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <User className="w-3.5 h-3.5 text-[#D4AF37]" />
              {person.gender}
            </span>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
            {person.description}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#D4AF37]/15 mb-8" />

      {/* Works */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <h2 className="text-[#D4AF37] text-[11px] font-bold tracking-[0.15em] uppercase">Works</h2>
          <span className="text-gray-600 text-xs">({works.length})</span>
        </div>

        {works.length > 0 ? (
          <div className="space-y-3">
            {works.map((drama) => {
              const hasImage = drama.image && drama.image.trim() !== "";
              return (
                <button
                  key={drama.id}
                  onClick={() => onDramaClick(drama.id)}
                  className="group w-full flex items-center gap-4 p-3 bg-[#0F0F0F] border border-white/5 rounded-md hover:border-[#D4AF37]/25 transition-all cursor-pointer text-left"
                >
                  {/* Mini poster */}
                  <div className="w-14 h-20 rounded overflow-hidden shrink-0">
                    {hasImage ? (
                      <img src={drama.image} alt={drama.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${drama.color}`} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-[#C41E3A]/80 text-white rounded-sm">
                        {drama.type}
                      </span>
                      <span className="text-gray-500 text-xs">{drama.year}</span>
                    </div>
                    <h3 className="text-white font-medium text-sm group-hover:text-[#D4AF37] transition-colors truncate">
                      {drama.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1">
                        <StarRating rating={drama.rating} size="sm" />
                        <span className="text-[#D4AF37] text-xs font-bold">{drama.rating}</span>
                      </div>
                      <span className="text-gray-600 text-[11px]">{drama.country}</span>
                      <span className="text-gray-600 text-[11px]">{drama.episodes} eps</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {drama.genres.slice(0, 4).map((g) => (
                        <span key={g} className="text-[10px] text-gray-500">{g}</span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No works listed.</p>
        )}
      </div>
    </div>
  );
}
