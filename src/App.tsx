import { useState, useMemo, useCallback } from "react";
import { Film, Tv, Clapperboard, Search, User } from "lucide-react";
import Navbar from "./components/Navbar";
import DramaCard from "./components/DramaCard";
import DramaDetail from "./components/DramaDetail";
import CastProfile from "./components/CastProfile";
import WatchPage from "./components/WatchPage";
import Footer from "./components/Footer";
import {
  dramas,
  castMembers,
  getCastById,
  getCastWorks,
} from "./data/dramas";

type View =
  | { page: "home" }
  | { page: "drama"; id: number }
  | { page: "cast"; id: number }
  | { page: "watch"; id: number; episode: number };

const TYPES = ["All", "Movie", "TV Series", "Short Play"] as const;

export default function App() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [view, setView] = useState<View>({ page: "home" });
  const [, setHistory] = useState<View[]>([]);

  // Navigation
  const navigate = useCallback(
    (next: View) => {
      setHistory((h) => [...h, view]);
      setView(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [view]
  );

  const goBack = useCallback(() => {
    setHistory((h) => {
      const copy = [...h];
      const prev = copy.pop();
      if (prev) setView(prev);
      return copy;
    });
  }, []);

  const goHome = useCallback(() => {
    setView({ page: "home" });
    setHistory([]);
    setSearch("");
    setTypeFilter("All");
    window.scrollTo({ top: 0 });
  }, []);

  const openDrama = useCallback(
    (id: number) => navigate({ page: "drama", id }),
    [navigate]
  );
  const openCast = useCallback(
    (id: number) => navigate({ page: "cast", id }),
    [navigate]
  );
  const openWatch = useCallback(
    (id: number, episode: number) => navigate({ page: "watch", id, episode }),
    [navigate]
  );

  // ─── SEARCH RESULTS (for navbar dropdown) ──────
  const dropdownResults = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return [];

    const items: {
      type: "drama" | "cast";
      id: number;
      title: string;
      sub: string;
      rating?: number;
      image?: string;
    }[] = [];

    // Cast matches
    castMembers.forEach((c) => {
      if (
        c.name.toLowerCase().includes(q) ||
        c.nationality.toLowerCase().includes(q)
      ) {
        const works = getCastWorks(c.id);
        items.push({
          type: "cast",
          id: c.id,
          title: c.name,
          sub: `${c.nationality} · ${works.length} works`,
          image: c.photo || undefined,
        });
      }
    });

    // Drama matches
    dramas.forEach((d) => {
      const inTitle = d.title.toLowerCase().includes(q);
      const inCountry = d.country.toLowerCase().includes(q);
      const inGenre = d.genres.some((g) => g.toLowerCase().includes(q));
      const inCast = d.castIds.some((cid) => {
        const c = getCastById(cid);
        return c ? c.name.toLowerCase().includes(q) : false;
      });
      if (inTitle || inCountry || inGenre || inCast) {
        items.push({
          type: "drama",
          id: d.id,
          title: d.title,
          sub: `${d.type} · ${d.country} · ${d.year}`,
          rating: d.rating,
          image: d.image || undefined,
        });
      }
    });

    return items.slice(0, 8); // max 8 results
  }, [search]);

  // ─── HOME PAGE: filtered dramas + cast ──────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return dramas.filter((d) => {
      const matchType = typeFilter === "All" || d.type === typeFilter;
      if (!matchType) return false;
      if (!q) return true;
      const inTitle = d.title.toLowerCase().includes(q);
      const inCountry = d.country.toLowerCase().includes(q);
      const inGenre = d.genres.some((g) => g.toLowerCase().includes(q));
      const inCast = d.castIds.some((cid) => {
        const c = getCastById(cid);
        return c ? c.name.toLowerCase().includes(q) : false;
      });
      return inTitle || inCountry || inGenre || inCast;
    });
  }, [search, typeFilter]);

  const filteredCast = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return [];
    return castMembers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nationality.toLowerCase().includes(q)
    );
  }, [search]);

  // Shared navbar props
  const navProps = {
    search,
    onSearch: setSearch,
    onLogo: goHome,
    onPickDrama: openDrama,
    onPickCast: openCast,
    results: dropdownResults,
  };

  // ─── LAYOUT WRAPPER ───────────────────────────
  function layout(page: React.ReactNode) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
        <Navbar {...navProps} />
        <div className="flex-1">{page}</div>
        <Footer />
      </div>
    );
  }

  // ─── WATCH PAGE ──────────────────────────────
  if (view.page === "watch") {
    const drama = dramas.find((d) => d.id === view.id);
    if (!drama) return null;
    const cast = drama.castIds
      .map((cid) => getCastById(cid))
      .filter(Boolean) as typeof castMembers;
    return layout(
      <WatchPage
        drama={drama}
        cast={cast}
        startEpisode={view.episode}
        onBack={goBack}
        onCastClick={openCast}
        onNavigate={(page, id) => {
          if (page === "drama") openDrama(id);
        }}
      />
    );
  }

  // ─── CAST PAGE ───────────────────────────────
  if (view.page === "cast") {
    const person = getCastById(view.id);
    if (!person) return null;
    const works = getCastWorks(view.id);
    return layout(
      <CastProfile
        person={person}
        works={works}
        onBack={goBack}
        onDramaClick={openDrama}
      />
    );
  }

  // ─── DRAMA DETAIL PAGE ───────────────────────
  if (view.page === "drama") {
    const drama = dramas.find((d) => d.id === view.id);
    if (!drama) return null;
    const cast = drama.castIds
      .map((cid) => getCastById(cid))
      .filter(Boolean) as typeof castMembers;
    return layout(
      <DramaDetail
        drama={drama}
        cast={cast}
        onBack={goBack}
        onCastClick={openCast}
        onWatch={openWatch}
      />
    );
  }

  // ─── HOME PAGE ───────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <Navbar {...navProps} />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
            Explore <span className="text-[#D4AF37]">Dramas</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Browse movies, TV series, and short plays from across Asia.
          </p>
        </div>

        {/* Type filter tabs */}
        <div className="flex items-center gap-1 mb-2 border-b border-white/5 pb-px">
          {TYPES.map((t) => {
            const active = typeFilter === t;
            const icon =
              t === "Movie" ? (
                <Film className="w-3.5 h-3.5" />
              ) : t === "TV Series" ? (
                <Tv className="w-3.5 h-3.5" />
              ) : t === "Short Play" ? (
                <Clapperboard className="w-3.5 h-3.5" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              );
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium tracking-wide border-b-2 transition-all cursor-pointer ${
                  active
                    ? "border-[#C41E3A] text-[#C41E3A]"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {icon}
                {t}
              </button>
            );
          })}
        </div>

        {/* Count */}
        <p className="text-gray-600 text-xs mb-6">
          {search
            ? `${filteredCast.length} cast · ${filtered.length} titles found`
            : `${filtered.length} titles`}
        </p>

        {/* Cast search results */}
        {filteredCast.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[#D4AF37] text-[11px] font-bold tracking-[0.15em] uppercase mb-4">
              Cast Members
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredCast.map((member) => {
                const works = getCastWorks(member.id);
                return (
                  <button
                    key={member.id}
                    onClick={() => openCast(member.id)}
                    className="group text-left w-full bg-[#0F0F0F] border border-white/5 rounded-md overflow-hidden hover:border-[#D4AF37]/25 transition-all cursor-pointer"
                  >
                    <div className="p-4 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full border border-[#D4AF37]/20 mb-3 overflow-hidden">
                        {member.photo && member.photo.trim() !== "" ? (
                          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#C41E3A] to-[#1B2A4A] flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-white text-sm font-medium group-hover:text-[#D4AF37] transition-colors truncate w-full">
                        {member.name}
                      </h3>
                      <p className="text-gray-500 text-[11px] mt-1">{member.nationality}</p>
                      <p className="text-gray-600 text-[11px] mt-0.5">
                        {works.length} {works.length === 1 ? "work" : "works"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Drama Grid */}
        {filtered.length > 0 ? (
          <div>
            {filteredCast.length > 0 && (
              <h2 className="text-[#D4AF37] text-[11px] font-bold tracking-[0.15em] uppercase mb-4">
                Titles
              </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {filtered.map((d) => (
                <DramaCard
                  key={d.id}
                  drama={d}
                  onClick={() => openDrama(d.id)}
                />
              ))}
            </div>
          </div>
        ) : filteredCast.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 mx-auto mb-4 border border-[#D4AF37]/15 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-white font-medium mb-1">No results found</h3>
            <p className="text-gray-500 text-sm mb-4">
              Try a different search or filter.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("All");
              }}
              className="text-[#C41E3A] text-sm font-medium hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
