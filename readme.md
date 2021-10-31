# Gera - CLI

Uma CLI para automatizar o processo de desenvolvimento.

#### Instale o Gera - CLI no seu computador:

```
  npm i -g gera
```

### Principais comandos:   
- `start (s)`     Inícia o Gera CLI no diretório atual (ex. `gera start`).  
- `list (l)`      Lista todos os comandos criados para o projeto, presentes na pasta `.gera-commands` (ex. `gera list`).         
- `new (n)`       Crie um novo comando para o projeto (ex. `gera new <comando_name>`). 
- `gera`          Executa um comando criado para o projeto (ex. `gera <comando_name>`).                      
- `help (h)`      Lista os comandos principais da CLI.                                                                   
- `version (v)`     Versão da CLI.

## Começo rápido
Após instalação da CLI no seu computador:

```
  // Inície o Gera CLI em um projeto.
  gera start
  
  // Executa comando de exemplo criado
  gera exemple Teste
  
  // Será criado um arquivo `Teste.ts` no diretório `teste` dentro do seu projeto.
```

## Documentação das dependências importantes:

- Documentação toolbox: https://infinitered.github.io/gluegun/#/toolbox-api
- Documentação ejs: https://ejs.co/#docs

## Exemplo 1
Automatização na criação de classes para o seu projeto .Net
1. Inície o Gera CLI no seu projeto.
```
gera start
```
![Untitled](https://user-images.githubusercontent.com/24979597/139561302-de01e7fb-b0b2-4608-9277-2377cebd4d1c.png)

2. Crie um novo comando para o seu projeto, com o nome de `domain:models`.
```
gera new domain:models
```
3. Altere o arquivo `.gera-commands/domain:models.js` referente ao comando criado:
```
module.exports  = {
    name:'domain:models',
    description:'Cria uma nova classe de modelo em src/MyFlashCards.Co.Domain/Models',
    run:run
}

function run(toolbox){
    const classe_name = toolbox.parameters.first;

    if(typeof classe_name !== "string"){
        toolbox.print.error('Nome da classe não informado!')
        return;
    }


    toolbox.gera.generate({
        template: 'domain:models.ejs',
        target: `src/MyFlashCards.Co.Domain/Models/${classe_name}.cs`,
        props: { 
            classe_name:classe_name,
        }
    })
}
```

4. Altere o template `.gera-commands/templates/domain:models.ejs`.
```
using System;

namespace MyFlashCards.Co.Domain.Models
{
    public class <%= props.classe_name %>
    {
        public string Id { get; private set; }
        public DateTime CreatedIn { get; private set; }
        public DateTime? UpdatedIn { get; private set; }
    }
}
```
5. Execute o comando criado
```
gera domain:models Usuario
```
Resultado:
![Frame 1](https://user-images.githubusercontent.com/24979597/139561659-06dd56cd-fb40-498a-94f3-cf1846d899ee.png)


<a href="https://www.npmjs.com/package/gluegun">😍 Gluegun</a>

## License

MIT - see LICENSE

