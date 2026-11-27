import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ArrowRight, ChevronLeft, X, Maximize2, Play } from "lucide-react";
import { getCategoriaBySlug, categorias } from "../data/categorias";
import { getServiciosByCategoria, type GaleriaItem } from "../data/servicios";
import { openWhatsApp } from "../utils/whatsapp";
import { WhatsAppIcon } from "../components/WhatsAppIcon";

import starburst from "../../imports/02_starburst.png";
import xShape from "../../imports/05_x.png";

// ── Fullscreen lightbox ───────────────────────────────────────────────────────
function GalleryLightbox({
  galeria,
  index,
  onClose,
  onPrev,
  onNext,
  onSetIndex,
  color,
}: {
  galeria: GaleriaItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSetIndex: (i: number) => void;
  color: string;
}) {
  const item = galeria[index];

  // Close on Escape / arrow keys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0" onClick={(e) => e.stopPropagation()}>
        <span className="font-['Barlow_Condensed'] font-bold text-white/50 text-sm tracking-widest uppercase">
          {index + 1} / {galeria.length}
        </span>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X size={18} className="text-white" />
        </button>
      </div>

      {/* Main media */}
      <div className="flex-1 flex items-center justify-center px-4 relative min-h-0" onClick={(e) => e.stopPropagation()}>
        {/* Prev */}
        {galeria.length > 1 && (
          <button
            onClick={onPrev}
            className="absolute left-3 md:left-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
          >
            <ChevronLeft size={22} className="text-white" />
          </button>
        )}

        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="max-w-5xl w-full max-h-full flex items-center justify-center"
        >
          {item.type === "video" ? (
            <video
              src={item.url}
              poster={item.thumbnail}
              controls
              muted
              playsInline
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              onVolumeChange={(e) => { e.currentTarget.muted = true; }}
              autoPlay
              className="max-h-[75vh] max-w-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={item.url}
              alt={item.caption ?? ""}
              className="max-h-[75vh] max-w-full rounded-xl object-contain select-none"
              draggable={false}
            />
          )}
        </motion.div>

        {/* Next */}
        {galeria.length > 1 && (
          <button
            onClick={onNext}
            className="absolute right-3 md:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
          >
            <ChevronRight size={22} className="text-white" />
          </button>
        )}
      </div>

      {/* Caption */}
      {item.caption && (
        <div className="text-center py-3 shrink-0">
          <p className="font-['Montserrat'] text-white/60 text-sm">{item.caption}</p>
        </div>
      )}

      {/* Thumbnail strip */}
      {galeria.length > 1 && (
        <div className="flex gap-2 justify-center px-4 pb-5 pt-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }} onClick={(e) => e.stopPropagation()}>
          {galeria.map((it, i) => (
            <button
              key={i}
              onClick={() => onSetIndex(i)}
              className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all duration-200"
              style={{ outline: i === index ? `2px solid ${color}` : "2px solid transparent", outlineOffset: "2px", opacity: i === index ? 1 : 0.45 }}
            >
              <img
                src={it.type === "video" ? (it.thumbnail ?? it.url) : it.url}
                alt=""
                className="w-full h-full object-cover"
              />
              {it.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play size={12} className="text-white fill-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Horizontal filter bar (shared logic with /servicios) ─────────────────────
function ServiceFilterBar({
  serviciosCat,
  activeServicePath,
  setActiveServicePath,
  color,
}: {
  serviciosCat: ReturnType<typeof getServiciosByCategoria>;
  activeServicePath: string;
  setActiveServicePath: (p: string) => void;
  color: string;
  // "todos" is a special value — show overview grid
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [update, serviciosCat]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const hide = () => setShowSwipeHint(false);
    el.addEventListener("touchstart", hide, { once: true });
    return () => el.removeEventListener("touchstart", hide);
  }, []);

  // Scroll active pill into view whenever selection changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const active = el.querySelector("[data-active='true']") as HTMLElement | null;
    if (active) {
      active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeServicePath]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center bg-white border-b border-[#ECEAE4] shadow-sm">
      {/* Desktop left arrow */}
      {!isMobile && (
        <div
          className={`absolute left-0 top-0 bottom-0 z-10 flex items-center pl-2 pr-8 pointer-events-none transition-opacity duration-200 ${canLeft ? "opacity-100" : "opacity-0"}`}
          style={{ background: "linear-gradient(to right, white 60%, transparent)" }}
        >
          <button
            onClick={() => scroll("left")}
            disabled={!canLeft}
            className="pointer-events-auto w-8 h-8 bg-white border border-[#ECEAE4] hover:border-current rounded-full flex items-center justify-center shadow-md transition-colors"
            style={{ color }}
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}

      {/* Mobile hint — right side (before scrolling) */}
      {isMobile && showSwipeHint && canRight && !canLeft && (
        <div
          className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-end pr-2 pl-8 pointer-events-none"
          style={{ background: "linear-gradient(to left, white 50%, transparent)" }}
        >
          <motion.div
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronRight size={20} style={{ color }} />
          </motion.div>
        </div>
      )}

      {/* Mobile hint — left side (after scrolling to end) */}
      {isMobile && showSwipeHint && canLeft && !canRight && (
        <div
          className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-2 pr-8 pointer-events-none"
          style={{ background: "linear-gradient(to right, white 50%, transparent)" }}
        >
          <motion.div
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronLeft size={20} style={{ color }} />
          </motion.div>
        </div>
      )}

      {/* Pills */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 px-6 py-3 overflow-x-auto w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* "Todos" pill */}
        <button
          data-active={activeServicePath === "todos"}
          onClick={() => setActiveServicePath("todos")}
          className="shrink-0 font-['Barlow_Condensed'] font-bold text-sm tracking-wide uppercase px-4 py-2 rounded-full transition-all"
          style={activeServicePath === "todos" ? { backgroundColor: color, color: "#fff" } : { backgroundColor: "#F7F5F0", color: "#53565A" }}
        >
          Todos
        </button>

        {serviciosCat.map((svc) => {
          const isActive = svc.path === activeServicePath;
          return (
            <button
              key={svc.path}
              data-active={isActive}
              onClick={() => setActiveServicePath(svc.path)}
              className="shrink-0 font-['Barlow_Condensed'] font-bold text-sm tracking-wide uppercase px-4 py-2 rounded-full transition-all"
              style={isActive ? { backgroundColor: color, color: "#fff" } : { backgroundColor: "#F7F5F0", color: "#53565A" }}
            >
              {svc.tituloServicio}
            </button>
          );
        })}
      </div>

      {/* Desktop right arrow */}
      {!isMobile && (
        <div
          className={`absolute right-0 top-0 bottom-0 z-10 flex items-center pr-2 pl-8 pointer-events-none transition-opacity duration-200 ${canRight ? "opacity-100" : "opacity-0"}`}
          style={{ background: "linear-gradient(to left, white 60%, transparent)" }}
        >
          <button
            onClick={() => scroll("right")}
            disabled={!canRight}
            className="pointer-events-auto w-8 h-8 bg-white border border-[#ECEAE4] hover:border-current rounded-full flex items-center justify-center shadow-md transition-colors"
            style={{ color }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CategoriaDetalle() {
  const { slug, servicePath: servicePathParam } = useParams<{ slug: string; servicePath: string }>();
  const navigate = useNavigate();

  const categoria = getCategoriaBySlug(slug ?? "");
  const serviciosCat = getServiciosByCategoria(slug ?? "");

  const [activeServicePath, setActiveServicePath] = useState<string>("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollOnChange = useRef(false);

  // Set initial tab from URL — no scroll, only user clicks scroll
  useEffect(() => {
    if (serviciosCat.length === 0) return;
    scrollOnChange.current = false;
    if (servicePathParam && serviciosCat.find((s) => s.path === servicePathParam)) {
      setActiveServicePath(servicePathParam);
    } else {
      setActiveServicePath("todos");
    }
  }, [slug, servicePathParam]);

  // Update URL when tab changes (replace so back button still works)
  const handleTabChange = (path: string) => {
    scrollOnChange.current = true;
    setActiveServicePath(path);
    if (path === "todos") {
      navigate(`/categorias/${slug}`, { replace: true });
    } else {
      navigate(`/categorias/${slug}/${path}`, { replace: true });
    }
  };

  useEffect(() => {
    setActiveImageIndex(0);
    if (!scrollOnChange.current) return;
    scrollOnChange.current = false;
    const el = contentRef.current;
    if (!el) return;
    const offset = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }, [activeServicePath]);

  if (!categoria) {
    return (
      <main className="pt-16 min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="text-center px-6">
          <div className="font-['Barlow_Condensed'] font-black text-[#ECEAE4] text-[10rem] leading-none select-none">404</div>
          <h1 className="font-['Barlow_Condensed'] font-black text-[#13322B] text-4xl uppercase mb-4 -mt-6">
            Categoría no encontrada
          </h1>
          <Link to="/categorias" className="inline-flex items-center gap-2 bg-[#009681] text-white font-['Barlow_Condensed'] font-bold text-sm tracking-widest uppercase px-6 py-3 rounded-full">
            <ChevronLeft size={16} /> Ver categorías
          </Link>
        </div>
      </main>
    );
  }

  const activeService = serviciosCat.find((s) => s.path === activeServicePath);
  const galeria = activeService?.galeria ?? [];
  const mainImage = galeria[activeImageIndex];

  const handleWhatsApp = () => {
    openWhatsApp(activeService?.tituloServicio ?? categoria?.titulo ?? "");
  };

  return (
    <main className="pt-16 min-h-screen bg-[#F7F5F0]">

      {/* ── 1. Header ── */}
      <section
        className="relative pt-12 pb-10 px-6 overflow-hidden"
        style={{ backgroundColor: categoria.color }}
      >
        <motion.img src={starburst} alt="" className="absolute top-4 right-8 w-36 md:w-48 opacity-15 pointer-events-none select-none"
          animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} />
        <motion.img src={xShape} alt="" className="absolute bottom-4 left-6 w-12 opacity-20 pointer-events-none select-none"
          animate={{ rotate: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <span className="font-['Barlow_Condensed'] font-black text-5xl md:text-7xl opacity-10 select-none block leading-none mb-2">
                {categoria.icono}
              </span>
              <h1 className="font-['Barlow_Condensed'] font-black text-white text-5xl md:text-7xl uppercase leading-none">
                {categoria.titulo}
              </h1>
              <p className="font-['Montserrat'] text-white/70 text-base mt-2 max-w-2xl">
                {categoria.subtitulo}
                {categoria.detalleEncabezado?.map((linea) => (
                  <span key={linea} className="block">{linea}</span>
                ))}
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
              <span className="font-['Barlow_Condensed'] font-bold text-white text-sm tracking-widest uppercase">
                {serviciosCat.length} servicio{serviciosCat.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Filter bar (sticky, full width) ── */}
      <div className="sticky top-16 z-40">
        <ServiceFilterBar
          serviciosCat={serviciosCat}
          activeServicePath={activeServicePath}
          setActiveServicePath={handleTabChange}
          color={categoria.color}
        />
      </div>

      {/* ── 3. Content ── */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-6 py-10">

        {/* ── "Todos" overview grid ── */}
        {activeServicePath === "todos" && (
          <motion.div
            key="todos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {serviciosCat.map((svc, i) => (
              <motion.button
                key={svc.path}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleTabChange(svc.path)}
                className="group relative flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-left"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] bg-[#ECEAE4] overflow-hidden">
                  {svc.galeria[0] && (
                    <img
                      src={svc.galeria[0].type === "video" ? (svc.galeria[0].thumbnail ?? svc.imagenHero) : svc.galeria[0].url}
                      alt={svc.tituloServicio}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {/* Color top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: categoria.color }} />
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col gap-1 flex-1">
                  <p className="font-['Barlow_Condensed'] font-black text-[#13322B] text-sm uppercase leading-tight line-clamp-2">
                    {svc.tituloServicio}
                  </p>
                  <p className="font-['Montserrat'] text-[#888B8D] text-xs leading-snug line-clamp-2 flex-1">
                    {svc.descripcion}
                  </p>
                  <span
                    className="mt-1 inline-flex items-center gap-1 font-['Barlow_Condensed'] font-bold text-xs tracking-wide uppercase transition-colors"
                    style={{ color: categoria.color }}
                  >
                    Ver más <ArrowRight size={11} />
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {activeServicePath !== "todos" && activeService ? (
          <motion.div
            key={activeService.path}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col lg:flex-row gap-8 items-start lg:items-start"
          >
            {/* ── Left: service info (40%) ── */}
            <div className="w-full lg:w-[40%] shrink-0 lg:sticky lg:top-[120px] lg:self-start space-y-5">

              {/* Title block */}
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <span
                  className="inline-block font-['Barlow_Condensed'] font-bold text-xs tracking-widest uppercase text-white px-3 py-1 rounded-full mb-4"
                  style={{ backgroundColor: categoria.color }}
                >
                  {categoria.titulo}
                </span>

                <h2 className="font-['Barlow_Condensed'] font-black text-[#13322B] text-3xl md:text-4xl uppercase leading-tight mb-3">
                  {activeService.tituloServicio}
                </h2>

                <div className="w-10 h-1 rounded-full mb-4" style={{ backgroundColor: categoria.color }} />

                <p className="font-['Montserrat'] text-[#53565A] text-base leading-relaxed">
                  {activeService.descripcion}
                </p>
              </div>

              {/* Sub-services */}
              {/*
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <p className="font-['Barlow_Condensed'] font-semibold text-xs tracking-[0.2em] uppercase text-[#888B8D] mb-3">
                  Incluye
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeService.subservicios.map((sub, i) => (
                    <span
                      key={i}
                      className="font-['Montserrat'] text-xs text-[#53565A] bg-[#F7F5F0] border border-[#ECEAE4] px-3 py-1.5 rounded-full"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
              */}

              

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fbb5a] text-white font-['Barlow_Condensed'] font-bold text-sm tracking-[0.15em] uppercase px-6 py-4 rounded-full transition-colors shadow-sm"
                >
                  <WhatsAppIcon size={18} />
                  Cotiza ahora
                </button>
              </div>
            </div>

            {/* ── Right: gallery (60%) ── */}
            <div className="w-full lg:flex-1 min-w-0 overflow-hidden">
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
                {/* Main media */}
                <div className="relative w-full aspect-[4/3] bg-[#ECEAE4] overflow-hidden group">
                  {mainImage && (
                    mainImage.type === "video" ? (
                      <video
                        key={mainImage.url}
                        src={mainImage.url}
                        poster={mainImage.thumbnail}
                        controls
                        muted
                        playsInline
                        controlsList="nodownload noplaybackrate"
                        disablePictureInPicture
                        onVolumeChange={(e) => { e.currentTarget.muted = true; }}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <motion.img
                        key={mainImage.url}
                        src={mainImage.url}
                        alt={mainImage.caption ?? activeService.tituloServicio}
                        className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setLightboxOpen(true)}
                      />
                    )
                  )}

                  {/* Fullscreen button (images only) */}
                  {mainImage && mainImage.type !== "video" && (
                    <button
                      onClick={() => setLightboxOpen(true)}
                      className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                      title="Ver en pantalla completa"
                    >
                      <Maximize2 size={14} className="text-white" />
                    </button>
                  )}

                  {galeria.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImageIndex((i) => (i - 1 + galeria.length) % galeria.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors z-10"
                      >
                        <ChevronLeft size={18} className="text-[#13322B]" />
                      </button>
                      <button
                        onClick={() => setActiveImageIndex((i) => (i + 1) % galeria.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors z-10"
                      >
                        <ChevronRight size={18} className="text-[#13322B]" />
                      </button>
                    </>
                  )}
                  {galeria.length > 0 && (
                    <div className="absolute bottom-3 left-3 bg-black/40 text-white font-['Montserrat'] text-xs px-2.5 py-1 rounded-full z-10">
                      {activeImageIndex + 1} / {galeria.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail strip */}
                {galeria.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    {galeria.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`relative shrink-0 rounded-xl overflow-hidden transition-all duration-200 ${
                          i === activeImageIndex ? "opacity-100" : "opacity-50 hover:opacity-80"
                        }`}
                        style={{
                          width: "4rem",
                          height: "4rem",
                          outline: i === activeImageIndex ? `2.5px solid ${categoria.color}` : "none",
                          outlineOffset: "2px",
                        }}
                      >
                        <img
                          src={item.type === "video" ? (item.thumbnail ?? item.url) : item.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {item.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play size={14} className="text-white fill-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : activeServicePath !== "todos" && (
          <div className="flex items-center justify-center h-64">
            <p className="font-['Montserrat'] text-[#888B8D]">Selecciona un servicio</p>
          </div>
        )}
      </div>

      {/* ── Other categories ── */}
      <section className="border-t border-[#ECEAE4] bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-['Barlow_Condensed'] font-semibold text-xs tracking-[0.25em] uppercase text-[#888B8D] mb-5">
            Explorar otras categorías
          </p>
          <div className="flex flex-wrap gap-3">
            {categorias
              .filter((c) => c.slug !== slug)
              .map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/categorias/${cat.slug}`}
                  className="flex items-center gap-2 bg-[#F7F5F0] hover:bg-white border border-[#ECEAE4] hover:border-current hover:shadow-sm font-['Barlow_Condensed'] font-bold text-sm tracking-wide uppercase px-5 py-2.5 rounded-full transition-all"
                  style={{ color: cat.color }}
                >
                  <span>{cat.icono}</span>
                  {cat.titulo}
                </Link>
              ))}
            <Link
              to="/categorias"
              className="flex items-center gap-2 bg-[#13322B] hover:bg-[#154734] text-white font-['Barlow_Condensed'] font-bold text-sm tracking-wide uppercase px-5 py-2.5 rounded-full transition-colors"
            >
              Ver todas <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Fullscreen lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && activeService && (
          <GalleryLightbox
            galeria={galeria}
            index={activeImageIndex}
            color={categoria.color}
            onClose={() => setLightboxOpen(false)}
            onPrev={() => setActiveImageIndex((i) => (i - 1 + galeria.length) % galeria.length)}
            onNext={() => setActiveImageIndex((i) => (i + 1) % galeria.length)}
            onSetIndex={setActiveImageIndex}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
