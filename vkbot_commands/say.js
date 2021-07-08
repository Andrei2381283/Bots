bot.on(/say( [^]+|)/i, (msg, text) => {
 if(text != ''){
  send(text);
 } else {
  send('Введите текст, который нужно повторить');
 }
}, {
normal:'\n!say',
command:['say'],
desc:'!say <text> - Напишет то что указано в text'
});