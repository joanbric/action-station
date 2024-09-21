import { LINKS_PLACEHOLDER } from "node_modules/astro/dist/content/consts";
type urls = 'categories' | 'links';

const URLs = {
    categories: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTsyfvS7LXU9JDMcWLVxJ6T2ekONhhktT-2DtY2uJbdcFFQT0-RpOtLYv-TD11KTle-2RPcfttYK6Py/pub?gid=707361259&single=true&output=csv',
    links: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTsyfvS7LXU9JDMcWLVxJ6T2ekONhhktT-2DtY2uJbdcFFQT0-RpOtLYv-TD11KTle-2RPcfttYK6Py/pub?output=csv'
}
export default async function fetchLinksData(url: urls) {
    if (!url) throw new Error('url not provided');
    const categoriesRes = await fetch(URLs[url]);
    const categoriesRaw = await categoriesRes.text();
    const categoriesRows = categoriesRaw.split('\n');
    const categoriesHeaders = categoriesRows.shift()?.replace('\r', '').split(',') || [];



    const categories = categoriesRows.map((row) => {
        const rowValues = row.split(',');

        const category = categoriesHeaders.reduce((acc: Record<string, string>, header, index) => {
            const valueRaw = rowValues[index]
            const valueWithoutCarriageReturn = valueRaw.replace('\r', '')

            const valueTrimmed = valueWithoutCarriageReturn.trim();
            const valueOutOfQuotes = (valueTrimmed.startsWith('"') && valueTrimmed.endsWith('"')) ? valueTrimmed.slice(1, - 1) : valueTrimmed;
            const valueDuplicatedQuotesRemoved = valueOutOfQuotes.replaceAll('""', '"');
            const value = valueDuplicatedQuotesRemoved;

            acc[header] = value;
            return acc;
        }, {})

        return category;
    });

    return categories;
}