# Contribuindo para o EDDA

Obrigado por se interessar em contribuir! Este documento fornece diretrizes e instruções para contribuir com o projeto.

## Como Contribuir

### Reportando Bugs

Se você encontrar um bug, abra uma issue no GitHub com:

- Uma descrição clara do problema
- Passos para reproduzir o bug
- Comportamento esperado vs atual
- Seu ambiente (OS, Node.js version, etc)

### Sugestões de Melhorias

Sugestões são bem-vindas! Abra uma issue descrevendo:

- O problema que sua sugestão resolve
- Como você imagina a solução funcionando
- Exemplos de outras implementações (se houver)

### Pull Requests

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/seu-usuario/edda.git`
3. **Crie uma branch**: `git checkout -b feature/meu-recurso`
4. **Faça suas mudanças** e commit: `git commit -m "Descrição clara das mudanças"`
5. **Push** para sua branch: `git push origin feature/meu-recurso`
6. **Abra um Pull Request** com uma descrição clara

### Guidelines para PRs

- Mantenha commits pequenos e focados
- Escreva mensagens de commit descritivas
- Adicione testes para funcionalidades novas
- Atualize a documentação se necessário
- Certifique-se que os testes passam: `npm test`

## Padrões de Código

### JavaScript/Node.js

- Use 2 espaços de indentação
- Use `const` por padrão, `let` quando necessário
- Evite `var`
- Use async/await ao invés de callbacks

### React

- Use functional components com hooks
- Mantenha componentes pequenos e focados
- Use nomes descritivos para componentes e funções
- Adicione PropTypes ou TypeScript quando apropriado

### Banco de Dados

- Migrations sempre que alterar schema
- Use transaction para operações críticas
- Escreva queries eficientes

## Processo de Revisão

Pull requests serão revisados quanto a:

- ✅ Qualidade do código
- ✅ Testes (cobertura e passando)
- ✅ Documentação
- ✅ Segurança
- ✅ Performance

## Dúvidas?

Sinta-se livre para abrir uma discussion ou entrar em contato através das issues.

Obrigado por contribuir! 🎉
