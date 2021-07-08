bot.on(/(stats|статистика)/i, (msg , text, text2) => {
    var chats;
    fs.readdir('chats', function(err, data){
        chats = data.length;
        send(
            `\nКоманд : ${bot.cmds.length}\nБесед подключено : ${chats}`
            )
    })
}, {
normal:'\n!stats',
command:['stats','статистика'],
desc:'!stats - Показывает статистику бота'
}); 