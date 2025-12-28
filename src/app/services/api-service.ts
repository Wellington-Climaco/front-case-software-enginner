import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080';
  private http = inject(HttpClient);

  obterTodosRegistros(pagina: number): Observable<obterTodosResponse> {
    return this.http.get<obterTodosResponse>(`${this.baseUrl}/obterTodos/pagina/${pagina}`);
  }
}
