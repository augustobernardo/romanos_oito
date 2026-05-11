import { WHATSAPP_NUMBER_FORMATTED } from "@/config/constants";

export const VIGILIA_INFO_TEXT =
  `📖 LEIA COM ATENÇÃO AS INFORMAÇÕES DA VIGÍLIA DE PENTECOSTES

A Vigília de Pentecostes é um momento de profunda experiência espiritual, onde nos reunimos para clamar o derramamento do Espírito Santo sobre nossas vidas.

🕘 HORÁRIOS
• Início: 21h30
• Término: 7h do dia seguinte (com missa às 6h)
• Check-in: a partir das 21h30

💵 TAXA DE CONTRIBUIÇÃO
R$ 10,00

📍 LOCAL
Paróquia Cristo Redentor - Av. Roma, 425 - Grã-Duquesa

🙏 O QUE ESPERAR
• Momentos de oração e louvor
• Pregações e partilhas da Palavra
• Adoração ao Santíssimo Sacramento
• Workshops sobre os Dons do Espírito Santo
• Partilha de alimentos (cada participante contribui)

📋 REGRAS IMPORTANTES
• É necessário trazer documento de identificação
• Menores de 18 anos devem trazer autorização assinada pelos pais/responsáveis
• A vigília de pentecostes é aberta para qualquer um, de qualquer paróquia e movimento participar e que tenha idade superior a 14 anos
• Aos menores de 18 anos pedimos que entre em contato IMEDIATAMENTE com o número do SAC (33) 99709-5843 solicitando para que seja enviada uma autorização para que os pais/responsável possa assinar autorizando sua participação
• Os menores de idade não poderão em hipótese alguma sair da Igreja após o fechamento dos portões (22h30) com ressalva em caso de emergência ou o pai/responsável compareça PESSOALMENTE a paróquia para buscar ou previamente combinado com a coordenação geral do Romanos 8 e pais/responsável do menor de idade
• Celulares devem permanecer no modo silencioso
• Respeitar o ambiente de oração e os momentos de silêncio

🍞 PARTILHA
Cada participante deve contribuir com um item para a partilha de alimentos
(as opções serão apresentadas no formulário)

👕 VESTIMENTA
Roupas confortáveis e adequadas ao ambiente de igreja

📞 CONTATO
Em caso de dúvidas, entre em contato com o SAC do Romanos 8: ` +
  WHATSAPP_NUMBER_FORMATTED;

interface VigiliaInfoSummaryProps {
  readOnly?: boolean;
}

const VigiliaInfoSummary = ({ readOnly = false }: VigiliaInfoSummaryProps) => {
  if (readOnly) {
    return (
      <div className="font-mono text-xs uppercase leading-relaxed tracking-wide text-pentecoste-navy/85 whitespace-pre-line">
        {VIGILIA_INFO_TEXT}
      </div>
    );
  }

  return (
    <div
      className="max-h-[50vh] overflow-y-auto border-2 border-pentecoste-navy bg-pentecoste-paper p-6 font-mono text-xs uppercase leading-relaxed tracking-wide text-pentecoste-navy/85 whitespace-pre-line"
      style={{ scrollBehavior: "smooth" }}
    >
      {VIGILIA_INFO_TEXT}
    </div>
  );
};

export default VigiliaInfoSummary;
