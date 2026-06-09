// ==============================================================================
// IMPORTAÇÃO DE DEPENDÊNCIAS E CONFIGURAÇÃO DO SERVIDOR
// ==============================================================================

const express = require('express');  // Framework web para criar as rotas e gerenciar requisições HTTP
const mongoose = require('mongoose'); // Biblioteca ODM para modelar e conectar ao banco de dados MongoDB
const cors = require('cors');     // Middleware para liberar o acesso da API para outros domínios (como o Angular)

const app = express();

// Middlewares Globais
app.use(express.json()); // Permite que o Express entenda e processe dados enviados no formato JSON
app.use(cors());         // Ativa o CORS para que a aplicação Angular consiga se comunicar com esta API

// ==============================================================================
// CONFIGURAÇÃO DO BANCO DE DADOS (MONGODB EM MEMÓRIA RAM)
// ==============================================================================

const { MongoMemoryServer } = require('mongodb-memory-server');

/**
 * Inicializa um servidor MongoDB virtual rodando diretamente na memória RAM.
 * Ideal para ambientes de desenvolvimento rápido e testes, pois descarta a necessidade 
 * de instalar um banco de dados físico localmente.
 */
async function conectarBanco() {
  try {
    // Cria a instância do servidor MongoDB virtual
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Estabelece a conexão do Mongoose com o banco de dados virtual chamado 'techmanager'
    await mongoose.connect(`${uri}techmanager`);
    console.log('🚀 Conectado com sucesso ao MongoDB (Ambiente de Desenvolvimento em Memória)!');
  } catch (err) {
    console.error('❌ Erro crítico ao iniciar o banco de dados em memória:', err);
  }
}

// Inicializa a conexão com o banco de dados
conectarBanco();

// ==============================================================================
// MODELAGEM DE DADOS (MONGOOSE SCHEMA & MODEL)
// ==============================================================================

/**
 * Definição do esqueleto (Schema) de uma Ordem de Serviço (OS).
 * Determina quais campos o banco de dados aceitará e os seus tipos.
 */
const osSchema = new mongoose.Schema({
  cliente: { type: String, required: true }, // Nome do cliente (Obrigatório)
  endereco: String,                          // Endereço físico do atendimento
  patrimonio: String,                        // Código de controle do equipamento
  marca: String,                             // Fabricante da máquina
  modelo: String,                            // Modelo exato do aparelho
  causa: String,                             // Motivo da abertura do chamado (ex-campo defeito)
  status: { type: String, default: 'Em Análise' }, // Estado atual do chamado (Valor padrão inicial)
  dataCriacao: { type: Date, default: Date.now }   // Registra a data e hora do cadastro de forma automática
});

// Cria o modelo operacional a partir do Schema configurado acima
const OS = mongoose.model('OrdemServico', osSchema);

// ==============================================================================
// ROTAS DA API (ENDPOINTS HTTP RESTful)
// ==============================================================================

/**
 * ROTA 1: Listar todas as Ordens de Serviço
 * Método: GET /api/os
 */
app.get('/api/os', async (req, res) => {
  try {
    const chamados = await OS.find();
    res.json(chamados);
  } catch (erro) {
    res.status(500).json({ erro: 'Falha ao buscar as ordens de serviço do banco.' });
  }
});

/**
 * ROTA 2: Criar uma nova Ordem de Serviço
 * Método: POST /api/os
 */
app.post('/api/os', async (req, res) => {
  try {
    const novaOS = new OS(req.body);
    const osSalva = await novaOS.save();
    res.json(osSalva);
  } catch (erro) {
    res.status(400).json({ erro: 'Dados inválidos enviados no formulário.' });
  }
});

/**
 * ROTA 3: Atualizar o Status de uma Ordem de Serviço Existente
 * Método: PUT /api/os/:id
 */
app.put('/api/os/:id', async (req, res) => {
  try {
    // Busca pelo ID fornecido na URL e atualiza apenas a propriedade 'status' enviada no corpo da requisição
    const osAtualizada = await OS.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true } // Configuração que força o Mongoose a retornar o registro já modificado
    );
    res.json(osAtualizada);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao atualizar o status da ordem de serviço.' });
  }
});

/**
 * ROTA 4: Remover permanentemente uma Ordem de Serviço do banco
 * Método: DELETE /api/os/:id
 */
app.delete('/api/os/:id', async (req, res) => {
  try {
    // Localiza e remove o registro correspondente ao ID informado na URL
    await OS.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Ordem de serviço excluída com sucesso.' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao excluir a ordem de serviço informada.' });
  }
});

// ==============================================================================
// INICIALIZAÇÃO DO SERVIDOR WEB
// ==============================================================================

// Liga o servidor para escutar conexões externas na porta configurada (3000)
app.listen(3000, () => {
  console.log('💻 API Rodando perfeitamente e aguardando conexões na porta 3000!');
});
