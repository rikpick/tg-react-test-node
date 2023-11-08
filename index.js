const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '6734134366:AAHSQQSrnnofTC75MMScy95TFy0oT0AAO_w';
const webAppUrl = 'https://monumental-frangipane-34ce90.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if(text === '/start') {
    await bot.sendMessage(chatId, 'Сообщение 2', {
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

app.post('/web-data', async (req, res) => {
  const {queryId, products, totalPrice} = req.body;

  try {
     await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Успешная покупка',
      input_message_content: {message_text: 'Поздравляем с покупкой'}
     })
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

const PORT = 8000;
app.listen(PORT, () => console.log('server started on PORT' + PORT))