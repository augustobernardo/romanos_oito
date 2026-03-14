import { Instagram, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import romanosOitoLogo from "@/assets/oikos/logo-r8.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-t border-border/50 bg-card"
    >
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <Link to="/" className="flex items-center gap-3">
                  <img
                    src={romanosOitoLogo}
                    alt="Romanos Oito"
                    className="h-12 w-auto md:h-9"
                  />
                  <span className="sr-only">Romanos Oito</span>
                </Link>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Movimento Católico de Jovens comprometidos em viver e anunciar o amor de Deus.
            </p>
          </div>

          {/* Contact & Social */}
          <div className="flex flex-col items-center gap-4 md:items-end">
            <div className="text-center md:text-right">
              <h4 className="mb-2 font-display text-sm font-semibold text-foreground">
                Duvidas? Chama o SAC do R8 ;) 
              </h4>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/romanos8.mov/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=5533998427416"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="WhatsApp"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border/50 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Romanos Oito. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
