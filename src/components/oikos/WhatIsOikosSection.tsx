import ovalImages from "@/assets/oikos/oval-images.png";
import logoR8White from "@/assets/oikos/logo-r8-white.png";

const WhatIsOikosSection = () => {
  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
      {/* Green diagonal accent */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-30"
        style={{
          background: "linear-gradient(135deg, transparent 30%, #19C971 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left column */}
          <div>
            <img
              src={logoR8White}
              alt="Romanos Oito"
              className="w-16 h-16 md:w-20 md:h-20 mb-6 opacity-80"
            />
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase leading-none mb-4"
              style={{ color: "#F5E6C8" }}
            >
              O QUE É
              <br />
              O OIKOS?
            </h2>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              O OIKOS é a nossa experiência de primeiro anúncio para jovens.
            </p>
          </div>

          {/* Right column */}
          <div className="flex items-start">
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              Ele nasce diante da necessidade de alargar as frontas do nosso
              movimento, trazer novos corações e um ar novo para dentro de
              nossas casas... buscando um novo rumo e novas trilhas
              para manifestarem a glória de Deus ao mundo.
            </p>
          </div>
        </div>
      </div>

      {/* Oval images strip */}
      <div className="relative w-full flex justify-center">
        <img
          src={ovalImages}
          alt="Momentos de oração e adoração no OIKOS"
          className="w-full max-w-[900px] h-auto block"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default WhatIsOikosSection;
