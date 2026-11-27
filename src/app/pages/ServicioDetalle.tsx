import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  X,
  Play,
  ChevronLeft,
  ZoomIn,
} from "lucide-react";
import { servicios, type GaleriaItem } from "../data/servicios";
import { getCategoriaBySlug } from "../data/categorias";
import { openWhatsApp } from "../utils/whatsapp";
import { WhatsAppIcon } from "../components/WhatsAppIcon";

import starburst from "../../imports/02_starburst.png";
import sunburst from "../../imports/08_sunburst.png";
import xShape from "../../imports/05_x.png";

function Lightbox({
  items,
  startIndex,
  onClose,
}: {
  items: GaleriaItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const item = items[index];

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + items.length) % items.length),
    [items.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % items.length),
    [items.length]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <div className="absolute top-5 left-5 z-10 font-['Barlow_Condensed'] font-bold text-sm tracking-widest text-white/60">
        {index + 1} / {items.length}
      </div>
      <button
        className="absolute left-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        onClick={(e) => { e.stopPropagation(); prev(); }}
      >
        <ChevronLeft size={24} />
      </button>
      <div
        className="max-w-5xl max-h-[80vh] w-full mx-16 flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === "video" ? (
          <video
            key={item.url}
            src={item.url}
            controls
            muted
            playsInline
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            onVolumeChange={(e) => { e.currentTarget.muted = true; }}
            autoPlay
            className="max-h-[72vh] w-full object-contain rounded-2xl"
          />
        ) : (
          <img
            key={item.url}
            src={item.url}
            alt={item.caption ?? ""}
            className="max-h-[72vh] w-full object-contain rounded-2xl"
          />
        )}
        {item.caption && (
          <p className="font-['Montserrat'] text-white/70 text-sm text-center">
            {item.caption}
          </p>
        )}
      </div>
      <button
        className="absolute right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        onClick={(e) => { e.stopPropagation(); next(); }}
      >
        <ChevronRight size={24} />
      </button>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
        {items.map((it, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIndex(i); }}
            className={`relative w-14 h-10 overflow-hidden shrink-0 rounded-lg transition-all ${
              i === index ? "ring-2 ring-white opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            <img
              src={it.type === "video" ? (it.thumbnail ?? it.url) : it.url}
              alt=""
              className="w-full h-full object-cover"
            />
            {it.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                <Play size={10} className="text-white fill-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ServicioDetalle() {
  const { path } = useParams<{ path: string }>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const servicio = servicios.find((s) => s.path === path);
  const cat = servicio ? getCategoriaBySlug(servicio.categoriaSlug) : null;

  if (!servicio) {
    return (
      <main className="pt-16 min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="text-center px-6">
          <div className="font-['Barlow_Condensed'] font-black text-[#ECEAE4] text-[10rem] leading-none select-none">
            404
          </div>
          <h1 className="font-['Barlow_Condensed'] font-black text-[#13322B] text-4xl uppercase mb-4 -mt-6">
            Servicio no encontrado
          </h1>
          <p className="font-['Montserrat'] text-[#53565A] text-base mb-8">
            El servicio que buscas no existe o fue movido.
          </p>
          <Link
            to="/categorias"
            className="inline-flex items-center gap-2 bg-[#009681] text-white font-['Barlow_Condensed'] font-bold text-sm tracking-widest uppercase px-6 py-3 rounded-full"
          >
            <ArrowLeft size={16} /> Ver categorías
          </Link>
        </div>
      </main>
    );
  }

  const sortedServices = [...servicios].sort((a, b) => a.orden - b.orden);
  const currentIndex = sortedServices.findIndex((s) => s.path === path);
  const prevService = currentIndex > 0 ? sortedServices[currentIndex - 1] : null;
  const nextService =
    currentIndex < sortedServices.length - 1 ? sortedServices[currentIndex + 1] : null;

  const otherServices = servicios
    .filter((s) => s.path !== path)
    .sort((a, b) => a.orden - b.orden)
    .slice(0, 3);

  const handleWhatsApp = () => openWhatsApp(servicio.tituloServicio);

  return (
    <main className="pt-16 min-h-screen bg-[#F7F5F0]">
      {lightboxIndex !== null && (
        <Lightbox
          items={servicio.galeria}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Hero */}
      <section className="relative h-[55vh] min-h-[360px] overflow-hidden">
        {servicio.imagenHero && (
          <img
            src={servicio.imagenHero}
            alt={servicio.tituloServicio}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0" style={{ backgroundColor: servicio.color + "E0" }} />

        {/* Decorative */}
        <motion.img
          src={starburst}
          alt=""
          className="absolute top-20 right-10 w-32 md:w-44 opacity-15 pointer-events-none select-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.img
          src={xShape}
          alt=""
          className="absolute bottom-16 left-8 w-12 opacity-20 pointer-events-none select-none"
          animate={{ rotate: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            {cat && (
              <span
                className="inline-block font-['Barlow_Condensed'] font-bold text-xs tracking-widest uppercase text-white px-4 py-1.5 rounded-full mb-6"
                style={{ backgroundColor: cat.color }}
              >
                {cat.titulo}
              </span>
            )}
            <h1 className="font-['Barlow_Condensed'] font-black text-white text-5xl md:text-7xl lg:text-8xl uppercase leading-none mb-6 max-w-4xl">
              {servicio.tituloServicio}
            </h1>
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-2 bg-white text-[#13322B] font-['Barlow_Condensed'] font-black text-sm tracking-[0.2em] uppercase px-7 py-3 rounded-full hover:bg-[#25D366] hover:text-white transition-colors"
            >
              <WhatsAppIcon size={16} />
              Cotiza ahora
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 right-8 z-10 font-['Barlow_Condensed'] font-black text-white/10 text-[12rem] leading-none select-none">
          {String(servicio.orden).padStart(2, "0")}
        </div>
      </section>

      {/* Body */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-14">
          <div>
            <div className="w-12 h-1 mb-6 rounded-full" style={{ backgroundColor: servicio.color }} />
            <p className="font-['Montserrat'] text-[#13322B] text-lg leading-relaxed">
              {servicio.descripcion}
            </p>
          </div>

          <div>
            <h2 className="font-['Barlow_Condensed'] font-black text-[#13322B] text-3xl uppercase mb-8">
              ¿Qué incluye?
            </h2>
            <ul className="space-y-4">
              {servicio.subservicios.map((sub, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckCircle
                    size={20}
                    className="shrink-0 mt-0.5"
                    style={{ color: servicio.color }}
                  />
                  <span className="font-['Montserrat'] text-[#13322B] text-base leading-relaxed">
                    {sub}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Galería */}
          <div>
            <h2 className="font-['Barlow_Condensed'] font-black text-[#13322B] text-3xl uppercase mb-2">
              Galería de trabajos
            </h2>
            <p className="font-['Montserrat'] text-[#53565A] text-sm mb-8">
              Ejemplos reales de nuestros trabajos terminados.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {servicio.galeria.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="relative group aspect-[4/3] overflow-hidden bg-[#ECEAE4] rounded-2xl focus:outline-none"
                >
                  <img
                    src={item.type === "video" ? (item.thumbnail ?? item.url) : item.url}
                    alt={item.caption ?? ""}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 rounded-2xl flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                      {item.type === "video" ? (
                        <Play size={32} className="text-white fill-white drop-shadow-lg" />
                      ) : (
                        <ZoomIn size={28} className="text-white drop-shadow-lg" />
                      )}
                      {item.caption && (
                        <span className="font-['Montserrat'] text-white text-xs text-center px-2 leading-tight drop-shadow-lg max-w-[140px]">
                          {item.caption}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.type === "video" && (
                    <div
                      className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-white font-['Barlow_Condensed'] font-bold text-[10px] tracking-widest uppercase"
                      style={{ backgroundColor: servicio.color }}
                    >
                      <Play size={8} className="fill-white" />
                      Video
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* CTA block */}
          <div className="p-8 md:p-10 rounded-3xl" style={{ backgroundColor: servicio.color }}>
            <h3 className="font-['Barlow_Condensed'] font-black text-white text-3xl uppercase mb-3">
              ¿Listo para comenzar?
            </h3>
            <p className="font-['Montserrat'] text-white/80 text-sm mb-6 max-w-md">
              Cuéntanos sobre tu proyecto y te daremos una cotización personalizada sin costo.
            </p>
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-2 bg-white font-['Barlow_Condensed'] font-black text-sm tracking-[0.2em] uppercase px-7 py-3 rounded-full hover:bg-[#25D366] hover:text-white transition-colors"
              style={{ color: servicio.color }}
            >
              <WhatsAppIcon size={16} />
              Cotiza ahora
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-6 shadow-sm rounded-2xl">
            <h3 className="font-['Barlow_Condensed'] font-bold text-[#13322B] text-lg uppercase tracking-wide mb-4">
              Información
            </h3>
            <dl className="space-y-3">
              {[
                { label: "Categoría", value: cat?.titulo ?? "—", color: servicio.color },
                { label: "Entrega", value: "5–15 días hábiles", color: null },
                { label: "Muestras", value: "Mockups digitales", color: null },
                { label: "Envíos", value: "Nacional", color: null },
              ].map(({ label, value, color }, i, arr) => (
                <div
                  key={label}
                  className={`flex justify-between items-center text-sm pb-3 ${i < arr.length - 1 ? "border-b border-[#ECEAE4]" : ""}`}
                >
                  <dt className="font-['Montserrat'] text-[#888B8D]">{label}</dt>
                  <dd className="font-['Montserrat'] font-semibold" style={{ color: color ?? "#13322B" }}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <button
              onClick={handleWhatsApp}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fbb5a] text-white font-['Barlow_Condensed'] font-bold text-xs tracking-[0.2em] uppercase py-3 rounded-full transition-colors"
            >
              <WhatsAppIcon size={15} />
              Cotiza ahora
            </button>
          </div>

          {/* Gallery quick view */}
          <div className="bg-white p-6 shadow-sm rounded-2xl">
            <h3 className="font-['Barlow_Condensed'] font-bold text-[#13322B] text-lg uppercase tracking-wide mb-4">
              Trabajos realizados
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
              {servicio.galeria.slice(0, 6).map((item, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="relative aspect-square overflow-hidden bg-[#ECEAE4] rounded-xl group"
                >
                  <img
                    src={item.type === "video" ? (item.thumbnail ?? item.url) : item.url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                      <Play size={12} className="text-white fill-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setLightboxIndex(0)}
              className="w-full mt-3 font-['Barlow_Condensed'] font-bold text-xs tracking-widest uppercase py-2 border border-[#ECEAE4] hover:border-current rounded-full transition-colors"
              style={{ color: servicio.color }}
            >
              Ver galería completa
            </button>
          </div>

          {/* Other services */}
          {otherServices.length > 0 && (
            <div className="bg-white p-6 shadow-sm rounded-2xl">
              <h3 className="font-['Barlow_Condensed'] font-bold text-[#13322B] text-lg uppercase tracking-wide mb-4">
                Otros servicios
              </h3>
              <ul className="space-y-3">
                {otherServices.map((svc) => (
                  <li key={svc.path}>
                    <Link to={`/servicios/${svc.path}`} className="flex items-center gap-3 group">
                      <div
                        className="w-1 h-8 shrink-0 rounded-full transition-all group-hover:h-10"
                        style={{ backgroundColor: svc.color }}
                      />
                      <span className="font-['Montserrat'] font-semibold text-sm text-[#13322B] group-hover:text-[#009681] transition-colors">
                        {svc.tituloServicio}
                      </span>
                      <ChevronRight size={14} className="ml-auto text-[#B1B3B3] group-hover:text-[#009681] transition-colors shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/categorias"
                className="flex items-center gap-1 mt-4 font-['Barlow_Condensed'] font-bold text-xs tracking-widest uppercase text-[#009681] hover:text-[#FA4616] transition-colors"
              >
                Ver todos <ChevronRight size={12} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Prev / Next */}
      <section className="border-t border-[#ECEAE4] bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#ECEAE4]">
          {prevService ? (
            <Link
              to={`/servicios/${prevService.path}`}
              className="flex items-center gap-4 p-8 group hover:bg-[#F7F5F0] transition-colors"
            >
              <ArrowLeft size={20} className="text-[#B1B3B3] group-hover:text-[#009681] transition-colors shrink-0" />
              <div>
                <div className="font-['Montserrat'] text-xs text-[#888B8D] uppercase tracking-widest mb-1">Anterior</div>
                <div className="font-['Barlow_Condensed'] font-bold text-[#13322B] text-lg uppercase group-hover:text-[#009681] transition-colors">
                  {prevService.tituloServicio}
                </div>
              </div>
            </Link>
          ) : <div />}
          {nextService && (
            <Link
              to={`/servicios/${nextService.path}`}
              className="flex items-center justify-end gap-4 p-8 group hover:bg-[#F7F5F0] transition-colors text-right"
            >
              <div>
                <div className="font-['Montserrat'] text-xs text-[#888B8D] uppercase tracking-widest mb-1">Siguiente</div>
                <div className="font-['Barlow_Condensed'] font-bold text-[#13322B] text-lg uppercase group-hover:text-[#009681] transition-colors">
                  {nextService.tituloServicio}
                </div>
              </div>
              <ArrowRight size={20} className="text-[#B1B3B3] group-hover:text-[#009681] transition-colors shrink-0" />
            </Link>
          )}
        </div>
      </section>

      {/* Decorative bottom */}
      <div className="h-2" style={{ backgroundColor: servicio.color }} />
    </main>
  );
}
