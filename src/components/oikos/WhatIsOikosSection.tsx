import whatIsOikosDesktop from '@/assets/oikos/desktop/DESKTOP_SS_02_03.png'
import newAgeDesktopImage from '@/assets/oikos/desktop/DESKTOP_NOIVAS.png'
import whatIsOikosMobile from '@/assets/oikos/mobile/MOBILE_SS_02__SS_03__SS_04_edit.png'
import newAgeMobileImage from '@/assets/oikos/mobile/MOBILE_NOIVAS.png'
import btnMySubscript from '@/assets/oikos/BOTAO_FACA_INSC.png'

const WhatIsOikosSection = () => {
  return (
    // <section className="relative w-full overflow-hidden bg-secondary text-[#fffbeb] p-8 md:p-16 lg:p-24" style={{ backgroundColor: "#4ade80" }}>
    //   <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
    //     <img
    //       src={ovalImages}
    //       alt=""
    //       className="w-full h-full object-cover object-center opacity-90"
    //       // loading="lazy"
    //     />
    //   </div>
    //   <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
    //     <div>
    //       <h2 className="font-display text-6xl md:text-7xl lg:text-8xl mb-6 uppercase leading-[0.9] tracking-normal">
    //         O que é<br />o Oikos?
    //       </h2>
    //       <p className="text-xl md:text-2xl font-bold max-w-md leading-snug">
    //         O OIKOS é a nossa experiência de primeiro anúncio para jovens.
    //       </p>
    //     </div>
    //     <div>
    //       <p className="text-lg md:text-xl lg:text-2xl leading-relaxed font-medium">
    //         Ele nasce diante da necessidade de alargar as tendas de nosso
    //         movimento, trazer novos corações e um ar novo para dentro de nossa
    //         casa, incendiar um novo povo e novos filhos para manifestarem a
    //         glória de Deus ao mundo.
    //       </p>
    //     </div>
    //   </div>
    // </section>
    <section className="w-full">
      <picture>
        <source media="(max-width: 767px)" srcSet={whatIsOikosMobile} />
        <img
          src={whatIsOikosDesktop}
          alt="O que é o OIKOS?"
        />
      </picture>

      <a href='#inscricao'>
        <picture>
          <source media="(max-width: 767px)" srcSet={btnMySubscript} />
          <img
            src={btnMySubscript}
            alt="Vamos viver o melhor final de semana da sua vida?"
            className='pb-3 cursor-pointer' />
        </picture>
      </a>

      <picture>
        <source media="(max-width: 767px)" srcSet={newAgeMobileImage} />
        <img
          src={newAgeDesktopImage}
          alt="O que é o OIKOS?"
          className='pb-12'
        />
      </picture>
    </section>
  );
};

export default WhatIsOikosSection;
