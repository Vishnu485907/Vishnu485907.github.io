import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router";
import CredfixDownloadModal from "@/components/CredfixDownloadModal";
import CredfixLogo from "@/components/CredfixLogo";
import { useCredfixDownload } from "@/hooks/useCredfixDownload";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { handleDownloadClick, showDownloadModal, setShowDownloadModal } =
    useCredfixDownload();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 sm:pt-6 px-3 sm:px-4">
      <div
        className={`rounded-full shadow-sm border pl-2 pr-2 py-2 w-full max-w-[980px] relative transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-neutral-200"
            : "bg-white border-neutral-200"
        }`}
      >
        <div className="flex items-center">
          <Link to="/" className="shrink-0 flex items-center gap-2">
            <CredfixLogo className="h-7 sm:h-8" />
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-6 ml-6 text-[14px]">
            <button
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-1.5 text-pitch-black hover:text-brand-orange transition-colors"
            >
              <span className="w-[6px] h-[6px] rounded-full bg-black" />
              Home
            </button>
            <button
              onClick={() => scrollToSection("calculator")}
              className="text-neutral-600 hover:text-brand-orange transition-colors"
            >
              Calculator
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-neutral-600 hover:text-brand-orange transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("community")}
              className="text-neutral-600 hover:text-brand-orange transition-colors"
            >
              Community
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="flex items-center gap-1 text-brand-orange hover:opacity-80 transition-opacity"
            >
              Pages
              <ChevronDown size={14} />
            </button>
          </nav>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-2">
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:block text-xs font-medium text-brand-orange hover:underline"
              >
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-xs text-neutral-600">{user?.name || "User"}</span>
                <button
                  onClick={logout}
                  className="text-xs text-neutral-500 hover:text-brand-orange transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center text-xs font-medium text-neutral-600 transition-colors hover:text-brand-orange"
              >
                Login
              </Link>
            )}

            <button
              onClick={handleDownloadClick}
              className="hidden md:inline-flex items-center gap-2 bg-brand-orange text-white rounded-full pl-4 pr-1.5 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity group"
            >
              Download Credfix
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChevronRight size={14} />
              </span>
            </button>

            <button
              onClick={handleDownloadClick}
              className="md:hidden inline-flex items-center gap-1 bg-brand-orange text-white rounded-full px-3 py-1.5 text-[11px] font-medium hover:opacity-90 transition-opacity"
            >
              Download Credfix
            </button>

            {/* Hamburger */}
            <button
              className="md:hidden p-1 text-neutral-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-2 right-2 mt-2 bg-white rounded-2xl shadow-lg border border-neutral-200 p-3 z-20">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => scrollToSection("hero")}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-pitch-black hover:bg-neutral-50"
              >
                <span className="w-[6px] h-[6px] rounded-full bg-black" />
                Home
              </button>
              <button
                onClick={() => scrollToSection("calculator")}
                className="px-3 py-2 rounded-xl text-sm text-neutral-600 hover:bg-neutral-50 text-left"
              >
                Calculator
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="px-3 py-2 rounded-xl text-sm text-neutral-600 hover:bg-neutral-50 text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("community")}
                className="px-3 py-2 rounded-xl text-sm text-neutral-600 hover:bg-neutral-50 text-left"
              >
                Community
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="px-3 py-2 rounded-xl text-sm text-brand-orange hover:bg-neutral-50 text-left"
              >
                Pages
              </button>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm text-brand-orange hover:bg-neutral-50"
                >
                  Admin Dashboard
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="px-3 py-2 rounded-xl text-sm text-neutral-600 hover:bg-neutral-50 text-left"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm text-neutral-600 hover:bg-neutral-50"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      <CredfixDownloadModal
        open={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </div>
  );
}
