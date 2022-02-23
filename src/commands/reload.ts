import { CommandExecuteOptions, CommandObject } from '../models/CommandModel';
import { Logger } from '../utils/Logger';
import { CommandReply } from '../utils/messages/CommandReply';
import { loadCommands } from '../utils/registers/CommandRegister';
import { loadComponents } from '../utils/registers/ComponentResister';

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
