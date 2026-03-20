import { FrankfurterClient, FrankfurterError } from "../src/index.js";

const client = new FrankfurterClient();

async function main() {
  const latest = await client.latest({ base: "USD", quotes: ["EUR", "GBP"] });
  console.log("latest", latest);

  const historical = await client.historical("2025-01-10", {
    base: "EUR",
    quotes: "USD"
  });
  console.log("historical", historical);

  const ranged = await client.range("2025-01-01", "2025-01-31", {
    base: "EUR",
    quotes: ["USD", "CHF"],
    group: "month"
  });
  console.log("range", ranged);

  const currencies = await client.currencies();
  console.log("currencies", currencies);

  const providers = await client.providers();
  console.log("providers", providers);
}

main().catch((error) => {
  if (error instanceof FrankfurterError) {
    console.error(error.status, error.statusText, error.url, error.body);
    return;
  }

  console.error(error);
});
