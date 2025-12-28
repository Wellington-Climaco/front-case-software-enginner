import { pessoaResponse } from './pessoaResponse';

export type obterTodosResponse = {
  paginaAtual: number;
  tamanhoPagina: number;
  totalPaginas: number;
  totalRegistros: number;
  possuiPaginaAnterior: boolean;
  possuiPaginaSeguinte: boolean;
  registros: pessoaResponse[];
};
