import * as cheerio from 'cheerio';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();
const url = process.env.url || 'https://default-url.com';
export async function crawlData(targetDate: string): Promise<string[]> {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const releaseDays = $('.release-day');
        const result: string[] = [];

        releaseDays.each((index: number, element: cheerio.Element) => {
            const id = $(element).attr('id');
            if (id === targetDate) {
                const items = $(element).find('.grid-cols-2');

                items.each((i: number, item: cheerio.Element) => {
                    const titleElement = $(item).find('.decoration-primary-400.font-condensed.text-xl.font-black');
                    const title = titleElement.text().trim();

                    if (title) {
                        result.push(title);
                    }
                });
            }
        });

        return result;
    } catch (error) {
        console.error('Lỗi khi tải trang web:', error);
        return [];
    }
}