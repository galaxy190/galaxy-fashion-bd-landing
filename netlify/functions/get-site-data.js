// netlify/functions/get-site-data.js

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;

const MAIN_TABLE = process.env.AIRTABLE_MAIN_PRODUCT_TABLE;
const RELATED_TABLE = process.env.AIRTABLE_RELATED_PRODUCTS_TABLE;
const HERO_TABLE = process.env.AIRTABLE_HERO_SLIDER_TABLE;

async function fetchTable(tableName) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(tableName)}?filterByFormula={Active}=TRUE()`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Airtable error: ${res.status}`);
  }

  const data = await res.json();
  return data.records.map((record) => ({
    id: record.id,
    ...record.fields,
  }));
}

exports.handler = async function () {
  try {
    const [mainProduct, relatedProducts, heroSlides] = await Promise.all([
      fetchTable(MAIN_TABLE),
      fetchTable(RELATED_TABLE),
      fetchTable(HERO_TABLE),
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        mainProduct: mainProduct[0] || null,
        relatedProducts,
        heroSlides,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};








async function loadAirtableData() {
  try {
    const res = await fetch("/.netlify/functions/get-site-data");
    const data = await res.json();

    console.log("Airtable Data:", data);
  } catch (error) {
    console.error("Airtable load error:", error);
  }
}

loadAirtableData();