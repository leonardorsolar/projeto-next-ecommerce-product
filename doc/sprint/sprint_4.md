# ✅ Sprint 4 — Qualidade e Entrega
> Sistema de Gestão de Produtos para E-commerce

**Duração estimada:** 1 hora
**Pré-requisito:** Sprints 1, 2 e 3 concluídos
**Objetivo:** Escrever testes unitários, revisar erros, adicionar estados de UI e finalizar a documentação para entrega.

---

## 📋 Checklist de Tarefas

- [ ] Escrever 4 testes unitários do `productService`
- [ ] Revisar tratamento de erros nas API Routes
- [ ] Adicionar estados de loading e erro no frontend
- [ ] Escrever `README.md` com instruções de instalação
- [ ] Checklist final de entrega

---

## 🛠️ Passo a Passo

### 1. Configurar Jest no Next.js

```bash
npm install --save-dev jest jest-environment-node @types/jest ts-jest
```

Criar `jest.config.ts` na raiz do projeto:

```typescript
// jest.config.ts

import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
}

export default config
```

Adicionar script no `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

### 2. Testes Unitários do `productService`

```bash
mkdir -p src/__tests__/unit
```

```typescript
// src/__tests__/unit/productService.test.ts

import { productService, ValidationError } from '@/modules/products/services/productService'
import { productRepository } from '@/modules/products/repository/productRepository'

// Mock do repository para não precisar do banco nos testes
jest.mock('@/modules/products/repository/productRepository')

const mockRepository = productRepository as jest.Mocked<typeof productRepository>

const mockProduct = {
  id: 1,
  name: 'Camiseta',
  description: 'Camiseta branca',
  price: 59.90,
  stock: 100,
  createdAt: '2024-01-29T10:00:00',
}

describe('productService.create', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRepository.create.mockReturnValue(mockProduct)
  })

  it('deve criar produto com dados válidos', () => {
    const result = productService.create({
      name: 'Camiseta',
      price: 59.90,
      stock: 100,
    })

    expect(result).toEqual(mockProduct)
    expect(mockRepository.create).toHaveBeenCalledTimes(1)
  })

  it('deve lançar ValidationError quando nome está vazio', () => {
    expect(() =>
      productService.create({ name: '', price: 59.90, stock: 100 })
    ).toThrow(ValidationError)

    expect(() =>
      productService.create({ name: '', price: 59.90, stock: 100 })
    ).toThrow('Nome é obrigatório')
  })

  it('deve lançar ValidationError quando nome é só espaços', () => {
    expect(() =>
      productService.create({ name: '   ', price: 59.90, stock: 100 })
    ).toThrow(ValidationError)
  })

  it('deve lançar ValidationError quando preço é negativo', () => {
    expect(() =>
      productService.create({ name: 'Camiseta', price: -1, stock: 100 })
    ).toThrow(ValidationError)

    expect(() =>
      productService.create({ name: 'Camiseta', price: -1, stock: 100 })
    ).toThrow('Preço não pode ser negativo')
  })

  it('deve lançar ValidationError quando estoque é negativo', () => {
    expect(() =>
      productService.create({ name: 'Camiseta', price: 59.90, stock: -1 })
    ).toThrow(ValidationError)
  })

  it('deve aceitar preço igual a zero', () => {
    const result = productService.create({ name: 'Brinde', price: 0, stock: 50 })
    expect(result).toBeDefined()
    expect(mockRepository.create).toHaveBeenCalled()
  })

  it('deve aceitar estoque igual a zero', () => {
    const result = productService.create({ name: 'Produto Esgotado', price: 99.90, stock: 0 })
    expect(result).toBeDefined()
  })

  it('deve aceitar descrição nula', () => {
    const result = productService.create({ name: 'Camiseta', price: 59.90, stock: 100 })
    expect(result).toBeDefined()
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Camiseta' })
    )
  })
})

describe('productService.delete', () => {
  it('deve lançar NotFoundError quando produto não existe', () => {
    mockRepository.delete.mockReturnValue(false)

    expect(() => productService.delete(999)).toThrow('Produto com ID 999 não encontrado')
  })

  it('deve deletar produto existente sem erros', () => {
    mockRepository.delete.mockReturnValue(true)

    expect(() => productService.delete(1)).not.toThrow()
  })
})
```

---

### 3. Executar os testes

```bash
npm test
```

Saída esperada:

```
PASS  src/__tests__/unit/productService.test.ts
  productService.create
    ✓ deve criar produto com dados válidos
    ✓ deve lançar ValidationError quando nome está vazio
    ✓ deve lançar ValidationError quando nome é só espaços
    ✓ deve lançar ValidationError quando preço é negativo
    ✓ deve lançar ValidationError quando estoque é negativo
    ✓ deve aceitar preço igual a zero
    ✓ deve aceitar estoque igual a zero
    ✓ deve aceitar descrição nula
  productService.delete
    ✓ deve lançar NotFoundError quando produto não existe
    ✓ deve deletar produto existente sem erros

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

---

### 4. README.md do Projeto

Crie o arquivo `README.md` na raiz do projeto:

```markdown
# Sistema de Gestão de Produtos para E-commerce

Aplicação web Full Stack para gerenciamento de produtos de um e-commerce.
Permite cadastrar, listar, atualizar e excluir produtos via interface web.

## Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **SQLite** com `better-sqlite3`

## Pré-requisitos

- Node.js 18+
- npm

## Instalação

\`\`\`bash
# Clonar o repositório
git clone <url-do-repositorio>
cd ecommerce-produtos

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
\`\`\`

Acesse: [http://localhost:3000](http://localhost:3000)

O banco de dados SQLite é criado automaticamente em `data/ecommerce.db` na primeira execução.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm start` | Inicia em modo produção |
| `npm test` | Executa os testes unitários |
| `npm run test:coverage` | Executa testes com relatório de cobertura |

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/products` | Lista todos os produtos |
| POST | `/api/products` | Cadastra novo produto |
| GET | `/api/products/:id` | Busca produto por ID |
| PUT | `/api/products/:id` | Atualiza produto |
| DELETE | `/api/products/:id` | Remove produto |
| GET | `/api/health` | Health check da aplicação |

## Estrutura do Projeto

\`\`\`
src/
├── app/                    # Rotas e páginas (Next.js App Router)
│   ├── products/           # Páginas de produtos
│   └── api/products/       # API Routes
├── modules/
│   └── products/
│       ├── components/     # Componentes React do módulo
│       ├── repository/     # Queries SQL
│       ├── services/       # Regras de negócio e validações
│       ├── hooks/          # Custom hooks
│       └── types/          # Interfaces TypeScript
├── lib/
│   ├── db.ts               # Conexão com SQLite
│   └── apiResponse.ts      # Helpers de resposta HTTP
└── components/             # Componentes globais reutilizáveis
\`\`\`
```

---

## 📋 Checklist Final de Entrega

### Funcionalidades
- [ ] Listar produtos (`GET /api/products`)
- [ ] Cadastrar produto (`POST /api/products`)
- [ ] Buscar produto por ID (`GET /api/products/:id`)
- [ ] Atualizar produto (`PUT /api/products/:id`)
- [ ] Deletar produto (`DELETE /api/products/:id`)
- [ ] Interface web funcional para todas as operações

### Qualidade
- [ ] Testes unitários passando (`npm test`)
- [ ] TypeScript sem erros de compilação (`npm run build`)
- [ ] Tratamento de erros em todas as rotas
- [ ] Estados de loading no frontend
- [ ] Mensagens de erro claras para o usuário

### Documentação
- [ ] `README.md` com instruções de instalação
- [ ] Endpoints documentados
- [ ] Estrutura de pastas explicada

### Entrega
- [ ] Repositório no GitHub com commits organizados
- [ ] Projeto roda com `npm install && npm run dev`
- [ ] Banco criado automaticamente sem configuração manual

---

## 💡 Dicas Finais

**Commits organizados impressionam o avaliador:**
```bash
git commit -m "feat: setup inicial do projeto Next.js + SQLite"
git commit -m "feat: implementar CRUD de produtos na API"
git commit -m "feat: adicionar interface web de listagem e cadastro"
git commit -m "test: adicionar testes unitários do productService"
git commit -m "docs: atualizar README com instruções de instalação"
```

**Verifique antes de entregar:**
```bash
npm run build   # Sem erros de TypeScript
npm test        # Todos os testes passando
npm run dev     # Aplicação funcional no browser
```
