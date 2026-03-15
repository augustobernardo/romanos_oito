import footerImageDesktop from "@/assets/oikos/desktop/DESKTOP_SS_07.png"
import footerMobileImage from "@/assets/oikos/mobile/MOBILE_SS_LAST.png"

const ClosingQuoteSection = () => {
  return (
    <footer className="w-full">
      <picture>
          <source media="(max-width: 767px)" srcSet={footerMobileImage} />
          <img
            src={footerImageDesktop}
            alt="Bem-vindo ao Oikos"
          />
        </picture>
    </footer>
  );
};

export default ClosingQuoteSection;
