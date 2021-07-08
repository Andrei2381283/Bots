bot.on(/restart/i, (msg , text) => {
    send("Restarting...");
    setTimeout(function(){
        process.kill()
    },1000);
}, {
sec:'\n!restart',
secCommand:['restart'],
secDesc:'!restart - Перезапускает бота'
});