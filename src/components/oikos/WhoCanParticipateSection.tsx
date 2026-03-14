import prayingGirl from "@/assets/oikos/BEA _FOTO.png";

const WhoCanParticipateSection = () => {
  return (
    <section className="w-full" style={{ backgroundColor: "#fff9e1" }}>
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left column - Text */}
          <div>
            <h2
              className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase leading-[0.9] mb-8"
              style={{ color: "#1a1a1a" }}
            >
              QUEM PODE
              <br />
              PARTICIPAR?
            </h2>
            <div className="text-lg md:text-xl lg:text-2xl leading-relaxed font-medium" style={{ color: "#333" }}>
              <p>
                Para aquele jovem que nunca teve contato com a
                Igreja, a uma experiência de encontro com Deus, assim
                como para quem já trilhou uma experiência do
                encontro com Deus e por algum motivo se esfriaram
                na fé e afastaram.
              </p>
              <p>
                Como também, é para quem está bem e crescendo
                em Deus e deseja dar um UPGRADE em sua vida com
                Deus.
              </p>
            </div>
          </div>

          {/* Right column - Image */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-[380px] rounded-[20px] overflow-hidden">
              <img
                src={prayingGirl}
                alt="Jovem em oração"
                className="w-full h-full object-cover"
                // loading="lazy"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhoCanParticipateSection;
