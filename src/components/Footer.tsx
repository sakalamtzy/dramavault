import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#D4AF37]/10 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#C41E3A] to-[#D4AF37] flex items-center justify-center">
              <span className="text-white font-bold text-[8px]">DV</span>
            </div>
            <span className="text-white font-semibold text-xs tracking-wide">
              Drama<span className="text-[#D4AF37]">Vault</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-600 text-xs">
            Made with <Heart className="w-3 h-3 text-[#C41E3A] fill-[#C41E3A]" /> for drama lovers
          </div>

          <p className="text-gray-600 text-xs">© 2024 DramaVault</p>
        </div>
      </div>
    </footer>
  );
}
