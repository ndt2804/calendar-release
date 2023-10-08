import { Collection, Client, GatewayIntentBits, Message, TextChannel } from 'discord.js';
import * as dotenv from 'dotenv';
import dayjs from "dayjs";
import { Cron } from "croner";

import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import vi from "dayjs/locale/vi.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale(vi);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");
dotenv.config();
import { release } from "./services/data";
if (!process.env.channleID)
    throw new Error("Releases channel is not defined.");
const channleAnouments = process.env.channleID;

const client = new Client({
    intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent],
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
    client.user?.setActivity('Reading data for calendar release books')
});
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

client.login(process.env.discordToken || 'Your Token');
