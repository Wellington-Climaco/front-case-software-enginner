type obterTodosResponse = {
  paginaAtual: number;
  tamanhoPagina: number;
  totalPaginas: number;
  totalRegistros: number;
  possuiPaginaAnterior: boolean;
  possuiPaginaSeguinte: boolean;
  registros: pessoaResponse[];
};

type pessoaResponse = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  dataNascimento: string;
};
