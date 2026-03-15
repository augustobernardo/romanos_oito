import secondSectionDesktop from "@/assets/oikos/desktop/DESKTOP_SS_02.png";
import secondSectionMobile from "@/assets/oikos/mobile/MOBILE_SS_02.png";

const HeadlineSection = () => {
  return (
    <section className="bg-bg-beige">
      <picture>
        <source media="(max-width: 767px)" srcSet={secondSectionMobile} />
        <img
          src={secondSectionDesktop}
          alt="Casa, Lugar, Habitado, Família"
        />
      </picture>
    </section>
  );
};

export default HeadlineSection;
