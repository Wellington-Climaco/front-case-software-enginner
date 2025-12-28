import { Component, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ApiService } from '../../services/api-service';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { LazyLoadEvent, MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule, DatePicker } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { pessoaResponse } from '../../types/pessoaResponse';
import { obterTodosResponse } from '../../types/obterTodosResponse';
import { cadastrarPessoaRequest } from '../../types/cadastrarPessoaRequest';
import { atualizarCadastroRequest } from '../../types/atualizarCadastroRequest';

@Component({
  selector: 'app-menu',
  imports: [
    TableModule,
    CommonModule,
    Button,
    ToastModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    DialogModule,
    DatePicker,
    ReactiveFormsModule,
    SkeletonModule,
    ConfirmPopupModule,
  ],
  providers: [MessageService, FormBuilder, ConfirmationService],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  pessoas = signal<obterTodosResponse | null>(null);
  private paginaAtual = 1;
  skeletonRows = Array.from({ length: 5 });
  formCadastrarPessoa!: FormGroup;
  formAtualizarCadastro!: FormGroup;
  dialogCriarCadastroVisivel = false;
  dialogAtualizarCadastroVisivel = false;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.criarFormularioCadastroPessoa();
    this.obterTodosRegistros(1);
  }

  async obterTodosRegistros(pagina: number): Promise<void> {
    //await new Promise((f) => setTimeout(f, 5000));
    this.apiService.obterTodosRegistros(pagina).subscribe({
      next: (response) => {
        console.log(response);
        this.pessoas.set(response);
      },
      error: (err) => console.error('Erro ao carregar dados', err),
    });
  }
  removerRegistro(id: string): void {
    console.log(id);
    this.apiService.removerRegistro(id).subscribe({
      next: () => {
        this.obterTodosRegistros(this.paginaAtual);
        this.setarToast('success', 'Sucesso', 'Cadastro removido com sucesso');
      },
      error: (err) => {
        if (err.status == 500) {
          this.setarToast(
            'error',
            'erro',
            'Não foi possível remover registro, tente novamente mais tarde'
          );
        }

        this.setarToast('error', 'Erro', err.error);
      },
    });
  }
  confirmarRemocao(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.target as HTMLElement,
      message: 'Deseja realmente remover este registro?',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.removerRegistro(id);
      },
      reject: () => {
        this.setarToast('info', '', 'Você rejeitou a remoção desse item.');
      },
    });
  }
  onPageChange(event: LazyLoadEvent): void {
    const page = event.first! / event.rows! + 1;
    this.paginaAtual = page;
    this.obterTodosRegistros(page);
  }
  abrirDialogCriarCadastro() {
    this.dialogCriarCadastroVisivel = true;
  }
  abrirDialogAtualizarCadastro(dados: pessoaResponse) {
    this.criarFormularioAtualizarCadastro(dados);
    this.dialogAtualizarCadastroVisivel = true;
  }

  cadastrarPessoa(): void {
    if (this.formCadastrarPessoa.invalid) {
      this.formCadastrarPessoa.markAllAsTouched();
      return;
    }

    const request: cadastrarPessoaRequest = {
      ...this.formCadastrarPessoa.value,
      dataNascimento: this.formatarData(this.formCadastrarPessoa.value.dataNascimento),
    };

    this.apiService.cadastrarPessoa(request).subscribe({
      next: () => {
        this.dialogCriarCadastroVisivel = false;
        this.formCadastrarPessoa.reset();
        this.obterTodosRegistros(this.paginaAtual);
        this.setarToast('success', 'sucesso', 'Pessoa cadastrada com sucesso!');
      },
      error: (err) => {
        if (err.status == 500) {
          this.setarToast(
            'error',
            'erro',
            'Não foi possível efetuar cadastro, tente novamente mais tarde'
          );
        }

        this.setarToast('error', 'Erro', err.error);
      },
    });
  }
  private formatarData(data: Date): string {
    return data.toISOString().split('T')[0];
  }
  private criarFormularioCadastroPessoa(): void {
    this.formCadastrarPessoa = this.formBuilder.group({
      primeiroNome: ['', Validators.required],
      ultimoNome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      endereco: ['', Validators.required],
      telefone: ['', Validators.required],
      dataNascimento: ['', Validators.required],
    });
  }
  private criarFormularioAtualizarCadastro(dados: pessoaResponse): void {
    this.formAtualizarCadastro = this.formBuilder.group({
      id: [dados.id, Validators.required],
      primeiroNome: [dados.nome.split(' ')[0], Validators.required],
      ultimoNome: [dados.nome.split(' ').slice(1).join(' '), Validators.required],
      email: [dados.email, [Validators.required, Validators.email]],
      endereco: [dados.endereco, Validators.required],
      telefone: [dados.telefone, Validators.required],
      dataNascimento: [dados.dataNascimento, Validators.required],
    });
  }
  atualizarCadastro() {
    if (this.formAtualizarCadastro.invalid) {
      this.formCadastrarPessoa.markAllAsTouched();
      return;
    }

    const request: atualizarCadastroRequest = { ...this.formAtualizarCadastro.value };
    this.apiService.atualizarCadastro(request).subscribe({
      next: () => {
        this.dialogAtualizarCadastroVisivel = false;
        this.formAtualizarCadastro.reset();
        this.obterTodosRegistros(this.paginaAtual);
        this.setarToast('success', 'sucesso', 'Cadastro atualizado com sucesso!');
      },
      error: (err) => {
        if (err.status == 500) {
          this.setarToast(
            'error',
            'erro',
            'Não foi possível atualizar cadastro, tente novamente mais tarde'
          );
        }

        this.setarToast('error', 'Erro', err.error);
      },
    });
  }
  private setarToast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
  }
}
