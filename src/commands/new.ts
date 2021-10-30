import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
    name: 'new',
    alias: ['n'],
    description: 'Create a new command for the project (ex. gera new <comando>).',
    run: async toolbox => {
        const {
            template: { generate },
        } = toolbox

        const first = toolbox.parameters.first;

        if(typeof first !== 'string'){
            toolbox.print.error('New command name was not passed as parameters!')
            return;
        }

        await generate({
            template: 'new-command.ejs',
            target: `.gera-commands/${first}.js`,
            props: { command: first }
        })


        await generate({
            template: 'new-template.ejs',
            target: `.gera-commands/templates/${first}.ejs`
        })

        toolbox.print.success(`new command created!`)
    }
}

module.exports = command
