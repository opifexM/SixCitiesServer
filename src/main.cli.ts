#!/usr/bin/env node
import 'reflect-metadata';
import {CliApplication} from '#src/cli/cli-application.js';
import {createCliApplicationContainer} from '#src/cli/cli.container.js';
import {GenerateCommand} from '#src/cli/commands/generate.command.js';
import {HelpCommand} from '#src/cli/commands/help.command.js';
import {ImportCommand} from '#src/cli/commands/import.command.js';
import {VersionCommand} from '#src/cli/commands/version.command.js';
import {Component} from '#src/type/component.enum.js';

function bootstrap() {
  const cliApplicationContainer = createCliApplicationContainer();
  const cliApplication = cliApplicationContainer.get<CliApplication>(Component.CliApplication);

  cliApplication.registerCommands([
    cliApplicationContainer.get<HelpCommand>(Component.HelpCommand),
    cliApplicationContainer.get<VersionCommand>(Component.VersionCommand),
    cliApplicationContainer.get<ImportCommand>(Component.ImportCommand),
    cliApplicationContainer.get<GenerateCommand>(Component.GenerateCommand),
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
