import worshipScene from "@/assets/oikos/worship-scene.jpg";

const EventDetailsSection = () => {
  return (
    <section
      className="w-full rounded-3xl overflow-hidden"
      style={{ backgroundColor: "#F2EDE4" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-8 md:gap-12 items-start">
          {/* Left column - Event info */}
          <div className="flex flex-col justify-start h-full max-w-[540px] mx-auto md:mx-0">
            {/* Date badges */}
            <div className="flex items-center gap-4">
              {["5", "6", "7"].map((day) => (
                <div
                  key={day}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-display text-2xl md:text-3xl font-bold border-2 border-[#393939] bg-transparent text-[#393939]"
                  // set as ellipse to create a more unique shape for the date badges
                  // style={{
                  //   clipPath: "ellipse(1000% 40% at 50% 50%)",
                  // }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Month/Year */}
            <div className="flex items-start gap-10 md:gap-14">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-6xl text-[#393939]">
                  JUNHO
                </span>
                <span className="font-display text-6xl font-bold text-[#393939]" style={{ lineHeight: 2 }}>
                  2026
                </span>
              </div>
              <div className="flex flex-col ml-auto items-start">
                <span className="text-xs md:text-sm uppercase font-bold tracking-widest text-[#393939]">
                  NOVA FAIXA ETÁRIA
                </span>
                <span
                  className="font-display text-6xl md:text-[4.5rem] lg:text-[5rem] font-bold text-[#19C971]"
                >
                  17+
                </span>
                <span className="text-xs md:text-sm uppercase font-bold tracking-wide text-[#393939]">
                  ATÉ 25 ANOS
                </span>
              </div>
            </div>

            {/* Location */}
            <p className="text-xs md:text-sm uppercase tracking-wider mb-3 text-[#393939]">
              LOCAL: CENTRO DE FORMAÇÃO DIOCESANO{" "}
              <span className="font-bold text-[#393939]">CENTREL</span>
            </p>

            <p className="text-sm md:text-base leading-relaxed text-[#393939]">
              A nova faixa etária dá ao OIKOS a possibilidade de levar cada
              participante a extrair o máximo daquilo que Deus deseja entregar
              nestes dias. Sendo assim, entendemos que a idade é um fator
              crucial para a assimilação e absorção do conteúdo desenvolvido no
              decorrer do encontro.
            </p>
          </div>

          {/* Right column - Image */}
          <div className="flex justify-center md:justify-end">
            <div
              className="w-full max-w-[560px] rounded-[24px] overflow-hidden shadow-xl"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={worshipScene}
                alt="Momento de adoração no OIKOS"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetailsSection;
