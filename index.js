#!/usr/bin/env node

const { execSync } = require("child_process");
const quotes = require("./quotes");
const { Command } = require("commander");

const program = new Command();

// Function to get a random quote
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

// Function to commit with an inspirational quote
function commitWithQuote() {
  const quote = getRandomQuote();
  try {
    execSync(`git commit -m "${quote}"`, { stdio: "inherit" });
    console.log(`\n✅ Commit message: "${quote}"`);
  } catch (error) {
    console.error("❌ Failed to commit:", error.message);
  }
}

// Set up the CLI command
program
  .command("commit")
  .description("Create a git commit with an inspiring quote")
  .action(commitWithQuote);

// Parse arguments
program.parse(process.argv);
