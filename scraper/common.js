import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

function Common() {
    const common = {};

    // Utility functions
    common.getLoadedHtml = async function getLoadedHtml(url) {
        const axiosResponse = await axios(url);
        const html = axiosResponse.data;
        return [html, cheerio.load(html)];
    }

    return common;
}

export default Common();
