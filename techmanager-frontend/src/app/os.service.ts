// Importa o decorador Injectable, que permite que essa classe seja usada (injetada) em outros componentes
import { Injectable } from '@angular/core';
// Importa o cliente HTTP do Angular para fazer requisições (enviar e receber dados do servidor)
import { HttpClient } from '@angular/common/http';
// Importa o Observable, que permite monitorar e receber as respostas do servidor de forma assíncrona
import { Observable } from 'rxjs';

// Esse decorador avisa ao Angular que o serviço está pronto para ser usado em qualquer lugar do sistema
@Injectable({
  providedIn: 'root' // Define que o serviço terá uma única cópia viva para toda a aplicação
})
export class OsService {
  
  // Endereço do servidor local (API) onde as ordens de serviço ficam salvas
  private apiUrl = 'http://192.168.1.22:3000/api/os';

  // O construtor recebe o "HttpClient" e o guarda em uma variável interna chamada "http"
  constructor(private http: HttpClient) { }

  // Função que busca a lista de todas as ordens de serviço guardadas no servidor
  listarOS(): Observable<any[]> {
    // Faz um pedido do tipo GET para o endereço da API e aguarda o retorno da lista (array)
    return this.http.get<any[]>(this.apiUrl);
  }

  // Função que envia os dados de uma nova ordem de serviço para ser salva no servidor
  criarOS(os: any): Observable<any> {
    // Faz um pedido do tipo POST para o endereço da API, levando junto os dados da nova OS
    return this.http.post<any>(this.apiUrl, os);
  }

  // Função que altera apenas o status de uma ordem de serviço específica
  atualizarStatus(id: string, status: string): Observable<any> {
    // Faz um pedido do tipo PUT para o endereço da API adicionando o ID na URL (ex: .../api/os/123)
    // Envia junto um objeto contendo o novo status do cartão
    return this.http.put<any>(`${this.apiUrl}/${id}`, { status });
  }

  // Função que apaga de vez uma ordem de serviço do servidor
  excluirOS(id: string): Observable<any> {
    // Faz um pedido do tipo DELETE para o endereço da API passando o ID da OS que deve sumir
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
