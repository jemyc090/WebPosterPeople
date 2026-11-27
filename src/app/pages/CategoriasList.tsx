import { Link } from "react-router";
import { motion } from "motion/react";
import { ChevronRight, ArrowRight } from "lucide-react";
import { categorias, textoSobre } from "../data/categorias";
import { servicios } from "../data/servicios";

import starburst from "../../imports/02_starburst.png";
import sunburst from "../../imports/08_sunburst.png";
import flower from "../../imports/07_flower.png";
import badge from "../../imports/10_badge.png";
import xShape from "../../imports/05_x.png";
import hexagon from "../../imports/01_hexagon.png";

export default function CategoriasList() {
  return (
    <main className="pt-16 min-h-screen bg-[#F7F5F0]">
      {/* ── Header ── */}
      <section className="bg-[#154734] pt-20 pb-20 px-6 relative overflow-hidden">
        <motion.img src={starburst} alt="" className="absolute top-6 right-10 w-44 opacity-15 pointer-events-none select-none"
          animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} />
        <motion.img src={sunburst} alt="" className="absolute -bottom-10 left-6 w-32 opacity-12 pointer-events-none select-none"
          animate={{ rotate: -360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} />
        <motion.img src={flower} alt="" className="absolute top-4 left-1/4 w-20 opacity-10 pointer-events-none select-none"
          animate={{ y: [-6, 6, -6] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <span className="font-['Barlow_Condensed'] font-semibold text-[#009681] text-sm tracking-[0.3em] uppercase block mb-4">
            Lo que hacemos
          </span>
          <h1 className="font-['Barlow_Condensed'] font-black text-white text-6xl lg:text-8xl uppercase leading-none mb-4">
            Nuestras
            <br />
            <span className="text-transparent [-webkit-text-stroke:2px_white]">
              Categorías
            </span>
          </h1>
          <p className="font-['Montserrat'] text-white/60 text-base max-w-xl leading-relaxed">
            Selecciona una categoría para explorar todos los servicios y productos disponibles.
          </p>
        </div>
      </section>

      {/* ── Categories grid ── */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative">
        <motion.img src={xShape} alt="" className="absolute top-8 right-4 w-10 opacity-15 pointer-events-none select-none"
          animate={{ rotate: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        <motion.img src={hexagon} alt="" className="absolute bottom-16 left-4 w-16 opacity-10 pointer-events-none select-none"
          animate={{ y: [-8, 8, -8] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categorias.map((cat, i) => {
            const count = servicios.filter((s) => s.categoriaSlug === cat.slug).length;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/categorias/${cat.slug}`}
                  className="group relative flex overflow-hidden bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-400 min-h-[200px]"
                >
                  {/* Color sidebar */}
                  <div
                    className="w-2 shrink-0 rounded-l-3xl transition-all duration-300 group-hover:w-3"
                    style={{ backgroundColor: cat.color }}
                  />

                  {/* BG image */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <img
                      src={cat.imagenHero}
                      alt=""
                      className="w-full h-full object-cover opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col justify-between p-8 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {/* Orden badge */}
                        <span
                          className="inline-block font-['Barlow_Condensed'] font-black text-xs tracking-widest uppercase px-3 py-1 rounded-full mb-4"
                          style={{ backgroundColor: cat.color, color: textoSobre(cat.color) }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h2 className="font-['Barlow_Condensed'] font-black text-[#13322B] text-4xl lg:text-5xl uppercase leading-none group-hover:text-[#13322B] transition-colors mb-1">
                          {cat.titulo}
                        </h2>
                        <p className="font-['Montserrat'] text-[#53565A] text-sm">
                          {cat.subtitulo}
                        </p>
                      </div>
                      {/* Icon circle */}
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: cat.color + "20" }}
                      >
                        {cat.icono}
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-6">
                      <p className="font-['Montserrat'] text-[#888B8D] text-sm leading-relaxed max-w-sm">
                        {cat.descripcion}
                      </p>
                      <div className="flex items-center gap-4 ml-6 shrink-0">
                        <span className="font-['Barlow_Condensed'] font-bold text-xs tracking-widest uppercase text-[#B1B3B3]">
                          {count} servicio{count !== 1 ? "s" : ""}
                        </span>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1"
                          style={{ backgroundColor: cat.color, color: textoSobre(cat.color) }}
                        >
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#13322B] py-16 px-6 relative overflow-hidden">
        <motion.img src={badge} alt="" className="absolute -top-8 right-12 w-36 opacity-10 pointer-events-none select-none"
          animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-['Barlow_Condensed'] font-black text-white text-4xl lg:text-5xl uppercase mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="font-['Montserrat'] text-white/60 text-base mb-8">
            Cuéntanos tu idea y encontramos la solución ideal para tu proyecto.
          </p>
          <Link
            to="/"
            onClick={() => setTimeout(() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" }), 100)}
            className="inline-flex items-center gap-2 bg-[#FA4616] hover:bg-[#e03a0f] text-white font-['Barlow_Condensed'] font-black text-sm tracking-[0.2em] uppercase px-8 py-4 rounded-full transition-colors"
          >
            Cotiza ahora <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
