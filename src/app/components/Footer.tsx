import { Link } from "react-router";
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import logo from "../../imports/logo-posterpeople.png";

export function Footer() {
  return (
    <footer className="bg-[#13322B] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="space-y-4">
          <img
            src={logo}
            alt="Poster People"
            className="h-10 w-auto object-contain"
          />
          <p className="text-white/60 text-sm font-['Barlow'] leading-relaxed max-w-xs">
            Especialistas en soluciones de merchandising e impresión. Tu marca,
            nuestra pasión creativa.
          </p>
          <div className="flex gap-3 pt-2">
            {[
              { icon: Instagram, href: "#", label: "Instagram" },
              { icon: Facebook, href: "#", label: "Facebook" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 bg-white/10 hover:bg-[#009681] rounded-full flex items-center justify-center transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h3 className="font-['Barlow_Condensed'] font-bold text-lg tracking-widest uppercase text-[#009681]">
            Categorías
          </h3>
          <ul className="space-y-2">
            {[
              { label: "Impresión", slug: "impresion" },
              { label: "Gran Formato", slug: "gran-formato" },
              { label: "Vinil & Rotulación", slug: "vinil-rotulacion" },
              { label: "DTF Textil", slug: "dtf-textil" },
              { label: "DTF UV", slug: "dtf-uv" },
              { label: "Grabado & Corte Láser", slug: "grabado-corte-laser" },
            ].map(({ label, slug }) => (
              <li key={slug}>
                <Link
                  to={`/categorias/${slug}`}
                  className="text-white/60 hover:text-white text-sm font-['Barlow'] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="font-['Barlow_Condensed'] font-bold text-lg tracking-widest uppercase text-[#009681]">
            Contacto
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-white/60 text-sm font-['Barlow']">
              <Mail size={15} className="mt-0.5 shrink-0 text-[#FA4616]" />
              <span>contacto@posterpeople.mx</span>
            </li>
            <li className="flex items-start gap-3 text-white/60 text-sm font-['Barlow']">
              <Phone size={15} className="mt-0.5 shrink-0 text-[#FA4616]" />
              <a href="tel:+525529599392" className="hover:text-white transition-colors">+52 55 2959 9392</a>
            </li>
            <li className="flex items-start gap-3 text-white/60 text-sm font-['Barlow']">
              <MapPin size={15} className="mt-0.5 shrink-0 text-[#FA4616]" />
              <span>Ciudad de México, México</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-white/40 text-xs font-['Barlow']">
          <span>© {new Date().getFullYear()} Poster People. Todos los derechos reservados.</span>
          <span>Hecho con pasión creativa en México 🇲🇽</span>
        </div>
      </div>
    </footer>
  );
}
