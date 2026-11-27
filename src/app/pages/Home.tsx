import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";
// MessageCircle kept for contact section buttons
import { categorias } from "../data/categorias";
import { servicios } from "../data/servicios";
import { openWhatsApp } from "../utils/whatsapp";
import { WhatsAppIcon } from "../components/WhatsAppIcon";
import { NuevoSlider } from "../components/sliders/NuevoSlider";

// Slider principal del inicio: true = nuevo slider (presentación de 8 slides),
// false = slider anterior de categorías (se conserva como respaldo más abajo).
const USAR_SLIDER_NUEVO = true;

// Decorative graphic elements
import starburst from "../../imports/02_starburst.png";
import sunburst from "../../imports/08_sunburst.png";
import hexagon from "../../imports/01_hexagon.png";
import flower from "../../imports/07_flower.png";
import badge from "../../imports/10_badge.png";
import xShape from "../../imports/05_x.png";
import fourDots from "../../imports/06_four_dots.png";
import nestedCorner from "../../imports/03_nested_corner.png";
import arrow from "../../imports/12_arrow.png";

// Imágenes del slider (una por categoría)
import sliderImpresion from "../../imports/sliders/impresion-slider.png";
import sliderGranFormato from "../../imports/sliders/gran-formato-slider.png";
import sliderVinil from "../../imports/sliders/vinil-y-rotulacion-slider.jpeg";
import sliderDtfTextil from "../../imports/sliders/dtf-textil-slider.jpg";
import sliderDtfUv from "../../imports/sliders/dtf-uv-slider.jpeg";
import sliderGrabado from "../../imports/sliders/grabado-laser-slider.jpeg";

const sliderImages: Record<string, string> = {
  "impresion": sliderImpresion,
  "gran-formato": sliderGranFormato,
  "vinil-rotulacion": sliderVinil,
  "dtf-textil": sliderDtfTextil,
  "dtf-uv": sliderDtfUv,
  "grabado-corte-laser": sliderGrabado,
};

// 6 slider categories (excluding "otros-servicios")
const sliderCats = categorias.filter((c) => c.slug !== "otros-servicios");

const faqs = [
  {
    question: "¿Cuál es el tiempo de entrega?",
    answer: "El tiempo de entrega varía según el producto y la cantidad. En general, manejamos entregas entre 5 y 15 días hábiles. Para pedidos urgentes, ofrecemos servicio express.",
  },
  {
    question: "¿Tienen un pedido mínimo?",
    answer: "Sí, manejamos diferentes cantidades mínimas dependiendo del producto. Contáctanos para conocer los detalles específicos de tu proyecto.",
  },
  {
    question: "¿Puedo ver una muestra antes de producir?",
    answer: "¡Por supuesto! Ofrecemos mockups digitales y, en algunos casos, muestras físicas antes de la producción final.",
  },
  {
    question: "¿Qué métodos de personalización ofrecen?",
    answer: "Ofrecemos serigrafía, sublimación, bordado, grabado láser, impresión digital y más. Cada método depende del producto y tus necesidades específicas.",
  },
  {
    question: "¿Hacen envíos a toda la república?",
    answer: "Sí, realizamos envíos a nivel nacional. Trabajamos con las mejores paqueterías para garantizar entregas seguras y puntuales.",
  },
];

const sliderServices = servicios.filter((s) => s.esEstrella);

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "", mensaje: "" });
  const [formSent, setFormSent] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
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

  const scrollToContact = () => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 4000);
    setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
  };

  const activeCat = sliderCats[currentSlide];
  const catServices = servicios.filter((s) => s.categoriaSlug === activeCat.slug).slice(0, 6);

  // Touch swipe for mobile slider
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) setCurrentSlide((p) => delta > 0 ? (p + 1) % sliderCats.length : (p - 1 + sliderCats.length) % sliderCats.length);
    touchStartX.current = null;
  };

  return (
    <main>
      {/* ─── HERO + SEARCH (100vh) ─── */}
      <div className="h-screen min-h-[640px] flex flex-col pt-16">

        {/* ── Slider (90%) ── */}
        {USAR_SLIDER_NUEVO ? (
          <div className="relative flex-1 overflow-hidden">
            <NuevoSlider />
          </div>
        ) : (
        /* Respaldo: slider anterior de categorías. Para regresarlo, cambia USAR_SLIDER_NUEVO a false. */
        <div
          className="relative flex-1 overflow-hidden bg-black"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slide backgrounds — full-bleed image + overlays */}
          {sliderCats.map((cat, i) => {
            const isActive = i === currentSlide;
            return (
              <div
                key={cat.slug}
                className="absolute inset-0 transition-opacity duration-[1500ms] lg:bg-[var(--cat)]"
                style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none", ["--cat" as string]: cat.color }}
              >
                {/* Imagen en la mitad derecha, pegada a la mitad del slider: máx. 50% del ancho en desktop (lg),
                    con padding y esquinas redondeadas; el fondo toma el color de la categoría.
                    En móvil ocupa todo el fondo. */}
                <div className="absolute inset-0 lg:left-1/2 lg:flex lg:items-center lg:justify-start lg:p-12">
                  <img
                    src={sliderImages[cat.slug] ?? cat.imagenHero}
                    alt={cat.titulo}
                    className="w-full h-full object-cover lg:w-auto lg:h-auto lg:max-w-full lg:max-h-full lg:object-contain lg:rounded-3xl lg:shadow-2xl"
                  />
                </div>
                {/* Overlay oscuro solo en móvil/tablet, donde el texto va encima de la imagen */}
                <div className="absolute inset-0 bg-black/60 lg:hidden" />
                {/* Color tint from category color — bottom vignette */}
                <div
                  className="absolute inset-0 opacity-20 lg:hidden"
                  style={{ background: `linear-gradient(135deg, ${cat.color}60 0%, transparent 60%)` }}
                />
              </div>
            );
          })}

          {/* Decorative elements */}
          <motion.img src={starburst} alt="" className="absolute top-6 right-[48%] md:right-[52%] w-16 opacity-15 pointer-events-none select-none z-10"
            animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
          <motion.img src={xShape} alt="" className="absolute bottom-12 left-8 w-10 opacity-20 pointer-events-none select-none z-10"
            animate={{ rotate: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
          <motion.img src={hexagon} alt="" className="absolute top-16 left-4 w-14 opacity-10 pointer-events-none select-none z-10 hidden md:block"
            animate={{ y: [-8, 8, -8] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />

          {/* ── Slide content ── */}
          <div className="relative z-20 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
              <div className="relative max-w-xl lg:max-w-[min(36rem,46%)] min-h-[420px] flex items-center">
                {sliderCats.map((cat, i) => {
                  const isActive = i === currentSlide;
                  const svcs = servicios.filter((s) => s.categoriaSlug === cat.slug).slice(0, 6);
                  return (
                    <div
                      key={cat.slug}
                      className="absolute inset-x-0 top-0 transition-all duration-[1200ms]"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "translateY(0)" : "translateY(16px)",
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                    >
                      {/* Category badge */}
                      <span
                        className="inline-flex items-center gap-2 font-['Barlow_Condensed'] font-bold text-xs tracking-[0.25em] uppercase text-white px-3 py-1.5 rounded-full mb-5 bg-[var(--cat)] lg:bg-black/25"
                        style={{ ["--cat" as string]: cat.color }}
                      >
                        <span>{cat.icono}</span>
                        {cat.subtitulo}
                      </span>

                      {/* Title */}
                      <h1 className="font-['Barlow_Condensed'] font-black text-white text-[3.2rem] md:text-[4.8rem] lg:text-[5.8rem] uppercase leading-[0.88] mb-6">
                        {cat.titulo}
                      </h1>

                      {/* Service bullet list */}
                      <ul className="space-y-2 mb-8">
                        {svcs.map((svc) => (
                          <li key={svc.path} className="flex items-center gap-3">
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0 bg-[var(--cat)] lg:bg-white"
                              style={{ ["--cat" as string]: cat.color }}
                            />
                            <span className="font-['Montserrat'] text-white/80 text-base">
                              {svc.tituloServicio}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* CTAs */}
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={`/categorias/${cat.slug}`}
                          className="inline-flex items-center gap-2 text-white bg-[var(--cat)] lg:bg-white lg:text-black font-['Barlow_Condensed'] font-bold text-sm tracking-[0.15em] uppercase px-6 py-3 rounded-full transition-all hover:brightness-110 active:scale-95"
                          style={{ ["--cat" as string]: cat.color }}
                        >
                          Ver más <ArrowRight size={16} />
                        </Link>
                        <button
                          onClick={() => openWhatsApp(cat.titulo)}
                          className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-['Barlow_Condensed'] font-bold text-sm tracking-[0.15em] uppercase px-6 py-3 rounded-full transition-all active:scale-95"
                        >
                          <WhatsAppIcon size={16} />
                          Cotiza ahora
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Navigation: dots only ── */}
          <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2">
            {sliderCats.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-300 rounded-full ${i === currentSlide ? "bg-[var(--cat)] lg:bg-white" : "bg-white/35"}`}
                style={{
                  width: i === currentSlide ? "2rem" : "0.5rem",
                  height: "0.5rem",
                  ["--cat" as string]: activeCat.color,
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
        )}

        {/* ── Search bar (10%) ── */}
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
                className="flex-1 px-3 py-3 text-[#13322B] font-['Montserrat'] placeholder-[#888B8D] focus:outline-none bg-transparent text-sm"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setShowResults(false); }} className="mr-4 text-[#888B8D] hover:text-[#13322B]">✕</button>
              )}
            </div>
            {showResults && searchResults.length > 0 && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-white shadow-2xl z-50 rounded-2xl overflow-hidden border border-[#ECEAE4]">
                {searchResults.map((svc) => (
                  <button
                    key={svc.path}
                    onMouseDown={() => handleResultClick(svc.path)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F7F5F0] transition-colors text-left group"
                  >
                    <span className="w-1 h-8 shrink-0 rounded-full" style={{ backgroundColor: svc.color }} />
                    <div>
                      <div className="font-['Montserrat'] font-semibold text-sm text-[#13322B] group-hover:text-[#009681] transition-colors">{svc.tituloServicio}</div>
                      <div className="font-['Montserrat'] text-xs text-[#888B8D]">{svc.subservicios[0]}</div>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-[#888B8D]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── SERVICIOS DESTACADOS ─── */}
      <section className="py-24 bg-[#F7F5F0] relative overflow-hidden">
        <motion.img src={nestedCorner} alt="" className="absolute top-0 right-0 w-28 md:w-40 opacity-15 pointer-events-none select-none"
          animate={{ rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
        <motion.img src={xShape} alt="" className="absolute bottom-12 left-8 w-10 opacity-20 pointer-events-none select-none"
          animate={{ rotate: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-14">
            <span className="font-['Barlow_Condensed'] font-semibold text-[#009681] text-sm tracking-[0.3em] uppercase block mb-3">
              01 — Lo que hacemos
            </span>
            <h2 className="font-['Barlow_Condensed'] font-black text-[#13322B] text-5xl lg:text-6xl uppercase leading-tight">
              Servicios<br />
              <span className="text-transparent [-webkit-text-stroke:2px_#13322B]">Destacados</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.filter((s) => s.esEstrella).concat(
              servicios.filter((s) => !s.esEstrella).slice(0, 3)
            ).slice(0, 6).map((svc) => (
              <Link key={svc.path} to={`/categorias/${svc.categoriaSlug}/${svc.path}`}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden rounded-t-2xl">
                  {svc.imagenHero && <img src={svc.imagenHero} alt={svc.tituloServicio} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <div className="absolute inset-0 opacity-70 group-hover:opacity-60 transition-opacity" style={{ backgroundColor: svc.color }} />
                  <span className="absolute top-4 left-4 font-['Barlow_Condensed'] font-black text-white text-4xl opacity-20">{String(svc.orden).padStart(2, "0")}</span>
                </div>
                <div className="p-6">
                  <div className="w-8 h-0.5 mb-4 rounded-full" style={{ backgroundColor: svc.color }} />
                  <h3 className="font-['Barlow_Condensed'] font-bold text-[#13322B] text-xl uppercase tracking-wide mb-2">{svc.tituloServicio}</h3>
                  <p className="font-['Montserrat'] text-[#53565A] text-sm leading-relaxed line-clamp-2">{svc.descripcion}</p>
                  <div className="flex items-center gap-1 mt-4 font-['Barlow_Condensed'] font-semibold text-xs tracking-widest uppercase transition-colors group-hover:text-[#009681]" style={{ color: svc.color }}>
                    Ver servicio <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA button — below the 6 cards */}
          <div className="flex justify-center mt-12">
            <Link
              to="/servicios"
              className="inline-flex items-center gap-3 bg-[#13322B] hover:bg-[#154734] text-white font-['Barlow_Condensed'] font-bold text-sm tracking-[0.2em] uppercase px-10 py-4 rounded-full transition-colors shadow-md"
            >
              <img src={arrow} alt="" className="w-5 h-5 object-contain invert" />
              Ver todos los servicios
            </Link>
          </div>
        </div>
      </section>

      {/* ─── QUIÉNES SOMOS ─── */}
      <section className="bg-[#154734] py-24 lg:py-32 relative overflow-hidden">
        <motion.img src={flower} alt="" className="absolute -top-6 -right-6 w-40 md:w-56 opacity-20 pointer-events-none select-none"
          animate={{ rotate: 360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} />
        <motion.img src={badge} alt="" className="absolute bottom-8 right-12 w-24 md:w-32 opacity-15 pointer-events-none select-none"
          animate={{ rotate: -360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} />
        <motion.img src={fourDots} alt="" className="absolute top-8 left-8 w-16 opacity-30 pointer-events-none select-none"
          animate={{ y: [-5, 5, -5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left: stats */}
          <div className="relative">
            <div className="font-['Barlow_Condensed'] font-black text-[12rem] lg:text-[18rem] leading-none text-white/[0.04] select-none absolute -top-8 -left-4">PP</div>
            <div className="relative z-10">
              <span className="font-['Barlow_Condensed'] font-semibold text-[#009681] text-sm tracking-[0.3em] uppercase block mb-6">
                02 — Quiénes Somos
              </span>
              <div className="w-16 h-1 bg-[#FA4616] rounded-full mb-8" />
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: "28", label: "Años de experiencia" },
                  { num: "500+", label: "Clientes satisfechos" },
                  { num: "9", label: "Líneas de servicio" },
                  { num: "100%", label: "Compromiso con calidad" },
                ].map(({ num, label }) => (
                  <div key={label} className="border-l-2 border-[#009681] pl-4">
                    <div className="font-['Barlow_Condensed'] font-black text-4xl text-white">{num}</div>
                    <div className="font-['Montserrat'] text-white/50 text-sm mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: copy */}
          <div className="space-y-6">
            <h2 className="font-['Barlow_Condensed'] font-black text-white text-5xl lg:text-6xl uppercase leading-tight">
              Especialistas en
              <br />
              <span className="text-[#009681]">hacer brillar</span>
              <br />
              tu marca
            </h2>
            <p className="font-['Montserrat'] text-white/70 text-base leading-relaxed">
              En Poster People somos especialistas en soluciones de merchandising e impresión que ayudan a las marcas a destacar y conectar con sus clientes. Combinamos creatividad, innovación y calidad para desarrollar productos personalizados que impulsan la identidad de cada negocio.
            </p>
            <p className="font-['Montserrat'] text-white/70 text-base leading-relaxed">
              Nuestro compromiso con la excelencia, la responsabilidad y la atención personalizada nos convierte en un aliado estratégico para empresas que buscan proyectar su marca con soluciones visuales de alto impacto.
            </p>
            <button
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 bg-[#FA4616] hover:bg-[#e03a0f] text-white font-['Barlow_Condensed'] font-bold text-sm tracking-[0.15em] uppercase px-7 py-3 rounded-full transition-colors mt-2"
            >
              Contáctanos <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <motion.img src={nestedCorner} alt="" className="absolute top-0 left-0 w-36 md:w-48 opacity-10 pointer-events-none select-none" />
        <motion.img src={sunburst} alt="" className="absolute bottom-8 right-8 w-20 md:w-28 opacity-12 pointer-events-none select-none"
          animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
        <motion.img src={hexagon} alt="" className="absolute top-1/2 -right-6 w-20 opacity-10 pointer-events-none select-none"
          animate={{ y: [-8, 8, -8] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <span className="font-['Barlow_Condensed'] font-semibold text-[#009681] text-sm tracking-[0.3em] uppercase block mb-3">
              03 — Preguntas frecuentes
            </span>
            <h2 className="font-['Barlow_Condensed'] font-black text-[#13322B] text-5xl uppercase leading-tight">
              Todo lo que<br />
              <span className="text-[#FA4616]">necesitas saber</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className={`border rounded-2xl transition-all duration-200 ${openFaq === i ? "border-[#009681] shadow-md" : "border-[#ECEAE4] hover:border-[#B1B3B3]"}`}>
                <button className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-['Montserrat'] font-semibold text-[#13322B] text-base">{faq.question}</span>
                  <ChevronDown size={20} className={`shrink-0 text-[#009681] transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-48" : "max-h-0"}`}>
                  <p className="px-6 pb-5 font-['Montserrat'] text-[#53565A] text-sm leading-relaxed border-t border-[#ECEAE4] pt-4">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACTO ─── */}
      <section id="contacto" className="py-24 bg-[#13322B] relative overflow-hidden">
        <motion.img src={starburst} alt="" className="absolute top-8 right-8 w-24 md:w-36 opacity-10 pointer-events-none select-none"
          animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
        <motion.img src={xShape} alt="" className="absolute bottom-8 left-8 w-14 opacity-15 pointer-events-none select-none"
          animate={{ rotate: [0, 30, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
        <motion.img src={flower} alt="" className="absolute -bottom-8 right-1/4 w-24 opacity-10 pointer-events-none select-none"
          animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-2xl rounded-3xl overflow-hidden">
            <div className="bg-white p-10 lg:p-14">
              <span className="font-['Barlow_Condensed'] font-semibold text-[#009681] text-sm tracking-[0.3em] uppercase block mb-3">04 — Contáctanos</span>
              <h2 className="font-['Barlow_Condensed'] font-black text-[#13322B] text-4xl lg:text-5xl uppercase leading-tight mb-8">
                Hablemos<br />de tu proyecto
              </h2>
              {formSent ? (
                <div className="bg-[#009681] text-white p-6 text-center rounded-2xl">
                  <div className="font-['Barlow_Condensed'] font-bold text-2xl uppercase mb-2">¡Mensaje enviado!</div>
                  <p className="font-['Montserrat'] text-sm text-white/80">Nos pondremos en contacto contigo muy pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {[
                    { name: "nombre", label: "Nombre completo", type: "text", placeholder: "Juan García" },
                    { name: "email", label: "Correo electrónico", type: "email", placeholder: "juan@empresa.com" },
                    { name: "telefono", label: "Teléfono", type: "tel", placeholder: "+52 55 1234 5678" },
                  ].map(({ name, label, type, placeholder }) => (
                    <div key={name}>
                      <label className="font-['Montserrat'] font-semibold text-xs tracking-widest uppercase text-[#53565A] block mb-1.5">{label}</label>
                      <input type={type} placeholder={placeholder} required
                        value={formData[name as keyof typeof formData]}
                        onChange={(e) => setFormData((f) => ({ ...f, [name]: e.target.value }))}
                        className="w-full border border-[#ECEAE4] px-4 py-3 rounded-xl font-['Montserrat'] text-sm text-[#13322B] placeholder-[#B1B3B3] focus:outline-none focus:border-[#009681] transition-colors bg-[#F7F5F0]"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="font-['Montserrat'] font-semibold text-xs tracking-widest uppercase text-[#53565A] block mb-1.5">Mensaje</label>
                    <textarea placeholder="Cuéntanos sobre tu proyecto..." rows={4} required
                      value={formData.mensaje}
                      onChange={(e) => setFormData((f) => ({ ...f, mensaje: e.target.value }))}
                      className="w-full border border-[#ECEAE4] px-4 py-3 rounded-xl font-['Montserrat'] text-sm text-[#13322B] placeholder-[#B1B3B3] focus:outline-none focus:border-[#009681] transition-colors bg-[#F7F5F0] resize-none"
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
            <div className="bg-[#154734] p-10 lg:p-14 flex flex-col justify-between">
              <div className="space-y-8">
                <div>
                  <h3 className="font-['Barlow_Condensed'] font-black text-white text-3xl uppercase mb-2">Estamos aquí<br />para ayudarte</h3>
                  <div className="w-12 h-1 bg-[#FA4616] rounded-full mt-4" />
                </div>
                <div className="space-y-5">
                  {[
                    { icon: Mail, label: "Email", value: "contacto@posterpeople.mx", href: "mailto:contacto@posterpeople.mx" },
                    { icon: Phone, label: "Teléfono", value: "+52 55 2959 9392", href: "tel:+525529599392" },
                    { icon: MessageCircle, label: "WhatsApp", value: "+52 55 2959 9392", href: "https://wa.me/525529599392" },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <a key={label} href={href} className="flex items-start gap-4 group">
                      <div className="w-10 h-10 bg-[#009681] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#FA4616] transition-colors">
                        <Icon size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="font-['Montserrat'] text-xs text-white/40 uppercase tracking-widest">{label}</div>
                        <div className="font-['Montserrat'] font-medium text-white group-hover:text-[#009681] transition-colors text-sm">{value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="mt-10">
                <p className="font-['Montserrat'] text-xs text-white/40 uppercase tracking-widest mb-4">Síguenos</p>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, label: "Instagram", href: "#" },
                    { icon: Facebook, label: "Facebook", href: "#" },
                    { icon: Linkedin, label: "LinkedIn", href: "#" },
                  ].map(({ icon: Icon, label, href }) => (
                    <a key={label} href={href} aria-label={label}
                      className="w-10 h-10 border border-white/20 hover:border-[#009681] hover:bg-[#009681] rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all"
                    >
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
