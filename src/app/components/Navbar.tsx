import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import logo from "../../imports/logo-posterpeople.png";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const navLinks = [
    { label: "Inicio", to: "/" },
    { label: "Servicios", to: "/servicios" },
    { label: "Categorías", to: "/categorias" },
  ];

  const handleContacto = () => {
    if (location.pathname === "/") {
      document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#contacto";
    }
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#154734] shadow-xl" : "bg-[#154734]/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo — 3px margin top/bottom inside h-16 nav */}
        <Link to="/" className="flex items-center py-[3px]">
          <img
            src={logo}
            alt="Poster People"
            className="h-[calc(4rem-6px)] w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active =
              link.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`font-['Barlow_Condensed'] font-semibold text-lg tracking-wider uppercase transition-colors ${
                  active
                    ? "text-[#009681] border-b-2 border-[#009681] pb-0.5"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={handleContacto}
            className="font-['Barlow_Condensed'] font-semibold text-lg tracking-wider uppercase text-white/80 hover:text-white transition-colors"
          >
            Contacto
          </button>
          <button
            onClick={handleContacto}
            className="bg-[#FA4616] hover:bg-[#e03a0f] text-white font-['Barlow_Condensed'] font-bold text-sm tracking-widest uppercase px-6 py-2 rounded-full transition-colors"
          >
            Cotiza Ahora
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#13322B] border-t border-white/10">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-['Barlow_Condensed'] font-semibold text-xl tracking-wider uppercase text-white hover:text-[#009681] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleContacto}
              className="font-['Barlow_Condensed'] font-semibold text-xl tracking-wider uppercase text-white hover:text-[#009681] transition-colors text-left"
            >
              Contacto
            </button>
            <button
              onClick={handleContacto}
              className="bg-[#FA4616] text-white font-['Barlow_Condensed'] font-bold text-sm tracking-widest uppercase px-5 py-3 rounded-full text-center mt-2"
            >
              Cotiza Ahora
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
