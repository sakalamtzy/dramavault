import { useState, useMemo, useCallback } from "react";
import { Film, Tv, Clapperboard, Search } from "lucide-react";
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

  // Filtered dramas
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

  // ─── WATCH PAGE ──────────────────────────────────
  if (view.page === "watch") {
    const drama = dramas.find((d) => d.id === view.id);
    if (!drama) return null;
    const cast = drama.castIds
      .map((cid) => getCastById(cid))
      .filter(Boolean) as typeof castMembers;
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
        <Navbar search={search} onSearch={setSearch} onLogo={goHome} />
        <div className="flex-1">
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
        </div>
        <Footer />
      </div>
    );
  }

  // ─── CAST PAGE ───────────────────────────────────
  if (view.page === "cast") {
    const person = getCastById(view.id);
    if (!person) return null;
    const works = getCastWorks(view.id);
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
        <Navbar search={search} onSearch={setSearch} onLogo={goHome} />
        <div className="flex-1">
          <CastProfile
            person={person}
            works={works}
            onBack={goBack}
            onDramaClick={openDrama}
          />
        </div>
        <Footer />
      </div>
    );
  }

  // ─── DRAMA DETAIL PAGE ───────────────────────────
  if (view.page === "drama") {
    const drama = dramas.find((d) => d.id === view.id);
    if (!drama) return null;
    const cast = drama.castIds
      .map((cid) => getCastById(cid))
      .filter(Boolean) as typeof castMembers;
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
        <Navbar search={search} onSearch={setSearch} onLogo={goHome} />
        <div className="flex-1">
          <DramaDetail
            drama={drama}
            cast={cast}
            onBack={goBack}
            onCastClick={openCast}
            onWatch={openWatch}
          />
        </div>
        <Footer />
      </div>
    );
  }

  // ─── HOME PAGE ───────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <Navbar search={search} onSearch={setSearch} onLogo={goHome} />

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
          {filtered.length} {filtered.length === 1 ? "title" : "titles"} found
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {filtered.map((d) => (
              <DramaCard
                key={d.id}
                drama={d}
                onClick={() => openDrama(d.id)}
              />
            ))}
          </div>
        ) : (
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
        )}
      </main>

      <Footer />
    </div>
  );
}
