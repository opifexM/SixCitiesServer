import {CommandParser} from '#src/cli/command-parser.js';
import {Command} from '#src/cli/commands/command.interface.js';
import chalk from 'chalk';
import {injectable} from 'inversify';

@injectable()
export class CliApplication {
  private commands: Record<string, Command> = {};
  private readonly defaultCommand = '--help';

  public registerCommands(commandsForRegistration: Command[]): void {
    commandsForRegistration.forEach((command) => {
      if (this.commands[command.name]) {
        throw new Error(`Command '${command.name}' is already registered.`);
      }
      this.commands[command.name] = command;
    });
  }

  public processCommand(args: string[]) {
    const parsedCommand = CommandParser.parse(args);
    const commands = Object.keys(parsedCommand);
    if (!commands.length) {
      commands.push(this.defaultCommand);
    }
    commands.forEach((commandName) => {
      const commandArguments = parsedCommand[commandName] ?? [];
      if (!this.commands[commandName]) {
        console.error(`Command '${commandName}' does not exist.`);
      } else {
        console.info(chalk.blue(`Executing a command: ${commandName} ${commandArguments}`));
        this.commands[commandName].execute(...commandArguments);
      }
    });
  }
}
