var fs = require('fs')
var http = require('http');
var static = require('node-static');
var file = new static.Server('.');
var request = require('request');

const Discord = require('discord.js');
const client = new Discord.Client();

var chatDefaultSettings,
	getSettingsChat,
	send,
	getSettingsUser,
	userDefaultSettings,
	save;

var admins = ["368502216106967040"];

let bot = { // Main config 
     out: true, // Отвечать на свои сообщения? (true/false) 
     cmds: [], // Массив с командами 
     on(r, f, d = {}) {
      this.cmds.push({
       r,
       f,
       d
      });
     }
 	};


client.on('message', msg => {

	if(msg.author.id == '528532161406566413') return;
    if(msg.channel.type == 'dm') return;

    //console.log(msg);

    save = function(){
		fs.writeFile('discordChats/' + msg.guild.id + '/' + msg.channel.id + '.txt', JSON.stringify(getSettingsChat,null,'\t') ,  (err) => {
			if (err) throw err;
		});
	}

	send = function(text){
		msg.channel.send(text);
	}

    fs.readFile('discordUsers/' + msg.author.id + '.txt', (err, data) => {
  		if (err){
  			fs.writeFile('discordUsers/' + msg.author.id + '.txt', JSON.stringify(defaultSettingsUser(msg.author),null,'\t') ,  (err) => {
  				if (err) {
                    fs.mkdir('discordUsers', (err) => {
                        fs.writeFile('discordUsers/' + msg.author.id + '.txt', JSON.stringify(defaultSettingsUser(msg.author),null,'\t') ,  (err) => {
                            if (err) throw err
                        });
                    })
                }
  				getSettingsUser = defaultSettingsUser(msg.author);
  			});
  		} else {
  			getSettingsUser = JSON.parse(data)
  		}
    fs.readFile('discordChats/' + msg.guild.id + '/' + msg.channel.id + '.txt', (err, data) => {
  		if (err){
  			fs.writeFile('discordChats/' + msg.guild.id + '/' + msg.channel.id + '.txt', JSON.stringify(defaultSettingsChat(msg.channel),null,'\t') ,  function(err){
  				if (err) {
  					fs.mkdir('discordChats/' + msg.guild.id, (err) => {
                        if (err) {
                            fs.mkdir('discordChats', (err) => {
                                fs.mkdir('discordChats/' + msg.guild.id, (err) => {
                                    if(err) throw err
                                })
                            })
                        }
  						fs.writeFile('discordChats/' + msg.guild.id + '/' + msg.channel.id + '.txt', JSON.stringify(defaultSettingsChat(msg.author),null,'\t') ,  (err) => {
                            if (err) throw err
                        });
  					})
  				}
  				getSettingsChat = defaultSettingsChat(msg.channel);
  			});
  		} else {
  			getSettingsChat = JSON.parse(data);
  		}
  		setTimeout(function() {
        if(getSettingsChat.admins.indexOf(msg.channel.guild.ownerID) == -1){
            getSettingsChat.admins.push(msg.channel.guild.ownerID);
            getSettingsChat.whitelistUsers.push(msg.channel.guild.ownerID)
            fs.writeFile('discordChats/' + msg.guild.id + '/' + msg.channel.id + '.txt', JSON.stringify(getSettingsChat,null,'\t') ,  (err) => {
                if (err) throw err;
            });
        }

	if(getSettingsChat.muted.find(x => x.id == msg.author.id)){
		if(getSettingsChat.muted.find(x => x.id == msg.author.id).time == 'forever') return msg.delete();
		if(getSettingsChat.muted.find(x => x.id == msg.author.id).time < Math.round(new Date().getTime() / 1000)){
			getSettingsChat.muted.splice(getSettingsChat.muted.indexOf(getSettingsChat.muted.find(x => x.id == msg.author.id)), 1);
			save()
		    send('У пользователя <@' + msg.author.id + '> истекло время мута')
		} else { 
			msg.delete();
		}
	}

	if(getSettingsChat.mathgame.pvp){
    if(getSettingsChat.mathgame.turn){
        getSettingsChat.mathgame.pvpeshers = '<@'+getSettingsChat.mathgame.player2.id+'>'
		save()
    } else {
        getSettingsChat.mathgame.pvpeshers = '<@'+getSettingsChat.mathgame.player1.id+'>';
        save()
    };

    if(msg.author.id == getSettingsChat.mathgame.player1.id && getSettingsChat.mathgame.turn){
        if(msg.content == getSettingsChat.mathgame.answer && msg.author.id == getSettingsChat.mathgame.player1.id){
            getSettingsChat.mathgame.turn = false;
            var response = Math.round(new Date().getTime() / 1000);
            	getSettingsChat.mathgame.time_move = response + 30;
            
            getSettingsChat.mathgame.player1.points++;
            act = Math.round(Math.random() * (4 - 1));
            switch (act) {
                case 1:
                    example = Math.round(Math.random() * (1000 - 1));
                    example2 = Math.round(Math.random() * (1000 - 1));
                    getSettingsChat.mathgame.answer = example + example2;
                    send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " + " + example2);
                    break;
                case 2:
                    example = Math.round(Math.random() * (1000 - 600));
                    example2 = Math.round(Math.random() * (400 - 1));
                    for(;example2 >= example;example2 = Math.round(Math.random() * (400 - 1))){}
                    getSettingsChat.mathgame.answer = example - example2;
                    send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " - " + example2);
                    break;
                case 3:
                    example = Math.round(Math.random() * (50 - 1));
                    example2 = Math.round(Math.random() * (9 - 1));
                    getSettingsChat.mathgame.answer = (example * example2);
                    send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " * " + example2);
                    break;
                    /*
                case 4:
                    example = Math.round(Math.random() * (maxNum - 1));
                    example2 = Math.round(Math.random() * (maxNum - 1));
                    answer = example / example2;
                    msg.send('Ходит ' + pvpeshers + ' : ' + example + " : " + example2);
                    break;
                    */
                default:
                    example = Math.round(Math.random() * (1000 - 1));
                    example2 = Math.round(Math.random() * (1000 - 1));
                    getSettingsChat.mathgame.answer = example + example2;
                    send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " + " + example2);
                    break;
            } // 1 = + , 2 = - , 3 = * , 4 = :
            save()
        } else if(msg.content != getSettingsChat.mathgame.answer && msg.author.id == getSettingsChat.mathgame.player1.id && (msg.content > 1000000 || msg.content < 1000000)){
            getSettingsChat.mathgame.player1.mistakes++;
            save()
            if(getSettingsChat.mathgame.player1.mistakes >= 3){
                send('<@'+getSettingsChat.mathgame.player1.id+'>'+" проиграл(-a)! \n\nОчки: " + '\n' + getSettingsChat.mathgame.player1.name + ' : ' + getSettingsChat.mathgame.player1.points + '\n' + getSettingsChat.mathgame.player2.name + ' : ' + getSettingsChat.mathgame.player2.points);
                fs.readFile('discordUsers/' + getSettingsChat.mathgame.player1.id + '.txt', (err, data) => {
                    if (err) throw err;
                    var info1 = JSON.parse(data);
                    if(info.mathgame.points < getSettingsChat.mathgame.player1.points){
                        info.mathgame.points = getSettingsChat.mathgame.player1.points;
                        fs.writeFile('discordUsers/' + getSettingsChat.mathgame.player1.id + '.txt', JSON.stringify(info1) ,  (err) => {
                            if (err) throw err;
                        });
                    }
                });
                fs.readFile('discordUsers/' + getSettingsChat.mathgame.player2.id + '.txt', (err, data) => {
                    if (err) throw err;
                    var info2 = JSON.parse(data);
                    if(info2.mathgame.points < getSettingsChat.mathgame.player2.points){
                        info2.mathgame.points = getSettingsChat.mathgame.player2.points;
                        fs.writeFile('discordUsers/' + getSettingsChat.mathgame.player2.id + '.txt', JSON.stringify(info2) ,  (err) => {
                            if (err) throw err;
                        });
                    }
                });
                getSettingsChat.mathgame.pvp = false; 
                getSettingsChat.mathgame.player1.points = getSettingsChat.mathgame.player1.mistakes = 0;
                getSettingsChat.mathgame.gamestartpvp = false;
                save()
            } else {
                send("Не верно!")
            }
        }
    }

    if(msg.author.id == getSettingsChat.mathgame.player2.id && !getSettingsChat.mathgame.turn){
        if(msg.content == getSettingsChat.mathgame.answer && msg.author.id == getSettingsChat.mathgame.player2.id){
            getSettingsChat.mathgame.turn = true;
            var response = Math.round(new Date().getTime() / 1000);
            getSettingsChat.mathgame.time_move = response + 30;
            
            getSettingsChat.mathgame.player2.points++;
            act = Math.round(Math.random() * (4 - 1));
            switch (act) {
                case 1:
                    example = Math.round(Math.random() * (1000 - 1));
                    example2 = Math.round(Math.random() * (1000 - 1));
                    getSettingsChat.mathgame.answer = example + example2;
                    send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " + " + example2);
                    break;
                case 2:
                    example = Math.round(Math.random() * (1000 - 600));
                    example2 = Math.round(Math.random() * (400 - 1));
                    for(;example2 >= example;example2 = Math.round(Math.random() * (400 - 1))){}
                    getSettingsChat.mathgame.answer = example - example2;
                    send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " - " + example2);
                    break;
                case 3:
                    example = Math.round(Math.random() * (50 - 1));
                    example2 = Math.round(Math.random() * (9 - 1));
                    getSettingsChat.mathgame.answer = (example * example2);
                    send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " * " + example2);
                    break;
                    /*
                case 4:
                    example = Math.round(Math.random() * (maxNum - 1));
                    example2 = Math.round(Math.random() * (maxNum - 1));
                    answer = example / example2;
                    msg.send(example + " : " + example2);
                    break;
                    */
                default:
                    example = Math.round(Math.random() * (1000 - 1));
                    example2 = Math.round(Math.random() * (1000 - 1));
                    getSettingsChat.mathgame.answer = example + example2;
                    send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " + " + example2);
                    break;
            } // 1 = + , 2 = - , 3 = * , 4 = :
			save()
        } else if(msg.content != getSettingsChat.mathgame.answer && msg.author.id == getSettingsChat.mathgame.player1.id && (msg.content > 1000000 || msg.content < 1000000)){
            getSettingsChat.mathgame.player2.mistakes++;
            save()
            if(getSettingsChat.mathgame.player1.mistakes >= 3){
                send('<@'+getSettingsChat.mathgame.player2.id+'>'+" проиграл(-a)! \n\nОчки: " + '\n' + getSettingsChat.mathgame.player1.name + ' : ' + getSettingsChat.mathgame.player1.points + '\n' + getSettingsChat.mathgame.player2.name + ' : ' + getSettingsChat.mathgame.player2.points);
                fs.readFile('discordUsers/' + getSettingsChat.mathgame.player1.id + '.txt', (err, data) => {
                    if (err) throw err;
                    var info1 = JSON.parse(data);
                    if(info.mathgame.points < getSettingsChat.mathgame.player1.points){
                        info.mathgame.points = getSettingsChat.mathgame.player1.points;
                        fs.writeFile('discordUsers/' + getSettingsChat.mathgame.player1.id + '.txt', JSON.stringify(info1) ,  (err) => {
                            if (err) throw err;
                        });
                    }
                });
                fs.readFile('discordUsers/' + getSettingsChat.mathgame.player2.id + '.txt', (err, data) => {
                    if (err) throw err;
                    var info2 = JSON.parse(data);
                    if(info2.mathgame.points < getSettingsChat.mathgame.player2.points){
                        info2.mathgame.points = getSettingsChat.mathgame.player2.points;
                        fs.writeFile('discordUsers/' + getSettingsChat.mathgame.player2.id + '.txt', JSON.stringify(info2) ,  (err) => {
                            if (err) throw err;
                        });
                    }
                });
                getSettingsChat.mathgame.pvp = false;                    
                getSettingsChat.mathgame.player1.points = getSettingsChat.mathgame.player1.mistakes = 0;
                getSettingsChat.mathgame.gamestartpvp = false;
                save()
            } else {
                send("Не верно!")
            }
        }
    }
}

	if(getSettingsChat.mathgame.gamestart){
		if(msg.content == getSettingsChat.mathgame.answer && msg.author.id == getSettingsChat.mathgame.gamestarter.id){
			getSettingsChat.mathgame.points++;
			act = Math.round(Math.random() * (4 - 1));
        	switch (act) {
            	case 1:
            	    example = Math.round(Math.random() * (1000 - 1));
            	    example2 = Math.round(Math.random() * (1000 - 1));
            	    getSettingsChat.mathgame.answer = example + example2;
            	    send(example + " + " + example2);
            	    break;
           		case 2:
                	example = Math.round(Math.random() * (1000 - 600));
                	example2 = Math.round(Math.random() * (400 - 1));
                	for(;example2 > example;example2 = Math.round(Math.random() * (400 - 1))){}
                	getSettingsChat.mathgame.answer = example - example2;
	                send(example + " - " + example2);
    	            break;
        	    case 3:
            	    example = Math.round(Math.random() * (50 - 1));
	                example2 = Math.round(Math.random() * (9 - 1));
	                getSettingsChat.mathgame.answer = (example * example2);
        	        send(example + " * " + example2);
            	    break;
                	/*
	            case 4:
    	            example = Math.round(Math.random() * (maxNum - 1));
        	        example2 = Math.round(Math.random() * (maxNum - 1));
            	    answer = example / example2;
                	msg.send(example + " : " + example2);
	                break;
    	            */
        	    default:
            	    example = Math.round(Math.random() * (1000 - 1));
                	example2 = Math.round(Math.random() * (1000 - 1));
	                getSettingsChat.mathgame.answer = example + example2;
    	            send(example + " + " + example2);
        	        break;
	        } // 1 = + , 2 = - , 3 = * , 4 = :
			save()
		} else if(msg.content != getSettingsChat.mathgame.answer && msg.author.id == getSettingsChat.mathgame.gamestarter.id && (msg.content > 1000000 || msg.content < 1000000)){
			getSettingsChat.mathgame.mistakes++;
            save()
			if(getSettingsChat.mathgame.mistakes >= 3){
				send("Вы проиграли! \n\nОчков: " + getSettingsChat.mathgame.points);
				if(getSettingsUser.mathgame.points < getSettingsChat.mathgame.points){
                    getSettingsUser.mathgame.points = getSettingsChat.mathgame.points;
                    fs.writeFile('discordUsers/' + msg.author.id + '.txt', JSON.stringify(getSettingsUser) ,  (err) => {
                        if (err) throw err;
                    });
                }
				getSettingsChat.mathgame.gamestart = false;
				getSettingsChat.mathgame.points = getSettingsChat.mathgame.mistakes = 0;
				save()
			} else {
				send("Не верно!")
			}
		} else if(msg.author.id != getSettingsChat.mathgame.gamestarter.id && (msg.content > 1000000 || msg.content < 1000000)){
			send("Сейчас играет другой пользователь")
		}
	}

	



	if(msg.content.substr(0,getSettingsChat.keyCommand.length) != getSettingsChat.keyCommand && !msg.content.match(/keycomand/)) return;
	let c = bot.cmds.find(e => e.r.test(msg.content));

    if (!c) return;

    //if(c.d.admin && !iadmin) return send('Я не администратор');
    if(c.d.admin && admins.indexOf(`${msg.author.id}`) == -1 && getSettingsChat.admins.indexOf(`${msg.author.id}`) == -1) return send('У вас недостаточно прав');
    if(c.d.sec && admins.indexOf(`${msg.author.id}`) == -1) return;

    let args = msg.content.match(c.r) || [];
    args[0] = msg;
    c.f.apply(this, args);
}, 100);
})
})
});


bot.on(/(ahelp|adminhelp)( [^]+|)/i, (msg , text, text2) => {
    //if(!iadmin) return send('Я не администратор')
    if(text2 == "") return send(bot.cmds.map(x => x.d.admin).join(' ').replace(/!/g,getSettingsChat.keyCommand));
    try {
    	send(bot.cmds.find((element, index, array) => {
    		if(element.d.adminCommand){
    			if(element.d.adminCommand.indexOf(text2.replace(/\s+/g,'').toLowerCase()) != -1){
    				return element;
    			}
    		}
    	}).d.adminDesc.replace(/!/g,getSettingsChat.keyCommand));
	} catch(err) {
    	send("Такой команды не существует");
    }
}, {
admin:'!adminhelр - Используйте !adminhelp <команда> для получения информации о команде \n\nПример: !adminhelp adminhelp выведет информацию о команде \"!adminhelp\" \n\nКоманды:\n!adminhelp',
adminCommand:['adminhelp', 'ahelp'],
adminDesc:'!adminhelp - Используйте !adminhelp <команда> для получения информации о команде \n\nПример: !adminhelp adminhelp выведет информацию о команде \"!adminhelp\"'
}); 



bot.on(/sechelp( [^]+|)/i, (msg , text) => {
    if(text == "") return send(bot.cmds.map(x => x.d.sec).join(' ').replace(/!/g,getSettingsChat.keyCommand));
    try {
    	send(bot.cmds.find((element, index, array) => {
    		if(element.d.secCommand){
    			if(element.d.secCommand.indexOf(text.replace(/\s+/g,'').toLowerCase()) != -1){
    				return element;
    			}
    		}
    	}).d.secDesc.replace(/!/g,getSettingsChat.keyCommand));
    } catch(err) {
    	send("Такой команды не существует");
    }
}, {
sec:'!sechelр - Используйте !sechelp <команда> для получения информации о команде \n\nПример: !sechelp sechelp выведет информацию о команде \"!sechelp\" \n\nКоманды:\n!sechelp',
secCommand:['sechelp'],
secDesc:'!sechelр - Используйте !sechelp <команда> для получения информации о команде \n\nПример: !sechelp sechelp выведет информацию о команде \"!sechelp\"'
});



bot.on(/(help|помощь|справка)( [^]+|)/i, (msg , text, text2) => {
	if(text2 == "") return msg.channel.send(bot.cmds.map(x => x.d.normal).join(' ').replace(/!/g,getSettingsChat.keyCommand));
	try { //findIndex(callback[, thisArg])
    	send(bot.cmds.find((element, index, array) => {
    		if(element.d.command){
    			if(element.d.command.indexOf(text2.replace(/\s+/g,'').toLowerCase()) != -1){
    				return element;
    			}
    		}
    	}).d.desc.replace(/!/g, getSettingsChat.keyCommand));
	} catch(err) {
    	send("Такой команды не существует");
    }
}, {
normal:'!helр - Используйте !help <команда> для получения информации о команде \n\nПример: !help help выведет информацию о команде \"!help\" \n\nКоманды:\n!help',
command:['help', 'помощь', 'справка'],
desc:'!help - Используйте !help <команда> для получения информации о команде \n\nПример: !help help выведет информацию о команде \"!help\"'
});



bot.on(/userinfo( [^]+|)/i, (msg , text) => {
    user = msg.mentions.users.first() || msg.author;
    var parsed
    fs.readFile('discordUsers/' + user.id + '.txt', (err, data) => {
        if(err) {
            parsed = defaultSettingsUser(user);
            fs.writeFile('discordUsers/' + user.id + '.txt', JSON.stringify(defaultSettingsUser(user),null,'\t') , (err) => {
                if(err) throw err
            })
        } else {
            parsed = JSON.parse(data);
        }
    var embed = {
    	embed : {
    		title:user.id,
    		//description:"Простоквашино",
    		author: {
    			name: user.username + '#' + user.discriminator,
    		},
            thumbnail : {
                url : 'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar || 'https://discordapp.com/assets/1cbd08c76f8af6dddce02c5138971129.png',
            },
    		fields:[{name:'Score',value:parsed.mathgame.points || 0,inline:true}],
    		color:51956
    	}
    }
    msg.channel.send('',embed);
    })
}, {
normal:'\n!userinfo',
command:['userinfo'],
desc:'!userinfo <id> - Показывает информацию о пользователе (если не указать id, то будет показана ваша информация)'
});



bot.on(/pred/i, (msg , text) => {
    var predMsg = ['Возможно','Наверное','Скорее всего','Да','Нет','Может быть','Вероятно'];
    send(predMsg[Math.floor(Math.random() * predMsg.length)])
}, {
normal:'\n!pred',
command:['pred'],
desc:'!pred - undefined'
}); 



bot.on(/test/i, (msg, text) => {
    send("Work!");
}, {});



bot.on(/unmute( [^]+)/i, (msg , text) => {
	if(!msg.mentions.users) return send('Упомяните пользовтеля')
	if(!getSettingsChat.muted.find(x => x.id == msg.mentions.users.first().id)) return send('Пользователь не замучен');
	getSettingsChat.muted.splice(getSettingsChat.muted.indexOf(getSettingsChat.muted.find(x => x.id == msg.mentions.users.first().id)), 1)
    save()
	send('Пользователь размучен');
}, {
admin:'\n!unmute',
adminCommand:['unmute'],
adminDesc:'!unmute <id> - Размучивает пользователя'
});



bot.on(/mute( [^]+)/i, (msg , text) => {
	if(!msg.mentions.users) return send('Упомяните пользователя')
	if(!getSettingsChat.muted.find(x => x.id == msg.mentions.users.first().id)){
	    getSettingsChat.muted.push({
	    	id : msg.mentions.users.first().id,
	    	time : (Math.round(new Date().getTime() / 1000) + (+text.split(' ')[2])) || 'forever'
	    });
	    save()
	} else {
		getSettingsChat.muted.splice(getSettingsChat.muted.indexOf(getSettingsChat.muted.find(x => x.id == msg.mentions.users.first().id)), 1, {
			id : msg.mentions.users.first().id,
	    	time : (Math.round(new Date().getTime() / 1000) + (+text.split(' ')[2])) || 'forever'
		})
		save()
	}
	if(getSettingsChat.muted.find(x => x.id == msg.mentions.users.first().id).time == 'forever') return send('Пользователь замучен навсегда');
	send('Пользователь замучен на ' + timeTranslate(text.split(' ')[2]))
}, {
admin:'\n!mute',
adminCommand:['mute'],
adminDesc:'!mute <id> <time> - Мутит пользователя(Моментально удаляет его сообщения) на время из time (Если time не указано, то мутит на всегда)'
}); 



bot.on(/info/i, (msg) => {
	send(
		'Я в VK : https://vk.com/public175696240'
		);
}, {
normal:'\n!info',
command:['info'],
desc:'!info - Информация о боте'
});



var player1 = {},player2 = {},pvp = false,pvpeshers;

var gamestart = false,gamestartpvp = false,turn,gamechat,acceptedall = false,time_move;
var answer,example,example2,act,points = 0,mistakes = 0,gamestarter = {},timer,accepted = false;

bot.on(/(mathgame|матигра)( [^]+|)/i, (msg, text, text2) => {

setInterval(function(){
	var response = Math.round(new Date().getTime() / 1000);
	    if(getSettingsChat.mathgame.gamestart){
	        if(getSettingsChat.mathgame.timer <= response){
	        	client.rest.methods.sendMessage(getSettingsChat.mathgame.gamechat,"<@"+getSettingsChat.mathgame.gamestarter.id+">, Время вышло! \n\nОчков: " + getSettingsChat.mathgame.points)
	        	getSettingsChat.mathgame.points = getSettingsChat.mathgame.mistakes = 0;
                getSettingsChat.mathgame.gamestart = false;
	        	save()
	        }
	    }

	    if(getSettingsChat.mathgame.pvp){
	        if(getSettingsChat.mathgame.timer <= response){
	            client.rest.methods.sendMessage(getSettingsChat.mathgame.gamechat,"Время вышло! \n\nОчки: " + '\n' + getSettingsChat.mathgame.player1.name + ' : ' + getSettingsChat.mathgame.player1.points + '\n' + getSettingsChat.mathgame.player2.name + ' : ' + getSettingsChat.mathgame.player2.points)
	            getSettingsChat.mathgame.pvp = false;
	            getSettingsChat.mathgame.gamestartpvp = false;
	            save()
	        }

	        if(getSettingsChat.mathgame.time_move <= response){
	            client.rest.methods.sendMessage(getSettingsChat.mathgame.gamechat,"Время хода истекло")
	            if(getSettingsChat.mathgame.turn){
	                getSettingsChat.mathgame.turn = false
	            } else {
	                getSettingsChat.mathgame.turn = true
	            }
                var response = Math.round(new Date().getTime() / 1000);
                getSettingsChat.mathgame.time_move = response + 30;
	            save()
	        }
	    }

	    if(getSettingsChat.mathgame.accepted){
	        if(getSettingsChat.mathgame.timer <= response){
	            client.rest.methods.sendMessage(getSettingsChat.mathgame.gamechat,'<@'+getSettingsChat.mathgame.player1.id+'>, ваш вызов не приняли.')
	            getSettingsChat.mathgame.accepted = false;
	            getSettingsChat.mathgame.gamestartpvp = false;
	            save()
            }
	    }

        if(getSettingsChat.mathgame.acceptedall){
            if(getSettingsChat.mathgame.timer <= response){
                client.rest.methods.sendMessage(getSettingsChat.mathgame.gamechat,'<@'+getSettingsChat.mathgame.player1.id+'>, ваш вызов не приняли.')
                getSettingsChat.mathgame.acceptedall = false;
                getSettingsChat.mathgame.gamestartpvp = false;
                save()
            }
        }
},1000)

if(text2 == ''){
	if(!getSettingsChat.mathgame.gamestart && !getSettingsChat.mathgame.gamestartpvp && !getSettingsChat.mathgame.pvp){
		getSettingsChat.mathgame.gamestarter.id = msg.author.id;
        getSettingsChat.mathgame.gamechat = msg.channel.id;
		getSettingsChat.mathgame.gamestart = true;
		act = Math.round(Math.random() * (4 - 1));
        switch (act) {
            case 1:
                example = Math.round(Math.random() * (1000 - 1));
                example2 = Math.round(Math.random() * (1000 - 1));
                getSettingsChat.mathgame.answer = example + example2;
                send(example + " + " + example2);
                break;
            case 2:
                example = Math.round(Math.random() * (1000 - 600));
                example2 = Math.round(Math.random() * (400 - 1));
                for(;example2 >= example;example2 = Math.round(Math.random() * (400 - 1))){}
                getSettingsChat.mathgame.answer = example - example2;
                send(example + " - " + example2);
                break;
            case 3:
                example = Math.round(Math.random() * (50 - 1));
                example2 = Math.round(Math.random() * (9 - 1));
                getSettingsChat.mathgame.answer = (example * example2);
                send(example + " * " + example2);
                break;
                /*
            case 4:
                example = Math.round(Math.random() * (maxNum - 1));
                example2 = Math.round(Math.random() * (maxNum - 1));
                getSettingsChat.mathgame.answer = example / example2;
                msg.send(example + " : " + example2);
                break;
                */
            default:
                example = Math.round(Math.random() * (1000 - 1));
                example2 = Math.round(Math.random() * (1000 - 1));
                getSettingsChat.mathgame.answer = example + example2;
                send(example + " + " + example2);
                break;
        } // 1 = + , 2 = - , 3 = * , 4 = :
        
        var response = Math.round(new Date().getTime() / 1000);
	    getSettingsChat.mathgame.timer = response + 180;
		save()
	} else {
		send("Игра уже идет")
	}
} else if(text2.replace(/\s+/g,'').toLowerCase() == 'accept'){
    if(getSettingsChat.mathgame.accepted){
        if(msg.author.id == getSettingsChat.mathgame.player2.id){
            getSettingsChat.mathgame.accepted = false;
            send('Вы приняли вызов от [id' + getSettingsChat.mathgame.player1.id + '|' + getSettingsChat.mathgame.player1.name + ']')
            getSettingsChat.mathgame.player1.mistakes = 0,player1.points = 0;
            getSettingsChat.mathgame.player2.mistakes = 0,player2.points = 0;
            getSettingsChat.mathgame.pvp = true;

            getSettingsChat.mathgame.pvpeshers = '<@'+getSettingsChat.mathgame.player1.id+'>';
            getSettingsChat.mathgame.turn = true;
            act = Math.round(Math.random() * (4 - 1));
            switch (act) {
                case 1:
                    example = Math.round(Math.random() * (1000 - 1));
                    example2 = Math.round(Math.random() * (1000 - 1));
                    getSettingsChat.mathgame.answer = example + example2;
                    send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " + " + example2);
                    break;
                case 2:
                    example = Math.round(Math.random() * (1000 - 600));
                    example2 = Math.round(Math.random() * (400 - 1));
                    for(;example2 >= example;example2 = Math.round(Math.random() * (400 - 1))){}
                    getSettingsChat.mathgame.answer = example - example2;
                    send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " - " + example2);
                    break;
                case 3:
                    example = Math.round(Math.random() * (50 - 1));
                    example2 = Math.round(Math.random() * (9 - 2));
                    answer = (example * example2);
                    send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " * " + example2);
                    break;
                    /*
                case 4:
                    example = Math.round(Math.random() * (maxNum - 1));
                    example2 = Math.round(Math.random() * (maxNum - 1));
                    answer = example / example2;
                    msg.send(example + " : " + example2);
                    break;
                    */
                default:
                    example = Math.round(Math.random() * (1000 - 1));
                    example2 = Math.round(Math.random() * (1000 - 1));
                    getSettingsChat.mathgame.answer = example + example2;
                    send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " + " + example2);
                    break;
            } // 1 = + , 2 = - , 3 = * , 4 = :
            var response = Math.round(new Date().getTime() / 1000);
            getSettingsChat.mathgame.time_move = response + 30;
		    getSettingsChat.mathgame.timer = response + 180;
		    save()
        } else {
            send('Вам не бросали вызова');
        }
    } else if(getSettingsChat.mathgame.acceptedall){
        if(msg.author.id != getSettingsChat.mathgame.player1.id){
            getSettingsChat.mathgame.acceptedall = false;
            getSettingsChat.mathgame.player2.id = msg.mentions.users.first().id

                getSettingsChat.mathgame.player2.name = msg.mentions.users.first().username;

                send('Вы приняли вызов от [id' + getSettingsChat.mathgame.player1.id + '|' + getSettingsChat.mathgame.player1.name + ']')
                getSettingsChat.mathgame.player1.mistakes = 0,player1.points = 0;
                getSettingsChat.mathgame.player2.mistakes = 0,player2.points = 0;
                getSettingsChat.mathgame.pvp = true;

                getSettingsChat.mathgame.pvpeshers = '<@'+getSettingsChat.mathgame.player1.id+'>';
                getSettingsChat.mathgame.turn = true;
                act = Math.round(Math.random() * (4 - 1));
                switch (act) {
                    case 1:
                        example = Math.round(Math.random() * (1000 - 1));
                        example2 = Math.round(Math.random() * (1000 - 1));
                        getSettingsChat.mathgame.answer = example + example2;
                        send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " + " + example2);
                        break;
                    case 2:
                        example = Math.round(Math.random() * (1000 - 600));
                        example2 = Math.round(Math.random() * (400 - 1));
                        for(;example2 >= example;example2 = Math.round(Math.random() * (400 - 1))){}
                        getSettingsChat.mathgame.answer = example - example2;
                        send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " - " + example2);
                        break;
                    case 3:
                        example = Math.round(Math.random() * (50 - 1));
                        example2 = Math.round(Math.random() * (9 - 2));
                        getSettingsChat.mathgame.answer = (example * example2);
                        send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " * " + example2);
                        break;
                        /*
                    case 4:
                        example = Math.round(Math.random() * (maxNum - 1));
                        example2 = Math.round(Math.random() * (maxNum - 1));
                        answer = example / example2;
                        msg.send(example + " : " + example2);
                        break;
                        */
                    default:
                        example = Math.round(Math.random() * (1000 - 1));
                        example2 = Math.round(Math.random() * (1000 - 1));
                        getSettingsChat.mathgame.answer = example + example2;
                        send('Ходит ' + getSettingsChat.mathgame.pvpeshers + ' : ' + example + " + " + example2);
                        break;
                } // 1 = + , 2 = - , 3 = * , 4 = :
                var response = Math.round(new Date().getTime() / 1000);
				getSettingsChat.mathgame.timer = response + 180;
				save()
        } else {
            send('Вы не можете принять свой вызов')
        }
    } else {
        send('Вам не бросали вызова');
    }
} else if(text2.replace(/\s+/g,'').toLowerCase() == 'deny'){
    if(getSettingsChat.mathgame.accepted && msg.author.id == getSettingsChat.mathgame.player2.id){
        getSettingsChat.mathgame.accepted = false;
        getSettingsChat.mathgame.gamestartpvp = false;
        getSettingsChat.mathgame.pvp = false;
        send('Вы отклонили вызов от [id' + getSettingsChat.mathgame.player1.id + '|' + getSettingsChat.mathgame.player1.name + ']')
		save()
    } else {
        send('Вам не бросали вызова')
    }
} else if(text2.replace(/\s+/g,'').toLowerCase() == 'all'){
    if(!getSettingsChat.mathgame.gamestart && !getSettingsChat.mathgame.gamestartpvp && !getSettingsChat.mathgame.pvp){
            getSettingsChat.mathgame.gamestartpvp = true;
            getSettingsChat.mathgame.gamechat = msg.channel.id;

            getSettingsChat.mathgame.player1.id = msg.author.id;
			getSettingsChat.mathgame.player1.name = msg.author.username;

			send('<@'+getSettingsChat.mathgame.player1.id+'> бросил вызов! Напишите '+getSettingsChat.keyCommand+'mathgame accept, чтобы принять вызов. Вызов будет автоматически отклонён через 5 минут');

            getSettingsChat.mathgame.acceptedall = true;

            var response = Math.round(new Date().getTime() / 1000);
		    getSettingsChat.mathgame.timer = response + 300;

            save()
        } else {
            send("Игра уже идет")
        }
} else if(text2.replace(/\s+/g,'').toLowerCase() == 'leaders'){
    fs.readFile('other/leaders.txt', (err, data) => {
        var leaders = JSON.parse(data);
        var d = '';
        for(var i = 0;i < 10;i++){
        	if(leaders[i].first_name != undefined){
            	d += `${i + 1}. ` + leaders[i].first_name + ' ' + leaders[i].last_name + ' - ' + leaders[i].points + '\n';
        	} else {
        		d += `${i + 1}. ` + leaders[i].username + ' - ' + leaders[i].points + '\n';
        	}
        }
        send(d);
    })
} else if(text2.toLowerCase().replace(/\s+/g,'') == 'cancel' || text2.toLowerCase().replace(/\s+/g,'') == 'stop'){
    getSettingsChat.mathgame.gamestart = false;
    getSettingsChat.mathgame.gamestartpvp = false;
    getSettingsChat.mathgame.pvp = false;
    getSettingsChat.mathgame.accepted = false;
    getSettingsChat.mathgame.acceptedall = false;
    //if(!getSettingsChat.mathgame.gamestart && !getSettingsChat.mathgame.gamestartpvp && !getSettingsChat.mathgame.pvp && !getSettingsChat.mathgame.accepted && !getSettingsChat.mathgame.acceptedall) return send('Mathgame не идет');
    save()
    send('Mathgame отменена');
} else {
    if(msg.mentions.users.first() == undefined) return send('Такой подкоманды нет');
    if(msg.mentions.users.first().id != msg.author.id){
        if(!getSettingsChat.mathgame.gamestartpvp){
            getSettingsChat.mathgame.gamestartpvp = true;
            getSettingsChat.mathgame.gamechat = msg.channel.id;

            getSettingsChat.mathgame.player1.id = msg.author.id;
            getSettingsChat.mathgame.player2.id = msg.mentions.users.first().id;

        	getSettingsChat.mathgame.player1.name = msg.author.username;
         	getSettingsChat.mathgame.player2.name = msg.mentions.users.first().username;

        	send('Вы бросили пользователю <@'+getSettingsChat.mathgame.player2.id+'> вызов');
        	send('<@'+getSettingsChat.mathgame.player2.id+'>, напишите '+getSettingsChat.keyCommand+'mathgame accept, чтобы принять вызов или '+getSettingsChat.keyCommand+'mathgame deny, чтобы отклонить. Вызов будет автоматически отклонён через 5 минут');

            getSettingsChat.mathgame.accepted = true;

            var response = Math.round(new Date().getTime() / 1000);
			getSettingsChat.mathgame.timer = response + 300;

            save()
        } else {
            send("Игра уже идет")
        }
    } else if(msg.mentions.users.first().id == msg.author.id){
        send('Вы не можете бросить вызов самому себе');
    } else {
        send('Необходимо указать id пользователя или упомянуть его');
    }
}
}, {
normal:'\n!mathgame',
command:['mathgame', 'матигра'],
desc:'!mathgame - Чат-игра в которой нужно решить как можно больше примеров. Можно бросить вызов другому пользователю в беседе, для этого упомяньте его \n\nПравила: \n1. Игра идет 3 минуты \n2. При игре с игроками время на ответ: 30 секунд \n\nПример: \n!mathgame - Вы начнёте игру с ботом \n!mathgame @1234#1234 - Вы бросите пользователю 1234 вызов \n!mathgame all - Вы бросите вызов и принять его сможет любой желающий'
});



/*var kal = setInterval(function(){
    var lps = [];
    var a = 0;
    fs.readFile('other/leaders.txt', (c, s) => {
    	if(c) throw c
    	var lrs = JSON.parse(s);
	    fs.readdir('discordUsers', (err, data) => {
	        for (var i = 0; i < data.length; i++) {
	            fs.readFile('discordUsers/' + data[i], (er, dat) => {
	                var asd = JSON.parse(dat);
	                lps.push({
	                    id : asd.id,
	                    username : asd.username + asd.tag,
	                    points : asd.mathgame.points
	                });
	                a = i;
	            })
	        }
	        var n;
	        var setInterv = setInterval(function(){
	            if(a >= (data.length - 1)){
	            	for(var i = 0;i < lps.length;i++){
	            		if(lrs.indexOf(lps[i]) == -1){
	            			lrs.push(lps[i]);
	            		} else {
	            			lrs[lrs.indexOf(lps[i])] = lps[i];
	            		}
	            		n = i;
	            	}
	            	if(n >= (lps.length - 1)){
		                fs.writeFile('other/leaders.txt', JSON.stringify(lrs.sort(function(obj1, obj2){return obj2.points-obj1.points})) ,  (err) => {
		                    if (err) throw err;
		                });
		                clearInterval(setInterv);
		            }
	            }
	        },1000)
	    })
    })
},100000)*/



function refreshLeaders(){
	var lps = [];
    var a = 0;
    fs.readFile('other/leaders.txt', (c, s) => {
    	if(c) throw c
    	var lrs = JSON.parse(s);
	    fs.readdir('discordUsers', (err, data) => {
	        for (var i = 0; i < data.length; i++) {
	            fs.readFile('discordUsers/' + data[i], (er, dat) => {
	                var asd = JSON.parse(dat);
	                lps.push({
	                    id : asd.id,
	                    username : asd.username + asd.tag,
	                    points : asd.mathgame.points
	                });
	                a = i;
	            })
	        }
	        var n;
	        var setInterv = setInterval(function(){
	            if(a >= (data.length - 1)){
	            	for(var i = 0;i < lps.length;i++){
	            		if(lrs.indexOf(lps[i]) == -1){
	            			lrs.push(lps[i]);
	            		} else {
	            			lrs[lrs.indexOf(lps[i])] = lps[i];
	            		}
	            		n = i;
	            	}
	            	if(n >= (lps.length - 1)){
		                fs.writeFile('other/leaders.txt', JSON.stringify(lrs.sort(function(obj1, obj2){return obj2.points-obj1.points})) ,  (err) => {
		                    if (err) throw err;
		                });
		                clearInterval(setInterv);
		            }
	            }
	        },1000)
	    })
    })
}



bot.on(/execute ([^]+)/i, (msg , text) => {
    try{
        eval(text);
    } catch(e) {
        send('Ошибка: ' + e);
    }
}, {
sec:'\n!execute',
secCommand:['execute'],
secDesc:'!execute <text> - Выполняет скрипт указанный в "text"'
});



bot.on(/setstatus( [^]+|)/i, (msg , text) => {
    if(text == "") return send('Необходимо указать данные ([name],[type],[status],[url]) (Разработку, 3, dnd)');
    client.user.setPresence({
    	status : text.replace(/\s+/g,'').toLowerCase().split(',')[2] || 'available',
    	game: { 
    		name: text.split(',')[0],
    		type: +text.replace(/\s+/g,'').split(',')[1] || 0,
    		url: text.replace(/\s+/g,'').split(',')[3] || undefined
    	}
    });
    send('Статус установлен');
}, {
sec:'\n!setstatus',
secCommand:['setstatus'],
secDesc:'!setstatus <data> - Ставит боту статус из data, data = ([name],[type],[status],[url])'
});



bot.on(/keycomand( [^]+|)/i, (msg, text, text2) => {
    getSettingsChat.keyCommand = text.replace(/\s+/g,'');
    save()
    if(text.replace(/\s+/g,'') == '') return send('Ключевое слово убрано')
    if(text.replace(/\s+/g,'').length > 1) return send('Ключевое слово для команд : ' + text.replace(/\s+/g,''))
    send('Ключевой символ для команд : ' + text.replace(/\s+/g,''));
}, {
admin:'\n!keycomand',
adminCommand:['keycomand'],
adminDesc:'!keycomand - Ставит text символом/словом для команд'
});



client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	//client.user.setStatus('dnd');
    client.user.setPresence({
    	status : 'dnd',
    	game: { 
    		name: 'Разработку',
    		type: 3,
    		//url: "https://minecraft.net"
    	}
    });
});

client.login('');

//Плюшки

function defaultSettingsUser(data) {
    return {
     id : data.id,
     username : data.username,
     tag : '#'+data.discriminator,
     mathgame : {
      points : 0
     }
    }
}

function defaultSettingsChat(data) {
    return {
       name : data.name,
       id : data.id,
       welcome : false,
       welcomeMessage : 'undefined',
       admins : [],
       banned : [],
       muted : [],
       mathgame : {
        gamestart : false,
        gamestartpvp : false,
        gamechat : 'undefined',
        pvp : false,
        time_move : 0,
        time : 0,
        accepted : false,
        acceptedall : false,
        turn : true,
        player1 : {},
        player2 : {},
        pvpeshers : 'undefined',
        answer : 'undefined',
        gamestarter : {},
        points : 0,
        mistakes : 0
       },
       whitelist : false,
       whitelistGroups : [],
       whitelistUsers : [],
       warnsToBan : 3,
       warnSettings : {
        mats : false,
        inviteBlockedUser : false,
        blockedWords : false
       },
       blockedWords : [],
       warns : [],
       keyCommand : '!'
    }
}

function timeConverter(UNIX_timestamp){

  var a = new Date(UNIX_timestamp * 1000);
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  
  var hourNull;
  if(hour < 10){
    hourNull = '0';
  } else {
    hourNull = '';
  }

  var time = date + '.' + month + '.' + year + ' ' + hourNull + hour + ':' + min + ':' + sec ;

  return time;

}

function banDet(timeBan){
    if(timeBan == 'Forever') return 'Никогда'
    return timeConverter(timeBan)
}

function timeTranslate(time){
	var sec = +time ;
    var h = sec/3600 ^ 0 ;
    var m = (sec-h*3600)/60 ^ 0 ;
    var s = sec-h*3600-m*60 ;
    var time = (h<10?"0"+h:h)+" ч. "+(m<10?"0"+m:m)+" мин. "+(s<10?"0"+s:s)+" сек."
    return time;
}

