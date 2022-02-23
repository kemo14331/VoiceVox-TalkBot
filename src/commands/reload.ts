import { CommandExecuteOptions, CommandObject } from '../types/CommandTypes';
import { loadCommands } from '../util/CommandRegister';
import { CommandReply } from '../util/CommandReply';
import { loadComponents } from '../util/ComponentResister';
import { Logger } from '../util/Logger';

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
