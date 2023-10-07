console.log("Hello via Bun!");
import { crawlData } from "./services/data";
(async () => {
    const targetDate = '2023-10-02';
    try {
        const result = await crawlData(targetDate);
        console.log('Result:', result);
    } catch (error) {
        console.error('Lỗi:', error);
    }
})();
