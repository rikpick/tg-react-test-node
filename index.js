const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '5815922470:AAHcHI6ypUrgBa-VJYmUOmsml85Ax319-2U';
const webAppUrl = 'https://monumental-frangipane-34ce90.netlify.app';
const managerChatId = '-1001836297880';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if(text === '/start') {
    await bot.sendMessage(chatId, '👇Чтобы сделать заказ нажми на кнопку "Магазин"', {
        
    })
    await bot.sendPhoto({
    chat_id : chatId,
    photo: 'tovar.jpg'
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
  const {queryId, products, totalPrice, address, username, pay, name, sort, klad} = req.body;

  try {
     await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Успешная покупка',
      input_message_content: {message_text:
         'Ваш заказ в обработке! В ближайшее время с Вами свяжется наш менеджер.'}
     })

     if (req.body) {
      
        bot.sendMessage(managerChatId, name ?
        `<strong>Имя пользователя:</strong> @${name ? name : 'нету'}
<strong>На сумму:</strong> ${totalPrice} грн 
<strong>Сорт:</strong> ${sort} 
<strong>Количество:</strong> ${products.map(item => item.title).join(', ')}
<strong>Способ доставки:</strong> ${klad}
<strong>Доставка на:</strong> ${address}
<strong>Способ оплаты:</strong> ${pay}`
 : 
 `<strong>Заказ от:</strong> <a href="tg://user?id=${username}">Покупатель</a>
<strong>На сумму:</strong> ${totalPrice} грн 
<strong>Количество:</strong> ${products.map(item => item.title).join(', ')}
<strong>Доставка на:</strong> ${address}
<strong>Способ оплаты:</strong> ${pay}`, {parse_mode: 'HTML'});
      
    }

     return res.status(200).json({});
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Не далось',
      input_message_content: {message_text: 'Что-то пошло не так, попробуйте снова!'}
     })
     return res.status(500).json({});

  }

  
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));