import { useEffect } from "react";
import { useLocation } from "react-router";
import { categorias, getCategoriaBySlug } from "./data/categorias";
import { servicios } from "./data/servicios";

// ── Configuración general ─────────────────────────────────────────────────────

export const SITE_NAME = "Poster People";
export const SITE_URL = "https://posterpeople.mx";

const DEFAULT_DESCRIPTION =
  "Poster People: imprenta en CDMX. Impresión digital, gran formato, vinil y rotulación, DTF textil, DTF UV, grabado y corte láser. Cotiza por WhatsApp.";

const BASE_KEYWORDS = [
  "Poster People",
  "imprenta CDMX",
  "impresión CDMX",
  "imprenta Ciudad de México",
  "impresión personalizada",
  "artículos promocionales",
];

// ── Títulos SEO por categoría ────────────────────────────────────────────────
// Se usan en el <title>: "<título categoría> | <servicio> | Poster People".

const CATEGORY_SEO_TITLE: Record<string, string> = {
  "impresion": "Impresión pequeño y mediano formato",
  "gran-formato": "Impresión de gran formato",
  "vinil-rotulacion": "Vinil y rotulación",
  "dtf-textil": "Impresión DTF textil",
  "dtf-uv": "Impresión DTF UV",
  "grabado-corte-laser": "Grabado y corte láser",
  "otros-servicios": "Otros servicios",
};

// ── Palabras clave por categoría ─────────────────────────────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "impresion": [
    "impresión cama plana", "impresión UV", "señalética", "lonas impresas", "plotter ecosolvente",
    "impresión en acrílico", "coroplast", "foamboard", "estireno", "PVC espumado",
    "photo frame", "figuras a contorno", "merchandising", "serigrafía", "sublimación",
  ],
  "gran-formato": [
    "impresión gran formato", "banners", "roll ups", "publicidad exterior", "displays para eventos",
  ],
  "vinil-rotulacion": [
    "vinil", "rotulación", "vinil de corte", "vinil impreso", "vinil adherible",
    "rotulación de negocios", "rotulación de vitrinas", "stickers de vinil",
  ],
  "dtf-textil": [
    "DTF textil", "impresión DTF", "estampado textil", "bolsas de tela personalizadas",
    "personalización de prendas", "transfer DTF",
  ],
  "dtf-uv": [
    "DTF UV", "impresión UV", "stickers UV", "termos personalizados",
    "etiquetas premium", "personalización de termos", "calcomanías UV",
  ],
  "grabado-corte-laser": [
    "grabado láser", "corte láser", "llaveros personalizados", "reconocimientos",
    "grabado en madera", "grabado en acrílico", "piezas personalizadas", "corte de acrílico",
  ],
  "otros-servicios": [
    "diseño gráfico", "instalación de publicidad", "catering", "box lunch",
    "entregas y envíos", "servicios para eventos",
  ],
};

// ── Palabras clave extra por servicio (path) ─────────────────────────────────

const SERVICE_KEYWORDS: Record<string, string[]> = {
  "tarjetas-de-presentacion": ["tarjetas de presentación", "tarjetas de presentación CDMX", "tarjetas personalizadas"],
  "volantes": ["volantes", "impresión de volantes", "volantes publicitarios"],
  "tripticos": ["trípticos", "impresión de trípticos", "folletos"],
  "flyers": ["flyers", "impresión de flyers", "flyers publicitarios"],
  "etiquetas": ["etiquetas", "etiquetas adheribles", "impresión de etiquetas"],
  "menus": ["menús para restaurante", "impresión de menús", "cartas de restaurante"],
  "catalogos": ["catálogos", "impresión de catálogos", "revistas"],
  "senaletica": ["señalética", "señalización para oficinas", "señales de seguridad", "letreros impresos"],
  "acrilicos-coroplast-foamboard": ["impresión en acrílico", "impresión en coroplast", "impresión en foamboard", "impresión en estireno", "impresión en PVC espumado", "impresión UV sobre rígidos"],
  "photo-frame": ["photo frame", "figuras a contorno", "marcos para fotos de eventos", "displays recortados"],
  "sublimacion": ["sublimación", "cintas para gafete", "lanyards personalizados", "sublimación textil"],
  "merchandising": ["merchandising", "artículos promocionales", "regalos corporativos", "promocionales con logo", "serigrafía"],
  "lonas": ["lonas", "lonas impresas", "impresión de lonas", "lonas publicitarias"],
  "banners": ["banners", "banners impresos", "banners para eventos"],
  "roll-ups": ["roll up", "roll ups", "porta banner", "displays roll up"],
  "vinil-de-corte": ["corte de vinil", "vinil de corte", "letras de vinil", "rotulación con vinil"],
  "vinil-impreso": ["vinil impreso", "impresión en vinil", "calcomanías"],
  "vinil-adherible": ["vinil adherible", "stickers", "calcomanías personalizadas"],
  "bolsas-de-tela": ["bolsas de tela", "tote bags personalizadas", "bolsas ecológicas"],
  "impresion-dtf-alta-calidad": ["impresión DTF", "DTF premium", "transfer DTF por metro"],
  "stickers-uv": ["stickers UV", "stickers personalizados", "calcomanías UV"],
  "termos": ["termos personalizados", "termos grabados", "termos con logo"],
  "etiquetas-premium": ["etiquetas premium", "etiquetas UV", "etiquetas para producto"],
  "grabado-materiales": ["grabado en madera", "grabado en acrílico", "grabado en metal"],
  "corte-materiales": ["corte láser de acrílico", "corte láser de madera", "corte de MDF"],
  "llaveros": ["llaveros personalizados", "llaveros grabados", "llaveros de acrílico"],
  "reconocimientos": ["reconocimientos", "placas de reconocimiento", "trofeos personalizados"],
  "piezas-personalizadas": ["piezas personalizadas", "regalos personalizados", "artículos grabados"],
  "catering": ["catering para eventos", "catering CDMX"],
  "box-lunch": ["box lunch", "box lunch para eventos", "box lunch CDMX"],
  "instalacion": ["instalación de lonas", "instalación de vinil", "instalación de publicidad"],
  "diseno-grafico": ["diseño gráfico", "diseño de logotipos", "diseño para impresión"],
  "entregas-envios": ["entregas a domicilio", "envíos a toda la república", "entregas CDMX"],
};

// ── Construcción de los metadatos según la ruta ──────────────────────────────

interface SeoData {
  title: string;
  description: string;
  keywords: string[];
}

const join = (...parts: string[]) => parts.filter(Boolean).join(" | ");

export function getSeoForPath(pathname: string): SeoData {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const segments = clean.split("/").filter(Boolean);

  // /servicios
  if (segments[0] === "servicios") {
    return {
      title: join(SITE_NAME, "Servicios"),
      description:
        "Catálogo de servicios de Poster People: impresión, gran formato, vinil, DTF textil y UV, grabado láser y más. Cotiza tu proyecto en CDMX.",
      keywords: [
        ...BASE_KEYWORDS,
        "servicios de impresión",
        ...Object.values(CATEGORY_KEYWORDS).map((k) => k[0]),
      ],
    };
  }

  // /categorias, /categorias/:slug, /categorias/:slug/:servicePath
  if (segments[0] === "categorias") {
    const cat = segments[1] ? getCategoriaBySlug(segments[1]) : undefined;

    if (!cat) {
      return {
        title: join(SITE_NAME, "Categorías"),
        description:
          "Conoce todas las categorías de Poster People: " +
          categorias.map((c) => c.titulo).join(", ") +
          ".",
        keywords: [...BASE_KEYWORDS, ...Object.values(CATEGORY_KEYWORDS).flat().slice(0, 20)],
      };
    }

    const catTitle = CATEGORY_SEO_TITLE[cat.slug] ?? cat.titulo;
    const catKeywords = CATEGORY_KEYWORDS[cat.slug] ?? [];
    const svc = segments[2]
      ? servicios.find((s) => s.path === segments[2] && s.categoriaSlug === cat.slug)
      : undefined;

    if (svc) {
      return {
        title: join(catTitle, svc.tituloServicio, SITE_NAME),
        description: svc.descripcion,
        keywords: [
          ...(SERVICE_KEYWORDS[svc.path] ?? [svc.tituloServicio.toLowerCase()]),
          ...catKeywords.slice(0, 4),
          ...BASE_KEYWORDS,
        ],
      };
    }

    return {
      title: join(catTitle, SITE_NAME),
      description: cat.descripcion,
      keywords: [...catKeywords, ...BASE_KEYWORDS],
    };
  }

  // Inicio (y cualquier otra ruta)
  return {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    keywords: [...BASE_KEYWORDS, ...Object.values(CATEGORY_KEYWORDS).map((k) => k[0])],
  };
}

// ── Aplicar los metadatos al <head> ──────────────────────────────────────────

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Actualiza title, description, keywords, Open Graph y canonical en cada cambio de ruta. */
export function useSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description, keywords } = getSeoForPath(pathname);
    const url = SITE_URL + (pathname === "/" ? "/" : pathname.replace(/\/+$/, ""));
    const uniqueKeywords = Array.from(new Set(keywords)).join(", ");

    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "keywords", uniqueKeywords);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setCanonical(url);
  }, [pathname]);
}
