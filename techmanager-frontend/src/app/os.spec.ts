// Importa o TestBed, que é o laboratório de testes do Angular para criar ambientes falsos
import { TestBed } from '@angular/core/testing';

// Importa o serviço que será testado pelo arquivo
import { OsService } from './os.service';

// O "describe" inicia um grupo de testes focado no serviço "Os"
describe('Os', () => {
  // Cria uma variável vazia para guardar a cópia do serviço que vamos testar
  let service: OsService;

  // O "beforeEach" roda um bloco de comandos antes de começar cada teste da lista
  beforeEach(() => {
    // Configura uma caixinha de ferramentas falsa (módulo de testes) para o Angular
    TestBed.configureTestingModule({});
    // Cria uma cópia real do OsService dentro do nosso ambiente de teste
    service = TestBed.inject(OsService);
  });

  // O "it" define um caso de teste individual em linguagem humana
  it('should be created', () => {
    // O "expect" faz uma verificação de segurança no código
    // O "toBeTruthy" confere se o serviço nasceu direitinho e não está nulo ou quebrado
    expect(service).toBeTruthy();
  });
});
