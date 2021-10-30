import { GluegunToolbox } from 'gluegun'

// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: GluegunToolbox) => {
  toolbox.gera = {
    getCommands: () => {
      let commands = []

      const arquivos = toolbox.filesystem.list(
        toolbox.filesystem.cwd() + '/.gera-commands/'
      )

      if (arquivos === undefined) return commands

      const arquivoFilter = arquivos.filter(e => e.indexOf('.js') > 0)

      arquivoFilter.forEach(arquivo => {
        const command = require(toolbox.filesystem.cwd() +
          '/.gera-commands/' +
          arquivo)

        const typeofName = typeof command.name
        const typeorRun = typeof command.run

        if (typeofName !== 'string') {
          toolbox.print.error(
            `Erro module '${arquivo}', did not export the attribute string name (ex. module.exports  = {name:'<name_module>',...}).`
          )
        }

        if (typeorRun !== 'function') {
          toolbox.print.error(
            `Erro module '${arquivo}', did not export the function run (ex. module.exports  = {run:<function_run>,...}).`
          )
        }

        if (typeorRun === 'function' && typeofName === 'string') {
          commands.push(command)
        }
      })

      return commands
    },
    diretoryTemplates: () => {
      return toolbox.filesystem.cwd() + '/.gera-commands/templates'
    },
    generate: async (props: {
      template: string
      target: string
      props: {}
    }) => {
      const template =
        toolbox.filesystem.cwd() +
        '/.gera-commands/templates' +
        '/' +
        props.template

      if (toolbox.filesystem.exists(template) !== 'file') {
        toolbox.print.error(`template not found. Target: ${template}`)
        return
      }

      await toolbox.template.generate({
        template: props.template,
        target: props.target,
        props: props.props,
        directory: toolbox.gera.diretoryTemplates()
      })
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
