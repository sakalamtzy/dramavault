import { Search } from "lucide-react";

interface NavbarProps {
  search: string;
  onSearch: (q: string) => void;
  onLogo: () => void;
}

export default function Navbar({ search, onSearch, onLogo }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur border-b border-[#D4AF37]/15">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={onLogo} className="flex items-center gap-2 shrink-0 cursor-pointer">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-[#C41E3A] to-[#D4AF37] flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">DV</span>
          </div>
          <span className="text-white font-semibold tracking-wide text-sm">
            Drama<span className="text-[#D4AF37]">Vault</span>
          </span>
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search title or cast…"
            className="w-full bg-[#1B2A4A]/40 border border-[#D4AF37]/15 rounded-full pl-9 pr-4 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
          />
        </div>
      </div>
    </header>
  );
}
