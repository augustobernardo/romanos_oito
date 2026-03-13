import ovalImages from "@/assets/oikos/oval-images.png";
import whatIsOikosImg from "@/assets/oikos/COPY_SS02.png";

const WhatIsOikosSection = () => {
  return (
    <section className="relative w-full overflow-hidden min-h-[70vh] md:min-h-[80vh]" style={{ backgroundColor: "#4ade80" }}>
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-20 md:py-32 lg:py-56"> 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center justify-items-center text-center md:text-left">
          {/* Left column */}
          <div>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase leading-none mb-4 text-white"
            >
              O QUE É
              <br />
              O OIKOS?
            </h2>
            <p className="text-white text-sm md:text-base leading-relaxed">
              O OIKOS é a nossa experiência de primeiro anúncio para jovens.
            </p>
          </div>

          {/* Right column */}
          <div className="flex items-start">
            <p className="text-white text-sm md:text-base leading-relaxed">
              Ele nasce diante da necessidade de alargar as frontas do nosso
              movimento, trazer novos corações e um ar novo para dentro de
              nossas casas... buscando um novo rumo e novas trilhas
              para manifestarem a glória de Deus ao mundo.
            </p>
          </div>
        </div>
      </div>

      {/* Oval images strip */}
      {/* <div className="relative w-full flex justify-center z-10">
        <img
          src={whatIsOikosImg}
          alt="O que é o OIKOS? O OIKOS é a nossa experiência de primeiro anúncio para jovens."
          // className="w-full max-w-[900px] h-auto block"
          loading="lazy"
        />
      </div> */}
      {/* Oval images background */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none w-full z-0">
        <img
          src={ovalImages}
          alt="Momentos de oração e adoração no OIKOS"
          className="max-w-none opacity-90 h-auto block w-full"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default WhatIsOikosSection;
