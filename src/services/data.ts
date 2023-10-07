import * as cheerio from 'cheerio';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { EmbedBuilder } from "@discordjs/builders";
import { Dayjs } from "dayjs";
dotenv.config();
const url = process.env.url || 'https://default-url.com';
export async function getReleases(date: Dayjs): Promise<string[]> {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const result: string[] = [];
    const dateString = date.format('YYYY-MM-DD');
    $('.release-day').each((i, element) => {
        const id = $(element).attr('id');
        if (id === dateString) {
            $(element).find('.group').each((i, index) => {
                const title = $(index).find('.space-y-1 > div:nth-child(1)').text().trim();
                const volume = $(index).find('.space-y-1 > div:nth-child(2)').text().trim();
                const books = `${title} - ${volume}`;
                result.push(books);
            });
        }
    });
    return result;
}
export async function release(date: Dayjs) {
    const releases = await getReleases(date);
    if (!releases || releases.length === 0) {
        console.log('Không có thông tin phát hành cho ngày này.');
        return;
    }
    const releaseText = releases.join('\n');
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Lịch Phát Hành')
        .setURL('https://tana.moe/calendar')
        .setAuthor({
            name: "Tana.moe",
            iconURL: "https://tana.moe/apple-touch-icon.png",
            url: "https://tana.moe",
        })
        .setDescription(
            Intl.DateTimeFormat("vi-VN", {
                dateStyle: "full",
                timeZone: "Asia/Ho_Chi_Minh",
            }).format(date.toDate()),
        )
        .addFields(
            {
                name: 'Hôm nay có:',
                value: releaseText
            },
        );
    return { embed };
}