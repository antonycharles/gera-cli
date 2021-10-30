import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'start',
  description:'Starts the Gera CLI in the current directory.',
  alias: ['s'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      template: { generate },
      print: { info }
    } = toolbox

    await generate({
      template: 'exemple.ejs',
      target: `.gera-commands/exemple.js`
    })


    await generate({
      template: 'exemple-template.ejs',
      target: `.gera-commands/templates/exemplo.ejs`,
      props: {name:'<%= props.name %>'}
    })

    info(`Gera successfully started!`)
  }
}
