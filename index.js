#!/usr/bin/env node

const axios = require("axios");
const quotes = require("./quotes");
const { Command } = require("commander");
const { execSync } = require("child_process");

const program = new Command();

async function getRandomQuote() {
  try {
    const response = await axios.get("https://zenquotes.io/api/random");
    const quote = response.data[0];
    return { quote: quote.q.toString(), author: quote.a.toString() };
  } catch (error) {
    console.error("Couldn't fetch a quote. Using a local one instead.");
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
}

async function commitWithQuote() {
  const result = await getRandomQuote();
  try {
    execSync(`git commit -m "${result.quote}"`, { stdio: "inherit" });
    console.log(`\n✅ Commit message: "${result.quote}"`);
  } catch (error) {
    console.error("❌ Failed to commit:", error.message);
  }
}

async function displayQuote() {
  const result = await getRandomQuote();
  try {
    console.log(`\n"${result.quote} - ${result.author}"`);
  } catch (error) {
    console.error("Something went wrong...", error.message);
  }
}

program
  .command("commit")
  .description("Create a git commit with an inspiring quote")
  .action(commitWithQuote);

program
  .command("quote")
  .description("Just get a quote without commit")
  .action(displayQuote);

// Parse arguments
program.parse(process.argv);
