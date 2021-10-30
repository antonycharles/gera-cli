import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
    name: 'exec',
    alias: ['e'],
    description:'Executes a command created for the project (ex. gera e <comando>).',
    run: async toolbox => {

        const nameCommand = toolbox.parameters.first;

        if(typeof nameCommand !== 'string'){
            toolbox.print.error('Command name not entered!')
            return;
        }
        
        const commands = toolbox.gera.getCommands();


        const command = commands.find(w => w.name === nameCommand)

        if(command === undefined){
            toolbox.print.error('command not found!')
            return;
        }

        toolbox.parameters.first = toolbox.parameters.array[1];
        toolbox.parameters.second = toolbox.parameters.array[2];
        toolbox.parameters.third = toolbox.parameters.array[3];

        command.run(toolbox);

    }
}

module.exports = command
