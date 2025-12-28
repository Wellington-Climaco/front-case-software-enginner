import { Component, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ApiService } from '../../services/api-service';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-menu',
  imports: [TableModule, CommonModule, Button],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  pessoas = signal<obterTodosResponse | null>(null);
  first = 1;
  last = 5;
  totalRecords = 20;
  selectedSize = 'normal';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.obterTodosRegistros(1);
  }

  obterTodosRegistros(pagina: number): void {
    this.apiService.obterTodosRegistros(pagina).subscribe({
      next: (response) => {
        console.log(response);
        this.pessoas.set(response);
        console.log(this.pessoas);
      },
      error: (err) => console.error('Erro ao carregar dados', err),
    });
  }
  onPageChange(event: LazyLoadEvent): void {
    const page = event.first! / event.rows! + 1;
    this.obterTodosRegistros(page);
  }
}
