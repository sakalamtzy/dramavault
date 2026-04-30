import { useState, useRef, useEffect } from "react";
import { Search, User, X, Play } from "lucide-react";

interface SearchResult {
  type: "drama" | "cast";
  id: number;
  title: string;
  sub: string;
  rating?: number;
  image?: string;
}

interface NavbarProps {
  search: string;
  onSearch: (q: string) => void;
  onLogo: () => void;
  onPickDrama: (id: number) => void;
  onPickCast: (id: number) => void;
  results: SearchResult[];
}

export default function Navbar({
  search,
  onSearch,
  onLogo,
  onPickDrama,
  onPickCast,
  results,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const pick = (r: SearchResult) => {
    setOpen(false);
    onSearch("");
    if (r.type === "drama") onPickDrama(r.id);
    else onPickCast(r.id);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur border-b border-[#D4AF37]/15">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={onLogo}
          className="flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <div className="w-7 h-7 rounded bg-gradient-to-br from-[#C41E3A] to-[#D4AF37] flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">DV</span>
          </div>
          <span className="text-white font-semibold tracking-wide text-sm">
            Drama<span className="text-[#D4AF37]">Vault</span>
          </span>
        </button>

        {/* Search */}
        <div ref={wrapRef} className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                onSearch(e.target.value);
                setOpen(true);
              }}
              onFocus={() => {
                if (search.trim()) setOpen(true);
              }}
              placeholder="Search title or cast…"
              className="w-full bg-[#1B2A4A]/40 border border-[#D4AF37]/15 rounded-full pl-9 pr-9 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
            />
            {search && (
              <button
                onClick={() => {
                  onSearch("");
                  setOpen(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {open && search.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-md shadow-2xl shadow-black/50 overflow-hidden max-h-[70vh] overflow-y-auto z-50">
              {results.length > 0 ? (
                <div className="py-1">
                  {results.map((r) => (
                    <button
                      key={`${r.type}-${r.id}`}
                      onClick={() => pick(r)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors cursor-pointer text-left"
                    >
                      {/* Icon / Image */}
                      {r.image && r.image.trim() !== "" ? (
                        <div className="w-8 h-8 rounded overflow-hidden shrink-0">
                          <img src={r.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div
                          className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                            r.type === "cast"
                              ? "bg-gradient-to-br from-[#C41E3A] to-[#1B2A4A]"
                              : "bg-[#1B2A4A]/60"
                          }`}
                        >
                          {r.type === "cast" ? (
                            <User className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {r.title}
                        </p>
                        <p className="text-gray-500 text-[11px] truncate">
                          {r.sub}
                        </p>
                      </div>

                      {/* Badge */}
                      <span
                        className={`shrink-0 px-1.5 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded-sm ${
                          r.type === "cast"
                            ? "bg-[#1B2A4A] text-[#D4AF37]"
                            : "bg-[#C41E3A]/20 text-[#C41E3A]"
                        }`}
                      >
                        {r.type === "cast" ? "Cast" : r.rating ? `${r.rating}` : ""}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Search className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No results found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
