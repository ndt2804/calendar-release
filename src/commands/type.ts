// import type {
//     CommandInteraction,
//     SlashCommandBuilder,
// } from "discord.js";


// export interface Command {
//     data: SlashCommandBuilder;
//     execute(interaction: CommandInteraction): Promise<void>;
// }

import type {
    BaseInteraction,
    SlashCommandBuilder,
    Message,
    ContextMenuCommandBuilder,
    InteractionResponse,
} from "discord.js";

export interface Command {
    data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | ContextMenuCommandBuilder;
    execute(
        interaction: BaseInteraction,
    ): Promise<void | Message | InteractionResponse>;
}