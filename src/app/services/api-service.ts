import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pessoaResponse } from '../types/pessoaResponse';
import { obterTodosResponse } from '../types/obterTodosResponse';
import { cadastrarPessoaRequest } from '../types/cadastrarPessoaRequest';
import { atualizarCadastroRequest } from '../types/atualizarCadastroRequest';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080';
  private http = inject(HttpClient);

  obterTodosRegistros(pagina: number): Observable<obterTodosResponse> {
    return this.http.get<obterTodosResponse>(`${this.baseUrl}/obterTodos/pagina/${pagina}`);
  }

  removerRegistro(id: string): Observable<Object> {
    return this.http.delete(`${this.baseUrl}/remover/${id}`);
  }

  cadastrarPessoa(request: cadastrarPessoaRequest): Observable<pessoaResponse> {
    return this.http.post<pessoaResponse>(`${this.baseUrl}/cadastrar`, request);
  }

  atualizarCadastro(request: atualizarCadastroRequest): Observable<pessoaResponse> {
    return this.http.put<pessoaResponse>(`${this.baseUrl}/atualizar`, request);
  }
}
