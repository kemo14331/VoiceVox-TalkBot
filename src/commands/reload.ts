import config from 'config';
import { CommandExecuteOptions, CommandObject } from '../models/CommandModel';
import { loadCommands, registerCommands } from '../registers/CommandRegister';
import { loadComponents } from '../registers/ComponentResister';
import { Logger } from '../utils/Logger';
import { CommandReply } from '../utils/messages/CommandReply';

module.exports = async (): Promise<CommandObject> => {
    return {
        data: {
            name: 'reload',
            description: 'コマンドとコンポーネントを再読み込する',
        },
        execute: async (options: CommandExecuteOptions) => {
            await options.interaction.deferReply();
            options.mainProvider.commands = await loadCommands();
            Logger.info(`Reloaded ${options.mainProvider.commands.length} commands.`);
            registerCommands({
                client: options.interaction.client,
                datas: options.mainProvider.commands.map((command) => command.data),
                guildId: config.get('bot.ownerGuild'),
            });
            registerCommands({
                client: options.interaction.client,
                datas: options.mainProvider.commands.map((command) => command.data),
            });
            options.mainProvider.components = await loadComponents();
            Logger.info(`Reloaded ${options.mainProvider.components.length} components.`);
            await options.interaction.followUp(
                CommandReply.success(
                    `${options.mainProvider.commands.length} のコマンドと ` +
                        `${options.mainProvider.components.length}のコンポーネントを再読み込みしました。`
                )
            );
        },
    };
};
