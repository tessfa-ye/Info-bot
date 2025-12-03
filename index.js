const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

// Paste your BotFather token here
const token = process.env.BOT_TOKEN;
// Create bot
const bot = new TelegramBot(token, { polling: true });

// Log to confirm bot is running
console.log("✅ Info Bot is running...");

// /start command
bot.onText(/\/start/i, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Welcome to Info Bot!\n\nCommands:\n⏰ /time - current time\n📅 /date - today's date\n🌤 /weather <city> - weather info"
  );
});

// /time command
bot.onText(/\/time/i, (msg) => {
  const time = new Date().toLocaleTimeString();
  bot.sendMessage(msg.chat.id, `⏰ Current Time: ${time}`);
});

// /date command
bot.onText(/\/date/i, (msg) => {
  const date = new Date().toLocaleDateString();
  bot.sendMessage(msg.chat.id, `📅 Today's Date: ${date}`);
});

// /weather <city> command
bot.onText(/\/weather(?: (.+))?/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const city = match[1];

  if (!city) {
    return bot.sendMessage(
      chatId,
      "❌ Please provide a city name.\nUsage: /weather <city>"
    );
  }

  try {
    // Using wttr.in API for simplicity
    const response = await axios.get("https://wttr.in/" + city + "?format=j1");
    const current = response.data.current_condition[0];

    bot.sendMessage(
      chatId,
      `🌤 Weather in ${city}:\nTemperature: ${current.temp_C}°C\nHumidity: ${current.humidity}%\nWind: ${current.windspeedKmph} km/h`
    );
  } catch (err) {
    bot.sendMessage(chatId, "❌ Unable to get weather for that city.");
  }
});
