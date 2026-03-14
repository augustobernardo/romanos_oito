import secondSectionDesktop from "@/assets/oikos/desktop/DESKTOP_SS_02.png";
import secondSectionMobile from "@/assets/oikos/mobile/MOBILE_SS_02.png";

const HeadlineSection = () => {
  return (
    <section className="bg-bg-beige">
      {/* <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-display text-7xl md:text-8xl lg:text-[10rem] text-[#00B2E3] leading-[0.9] uppercase tracking-normal">
            Casa
            <br />
            Lugar
            <br />
            Habitado
            <br />
            Família
          </h2>
        </div>
        <div className="hidden md:block">
          <div className="bg-neutral-dark/5 rounded-3xl aspect-[4/3] w-full shadow-inner overflow-hidden flex items-center justify-center">
            <span className="text-neutral-dark/40 font-medium">
              Espaço para Imagem
            </span>
          </div>
        </div>
      </div> */}
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
