# 📅 Roadmap Completo — projeto-ecommerce-product

## Sprint 1 — Setup e Foundation (1–2h)
- [x] Criar projeto Next.js com TypeScript + Tailwind
- [x] Configurar estrutura modular de pastas
- [x] Instalar e configurar `better-sqlite3`
- [x] Criar `lib/db.ts` com conexão singleton
- [x] Criar tabela `products`
- [x] Criar `lib/apiResponse.ts`
- [x] Testar rota health check

---

## Sprint 2 — Backend CRUD Produtos (2–3h)
- [x] Criar `types/product.ts`
- [x] Criar `productRepository.ts`
- [x] Criar `productService.ts`
- [x] Implementar CRUD completo de produtos
- [x] Testar endpoints via browser/curl

---

## Sprint 3 — Frontend Produtos (2–3h)
- [x] Criar componentes globais
- [x] Criar `ProductCard.tsx`
- [x] Criar `ProductList.tsx`
- [x] Criar `ProductForm.tsx`
- [x] Criar `useProducts.ts`
- [x] Implementar páginas de produtos
- [x] Implementar exclusão

---

## Sprint 3.5 — CRUD de Usuários (Atual)

### Backend
- [ ] Criar tabela `users`
- [ ] Criar `types/user.ts`
- [ ] Criar `userRepository.ts`
- [ ] Criar `userService.ts`
- [ ] Criar API routes
- [ ] Testar endpoints

### Frontend
- [ ] Criar `useUsers.ts`
- [ ] Criar `UserForm.tsx`
- [ ] Criar `UserList.tsx`
- [ ] Criar páginas `/users`
- [ ] Implementar edição
- [ ] Implementar exclusão

---

## Sprint 4 — Qualidade e Entrega (1h)
- [ ] Escrever testes unitários
- [ ] Revisar tratamento de erros
- [ ] Adicionar loading/error states
- [ ] Atualizar README
- [ ] Checklist final
