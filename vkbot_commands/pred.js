bot.on(/pred/i, (msg , text) => {
    var predMsg = ['Возможно','Наверное','Скорее всего','Да','Нет','Может быть','Вероятно'];
    send(predMsg[Math.floor(Math.random() * predMsg.length)])
}, {
normal:'\n!pred',
command:['pred'],
desc:'!pred - undefined'
});