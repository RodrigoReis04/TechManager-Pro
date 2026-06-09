// Importa as ferramentas necessárias do próprio Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// Importa o módulo que permite usar diretivas básicas como *ngIf e *ngFor no HTML
import { CommonModule } from '@angular/common'; 
// Importa o módulo que ativa a ligação de dados em formulários com [(ngModel)]
import { FormsModule } from '@angular/forms'; 
// Importa o serviço que faz a ponte e a comunicação com o banco de dados (API)
import { OsService } from './os.service';

@Component({
  selector: 'app-root',             // Nome da tag HTML criada para carregar este componente
  standalone: true,                 // Indica que o componente é independente e gerencia suas próprias importações
  imports: [CommonModule, FormsModule], // Libera o uso de recursos de formulário e loops estruturais no HTML
  templateUrl: './app.html'         // Caminho do arquivo de visualização (HTML) deste componente
})
export class AppComponent implements OnInit {
  
  // Variáveis globais da classe (Atributos)
  listaOS: any[] = []; // Guarda todas as ordens de serviço recebidas do banco de dados
  termoBusca: string = ''; // Guarda o texto que o usuário digita no campo de pesquisa
  
  // Objeto que começa vazio para guardar os dados do formulário de criação de nova OS
  novaOS = { 
    cliente: '', 
    endereco: '', 
    patrimonio: '', 
    marca: '', 
    modelo: '', 
    causa: '' 
  };

  // O construtor injeta as ferramentas externas (serviço e atualizador de tela) para uso na classe
  constructor(
    private osService: OsService,    // Conecta com o serviço que manipula os dados das ordens
    private cdr: ChangeDetectorRef   // Conectado para gerenciar manualmente as atualizações visuais da tela
  ) {}

  // Função nativa do Angular que roda de forma automática assim que a tela abre
  ngOnInit(): void { 
    this.carregarOS(); // Inicia o sistema trazendo os dados salvos
  }

  // Busca todas as ordens de serviço cadastradas na API
  carregarOS() {
    // Chama a função do serviço e se inscreve (.subscribe) para aguardar o retorno dos dados
    this.osService.listarOS().subscribe(dados => {
      
      // Recebe a lista e organiza para colocar as ordens mais novas no topo da tela
      this.listaOS = dados.sort((a: any, b: any) => 
        new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
      );
      
      // Avisa o Angular que novos dados chegaram e força o HTML a se redesenhar imediatamente
      this.cdr.detectChanges(); 
    });
  }

  // Função do tipo "get" que cria uma lista filtrada em tempo real conforme a digitação do usuário
  get osFiltradas() {
    // Filtra a lista principal verificando se o termo pesquisado bate com o cliente ou patrimônio
    return this.listaOS.filter(os => 
      // Transforma tudo em letra minúscula para que a busca não diferencie maiúsculas de minúsculas
      os.cliente.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
      os.patrimonio.toLowerCase().includes(this.termoBusca.toLowerCase())
    );
  }

  // Recebe um nome de status e faz a conta de quantos itens na lista possuem esse status exato
  contarStatus(status: string) {
    // Filtra os itens com o status correspondente e retorna apenas a quantidade (.length)
    return this.listaOS.filter(os => os.status === status).length;
  }

  // Envia as informações preenchidas no formulário para criar um novo registro no sistema
  salvarOS() {
    // Validação básica: só avança se o campo "cliente" não estiver em branco
    if(this.novaOS.cliente) {
      // Envia os dados capturados para a função de criação do serviço
      this.osService.criarOS(this.novaOS).subscribe(() => {
        
        // Após salvar com sucesso, limpa todos os campos do formulário para o próximo cadastro
        this.novaOS = { cliente: '', endereco: '', patrimonio: '', marca: '', modelo: '', causa: '' };
        
        // Recarrega a lista para mostrar a nova ordem criada na tela
        this.carregarOS();
      });
    }
  }

  // Recebe o identificador único da ordem e o novo valor de status selecionado no menu dropdown
  alterarStatus(id: string, novoStatus: string) {
    // Envia o ID e o novo status para o serviço atualizar no banco de dados
    this.osService.atualizarStatus(id, novoStatus).subscribe(() => 
      // Após a atualização terminar, recarrega a lista para exibir o dado novo atualizado
      this.carregarOS()
    );
  }

  // Remove permanentemente uma ordem de serviço do sistema através do ID recebido
  deletarOS(id: string) {
    // Aciona a rota de exclusão no serviço passando o identificador correspondente
    this.osService.excluirOS(id).subscribe(() => 
      // Atualiza a listagem na tela removendo visualmente o item deletado
      this.carregarOS()
    );
  }
}
