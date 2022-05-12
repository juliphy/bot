const TelegramApi = require('node-telegram-bot-api')
const {gameOptions,againOptions} = require('./options.js')
const token = '5332104209:AAEOiEKiIx_8Grufrk9oJ8u_pZ2q5xa31dY'
const bot = new TelegramApi(token, {polling: true})

const chats = {}
const startAgain = async (chatID) => {
    await bot.sendMessage(chatID,'Bot will randomly choose the number from 0 to 10. You need to guess this number')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatID] = randomNumber;  
    await bot.sendMessage(chatID,'Guess the number', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command:'/start', description:'First command'},
        {command:'/info', description:'Displays your name'},
        {command:'/game', description:'My game'},
        {command:'/showdata',description:'Show data const'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text
        const chatID = msg.chat.id
        if (text === '/start') {
            await bot.sendSticker(chatID,'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/11.webp')
            return bot.sendMessage(chatID,'Welcome! That is a Test Game bot')
        }
        if (text === '/info') {
            return bot.sendMessage(chatID,`Your name is ${msg.from.first_name}`)
        }
        if (text === '/game') {
            return startAgain(chatID)
        }
        if (text === '/showdata') {
            return await bot.sendMessage(chatID,`${chats[chatID]}`)
        }
        return bot.sendMessage(chatID,'Not understood')
    })
    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatID = msg.message.chat.id;
        if (data == '/again') {
            return startAgain(chatID)
        }
        if (data == chats[chatID]) {
            return await bot.sendMessage(chatID,`Congrats! You have guessed ${chats[chatID]} number `,againOptions)
        } else {
            return await bot.sendMessage(chatID, `unfortunately, you have not guessed ${chats[chatID]} number`,againOptions)
        }
    })
}

start()