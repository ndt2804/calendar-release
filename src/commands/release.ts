import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import dayjs from "dayjs";
import type { Command } from "./type";
import { release } from "../services/data";

const dateFormats = ["DD-MM-YYYY", "DD/MM/YYYY", "DD.MM.YYYY"];

export default {
    data: new SlashCommandBuilder()
        .setName("releases")
        .setDescription("Xem lịch phát hành")
        .addStringOption((option) =>
            option.setName("date").setDescription("Ngày/tháng/năm"),
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });
        if (interaction.options.getString("date") && !dayjs(interaction.options.getString("date"), dateFormats).isValid()) {
            return await interaction.editReply("Ngày không hợp lệ.");
        }
        const date = interaction.options.getString("date")
            ? dayjs(interaction.options.getString("date"), dateFormats).startOf("day")
            : dayjs.tz().startOf("day");

        const response = await release(date);
        if (!response)
            return await interaction.editReply("Không có truyện phát hành ngày này.");

        const { embed } = response;

        return await interaction.editReply({
            embeds: [embed],
        });
    },
} as Command;