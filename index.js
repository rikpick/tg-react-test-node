const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '5815922470:AAHcHI6ypUrgBa-VJYmUOmsml85Ax319-2U';
const webAppUrl = 'https://monumental-frangipane-34ce90.netlify.app';
const managerChatId = '-1001836297880';
const newUsersChat = '-1002093091761';


const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on("polling_error", console.log);

try {
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
  
    
  
    if(text === '/start') {
      await bot.sendMessage(chatId, 
      `Наличие товара
      
      <strong>Super Skunk</strong>
      Индика, 17-19% тгк, мягкий накур, полноценное расслабление и сильный эффект.
      
      <strong>Bruce Benner</strong> 
      65% сатива 35% индика, уровень тгк доходит до 25%, очень мощный сорт с приятными фруктовыми нотками.
      
      <strong>Big Dewil</strong>
      40% Індика/47,5% Сатива/12,5% Рудераліс, 15-20% тгк, смесь неизвестных сортов сформировавшая уникальный фенотип с ни на что не похожим эффектом.`, {parse_mode: 'HTML'}).catch((error) => {
        console.log(error.code);  // => 'ETELEGRAM'
        console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
      });
      await bot.sendMessage(chatId, '👇Чтобы сделать заказ нажми на кнопку "Магазин"').catch((error) => {
        console.log(error.code);  // => 'ETELEGRAM'
        console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
      });;
  
      await bot.sendMessage(newUsersChat, `Пользователь ${msg.from.id}, ${msg.from.username}, ${msg.from.is_bot}`
  
      )
  
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
} catch (e) {
  console.log(e)
}



try {
  app.post('/web-data/', async (req, res) => {
    const {queryId, products, totalPrice, address, username, pay, name, sort, klad} = req.body;
  
    try {
       await bot.answerWebAppQuery(queryId, {
        type: 'article',
        id: queryId,
        title: 'Успешная покупка',
        input_message_content: {message_text:
           'Ваш заказ в обработке! В ближайшее время с Вами свяжется наш менеджер.'}
       }).catch((error) => {
        console.log(error.code);  // => 'ETELEGRAM'
        console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
      });
  
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
  <strong>Сорт:</strong> ${sort} 
  <strong>Количество:</strong> ${products.map(item => item.title).join(', ')}
  <strong>Способ доставки:</strong> ${klad}
  <strong>Доставка на:</strong> ${address}
  <strong>Способ оплаты:</strong> ${pay}`, {parse_mode: 'HTML'}).catch((error) => {
    console.log(error.code);  // => 'ETELEGRAM'
    console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
  });;
        
      }
  
       return res.status(200).json({});
    } catch (e) {
      await bot.answerWebAppQuery(queryId, {
        type: 'article',
        id: queryId,
        title: 'Не далось',
        input_message_content: {message_text: 'Что-то пошло не так, попробуйте снова!'}
       }).catch((error) => {
        console.log(error.code);  // => 'ETELEGRAM'
        console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
      });
       return res.status(500).json({});
  
    }
  
    
  })
} catch (e) {
console.log(e)
}


const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));