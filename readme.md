# Gera - CLI
[![NPM version](https://badge.fury.io/js/gera.svg)](http://badge.fury.io/js/gera)

Uma CLI que permite facilitar o processo de desenvolvimento de código dentro de um projeto.

#### Instale o Gera - CLI no seu computador globalmente:

```
  npm i -g gera
```

### Principais comandos:   
- `start (s)`     Inícia o Gera CLI no diretório atual (ex. `gera start`).  
- `list (l)`      Lista todos os comandos criados para o projeto, presentes na pasta `.gera-commands` (ex. `gera list`).         
- `new (n)`       Crie um novo comando para o projeto (ex. `gera new <comando_name>`). 
- `gera`          Executa um comando criado para o projeto (ex. `gera <comando_name>`).                      
- `help (h)`      Lista os comandos principais da CLI.                                                                   
- `version (v)`   Versão da CLI.

## Começo rápido
Após instalação da CLI no seu computador:

```
  // Inície o Gera CLI em um projeto.
  gera start
  
  // Executa comando de exemplo criado
  gera exemple Teste
  
  // Será criado um arquivo `Teste.ts` no diretório `teste` dentro do seu projeto.
```

## 🚨Documentação das dependências importantes:

- Documentação toolbox: https://infinitered.github.io/gluegun/#/toolbox-api
- Documentação ejs: https://ejs.co/#docs

## Exemplo 1
Automatizar a criação de classes para um projeto .Net
1. Inície o Gera CLI no seu projeto (caso ainda não tenha iníciado).
```
gera start
```
2. Crie um novo comando para o seu projeto, com o nome de `domain:models`.
```
gera new domain:models
```
3. Altere o arquivo `.gera-commands/domain:models.js` referente ao comando criado:
```js
module.exports  = {
    name:'domain:models',
    description:'Cria uma nova classe de modelo em src/Teste.Co.Domain/Models',
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
        target: `src/Teste.Co.Domain/Models/${classe_name}.cs`,
        props: { 
            classe_name:classe_name,
        }
    })
}
```

4. Altere o template `.gera-commands/templates/domain:models.ejs`.
```
using System;

namespace Teste.Co.Domain.Models
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
```cs
using System;

namespace Teste.Co.Domain.Models
{
    public class Usuario
    {
        public string Id { get; private set; }
        public DateTime CreatedIn { get; private set; }
        public DateTime? UpdatedIn { get; private set; }
    }
}
```

## Exemplo 2
Automatizar a implementação do padrão de projeto Repository
1. Inície o Gera CLI no seu projeto (caso ainda não tenha iníciado).
```
gera start
```
2. Crie um novo comando para o seu projeto, com o nome de `domain:models`.
```
gera new infra:repositories
```
3. Altere o arquivo `.gera-commands/infra:repositories.js` referente ao comando criado:
```js
module.exports  = {
    name:'infra:repositories',
    description:'',
    run:run
}

function run(toolbox){

    //Pega e valida o nome do repository
    const nome = toolbox.parameters.first;

    if(typeof nome !== "string"){
        toolbox.print.error('First parameter not entered!')
        return;
    }

    //Cria o arquivo de interface da repository
    toolbox.gera.generate({
        template: 'infra:irepositories.ejs',
        target: `src/LeilaoFake.Me.Infra/Datas/Repositories/I${nome}Repository.cs`,
        props: { 
            nome:nome,
        }
    })

    //Cria o arquivo referente a repository
    toolbox.gera.generate({
        template: 'infra:repositories.ejs',
        target: `src/LeilaoFake.Me.Infra/Datas/Repositories/${nome}Repository.cs`,
        props: { 
            nome:nome,
        }
    })
    
    //Adiciona a injeção de dependência na classe Startup.cs
    const addTransient = `services.AddTransient<I${nome}Repository,${nome}Repository>();`;

    toolbox.patching.patch('src/LeilaoFake.Me.Api/Startup.cs', { 
        insert: `\n${addTransient}`, 
        after: 'GERA-COMMANDS-ADD-REPOSITORY' 
    })

}
```

4. Altere o template `.gera-commands/templates/infra:repositories.ejs`.
```
using Dapper;
using LeilaoFake.Me.Core.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LeilaoFake.Me.Infra.Datas.Repositories
{
    public class <%= props.nome %>Repository : I<%= props.nome %>Repository
    {
        private readonly IDbConnection _dbConnection;

        public <%= props.nome %>Repository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
    }
}
```
5. Cria o template referente a interface `.gera-commands/templates/infra:irepositories.ejs`.
```
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using LeilaoFake.Me.Core.Models;

namespace LeilaoFake.Me.Infra.Datas.Repositories
{
    public interface I<%= props.nome %>Repository
    {
    }
}

```
6. Execute o comando criado
```
gera infra:repositories Teste
```
Resultado interface Repository:
```cs
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using LeilaoFake.Me.Core.Models;

namespace LeilaoFake.Me.Infra.Datas.Repositories
{
    public interface ITesteRepository
    {
    }
}

```
Resultado Repository:
```cs
using Dapper;
using LeilaoFake.Me.Core.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LeilaoFake.Me.Infra.Datas.Repositories
{
    public class TesteRepository : ITesteRepository
    {
        private readonly IDbConnection _dbConnection;

        public TesteRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
    }
}
```
Resultado Startup:
```cs
      //GERA-COMMANDS-ADD-REPOSITORY
      services.AddTransient<ITesteRepository,TesteRepository>(); //Injeção de dependência adicionada.
      services.AddTransient<ILeilaoRepository,LeilaoRepository>();
      services.AddTransient<IUsuarioRepository, UsuarioRepository>();
      services.AddTransient<ILanceRepository, LanceRepository>();
      services.AddTransient<ILeilaoImagemRepository, LeilaoImagemRepository>();
```

😍 Obrigado Gluegun (https://www.npmjs.com/package/gluegun)

## License

MIT - see LICENSE

