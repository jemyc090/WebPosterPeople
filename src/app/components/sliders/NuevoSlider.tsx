import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// ── Imágenes ─────────────────────────────────────────────────────────────────
import logoCuadrado from "../../../imports/slider-nuevo/logo-cuadrado.jpg";
import logoHorizontal from "../../../imports/slider-nuevo/logo-horizontal.jpg";
import logoSitio from "../../../imports/logo-posterpeople.png";

import pAcciona from "../../../imports/slider-nuevo/proyectos/acciona.jpg";
import pHeartmanship from "../../../imports/slider-nuevo/proyectos/heartmanship.jpg";
import pInfinix from "../../../imports/slider-nuevo/proyectos/infinix-tecno.jpg";
import pAthenea from "../../../imports/slider-nuevo/proyectos/athenea.jpg";
import pAleatica from "../../../imports/slider-nuevo/proyectos/aleatica.jpg";

import gfStand from "../../../imports/slider-nuevo/gran-formato/stand-expo.jpg";
import gfInstalacion from "../../../imports/slider-nuevo/gran-formato/instalacion.jpg";
import gfMural from "../../../imports/slider-nuevo/gran-formato/mural.jpg";

import cAcciona from "../../../imports/slider-nuevo/clientes/acciona.png";
import cUnilever from "../../../imports/slider-nuevo/clientes/unilever.png";
import cHolcim from "../../../imports/slider-nuevo/clientes/holcim.png";
import cMitsubishi from "../../../imports/slider-nuevo/clientes/mitsubishi.png";
import cDeutsche from "../../../imports/slider-nuevo/clientes/deutsche-bank.jpg";
import cAleatica from "../../../imports/slider-nuevo/clientes/aleatica.jpg";
import cCarnet from "../../../imports/slider-nuevo/clientes/carnet.png";
import cTelevia from "../../../imports/slider-nuevo/clientes/televia.png";
import cAvaya from "../../../imports/slider-nuevo/clientes/avaya.jpg";
import cTecno from "../../../imports/slider-nuevo/clientes/tecno.jpg";
import cBrandepica from "../../../imports/slider-nuevo/clientes/brandepica.jpg";
import cWise from "../../../imports/slider-nuevo/clientes/wise.jpg";
import cEngen from "../../../imports/slider-nuevo/clientes/engen.png";
import cBbva from "../../../imports/slider-nuevo/clientes/bbva.jpg";
import cFundacion from "../../../imports/slider-nuevo/clientes/fundacion-aleatica.png";
import cAirCharter from "../../../imports/slider-nuevo/clientes/air-charter.jpg";

// Tipografías de la presentación: Archivo (títulos) y Montserrat Bold (números, nombres y etiquetas).

// ── Colores de la presentación ───────────────────────────────────────────────
const C = {
  verdeOscuro: "#002a02",
  texto: "#13322B",
  rosa: "#FF3EB5",
  azul: "#307FE2",
  amarillo: "#F1C400",
  teal: "#009681",
  navy: "#01426A",
  naranja: "#FA4616",
};

// ── Contenido editable ───────────────────────────────────────────────────────

const STATS = [
  { num: "28", label: "Años de experiencia", color: C.rosa },
  { num: "+50", label: "Clientes", color: C.azul },
  { num: "+5,000", label: "Proyectos", color: C.amarillo },
];

// Los enlaces se actualizarán cuando estén definidos.
const SERVICIOS = [
  { num: "01", nombre: "Merchandising", detalle: "", link: "/categorias/impresion/merchandising" },
  { num: "02", nombre: "Impresión", detalle: "pequeño, mediano y gran formato", link: "/categorias/impresion" },
  { num: "03", nombre: "Material POP", detalle: "", link: "/categorias/material-pop-y-display" },
  { num: "04", nombre: "Logos volumétricos", detalle: "3D", link: "/categorias/volumetricos/logos-volumetricos" },
  { num: "05", nombre: "Corte de vinil", detalle: "diseño e instalación", link: "/categorias/vinil-rotulacion/vinil-de-corte" },
  { num: "06", nombre: "Catering", detalle: "y box lunch", link: "/categorias/otros-servicios/catering" },
];

const PROYECTOS = [
  { img: pAcciona, label: "Acciona", bg: C.texto, fg: "#fff", area: "acciona" },
  { img: pHeartmanship, label: "Heartmanship", bg: C.amarillo, fg: C.texto, area: "heart" },
  { img: pInfinix, label: "Infinix | Tecno", bg: C.rosa, fg: "#fff", area: "infinix" },
  { img: pAthenea, label: "Athenea", bg: C.teal, fg: C.texto, area: "athenea" },
  { img: pAleatica, label: "Aleatica", bg: C.naranja, fg: "#fff", area: "aleatica" },
];

const VALORES = [
  { titulo: "Compromiso", texto: "Dedicación total a cada proyecto.", color: C.texto },
  { titulo: "Calidad", texto: "Calidad, tiempos y costos cumplidos.", color: C.texto },
  { titulo: "Innovación", texto: "Nuevas ideas y tecnología en cada entrega.", color: C.navy },
  { titulo: "Flexibilidad", texto: "Soluciones a la medida de cada campaña.", color: C.navy },
];

const PILARES = [
  { label: "Responsabilidad", bg: C.texto },
  { label: "Honestidad", bg: C.navy },
  { label: "Colaboración", bg: C.rosa },
  { label: "Orientación al cliente", bg: C.teal },
];

const CLIENTES = [
  { img: cAcciona, nombre: "Acciona" },
  { img: cUnilever, nombre: "Unilever" },
  { img: cHolcim, nombre: "Holcim" },
  { img: cMitsubishi, nombre: "Mitsubishi Motors" },
  { img: cDeutsche, nombre: "Deutsche Bank" },
  { img: cAleatica, nombre: "Aleatica" },
  { img: cCarnet, nombre: "Carnet" },
  { img: cTelevia, nombre: "Televía" },
  { img: cAvaya, nombre: "Avaya" },
  { img: cTecno, nombre: "Tecno Mobile" },
  { img: cBrandepica, nombre: "Brandépica" },
  { img: cWise, nombre: "Wise CX" },
  { img: cEngen, nombre: "Engen Capital" },
  { img: cBbva, nombre: "BBVA" },
  { img: cFundacion, nombre: "Fundación Aleatica" },
  { img: cAirCharter, nombre: "Air Charter Service" },
];

const EMAILS = [
  { email: "tere.rita@posterpeople.mx", color: C.amarillo },
  { email: "fernanda@posterpeople.mx", color: "#fff" },
];

// ── Piezas comunes ───────────────────────────────────────────────────────────

const pad = "px-5 sm:px-8 lg:px-16 xl:px-20 pt-6 pb-14 lg:pt-10 lg:pb-16";

function Encabezado({
  titulo, tag, color, subrayado = "linea",
}: { titulo: string; tag?: string; color: string; subrayado?: "linea" | "titulo" }) {
  return (
    <div
      className={`flex items-end justify-between gap-4 shrink-0 ${subrayado === "linea" ? "border-b-2 pb-2 lg:pb-3" : ""}`}
      style={subrayado === "linea" ? { borderColor: C.texto } : undefined}
    >
      <h2
        className="font-['Archivo'] font-semibold text-[1.9rem] sm:text-4xl lg:text-5xl leading-none"
        style={{
          color: C.texto,
          ...(subrayado === "titulo" ? { borderBottom: `3px solid ${color}`, paddingBottom: "0.2em" } : {}),
        }}
      >
        {titulo}
      </h2>
      {tag && (
        <span
          className="font-['Montserrat'] font-bold text-[0.65rem] sm:text-xs lg:text-sm tracking-wide uppercase text-right"
          style={{ color }}
        >
          {tag}
        </span>
      )}
    </div>
  );
}

function Etiqueta({ children, bg, fg }: { children: ReactNode; bg: string; fg: string }) {
  return (
    <span
      className="absolute left-0 bottom-0 font-['Montserrat'] font-bold uppercase text-[0.6rem] sm:text-xs lg:text-sm tracking-wide px-2 py-1 lg:px-3 lg:py-1.5"
      style={{ backgroundColor: bg, color: fg }}
    >
      {children}
    </span>
  );
}

// ── Slides ───────────────────────────────────────────────────────────────────

function SlideLogo() {
  return (
    <div className="h-full w-full flex items-center justify-center p-8" style={{ backgroundColor: C.verdeOscuro }}>
      <img src={logoCuadrado} alt="Poster People" className="h-[78%] max-h-[640px] max-w-[88%] object-contain" />
    </div>
  );
}

function SlideTrayectoria() {
  return (
    <div className="relative h-full w-full bg-white flex flex-col">
      {/* Franja con el logo */}
      <div
        className="shrink-0 h-[22%] min-h-[100px] max-h-[200px] flex items-center justify-center px-5 sm:px-8 lg:px-16 xl:px-20 border-b-4"
        style={{ backgroundColor: "#154734", borderColor: C.naranja }}
      >
        <img src={logoSitio} alt="Poster People" className="h-[80%] max-w-full object-contain" />
      </div>

      <div className="relative flex-1 min-h-0 flex flex-col justify-center gap-8 lg:gap-12 px-5 sm:px-8 lg:px-16 xl:px-20 pt-4 pb-14 lg:pb-16">
      {/* Hexágono azul cortado por el borde derecho */}
      <div
        className="absolute right-0 top-[8%] w-[20vw] h-[24vw] sm:w-[16vw] sm:h-[19vw] lg:w-[12vw] lg:h-[14vw] max-w-[220px] max-h-[260px]"
        style={{ backgroundColor: C.azul, clipPath: "polygon(30% 0, 100% 0, 100% 100%, 30% 100%, 0 50%)" }}
      />
      <h2
        className="relative font-['Archivo'] font-medium text-[2.1rem] sm:text-5xl lg:text-[3.8rem] xl:text-[4.4rem] leading-[1.08] max-w-[15ch] pr-16 sm:pr-0"
        style={{ color: C.texto }}
      >
        Lo diseñamos, lo producimos, lo{" "}
        <span className="font-bold" style={{ color: C.rosa }}>
          instalamos<span style={{ color: C.texto }}>.</span>
        </span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 lg:gap-12 max-w-6xl">
        {STATS.map((s) => (
          <div key={s.label} className="border-t-[3px] pt-3 lg:pt-5" style={{ borderColor: s.color }}>
            <div className="font-['Montserrat'] font-bold text-[2.2rem] sm:text-5xl lg:text-6xl leading-none" style={{ color: C.texto }}>
              {s.num}
            </div>
            <div className="font-['Montserrat'] font-bold uppercase text-xs lg:text-sm tracking-wide mt-2" style={{ color: C.texto }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

function SlideServicios() {
  return (
    <div className={`h-full w-full bg-white flex flex-col ${pad}`}>
      <Encabezado titulo="Servicios" color={C.rosa} />
      <ul className="flex-1 flex flex-col justify-center w-full">
        {SERVICIOS.map((s) => (
          <li key={s.num} className="border-b" style={{ borderColor: C.azul }}>
            <Link
              to={s.link}
              className="group flex items-center sm:items-baseline gap-4 lg:gap-8 py-2.5 sm:py-3 lg:py-[1.1vh]"
            >
              <span className="font-['Montserrat'] font-bold text-xs lg:text-sm w-6 shrink-0" style={{ color: C.rosa }}>
                {s.num}
              </span>
              <span className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                <span
                  className="font-['Montserrat'] font-bold text-[1.35rem] sm:text-3xl lg:text-[2.6rem] leading-tight transition-colors group-hover:text-[#FF3EB5]"
                  style={{ color: C.texto }}
                >
                  {s.nombre}
                </span>
                {s.detalle && (
                  <span className="font-['Montserrat'] font-semibold text-xs lg:text-base" style={{ color: C.texto }}>
                    {s.detalle}
                  </span>
                )}
              </span>
              <ArrowRight
                size={20}
                className="shrink-0 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                style={{ color: C.rosa }}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SlideProyectos() {
  return (
    <div className={`h-full w-full bg-white flex flex-col gap-4 lg:gap-6 ${pad}`}>
      <Encabezado titulo="Proyectos" tag="Kits y promocionales" color={C.rosa} subrayado="titulo" />
      <div
        className="flex-1 min-h-0 grid gap-3 lg:gap-5 grid-cols-2 grid-rows-3 lg:grid-cols-3 lg:grid-rows-2
                   [grid-template-areas:'acciona_heart''athenea_infinix''aleatica_infinix']
                   lg:[grid-template-areas:'acciona_heart_infinix''athenea_aleatica_infinix']"
      >
        {PROYECTOS.map((p) => (
          <div key={p.label} className="relative min-h-0 flex items-center justify-center" style={{ gridArea: p.area }}>
            <img src={p.img} alt={p.label} className="max-h-full max-w-full object-contain" />
            <Etiqueta bg={p.bg} fg={p.fg}>{p.label}</Etiqueta>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideGranFormato() {
  return (
    <div className={`h-full w-full bg-white flex flex-col gap-4 lg:gap-6 ${pad}`}>
      <Encabezado titulo="Proyectos" tag="Stands · Muros · Vinil" color={C.azul} subrayado="titulo" />
      <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-[1.3fr_1fr] gap-3 lg:gap-6">
        <div className="relative min-h-0 overflow-hidden">
          <img src={gfStand} alt="Stand de expo" className="w-full h-full object-contain object-left" />
          <Etiqueta bg={C.amarillo} fg={C.texto}>Stand de expo</Etiqueta>
        </div>
        <div className="relative min-h-0 overflow-hidden">
          <img src={gfInstalacion} alt="Instalación en sitio" className="w-full h-full object-cover" />
          <Etiqueta bg={C.rosa} fg="#fff">Instalación en sitio</Etiqueta>
        </div>
        <div className="relative min-h-0 col-span-2 flex justify-center">
          <div className="relative h-full aspect-[1056/424] max-w-full">
            <img src={gfMural} alt="Mural 7.93 × 2.55 m" className="w-full h-full object-cover" />
            <Etiqueta bg={C.teal} fg="#fff">Mural 7.93 × 2.55 m</Etiqueta>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideValores() {
  return (
    <div className={`h-full w-full flex flex-col gap-4 lg:gap-6 ${pad}`} style={{ backgroundColor: C.amarillo }}>
      <Encabezado titulo="Valores y compromiso" tag="Así trabajamos" color={C.texto} />
      <div className="flex-1 min-h-0 grid grid-cols-2 grid-rows-2">
        {VALORES.map((v, i) => (
          <div
            key={v.titulo}
            className={`flex flex-col justify-center gap-1 lg:gap-2 px-2 sm:px-5 lg:px-8
              ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b" : ""}`}
            style={{ borderColor: C.texto }}
          >
            <h3 className="font-['Montserrat'] font-bold text-[1.45rem] sm:text-4xl lg:text-6xl leading-none" style={{ color: v.color }}>
              {v.titulo}
            </h3>
            <p className="font-['Montserrat'] font-semibold text-xs sm:text-sm lg:text-lg" style={{ color: C.texto }}>
              {v.texto}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 lg:gap-3 shrink-0">
        {PILARES.map((p) => (
          <span
            key={p.label}
            className="font-['Montserrat'] font-bold uppercase text-white text-[0.6rem] sm:text-xs lg:text-sm tracking-wide px-2.5 py-1.5 lg:px-4 lg:py-2"
            style={{ backgroundColor: p.bg }}
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function SlideClientes() {
  return (
    <div className={`h-full w-full bg-white flex flex-col gap-3 lg:gap-4 ${pad}`}>
      <Encabezado titulo="Clientes" tag="+20 marcas atendidas" color={C.rosa} />
      <div className="flex-1 min-h-0 grid grid-cols-4 grid-rows-4">
        {CLIENTES.map((c, i) => (
          <div
            key={c.nombre}
            className={`flex items-center justify-center p-2 sm:p-3 lg:p-4 min-h-0
              ${i % 4 !== 3 ? "border-r" : ""} ${i < 12 ? "border-b" : ""}`}
            style={{ borderColor: "#E3E1DB" }}
          >
            <img src={c.img} alt={c.nombre} title={c.nombre} className="max-h-[55%] max-w-[78%] object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideContacto() {
  return (
    <div className={`h-full w-full flex flex-col justify-between ${pad}`} style={{ backgroundColor: C.verdeOscuro }}>
      <img src={logoHorizontal} alt="Poster People" className="w-full max-w-[640px] lg:max-w-[46%] object-contain object-left" />
      <div>
        <h2 className="font-['Archivo'] font-bold text-white text-[3rem] sm:text-6xl lg:text-[6.2rem] leading-[0.95] mb-4 lg:mb-6">
          Cuéntanos tu proyecto.
        </h2>
        <div className="h-[3px] mb-4 lg:mb-6" style={{ backgroundColor: C.azul }} />
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="flex flex-col gap-1 lg:gap-2">
            {EMAILS.map((e) => (
              <a
                key={e.email}
                href={`mailto:${e.email}`}
                className="font-['Montserrat'] font-bold text-lg sm:text-2xl lg:text-3xl hover:underline break-all"
                style={{ color: e.color }}
              >
                {e.email}
              </a>
            ))}
          </div>
          <span className="font-['Montserrat'] font-bold text-white text-xs lg:text-base tracking-wide uppercase">
            Ideas | Diseño | Soluciones
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Slider ───────────────────────────────────────────────────────────────────

const SLIDES: { id: string; tema: "claro" | "oscuro"; render: () => ReactNode }[] = [
  // { id: "logo", tema: "oscuro", render: () => <SlideLogo /> }, // retirado: el logo ahora va en el slide de trayectoria
  { id: "trayectoria", tema: "claro", render: () => <SlideTrayectoria /> },
  { id: "servicios", tema: "claro", render: () => <SlideServicios /> },
  { id: "proyectos", tema: "claro", render: () => <SlideProyectos /> },
  { id: "gran-formato", tema: "claro", render: () => <SlideGranFormato /> },
  { id: "valores", tema: "claro", render: () => <SlideValores /> },
  { id: "clientes", tema: "claro", render: () => <SlideClientes /> },
  { id: "contacto", tema: "oscuro", render: () => <SlideContacto /> },
];

const AUTOPLAY_MS = 8000;

export function NuevoSlider({ initialSlide = 0 }: { initialSlide?: number }) {
  const [current, setCurrent] = useState(initialSlide);
  const [paused, setPaused] = useState(false);
  const total = SLIDES.length;
  const go = (i: number) => setCurrent(((i % total) + total) % total);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(current + 1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [current, paused]);

  const touchX = useRef<number | null>(null);
  const oscuro = SLIDES[current].tema === "oscuro";

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const d = touchX.current - e.changedTouches[0].clientX;
        if (Math.abs(d) > 40) go(current + (d > 0 ? 1 : -1));
        touchX.current = null;
      }}
      aria-roledescription="carrusel"
    >
      {SLIDES.map((s, i) => (
        <section
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
          aria-hidden={i !== current}
        >
          {s.render()}
        </section>
      ))}

      {/* Flechas (desktop) */}
      {[-1, 1].map((dir) => (
        <button
          key={dir}
          onClick={() => go(current + dir)}
          aria-label={dir < 0 ? "Anterior" : "Siguiente"}
          className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 items-center justify-center rounded-full transition-colors
            ${dir < 0 ? "left-3" : "right-3"}
            ${oscuro ? "bg-white/10 hover:bg-white/25 text-white" : "bg-black/5 hover:bg-black/10 text-[#13322B]"}`}
        >
          {dir < 0 ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>
      ))}

      {/* Puntos */}
      <div className="absolute bottom-4 lg:bottom-5 left-0 right-0 z-30 flex items-center justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-300 h-2"
            style={{
              width: i === current ? "2rem" : "0.5rem",
              backgroundColor: i === current
                ? (oscuro ? "#fff" : C.rosa)
                : (oscuro ? "rgba(255,255,255,0.35)" : "rgba(19,50,43,0.25)"),
            }}
          />
        ))}
      </div>
    </div>
  );
}
