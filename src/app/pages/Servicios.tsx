import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, ChevronLeft, ArrowRight, Grid3X3 } from "lucide-react";
import { categorias } from "../data/categorias";
import { servicios } from "../data/servicios";

import starburst from "../../imports/02_starburst.png";
import xShape from "../../imports/05_x.png";

function FilterBar({
  filtro,
  setFiltro,
}: {
  filtro: string | null;
  setFiltro: (v: string | null) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    return () => el.removeEventListener("scroll", updateArrows);
  }, [updateArrows]);

  // Hide swipe hint after first touch interaction
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const hide = () => setShowSwipeHint(false);
    el.addEventListener("touchstart", hide, { once: true });
    return () => el.removeEventListener("touchstart", hide);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center bg-white border-b border-[#ECEAE4] shadow-sm">
      {/* Left fade + arrow — desktop only */}
      {!isMobile && (
        <div
          className={`absolute left-0 top-0 bottom-0 z-10 flex items-center pl-2 pr-8 pointer-events-none transition-opacity duration-200 ${
            canLeft ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(to right, white 60%, transparent)",
          }}
        >
          <button
            onClick={() => scroll("left")}
            disabled={!canLeft}
            className="pointer-events-auto w-8 h-8 bg-white border border-[#ECEAE4] hover:border-[#009681] rounded-full flex items-center justify-center shadow-md transition-colors"
          >
            <ChevronLeft size={16} className="text-[#53565A]" />
          </button>
        </div>
      )}

      {/* Mobile swipe hint — right arrow when not yet scrolled */}
      {isMobile && showSwipeHint && canRight && !canLeft && (
        <div
          className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-end pr-2 pl-8 pointer-events-none"
          style={{ background: "linear-gradient(to left, white 50%, transparent)" }}
        >
          <motion.div
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronRight size={20} className="text-[#009681]" />
          </motion.div>
        </div>
      )}

      {/* Mobile swipe hint — left arrow once user has scrolled right */}
      {isMobile && showSwipeHint && canLeft && !canRight && (
        <div
          className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-2 pr-8 pointer-events-none"
          style={{ background: "linear-gradient(to right, white 50%, transparent)" }}
        >
          <motion.div
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronLeft size={20} className="text-[#009681]" />
          </motion.div>
        </div>
      )}

      {/* Scrollable pills */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 px-6 py-3 overflow-x-auto w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.filter-scroll::-webkit-scrollbar { display: none; }`}</style>

        {/* All button */}
        <button
          onClick={() => setFiltro(null)}
          className={`flex items-center gap-2 shrink-0 font-['Barlow_Condensed'] font-bold text-sm tracking-wide uppercase px-4 py-2 rounded-full transition-all ${
            filtro === null
              ? "bg-[#154734] text-white shadow-sm"
              : "bg-[#F7F5F0] text-[#53565A] hover:bg-[#ECEAE4]"
          }`}
        >
          <Grid3X3 size={14} />
          Todos
        </button>

        {categorias.map((cat) => {
          const isActive = filtro === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => setFiltro(isActive ? null : cat.slug)}
              className="flex items-center gap-1.5 shrink-0 font-['Barlow_Condensed'] font-bold text-sm tracking-wide uppercase px-4 py-2 rounded-full transition-all"
              style={
                isActive
                  ? { backgroundColor: cat.color, color: "#fff" }
                  : { backgroundColor: "#F7F5F0", color: "#53565A" }
              }
            >
              <span className="text-base leading-none">{cat.icono}</span>
              {cat.titulo}
            </button>
          );
        })}
      </div>

      {/* Right fade + arrow — desktop only */}
      {!isMobile && (
        <div
          className={`absolute right-0 top-0 bottom-0 z-10 flex items-center pr-2 pl-8 pointer-events-none transition-opacity duration-200 ${
            canRight ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(to left, white 60%, transparent)",
          }}
        >
          <button
            onClick={() => scroll("right")}
            disabled={!canRight}
            className="pointer-events-auto w-8 h-8 bg-white border border-[#ECEAE4] hover:border-[#009681] rounded-full flex items-center justify-center shadow-md transition-colors"
          >
            <ChevronRight size={16} className="text-[#53565A]" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Servicios() {
  const [filtro, setFiltro] = useState<string | null>(null);
  const gridRef = useRef<HTMLElement>(null);
  const isFirstLoad = useRef(true);

  const serviciosFiltrados = filtro
    ? servicios.filter((s) => s.categoriaSlug === filtro)
    : servicios;

  const categoriaActiva = filtro ? categorias.find((c) => c.slug === filtro) : null;

  useEffect(() => {
    if (isFirstLoad.current) { isFirstLoad.current = false; return; }
    const el = gridRef.current;
    if (!el) return;
    const offset = el.getBoundingClientRect().top + window.scrollY - 130;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }, [filtro]);

  return (
    <main className="pt-16 min-h-screen bg-[#F7F5F0]">
      {/* Header */}
      <section className="bg-[#154734] pt-12 pb-10 px-6 relative overflow-hidden">
        <motion.img src={starburst} alt="" className="absolute top-6 right-10 w-44 opacity-15 pointer-events-none select-none"
          animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} />
        <motion.img src={xShape} alt="" className="absolute bottom-6 left-8 w-10 opacity-20 pointer-events-none select-none"
          animate={{ rotate: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-['Barlow_Condensed'] font-semibold text-[#009681] text-sm tracking-[0.3em] uppercase block mb-3">
                Catálogo completo
              </span>
              <h1 className="font-['Barlow_Condensed'] font-black text-white text-6xl md:text-7xl uppercase leading-none">
                Todos los
                <br />
                <span className="text-transparent [-webkit-text-stroke:2px_white]">Servicios</span>
              </h1>
            </div>
            <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-full">
              <span className="font-['Barlow_Condensed'] font-bold text-white text-sm tracking-widest uppercase">
                {serviciosFiltrados.length} resultado{serviciosFiltrados.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 z-40">
        <FilterBar filtro={filtro} setFiltro={setFiltro} />
      </div>

      {/* Category heading when filtered */}
      {categoriaActiva && (
        <div className="px-6 py-5 border-b border-white/10" style={{ backgroundColor: categoriaActiva.color }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{categoriaActiva.icono}</span>
              <div>
                <h2 className="font-['Barlow_Condensed'] font-black text-white text-2xl uppercase leading-none">
                  {categoriaActiva.titulo}
                </h2>
                <p className="font-['Barlow'] text-white/70 text-sm mt-0.5">{categoriaActiva.subtitulo}</p>
              </div>
            </div>
            <Link
              to={`/categorias/${categoriaActiva.slug}`}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white font-['Barlow_Condensed'] font-bold text-xs tracking-widest uppercase px-4 py-2 rounded-full transition-colors"
            >
              Ver categoría <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      )}

      {/* Services grid */}
      <section ref={gridRef} className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {serviciosFiltrados.map((svc, i) => {
            const cat = categorias.find((c) => c.slug === svc.categoriaSlug);
            return (
              <motion.div
                key={svc.path}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
              >
                <Link
                  to={`/categorias/${svc.categoriaSlug}/${svc.path}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={svc.imagenHero}
                      alt={svc.tituloServicio}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                      style={{ backgroundColor: svc.color }}
                    />
                    {cat && (
                      <span
                        className="absolute top-3 left-3 font-['Barlow_Condensed'] font-bold text-[10px] tracking-widest uppercase text-white px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      >
                        {cat.titulo}
                      </span>
                    )}
                    <span className="absolute bottom-2 right-3 font-['Barlow_Condensed'] font-black text-white/20 text-4xl leading-none select-none">
                      {String(svc.orden).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <div className="w-6 h-0.5 rounded-full mb-3" style={{ backgroundColor: svc.color }} />
                    <h3 className="font-['Barlow_Condensed'] font-black text-[#13322B] text-xl uppercase leading-tight mb-2">
                      {svc.tituloServicio}
                    </h3>
                    <p className="font-['Barlow'] text-[#53565A] text-sm leading-relaxed line-clamp-2 flex-1">
                      {svc.descripcion}
                    </p>
                    <div
                      className="flex items-center gap-1 mt-4 font-['Barlow_Condensed'] font-semibold text-xs tracking-widest uppercase"
                      style={{ color: svc.color }}
                    >
                      Ver servicio <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        {serviciosFiltrados.length === 0 && (
          <div className="text-center py-24">
            <p className="font-['Barlow_Condensed'] font-bold text-[#B1B3B3] text-2xl uppercase">
              No hay servicios en esta categoría
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
