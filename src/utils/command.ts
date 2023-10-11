import { Command } from '../commands/type';
import { REST, Routes } from "discord.js";

export async function register(commands: Command[]) {

    if (!process.env.discordToken)
        throw new Error("Discord Token  is not defined.");
    if (!process.env.clientID)
        throw new Error("Client ID  is not defined.");

    const clientID = process.env.clientID;
    const discordToken = process.env.discordToken

    const commandsArray = commands.map((command) => command.data.toJSON());
    const rest = new REST().setToken(discordToken);

    try {
        console.info(
            `Started refreshing ${commands.length} application (/) commands.`,
        );
        await rest.put(Routes.applicationCommands(clientID), {
            body: commandsArray,
        });
        console.info(`Successfully reloaded application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}