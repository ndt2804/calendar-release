import { Events, Collection, Client, GatewayIntentBits, Message, TextChannel } from 'discord.js';
import * as dotenv from 'dotenv';
import { release } from "./services/data";
import dayjs from "dayjs";
import { Cron } from "croner";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import vi from "dayjs/locale/vi.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { Command } from './commands/type';
import releaseCommand from './commands/release'

import { register } from './utils/command';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale(vi);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");
dotenv.config();


const client = new Client({
    intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent],
});

if (!process.env.channleID)
    throw new Error("Releases channel is not defined.");
if (!process.env.discordToken)
    throw new Error("Discord Token  is not defined.");
if (!process.env.clientID)
    throw new Error("Client ID  is not defined.");

const channleAnouments = process.env.channleID;


const commands: Command[] = [releaseCommand];
await register(commands);



client.on(Events.InteractionCreate, async (interaction) => {
    if (
        interaction.isChatInputCommand() ||
        interaction.isMessageContextMenuCommand()
    ) {
        const command = commands.find(
            (command) => command.data.name === interaction.commandName,
        );

        if (!command) {
            console.error(`Không tìm thấy lệnh ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (e) {
            console.error(e);
        }
    }

    if (interaction.isButton()) {
        const action = commands.find(
            (action) => action.data.name === interaction.customId,
        );

        if (!action) {
            console.error(`Không thực thi được hành động ${interaction.customId}`);
            return;
        }

        try {
            await action.execute(interaction);
        } catch (e) {
            console.error(e);
        }
    }
});



client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
    client.user?.setActivity('Reading data for calendar release books')
});
client.login(process.env.discordToken || 'Your Token');
Cron(
    "0 6 * * *",
    {
        timezone: "Asia/Ho_Chi_Minh",
    },
    async () => {
        const date = dayjs.tz().startOf("day");
        const response = await release(date);
        if (!response) return;
        const channel = client.channels.cache.get(channleAnouments) as TextChannel;
        if (channel) channel.send({ embeds: [response.embed] });
    },
);