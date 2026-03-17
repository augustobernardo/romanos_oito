import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Tables } from "@/integrations/supabase/types";

type Inscricao = Tables<"inscricoes">;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createUniqueKey = (inscricao: Inscricao) => {
  return `${inscricao.nome.trim().toLowerCase()}_${inscricao.telefone.trim()}`;
};

// Função para filtrar apenas os registros mais recentes por chave única
export const getUniqueRecentInscricoes = (inscricoes: Inscricao[]) => {
  const uniqueMap = new Map<string, Inscricao>();
  
  inscricoes.forEach(inscricao => {
    const key = createUniqueKey(inscricao);
    const existing = uniqueMap.get(key);
    
    // Se não existir ou se este registro for mais recente, adiciona/substitui
    if (!existing || new Date(inscricao.created_at) > new Date(existing.created_at)) {
      uniqueMap.set(key, inscricao);
    }
  });

  return Array.from(uniqueMap.values());
};

// Usada para mapear os nomes das colunas para a exportação
export const columnLabels: Record<string, string> = {
  nome: "Nome",
  telefone: "Telefone",
  data_nascimento: "Data de Nascimento",
  instagram: "Instagram",
  comunidade: "Comunidade",
  cidade_estado: "Cidade/Estado",
  endereco_completo: "Endereço Completo",
  tamanho_camisa: "Tamanho Camisa",
  nome_pai: "Nome do Pai",
  numero_pai: "Número do Pai",
  nome_mae: "Nome da Mãe",
  numero_mae: "Número da Mãe",
  numero_responsavel_proximo: "Número Responsável Próximo",
  is_catolico: "É Católico?",
  is_catolico_outro: "Católico (Outro)",
  participa_movimento: "Participa de Movimento",
  fez_retiro: "Fez Retiro?",
  fez_retiro_outro: "Retiro (Outro)",
  como_conheceu: "Como Conheceu",
  como_conheceu_outro: "Como Conheceu (Outro)",
  nome_pessoa_emergencia: "Pessoa de Emergência",
  grau_parentesco_emergencia: "Grau de Parentesco (Emergência)",
  numero_emergencia: "Número de Emergência",
  expectativa_oikos: "Expectativa OIKOS",
  status: "Status",
  created_at: "Data da Inscrição",
};

export const formatNamesString = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

export const formatNamesStringsInscricao = (insc: Inscricao[]) =>
  insc.map((i) => ({
    ...i,
    nome: formatNamesString(i.nome),
    comunidade: formatNamesString(i.comunidade),
    cidade_estado: formatNamesString(i.cidade_estado),
  })
);
