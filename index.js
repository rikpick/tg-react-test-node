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

try {
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
  
    
  
    if(text === '/start') {
      await bot.sendMessage(chatId, `
      ✅АК-47
      Всем известный сорт, мягкая сатива, 15-16% тгк, порадует своим мягким эффектом но межи огорчить малой длительностью и совсем не подходит для особо толерантных.
      
      ✅Tutankhamon
      Сбалансированная смесь индики и сативы, 21% тгк, среднее время эффекта и средняя мощность данного сорта мы бы назвали ничем иным как балансом.
      
      ✅Super Skunk 
      Индика, 17-19% тгк, мягкий накур, полноценное расслабление и сильный эффект.
      
      ✅Lemon Haze 
      Сатива, 17% тгк, данный сорт сопровождается лимонным ароматом, и быстрым расслабляющим эффектом.
      
      ✅Bruce Benner 
      65% сатива 35% индика, уровень тгк доходит до 25%, очень мощный сорт с приятными фруктовыми нотками.
      
      ✅Big Dewil 
      40% Індика/47,5% Сатива/12,5% Рудераліс, 15-20% тгк, смесь неизвестных сортов сформировавшая уникальный фенотип с ни на что не похожим эффектом.`)
      await bot.sendMessage(chatId, '👇Чтобы сделать заказ нажми на кнопку "Магазин"');
  
      await bot.sendMessage(newUsersChat, `Пользователь ${msg.from.id}, ${msg.from.username}, ${msg.from.is_bot}`
  
      )
  
    } else {
      await bot.sendMessage(newUsersChat, `спам ${msg.from.id}, ${msg.from.username}`
  
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