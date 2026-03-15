import whatIsOikosDesktop from '@/assets/oikos/desktop/DESKTOP_SS_02_03.png'
import newAgeDesktopImage from '@/assets/oikos/desktop/DESKTOP_NOIVAS.png'
import whatIsOikosMobile from '@/assets/oikos/mobile/MOBILE_SS_02__SS_03__SS_04_edit.png'
import newAgeMobileImage from '@/assets/oikos/mobile/MOBILE_NOIVAS.png'
import btnMySubscript from '@/assets/oikos/BOTAO_FACA_INSC.png'

const WhatIsOikosSection = () => {
  return (
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
