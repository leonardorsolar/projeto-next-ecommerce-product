# SQL Injection — Simulação Defensiva (Aula)

## Objetivo
Demonstrar que o sistema está protegido contra SQL Injection usando SQL parametrizado.

## Onde está a proteção
- `src/modules/users/repository/userRepository.ts`
- `src/modules/products/repository/productRepository.ts`

> Regra: nunca concatenar input em SQL. Sempre usar `?` ou `@campo`.

## Exemplo seguro (users)
```ts
// ...existing code...
db.prepare('SELECT id FROM users WHERE lower(email) = lower(?)').get(email)
// ...existing code...
```

## Teste manual (local)
1. Criar usuário normal: baseline
```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","email":"ana@teste.com","password":"123456","role":"user"}'
```

2. Enviar payload malicioso como dado: (deve ser tratado como dado ou rejeitado)
```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"x'' OR 1=1 --@teste.com","password":"123456","role":"user"}'
```
# 3) payload em path param (deve falhar validação de id)
```bash
curl -i http://localhost:3000/api/users/%271%27%20OR%201=1--
```

3. Validar integridade:
```bash
curl -i http://localhost:3000/api/users
```

## Resultado esperado
- API retorna erro de validação (4xx) ou trata como texto comum.
- Nenhuma tabela é apagada.
- Nenhum acesso indevido é concedido.