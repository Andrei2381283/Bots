bot.on(/info/i, (msg) => {
    send('Я в Discord : https://discordapp.com/api/oauth2/authorize?client_id=528532161406566413&permissions=8&scope=bot');
}, {
normal:'\n!info',
command:['info'],
desc:'!info - Информация о боте'
});