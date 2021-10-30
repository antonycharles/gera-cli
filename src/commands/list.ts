import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
    name: 'list',
    alias: ['l'],
    description:'Lists all commands created for the project.',
    run: async toolbox => {
        const {
            print
        } = toolbox

        print.info('')
        const commands = toolbox.gera.getCommands();

        if(commands.length === 0){
            print.info('No command found!')
            return;
        }

        const table = commands.map(command => {
            return [command.name,command.description]
        })

        print.info("Commands:")
        print.table(
            table,
            { 
                format:'default',
                style: { 'padding-left': 0 , 'padding-right': 8 }
            }
        );
        

        print.info('')
    }
}

module.exports = command
