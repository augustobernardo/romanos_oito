import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    question: "Quais os dias do encontro? E qual o horário de início na sexta-feira?",
    answer:
      "O OIKOS vai acontecer nos dias 5, 6 e 7 de Junho (sexta, sábado e domingo). Na sexta-feira é provavel que inicie às 16h com check-in.",
  },
  {
    question: "Eu trabalho no sábado de manhã. Posso participar?",
    answer:
      "Depente. Recomendamos que diante da antecedência da sua inscrição seja possível que busce junto ao seu trabalho uma folga ou compensão na carga horário fazendo hora extra.",
  },
  {
    question: "De onde sai para o local do retiro?",
    answer:
      "SAÍDA: Av. Roma, 425 - Grã-Duquesa (Paróquia Cristo Redentor)",
  },
  {
    question: "O que está incluso na inscrição?",
    answer:
      "TRANSPORTE, ALIMENTAÇÃO & KIT OIKOS (Camisa e brindes) (O transporte incluso é IDA para o local do retiro saindo da Paróquia Cristo Redentor e o RETORNO ao final do retiro para o mesmo local de saída, Paróquia Cristo Redentor);",
  },
  {
    question: "O OIKOS é de dormir?",
    answer:
      "Sim. O encontro funciona no formato de pernoite!",
  },
  {
    question: "O que é preciso levar para pernoite?",
    answer:
      "Roupa de cama e banho, itens de hiegene pessoal, roupas confortáveis;",
  },
  {
    question: "Como funciona a política de cancelamento/desistência da inscrição para o OIKOS?",
    answer:
      "Em caso de desistência será feito o estorno de apenas de 20% do valor da inscrição devido ao pedido das camisas e outros itens junto aos fornecedores. Para desistência faça contato com SAC do ROMANOS 8: +55 33 9842-7416",
  },
  {
    question: "Posso transferir minha inscrição para outra pessoa?",
    answer:
      "Sim. A titularidade da inscrição é TRANSFERÍVEL, podendo em caso de desistência ser repassada a sua vaga para outra pessoa. Para isto, se faz necessário fazer contato com número do SAC: +55 33 9842-7416",
  },
  {
    question: "Após preencher o formulário já estou automaticamente inscrito?",
    answer:
      "Não. Sua inscrição SÓ SERÁ REALMENTE EFETIVADA APÓS O PAGAMENTO! Sendo assim, apenas preencher este formulário NÃO GARANTE SUA VAGA! ",
  },
  {
    question: "Sou de outra cidade. Posso participar do retiro?",
    answer:
      "Sim, porém está sujeito à avaliação posterior. O OIKOS tem intenção de captar o máximo de pessoas que após a experiência estejam próximas à missão e possam caminhar conosco. Logo, morar em outra cidade/estado prejudica parcialmente a experiência pós-OIKOS.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full" style={{ backgroundColor: "#14A7C9" }}>
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20 lg:py-24">
        <h2
          className="font-display text-6xl text-[#fff9e1] md:text-7xl lg:text-8xl font-bold uppercase text-center mb-12 md:mb-16"
        >
          FAQ
        </h2>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden transition-colors"
              style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-sans text-base md:text-lg font-bold text-[#fff9e1] pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-white shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-60" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-5 text-sm md:text-base leading-relaxed text-white/80">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
