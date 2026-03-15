import welcomeDesktop from '@/assets/oikos/desktop/DESKTOP_SS _06.png'
import welcomeMobile from '@/assets/oikos/mobile/MOBILE_SS_06.png'

const WelcomeSection = () => {
  return (
    <section className="w-full">
      <picture>
        <source media="(max-width: 767px)" srcSet={welcomeMobile} />
        <img
          src={welcomeDesktop}
          alt="Bem-vindo ao Oikos"
        />
      </picture>
    </section>
  );
};

export default WelcomeSection;
