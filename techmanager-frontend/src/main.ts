// ==============================================================================
// IMPORTAÇÃO DE MÓDULOS NATIVOS E CONFIGURAÇÕES DO NÚCLEO
// ==============================================================================

// Importa o inicializador global do Angular para aplicações modernas baseadas em Standalone Components
import { bootstrapApplication } from '@angular/platform-browser';

// Importa o arquivo de configuração central do app (gerencia rotas, provedores HTTP, etc.)
import { appConfig } from './app/app.config';

// Importa o componente raiz (o topo da hierarquia visual) que gerencia a tela principal
import { AppComponent } from './app/app'; 

// ==============================================================================
// INICIALIZAÇÃO DA APLICAÇÃO (BOOTSTRAP PROCESS)
// ==============================================================================

/**
 * Dispara o processo de inicialização assíncrona do ecossistema Angular.
 * 
 * @param AppComponent O componente principal que será renderizado na tag <app-root> do index.html.
 * @param appConfig Objeto contendo os provedores globais necessários para toda a aplicação.
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    // Intercepta e expõe no console do navegador qualquer falha crítica ocorrida durante o carregamento inicial
    console.error('❌ Erro crítico ao inicializar a aplicação Angular:', err);
  });
