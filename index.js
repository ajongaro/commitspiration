#!/usr/bin/env node

const { execSync } = require("child_process");
const quotes = require("./quotes");
const { Command } = require("commander");
const axios = require("axios");

const program = new Command();

// Function to get a random quote
async function getRandomQuote() {
  try {
    const response = await axios.get("https://zenquotes.io/api/random");
    const quote = response.data[0];
    return `${quote.q}`;
  } catch (error) {
    console.error("Couldn't fetch a quote. Using a local one instead.");
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
}

async function commitWithQuote() {
  const quote = await getRandomQuote();
  try {
    execSync(`git commit -m "${quote}"`, { stdio: "inherit" });
    console.log(`\n✅ Commit message: "${quote}"`);
  } catch (error) {
    console.error("❌ Failed to commit:", error.message);
  }
}

async function displayQuote() {
  const quote = await getRandomQuote();
  try {
    console.log(`\n"${quote}"`);
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
