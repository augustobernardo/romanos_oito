import headerDesktopImg from '@/assets/oikos/desktop/DESKTOP_SS_01.png'
import headerMobileImg from '@/assets/oikos/mobile/MOBILE_SS_01.png'

const HeroSection = () => {
  return (
    <section className="w-full">
      <picture>
        <source media="(max-width: 767px)" srcSet={headerMobileImg} />
        <img
          src={headerDesktopImg}
          alt="Hero banner"
        />
      </picture>
    </section>
  );
};

export default HeroSection;
