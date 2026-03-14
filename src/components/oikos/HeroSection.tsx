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

      {/* <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[350%] md:w-[250%] lg:w-[200%] h-[85vh] md:h-[95vh] bg-halftone-blue z-0"
        style={{ clipPath: "ellipse(40% 100% at 50% 0%)" }}
      ></div>

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] md:w-[100%] lg:w-[90%] h-[30vh] md:h-[40vh] lg:h-[45vh] bg-halftone-green z-[3]"
        style={{ clipPath: "ellipse(40% 100% at 50% 0%)" }}
      ></div>

      <div className="absolute top-6 w-full flex justify-center items-center gap-4 md:gap-32 text-[8px] md:text-xs font-bold tracking-[0.2em] text-[#1a1a1a] z-10">
        <span>GOVERNADOR</span>
        <span className="text-xl md:text-3xl font-black tracking-normal">
          26'
        </span>
        <span>VALADARES - MG</span>
      </div>

      <div className="absolute top-[15%] md:top-[18%] left-6 md:left-16 lg:left-24 text-[10px] md:text-lg font-black text-white tracking-widest z-10">
        IDADE: 17+
      </div>

      <div className="absolute top-[15%] md:top-[18%] right-6 md:right-16 lg:right-24 text-[10px] md:text-lg font-black text-white text-right tracking-widest leading-tight z-10">
        CENTREL
        <br />
        PERNOITE
      </div>

      <div
        className="absolute top-[14%] md:top-[12%] left-1/2 -translate-x-1/2 w-[48vw] md:w-[450px] lg:w-[600px] h-[52vh] md:h-[800px] lg:h-[900px] bg-[#1a1a1a] z-10"
        style={{
          clipPath:
            "polygon(0 0, 35% 8%, 50% 55%, 65% 8%, 100% 0, 65% 80%, 35% 80%)",
        }}
      ></div>

      <div className="absolute top-[16%] md:top-[12%] left-1/2 -translate-x-1/2 z-20 w-full text-center pointer-events-none flex justify-center">
        <h1
          className="font-display text-[22vw] md:text-[10rem] lg:text-[14rem] text-white leading-none tracking-tighter origin-top drop-shadow-2xl scale-y-[1.5] md:scale-y-[1.4] lg:scale-y-[1.5] scale-x-[0.88] md:scale-x-100"
          style={{ letterSpacing: "-0.01em" }}
        >
          OIKOS
        </h1>
      </div>

      <div className="absolute bottom-[24%] md:bottom-[22%] lg:bottom-[25%] left-3 md:left-16 lg:left-24 text-[7px] md:text-xs font-bold text-white tracking-[0.1em] md:tracking-[0.15em] leading-relaxed z-30 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col">
          <div className="flex gap-1 md:gap-3">
            <span>O</span>
            <span>MELHOR</span>
            <span>FINAL</span>
            <span>DE</span>
            <span>SEMANA</span>
          </div>
          <div className="flex gap-1 md:gap-3">
            <span>DAS</span>
            <span>NOSSAS</span>
            <span>VIDAS</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[24%] md:bottom-[22%] lg:bottom-[25%] right-3 md:right-16 lg:right-24 flex flex-col items-end z-30 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
        <div className="flex gap-1 md:gap-5 mb-0.5 md:mb-2">
          {[5, 6, 7].map((num) => (
            <div
              key={num}
              className="w-6 h-6 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-[1.5px] md:border-[3px] border-white flex items-center justify-center text-[9px] md:text-xl lg:text-2xl font-black text-white font-display"
            >
              {num}
            </div>
          ))}
        </div>
        <div className="text-[9px] md:text-2xl lg:text-3xl font-black text-white tracking-widest">
          JUNHO <span className="text-white">2026</span>
        </div>
      </div> */}
    </section>
  );
};

export default HeroSection;
