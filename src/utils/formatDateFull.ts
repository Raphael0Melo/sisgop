import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateFull(dateString: string) {
  const date = new Date(dateString);

  // formata no padrão brasileiro: 23 de outubro de 2025
  const formatted = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // coloca a primeira letra maiúscula
  return formatted.replace(/^./, (char) => char.toUpperCase());
}