import worshipScene from "@/assets/oikos/worship-scene.jpg";

const CtaBannerSection = () => {
  return (
    <section className="relative w-full overflow-hidden py-10 md:py-20">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={worshipScene}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 px-4 md:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-display text-[#7EF17F] max-w-3xl uppercase font-bold leading-tight tracking-tight text-center md:text-left">
            Vamos viver o melhor fim de semana da sua vida?
          </h2>
          <a
            href="#inscricao"
            className="relative inline-flex items-center justify-center px-6 py-3 md:px-10 md:py-4 rounded-full border-2 border-[#fff9e1] text-[#fff9e1] font-bold text-base md:text-2xl uppercase tracking-widest whitespace-nowrap shrink-0"
          >
            FAZER MINHA INSCRIÇÃO!
          </a>
        </div>
      </div>
    </section>
  );
};

export default CtaBannerSection;
