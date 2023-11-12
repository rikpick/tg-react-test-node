const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '6399316344:AAEqygeDSYsR9s4GFMsn_S5hez-H_13-Xzw';
const webAppUrl = 'https://monumental-frangipane-34ce90.netlify.app';
const managerChatId = '-1002002444582';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if(text === '/start') {
    await bot.sendMessage(chatId, 'Сообщение 3', {
        reply_markup: {
            
            inline_keyboard: [
                [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
            ]
        }
    })

    await bot.sendMessage(chatId, 'Сообщение 1', {
      reply_markup: {
          
          keyboard: [
              [{text: 'Сообщение 2', web_app: {url: webAppUrl}}]
          ]
      }
  })
  }

  if(msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data)
      await bot.sendMessage(chatId, 'Спасибо за заказ!')

    } catch (e) {
      console.log(e);
    }
  }
});

app.post('/web-data/', async (req, res) => {
  const {queryId, products, totalPrice} = req.body;

  try {
     await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Успешная покупка',
      input_message_content: {message_text: 'Поздравляем с покупкой'}
     })

     if(req.body) {
      const username = await bot.getWebAppData(queryId)
      const usernameValue = username.user
      const product = JSON.stringify(products)
      bot.sendMessage(managerChatId, `${totalPrice} ${product} ${usernameValue}`);
     }

     return res.status(200).json({});
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Не далось',
      input_message_content: {message_text: 'Не удалось'}
     })
     return res.status(500).json({});

  }

  
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log('server started on PORT' + PORT))