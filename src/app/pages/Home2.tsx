import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Search,
  ChevronRight,
  ArrowRight,
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
import { categorias } from "../data/categorias";
import { servicios } from "../data/servicios";
import { openWhatsApp } from "../utils/whatsapp";
import { WhatsAppIcon } from "../components/WhatsAppIcon";

// Decorative
import starburst from "../../imports/02_starburst.png";
import xShape from "../../imports/05_x.png";
import flower from "../../imports/07_flower.png";

// Project images — Kits & Promocionales
import bolsas1 from "../../imports/bolsas-de-tela/bolsas-de-tela-1.jpg";
import bolsas3 from "../../imports/bolsas-de-tela/bolsas-de-tela-3.jpg";
import sudaderas1 from "../../imports/sudaderas/sudaderas-1.jpg";
import catering1 from "../../imports/cattering/catering-1.jpg";
import piezas1 from "../../imports/piezas-personalizadas/piezas-personalizadas-1.jpg";

// Project images — Gran Formato
import instalacion1 from "../../imports/instalacion/instalacion-1.jpg";
import instalacion2 from "../../imports/instalacion/instalacion-2.jpg";
import instalacion3 from "../../imports/instalacion/instalacion-3.jpg";

// ── Data ──────────────────────────────────────────────────────────────────────
const sliderCats = categorias.filter((c) => c.slug !== "otros-servicios");

const mainServices = [
  { num: "01", name: "Merchandising",       tag: "" },
  { num: "02", name: "Impresión",           tag: "pequeño, mediano y gran formato" },
  { num: "03", name: "Material POP",        tag: "" },
  { num: "04", name: "Logos volumétricos",  tag: "3D" },
  { num: "05", name: "Corte de vinil",      tag: "diseño e instalación" },
  { num: "06", name: "Catering",            tag: "" },
  { num: "07", name: "Box lunch",           tag: "" },
];

// Grid: col3 (index 2) spans 2 rows — matches PDF layout
const kitsProjects = [
  { img: bolsas1,    client: "ACCIONA",        color: "#FA4616" },
  { img: sudaderas1, client: "HEARTMANSHIP",   color: "#F5C800" },
  { img: catering1,  client: "INFINIX | TECNO",color: "#FF3EB5" }, // tall item
  { img: bolsas3,    client: "ATHENEA",        color: "#009681" },
  { img: piezas1,    client: "ALEATICA",       color: "#FA4616" },
];

const granFormatoProjects = [
  { img: instalacion2, label: "STAND DE EXPO",         color: "#F5C800" },
  { img: instalacion1, label: "INSTALACIÓN EN SITIO",  color: "#FF3EB5" },
  { img: instalacion3, label: "MURAL 7.93 × 2.55 M",  color: "#009681" },
];

const valores = [
  { title: "Compromiso",   desc: "Dedicación total a cada proyecto.",               pink: false },
  { title: "Calidad",      desc: "Calidad, tiempos y costos cumplidos.",            pink: false },
  { title: "Innovación",   desc: "Nuevas ideas y tecnología en cada entrega.",      pink: true  },
  { title: "Flexibilidad", desc: "Soluciones a la medida de cada campaña.",         pink: false },
];

const valorTags = [
  { label: "RESPONSABILIDAD",      bg: "#13322B" },
  { label: "HONESTIDAD",           bg: "#154734" },
  { label: "COLABORACIÓN",         bg: "#FF3EB5" },
  { label: "ORIENTACIÓN AL CLIENTE", bg: "#009681" },
];

const clientesGrid = [
  ["acciona",       "Unilever",          "HOLCIM",              "Mitsubishi Motors"],
  ["Deutsche Bank", "ALEATICA",          "CARNET",              "Televia"],
  ["AVAYA",         "TECNO mobile",      "Brandépica",          "wiseCX"],
  ["engen capital", "BBVA",              "Fundación Aleatica",  "Air Charter Service"],
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home2() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "", mensaje: "" });
  const [formSent, setFormSent] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % sliderCats.length), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const searchResults = searchQuery.length > 1
    ? servicios.filter((s) =>
        s.tituloServicio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subservicios.some((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleResultClick = (path: string) => {
    setSearchQuery(""); setShowResults(false);
    const svc = servicios.find((s) => s.path === path);
    navigate(svc ? `/categorias/${svc.categoriaSlug}/${svc.path}` : `/categorias`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 4000);
    setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40)
      setCurrentSlide((p) => delta > 0 ? (p + 1) % sliderCats.length : (p - 1 + sliderCats.length) % sliderCats.length);
    touchStartX.current = null;
  };

  const activeCat = sliderCats[currentSlide];

  return (
    <main className="bg-white">

      {/* ─── 1. HERO SLIDER + SEARCH ─────────────────────────────────────────── */}
      <div className="h-screen min-h-[640px] flex flex-col pt-16">

        {/* Slider */}
        <div
          className="relative flex-1 overflow-hidden bg-[#0a0a0a]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {sliderCats.map((cat, i) => {
            const isActive = i === currentSlide;
            return (
              <div
                key={cat.slug}
                className="absolute inset-0 transition-opacity duration-[1500ms]"
                style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none" }}
              >
                <img src={cat.imagenHero} alt={cat.titulo} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, ${cat.color}60 0%, transparent 60%)` }} />
              </div>
            );
          })}

          <motion.img src={starburst} alt="" className="absolute top-6 right-[48%] md:right-[52%] w-16 opacity-15 pointer-events-none select-none z-10"
            animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
          <motion.img src={xShape} alt="" className="absolute bottom-12 left-8 w-10 opacity-20 pointer-events-none select-none z-10"
            animate={{ rotate: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />

          <div className="relative z-20 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
              <div className="relative max-w-xl min-h-[420px] flex items-center">
                {sliderCats.map((cat, i) => {
                  const isActive = i === currentSlide;
                  const svcs = servicios.filter((s) => s.categoriaSlug === cat.slug).slice(0, 6);
                  return (
                    <div
                      key={cat.slug}
                      className="absolute inset-x-0 top-0 transition-all duration-[1200ms]"
                      style={{ opacity: isActive ? 1 : 0, transform: isActive ? "translateY(0)" : "translateY(16px)", pointerEvents: isActive ? "auto" : "none" }}
                    >
                      <span className="inline-flex items-center gap-2 font-['Barlow_Condensed'] font-bold text-xs tracking-[0.25em] uppercase text-white px-3 py-1.5 rounded-full mb-5" style={{ backgroundColor: cat.color }}>
                        <span>{cat.icono}</span>{cat.subtitulo}
                      </span>
                      <h1 className="font-['Barlow_Condensed'] font-black text-white text-[3.2rem] md:text-[4.8rem] lg:text-[5.8rem] uppercase leading-[0.88] mb-6">
                        {cat.titulo}
                      </h1>
                      <ul className="space-y-2 mb-8">
                        {svcs.map((svc) => (
                          <li key={svc.path} className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                            <span className="font-['Barlow'] text-white/80 text-base">{svc.tituloServicio}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-3">
                        <Link to={`/categorias/${cat.slug}`}
                          className="inline-flex items-center gap-2 text-white font-['Barlow_Condensed'] font-bold text-sm tracking-[0.15em] uppercase px-6 py-3 rounded-full transition-all hover:brightness-110"
                          style={{ backgroundColor: cat.color }}
                        >
                          Ver más <ArrowRight size={16} />
                        </Link>
                        <button onClick={() => openWhatsApp(cat.titulo)}
                          className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-['Barlow_Condensed'] font-bold text-sm tracking-[0.15em] uppercase px-6 py-3 rounded-full transition-all"
                        >
                          <WhatsAppIcon size={16} /> Cotiza ahora
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2">
            {sliderCats.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className="transition-all duration-300 rounded-full"
                style={{ width: i === currentSlide ? "2rem" : "0.5rem", height: "0.5rem", backgroundColor: i === currentSlide ? activeCat.color : "rgba(255,255,255,0.35)" }} />
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="h-[10vh] min-h-[64px] flex items-center px-6 md:px-10" style={{ backgroundColor: "#FF3EB5" }}>
          <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg">
              <Search size={18} className="ml-5 text-[#53565A] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
                placeholder="¿Qué tienes en mente? Busca un servicio..."
                className="flex-1 px-3 py-3 text-[#13322B] font-['Barlow'] placeholder-[#888B8D] focus:outline-none bg-transparent text-sm"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setShowResults(false); }} className="mr-4 text-[#888B8D] hover:text-[#13322B]">✕</button>
              )}
            </div>
            {showResults && searchResults.length > 0 && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-white shadow-2xl z-50 rounded-2xl overflow-hidden border border-[#ECEAE4]">
                {searchResults.map((svc) => (
                  <button key={svc.path} onMouseDown={() => handleResultClick(svc.path)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F7F5F0] transition-colors text-left group">
                    <span className="w-1 h-8 shrink-0 rounded-full" style={{ backgroundColor: svc.color }} />
                    <div>
                      <div className="font-['Barlow'] font-semibold text-sm text-[#13322B] group-hover:text-[#009681] transition-colors">{svc.tituloServicio}</div>
                      <div className="font-['Barlow'] text-xs text-[#888B8D]">{svc.subservicios[0]}</div>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-[#888B8D]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 2. "LO DISEÑAMOS..." + STATS ────────────────────────────────────── */}
      <section className="bg-white pt-20 pb-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">

          {/* Statement row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 mb-16">
            <div className="flex-1">
              <h2 className="font-['Barlow'] font-black text-[#13322B] text-4xl md:text-5xl lg:text-[3.8rem] leading-[1.1]">
                Lo diseñamos, lo<br />
                producimos, lo<br />
                <span style={{ color: "#FF3EB5" }}>instalamos.</span>
              </h2>
            </div>
            {/* Blue hexagon — decorative geometric */}
            <div className="shrink-0 hidden lg:flex items-center justify-end w-64">
              <svg viewBox="0 0 200 230" width="200" height="230" fill="none">
                <polygon points="100,0 200,57.5 200,172.5 100,230 0,172.5 0,57.5" fill="#307FE2" />
              </svg>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-[#ECEAE4] border-t border-[#ECEAE4]">
            {[
              { num: "28",     label: "AÑOS DE EXPERIENCIA", line: "#FF3EB5" },
              { num: "+20",    label: "CLIENTES",            line: "#307FE2" },
              { num: "+5,000", label: "PROYECTOS",           line: "#F5C800" },
            ].map((stat) => (
              <div key={stat.label} className="pt-8 pb-4 px-0 first:pr-8 [&:nth-child(2)]:px-8 last:pl-8">
                <div className="h-0.5 w-full mb-6" style={{ backgroundColor: stat.line }} />
                <div className="font-['Barlow'] font-black text-[#13322B] text-4xl md:text-5xl lg:text-6xl leading-none mb-2">
                  {stat.num}
                </div>
                <div className="font-['Barlow'] font-bold text-[#13322B] text-[10px] md:text-xs tracking-[0.2em] uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. SERVICIOS — LISTA NUMERADA ───────────────────────────────────── */}
      <section className="bg-white py-16 px-6 border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto">
          <div className="border-b-2 border-[#13322B] pb-5 mb-0">
            <h2 className="font-['Barlow'] font-black text-[#13322B] text-4xl md:text-5xl">Servicios</h2>
          </div>
          <div>
            {mainServices.map((svc) => (
              <div key={svc.num} className="flex items-center gap-5 py-5 border-b border-[#E5E7EB]">
                <span className="font-['Barlow'] font-bold text-xs md:text-sm w-6 shrink-0" style={{ color: "#FF3EB5" }}>
                  {svc.num}
                </span>
                <span className="font-['Barlow'] font-bold text-[#13322B] text-2xl md:text-3xl lg:text-[2rem] flex-1 leading-tight">
                  {svc.name}
                </span>
                {svc.tag && (
                  <span className="font-['Barlow'] text-[#888B8D] text-sm hidden sm:block shrink-0">
                    {svc.tag}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. PROYECTOS — KITS Y PROMOCIONALES ─────────────────────────────── */}
      <section className="bg-white py-16 px-6 border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-['Barlow'] font-black text-[#13322B] text-4xl md:text-5xl">Proyectos</h2>
              <div className="h-0.5 mt-2" style={{ backgroundColor: "#FF3EB5", width: "100%" }} />
            </div>
            <span className="font-['Barlow'] font-bold text-xs tracking-[0.18em] uppercase mb-0.5 shrink-0 ml-6" style={{ color: "#FF3EB5" }}>
              KITS Y PROMOCIONALES
            </span>
          </div>

          {/* Desktop: col-3 grid where item[2] spans 2 rows */}
          <div
            className="hidden md:grid gap-4"
            style={{ gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "220px 220px" }}
          >
            {kitsProjects.map((proj, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl"
                style={i === 2 ? { gridRow: "1 / 3" } : {}}
              >
                <img src={proj.img} alt={proj.client} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4">
                  <span className="font-['Barlow'] font-black text-white text-xs tracking-widest uppercase px-3 py-1.5"
                    style={{ backgroundColor: proj.color }}>
                    {proj.client}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: simple 2-col grid */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {kitsProjects.map((proj, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl" style={{ height: "160px" }}>
                <img src={proj.img} alt={proj.client} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-3 left-3">
                  <span className="font-['Barlow'] font-black text-white text-[10px] tracking-widest uppercase px-2 py-1"
                    style={{ backgroundColor: proj.color }}>
                    {proj.client}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. GRAN FORMATO ──────────────────────────────────────────────────── */}
      <section className="bg-white py-16 px-6 border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2
                className="font-['Barlow'] font-black text-[#13322B] text-4xl md:text-5xl pb-1"
                style={{ borderBottom: "3px solid #307FE2", display: "inline-block" }}
              >
                Gran formato
              </h2>
            </div>
            <span className="font-['Barlow'] font-bold text-xs tracking-[0.18em] uppercase mb-1 shrink-0 ml-6" style={{ color: "#307FE2" }}>
              STANDS · MUROS · VINIL
            </span>
          </div>

          {/* Top row: 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {granFormatoProjects.slice(0, 2).map((proj, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl" style={{ height: "260px" }}>
                <img src={proj.img} alt={proj.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/15" />
                <div className="absolute bottom-4 left-4">
                  <span className="font-['Barlow'] font-black text-white text-xs tracking-widest uppercase px-3 py-1.5"
                    style={{ backgroundColor: proj.color }}>
                    {proj.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row: full width */}
          <div className="relative overflow-hidden rounded-xl" style={{ height: "260px" }}>
            <img src={granFormatoProjects[2].img} alt={granFormatoProjects[2].label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute bottom-4 left-4">
              <span className="font-['Barlow'] font-black text-white text-xs tracking-widest uppercase px-3 py-1.5"
                style={{ backgroundColor: granFormatoProjects[2].color }}>
                {granFormatoProjects[2].label}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. VALORES Y COMPROMISO ──────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ backgroundColor: "#F5C800" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#13322B]/25 pb-5 mb-0">
            <h2 className="font-['Barlow'] font-black text-[#13322B] text-3xl md:text-4xl">Valores y compromiso</h2>
            <span className="font-['Barlow'] font-bold text-xs tracking-[0.2em] uppercase text-[#13322B]/50 shrink-0 ml-6">
              ASÍ TRABAJAMOS
            </span>
          </div>

          {/* 2×2 grid with cross dividers */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {valores.map((v, i) => (
              <div
                key={v.title}
                className={[
                  "py-12",
                  i % 2 === 0 ? "md:pr-14" : "md:pl-14 md:border-l border-[#13322B]/20",
                  i >= 2 ? "border-t border-[#13322B]/20" : "",
                ].join(" ")}
              >
                <h3
                  className="font-['Barlow'] font-black text-4xl md:text-5xl lg:text-6xl mb-3"
                  style={{ color: v.pink ? "#FF3EB5" : "#13322B" }}
                >
                  {v.title}
                </h3>
                <p className="font-['Barlow'] font-bold text-[#13322B] text-base md:text-lg">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* Value tags */}
          <div className="flex flex-wrap gap-2 pt-8 border-t border-[#13322B]/20">
            {valorTags.map((tag) => (
              <span
                key={tag.label}
                className="font-['Barlow'] font-black text-white text-[10px] md:text-xs tracking-[0.15em] uppercase px-4 py-2"
                style={{ backgroundColor: tag.bg }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. CLIENTES ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline justify-between border-b border-[#E5E7EB] pb-5 mb-8">
            <h2 className="font-['Barlow'] font-black text-[#13322B] text-4xl md:text-5xl">Clientes</h2>
            <span className="font-['Barlow'] font-bold text-xs tracking-[0.2em] uppercase shrink-0 ml-6" style={{ color: "#FF3EB5" }}>
              +20 MARCAS ATENDIDAS
            </span>
          </div>

          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
            {clientesGrid.map((row, ri) => (
              <div key={ri} className={`grid grid-cols-2 md:grid-cols-4 ${ri > 0 ? "border-t border-[#E5E7EB]" : ""}`}>
                {row.map((name, ci) => (
                  <div
                    key={name}
                    className={`flex items-center justify-center px-4 py-8 ${ci > 0 ? "border-l border-[#E5E7EB]" : ""}`}
                  >
                    <span className="font-['Barlow'] font-black text-[#13322B] text-center text-sm md:text-base leading-tight">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. CONTACTO ─────────────────────────────────────────────────────── */}
      <section id="contacto" className="py-24 bg-[#13322B] relative overflow-hidden">
        <motion.img src={starburst} alt="" className="absolute top-8 right-8 w-24 md:w-36 opacity-10 pointer-events-none select-none"
          animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
        <motion.img src={xShape} alt="" className="absolute bottom-8 left-8 w-14 opacity-15 pointer-events-none select-none"
          animate={{ rotate: [0, 30, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
        <motion.img src={flower} alt="" className="absolute -bottom-8 right-1/4 w-24 opacity-10 pointer-events-none select-none"
          animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-2xl rounded-3xl overflow-hidden">

            {/* Form */}
            <div className="bg-white p-10 lg:p-14">
              <span className="font-['Barlow_Condensed'] font-semibold text-[#009681] text-sm tracking-[0.3em] uppercase block mb-3">
                Contáctanos
              </span>
              <h2 className="font-['Barlow_Condensed'] font-black text-[#13322B] text-4xl lg:text-5xl uppercase leading-tight mb-8">
                Hablemos<br />de tu proyecto
              </h2>
              {formSent ? (
                <div className="bg-[#009681] text-white p-6 text-center rounded-2xl">
                  <div className="font-['Barlow_Condensed'] font-bold text-2xl uppercase mb-2">¡Mensaje enviado!</div>
                  <p className="font-['Barlow'] text-sm text-white/80">Nos pondremos en contacto contigo muy pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {[
                    { name: "nombre",   label: "Nombre completo",     type: "text",  placeholder: "Juan García" },
                    { name: "email",    label: "Correo electrónico",   type: "email", placeholder: "juan@empresa.com" },
                    { name: "telefono", label: "Teléfono",             type: "tel",   placeholder: "+52 55 1234 5678" },
                  ].map(({ name, label, type, placeholder }) => (
                    <div key={name}>
                      <label className="font-['Barlow'] font-semibold text-xs tracking-widest uppercase text-[#53565A] block mb-1.5">{label}</label>
                      <input type={type} placeholder={placeholder} required
                        value={formData[name as keyof typeof formData]}
                        onChange={(e) => setFormData((f) => ({ ...f, [name]: e.target.value }))}
                        className="w-full border border-[#ECEAE4] px-4 py-3 rounded-xl font-['Barlow'] text-sm text-[#13322B] placeholder-[#B1B3B3] focus:outline-none focus:border-[#009681] transition-colors bg-[#F7F5F0]"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="font-['Barlow'] font-semibold text-xs tracking-widest uppercase text-[#53565A] block mb-1.5">Mensaje</label>
                    <textarea placeholder="Cuéntanos sobre tu proyecto..." rows={4} required
                      value={formData.mensaje}
                      onChange={(e) => setFormData((f) => ({ ...f, mensaje: e.target.value }))}
                      className="w-full border border-[#ECEAE4] px-4 py-3 rounded-xl font-['Barlow'] text-sm text-[#13322B] placeholder-[#B1B3B3] focus:outline-none focus:border-[#009681] transition-colors bg-[#F7F5F0] resize-none"
                    />
                  </div>
                  <button type="submit"
                    className="w-full bg-[#FA4616] hover:bg-[#e03a0f] text-white font-['Barlow_Condensed'] font-bold text-sm tracking-[0.2em] uppercase py-4 rounded-full transition-colors flex items-center justify-center gap-2"
                  >
                    Enviar mensaje <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="bg-[#154734] p-10 lg:p-14 flex flex-col justify-between">
              <div className="space-y-8">
                <div>
                  <h3 className="font-['Barlow_Condensed'] font-black text-white text-3xl uppercase mb-2">
                    Estamos aquí<br />para ayudarte
                  </h3>
                  <div className="w-12 h-1 bg-[#FA4616] rounded-full mt-4" />
                </div>
                <div className="space-y-5">
                  {[
                    { icon: Mail,           label: "Email",     value: "contacto@posterpeople.mx",  href: "mailto:contacto@posterpeople.mx" },
                    { icon: Phone,          label: "Teléfono",  value: "+52 55 2959 9392",          href: "tel:+5529599392" },
                    { icon: MessageCircle,  label: "WhatsApp",  value: "+52 55 2959 9392",          href: "https://wa.me/5529599392" },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <a key={label} href={href} className="flex items-start gap-4 group">
                      <div className="w-10 h-10 bg-[#009681] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#FA4616] transition-colors">
                        <Icon size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="font-['Barlow'] text-xs text-white/40 uppercase tracking-widest">{label}</div>
                        <div className="font-['Barlow'] font-medium text-white group-hover:text-[#009681] transition-colors text-sm">{value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="mt-10">
                <p className="font-['Barlow'] text-xs text-white/40 uppercase tracking-widest mb-4">Síguenos</p>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, label: "Instagram", href: "#" },
                    { icon: Facebook,  label: "Facebook",  href: "#" },
                    { icon: Linkedin,  label: "LinkedIn",  href: "#" },
                  ].map(({ icon: Icon, label, href }) => (
                    <a key={label} href={href} aria-label={label}
                      className="w-10 h-10 border border-white/20 hover:border-[#009681] hover:bg-[#009681] rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all">
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
