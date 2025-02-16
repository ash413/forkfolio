require("dotenv").config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log("OpenAI API Key:", process.env.OPENAI_API_KEY ? "Set" : "Not Set");

module.exports = openai;