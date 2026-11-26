export interface Categoria {
  slug: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  color: string;
  imagenHero: string;
  icono: string;
}

export const categorias: Categoria[] = [
  {
    slug: "impresion",
    titulo: "Impresión",
    subtitulo: "Materiales impresos de alta calidad",
    descripcion:
      "Tarjetas de presentación, volantes, trípticos, flyers y más. Impresión profesional que refleja la identidad de tu marca.",
    color: "#009681",
    imagenHero:
      "https://images.unsplash.com/photo-1512106374988-c95f566d39ef?w=1400&h=800&fit=crop&auto=format",
    icono: "🖨️",
  },
  {
    slug: "gran-formato",
    titulo: "Gran Formato",
    subtitulo: "Impresión a gran escala para máximo impacto",
    descripcion:
      "Lonas, banners, roll ups e impresión en cama plana. Haz que tu marca sea visible a gran escala con impresión de alta resolución.",
    color: "#FA4616",
    imagenHero:
      "https://images.unsplash.com/photo-1693031630369-bd429a57f115?w=1400&h=800&fit=crop&auto=format",
    icono: "🏔️",
  },
  {
    slug: "vinil-rotulacion",
    titulo: "Vinil & Rotulación",
    subtitulo: "Personaliza y decora con vinil de calidad",
    descripcion:
      "Vinil de corte, vinil impreso y vinil adherible con acabados premium para interiores y exteriores.",
    color: "#307FE2",
    imagenHero:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=800&fit=crop&auto=format",
    icono: "✂️",
  },
  {
    slug: "dtf-textil",
    titulo: "DTF Textil",
    subtitulo: "Personalización textil de alta definición",
    descripcion:
      "Playeras, gorras, bolsas de tela y más. Tecnología DTF para lograr la mayor calidad y definición en prendas.",
    color: "#154734",
    imagenHero:
      "https://images.unsplash.com/photo-1663433541063-ddab084d1126?w=1400&h=800&fit=crop&auto=format",
    icono: "👕",
  },
  {
    slug: "dtf-uv",
    titulo: "DTF UV",
    subtitulo: "Impresión UV sobre cualquier superficie",
    descripcion:
      "Stickers UV, termos y etiquetas premium. Colores vibrantes y durabilidad superior para personalizar tus productos.",
    color: "#FF3EB5",
    imagenHero:
      "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=1400&h=800&fit=crop&auto=format",
    icono: "✨",
  },
  {
    slug: "grabado-corte-laser",
    titulo: "Grabado & Corte Láser",
    subtitulo: "Precisión milimétrica en cada pieza",
    descripcion:
      "Grabado en acrílico, madera, metal y vidrio. Llaveros, reconocimientos y piezas únicas con detalle excepcional.",
    color: "#01426A",
    imagenHero:
      "https://images.unsplash.com/photo-1615286922420-c6b348ffbd62?w=1400&h=800&fit=crop&auto=format",
    icono: "⚡",
  },
  {
    slug: "otros-servicios",
    titulo: "Otros Servicios",
    subtitulo: "Soluciones complementarias para tu proyecto",
    descripcion:
      "Diseño gráfico, instalación y logística. Todo lo que tu proyecto necesita en un solo lugar con la misma calidad Poster People.",
    color: "#53565A",
    imagenHero:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&h=800&fit=crop&auto=format",
    icono: "🔧",
  },
];

export const getCategoriaBySlug = (slug: string) =>
  categorias.find((c) => c.slug === slug);
