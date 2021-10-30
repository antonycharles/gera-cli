import { GluegunToolbox } from 'gluegun'

// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: GluegunToolbox) => {
  toolbox.gera = {
      getCommands: () => {
        let commands = [];


        const arquivos = toolbox.filesystem.list(toolbox.filesystem.cwd() + "/.gera-commands/")

        const arquivoFilter = arquivos.filter(e => e.indexOf('.js') > 0); 

        arquivoFilter.forEach((arquivo) => {

          const command = require(toolbox.filesystem.cwd() + "/.gera-commands/" + arquivo);

          if(typeof command.name !== "string"){
            toolbox.print.error(`Erro module '${arquivo}', did not export the attribute string name (ex. module.exports  = {name:'<name_module>',...}).`)
          }

          if(typeof command.run !== "function"){
            toolbox.print.error(`Erro module '${arquivo}', did not export the function run (ex. module.exports  = {run:<function_run>,...}).`)
          }

          if(typeof command.run === "function" && typeof command.name === "string")
            commands.push(command);
        })

        return commands;
      },
      diretoryTemplates: () => {
        return  toolbox.filesystem.cwd() + "/.gera-commands/templates";
      }
  }

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "gera" property),
  // gera.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig("gera", process.cwd())
  // }
}
