import { Client } from '@notionhq/client';
import { env } from './utils/env.js'

// 初始化Notion客戶端
const notion = new Client({ auth: `${env.NOTION_ACCESS_TOKEN}` });

// 假設您已經從授權流程中獲得了存取令牌
export const listDatabases = async () => {
    try {
        const response = await notion.databases.list({});
        console.log(response);
        return response;
    } catch (error) {
        console.error(error.body);
    }
};
