checker.addCheck("mathgame", function(data){
	api.call('utils.getServerTime',{}, (error, response) => {
		if(data.getSettingsChat.mathgame.gamestart){
	        if(data.getSettingsChat.mathgame.timer <= response.response){
	        	send("[id"+data.getSettingsChat.mathgame.gamestarter.id+'|'+data.getSettingsChat.mathgame.gamestarter.name+"], Время вышло! \n\nОчков: " + data.getSettingsChat.mathgame.points);
	        	data.getSettingsChat.mathgame.points = data.getSettingsChat.mathgame.mistakes = 0;
                data.getSettingsChat.mathgame.gamestart = false;
	        	save();
                if(data.getSettingsUser.mathgame.points < data.getSettingsChat.mathgame.points){
                    data.getSettingsUser.mathgame.points = data.getSettingsChat.mathgame.points;
                    fs.writeFile('users/' + data.msg.from_id + '.txt', JSON.stringify(data.getSettingsUser) ,  (err) => {
                        if (err) throw err;
                    });
                }
	        }
	    }
	    if(data.getSettingsChat.mathgame.pvp){
	        if(data.getSettingsChat.mathgame.timer <= response.response){
	            send("Время вышло! \n\nОчки: " + '\n' + data.getSettingsChat.mathgame.pvp_game.player1.name + ' : ' + data.getSettingsChat.mathgame.pvp_game.player1.points + '\n' + data.getSettingsChat.mathgame.pvp_game.player2.name + ' : ' + data.getSettingsChat.mathgame.pvp_game.player2.points);
	            data.getSettingsChat.mathgame.pvp = false;
	            save();
                fs.readFile('users/' + data.getSettingsChat.mathgame.pvp_game.player1.id + '.txt', (err, dat) => {
                    if (err) throw err;
                    var info1 = JSON.parse(dat);
                    if(info1.mathgame.points < data.getSettingsChat.mathgame.pvp_game.player1.points){
                        info1.mathgame.points = data.getSettingsChat.mathgame.pvp_game.player1.points;
                        fs.writeFile('users/' + data.getSettingsChat.mathgame.pvp_game.player1.id + '.txt', JSON.stringify(info1) ,  (err) => {
                            if (err) throw err;
                        });
                    }
                });
                fs.readFile('users/' + data.getSettingsChat.mathgame.pvp_game.player2.id + '.txt', (err, dat) => {
                    if (err) throw err;
                    var info2 = JSON.parse(dat);
                    if(info2.mathgame.points < data.getSettingsChat.mathgame.pvp_game.player2.points){
                        info2.mathgame.points = data.getSettingsChat.mathgame.pvp_game.player2.points;
                        fs.writeFile('users/' + data.getSettingsChat.mathgame.pvp_game.player2.id + '.txt', JSON.stringify(info2) ,  (err) => {
                            if (err) throw err;
                        });
                    }
                });
	        }

	        if(data.getSettingsChat.mathgame.pvp_game.time_move <= response){
                send(data.getSettingsChat.mathgame.pvp_game.pvpeshers + ", ваше время хода истекло");
	            data.getSettingsChat.mathgame.pvp_game.turn = !data.getSettingsChat.mathgame.pvp_game.turn;
                mathgame_moves_pvp(Math.round(Math.random() * (4 - 1)), getSettingsChat.mathgame.pvp_game.pvpeshers);
                api.call('utils.getServerTime',{}, (error, response) => {
                    data.getSettingsChat.mathgame.pvp_game.time_move = response.response + 30;
    	            save();
                })
	        }
	    }
	    if(data.getSettingsChat.mathgame.accepted){
	        if(data.getSettingsChat.mathgame.timer <= response){
	            send('[id' + data.getSettingsChat.mathgame.pvp_game.player1.id + '|' + data.getSettingsChat.mathgame.pvp_game.player1.name + '], ваш вызов не приняли.')
	            data.getSettingsChat.mathgame.accepted = false;
	            save();
            }
	    }
        if(data.getSettingsChat.mathgame.acceptedall){
            if(data.getSettingsChat.mathgame.timer <= response){
                save('[id' + data.getSettingsChat.mathgame.pvp_game.player1.id + '|' + data.getSettingsChat.mathgame.pvp_game.player1.name + '], ваш вызов не приняли.')
                data.getSettingsChat.mathgame.acceptedall = false;
                save();
            }
        }
	})

	if(data.getSettingsChat.mathgame.pvp){
	    if(data.getSettingsChat.mathgame.pvp_game.turn){
	        data.getSettingsChat.mathgame.pvp_game.pvpeshers = '[id'+data.getSettingsChat.mathgame.pvp_game.player2.id+'|'+data.getSettingsChat.mathgame.pvp_game.player2.name+']'
			save();
	    } else {
	        data.getSettingsChat.mathgame.pvp_game.pvpeshers = '[id'+data.getSettingsChat.mathgame.pvp_game.player1.id+'|'+data.getSettingsChat.mathgame.pvp_game.player1.name+']'
			save();
	    };

	    if(data.msg.from_id == data.getSettingsChat.mathgame.pvp_game.player1.id && data.getSettingsChat.mathgame.pvp_game.turn){
	        if(data.msg.text.replace(/\[club175696240\|([^]+)\]( |, )/,'') == data.getSettingsChat.mathgame.answer && data.msg.from_id == data.getSettingsChat.mathgame.pvp_game.player1.id){
	            data.getSettingsChat.mathgame.pvp_game.turn = false;
	            api.call('utils.getServerTime',{}, (error, response) => {
	            	data.getSettingsChat.mathgame.pvp_game.time_move = response.response + 30;
	            	data.getSettingsChat.mathgame.pvp_game.player1.points++;
	            	mathgame_moves_pvp(Math.round(Math.random() * (4 - 1)), getSettingsChat.mathgame.pvp_game.pvpeshers);
	            	save()
	            })
	        } else if(data.msg.text.replace(/\[club175696240\|([^]+)\]( |, )/,'') != data.getSettingsChat.mathgame.answer && data.msg.from_id == data.getSettingsChat.mathgame.pvp_game.player1.id && (data.msg.text.replace(/\[club175696240\|([^]+)\]( |, )/,'') > 1000000 || data.msg.text.replace(/\[club175696240\|([^]+)\]( |, )/,'') < 1000000)){
	            data.getSettingsChat.mathgame.pvp_game.player1.mistakes++;
	            save();
	            if(data.getSettingsChat.mathgame.pvp_game.player1.mistakes >= 3){
	                send('[id'+data.getSettingsChat.mathgame.pvp_game.player1.id+'|'+data.getSettingsChat.mathgame.pvp_game.player1.name+']'+" проиграл(-a)! \n\nОчки: " + '\n' + data.getSettingsChat.mathgame.pvp_game.player1.name + ' : ' + data.getSettingsChat.mathgame.pvp_game.player1.points + '\n' + data.getSettingsChat.mathgame.pvp_game.player2.name + ' : ' + data.getSettingsChat.mathgame.pvp_game.player2.points);
	                fs.readFile('users/' + data.getSettingsChat.mathgame.pvp_game.player1.id + '.txt', (err, dat) => {
	                    if (err) throw err;
	                    var info1 = JSON.parse(dat);
	                    if(info1.mathgame.points < data.getSettingsChat.mathgame.pvp_game.player1.points){
	                        info1.mathgame.points = data.getSettingsChat.mathgame.pvp_game.player1.points;
	                        fs.writeFile('users/' + data.getSettingsChat.mathgame.pvp_game.player1.id + '.txt', JSON.stringify(info1) ,  (err) => {
	                            if (err) throw err;
	                        });
	                    }
	                });
	                fs.readFile('users/' + data.getSettingsChat.mathgame.pvp_game.player2.id + '.txt', (err, dat) => {
	                    if (err) throw err;
	                    var info2 = JSON.parse(dat);
	                    if(info2.mathgame.points < data.getSettingsChat.mathgame.pvp_game.player2.points){
	                        info2.mathgame.points = data.getSettingsChat.mathgame.pvp_game.player2.points;
	                        fs.writeFile('users/' + data.getSettingsChat.mathgame.pvp_game.player2.id + '.txt', JSON.stringify(info2) ,  (err) => {
	                            if (err) throw err;
	                        });
	                    }
	                });
	                data.getSettingsChat.mathgame.pvp = false;                   
	                data.getSettingsChat.mathgame.pvp_game.player1.points = data.getSettingsChat.mathgame.pvp_game.player1.mistakes = 0;
	                save();
	            } else {
	                send("Не верно!")
	            }
	        }
	    }

	    if(data.msg.from_id == data.getSettingsChat.mathgame.pvp_game.player2.id && !data.getSettingsChat.mathgame.pvp_game.turn){
	        if(data.msg.text.replace(/\[club175696240\|([^]+)\]( |, )/,'') == data.getSettingsChat.mathgame.answer && data.msg.from_id == data.getSettingsChat.mathgame.pvp_game.player2.id){
	            data.getSettingsChat.mathgame.pvp_game.turn = true;
	            api.call('utils.getServerTime',{}, (error, response) => {
	            	data.getSettingsChat.mathgame.time_move = response + 30;
		            data.getSettingsChat.mathgame.pvp_game.player2.points++;
		            mathgame_moves_pvp(Math.round(Math.random() * (4 - 1)), getSettingsChat.mathgame.pvp_game.pvpeshers);
		            save();
	            })
	        } else if(data.msg.text.replace(/\[club175696240\|([^]+)\]( |, )/,'') != data.getSettingsChat.mathgame.answer && data.msg.from_id == data.getSettingsChat.mathgame.pvp_game.player1.id && (data.msg.text.replace(/\[club175696240\|([^]+)\]( |, )/,'') > 1000000 || data.msg.text.replace(/\[club175696240\|([^]+)\]( |, )/,'') < 1000000)){
	            data.getSettingsChat.mathgame.pvp_game.player2.mistakes++;
	            save();
	            if(data.getSettingsChat.mathgame.pvp_game.player1.mistakes >= 3){
	                send('[id'+data.getSettingsChat.mathgame.pvp_game.player2.id+'|'+data.getSettingsChat.mathgame.pvp_game.player2.name+']'+" проиграл(-a)! \n\nОчки: " + '\n' + data.getSettingsChat.mathgame.pvp_game.player1.name + ' : ' + data.getSettingsChat.mathgame.pvp_game.player1.points + '\n' + data.getSettingsChat.mathgame.pvp_game.player2.name + ' : ' + data.getSettingsChat.mathgame.pvp_game.player2.points);
	                fs.readFile('users/' + data.getSettingsChat.mathgame.pvp_game.player1.id + '.txt', (err, dat) => {
	                    if (err) throw err;
	                    var info1 = JSON.parse(dat);
	                    if(info1.mathgame.points < data.getSettingsChat.mathgame.pvp_game.player1.points){
	                        info1.mathgame.points = data.getSettingsChat.mathgame.pvp_game.player1.points;
	                        fs.writeFile('users/' + data.getSettingsChat.mathgame.pvp_game.player1.id + '.txt', JSON.stringify(info1) ,  (err) => {
	                            if (err) throw err;
	                        });
	                    }
	                });
	                fs.readFile('users/' + data.getSettingsChat.mathgame.pvp_game.player2.id + '.txt', (err, dat) => {
	                    if (err) throw err;
	                    var info2 = JSON.parse(dat);
	                    if(info2.mathgame.points < data.getSettingsChat.mathgame.pvp_game.player2.points){
	                        info2.mathgame.points = data.getSettingsChat.mathgame.pvp_game.player2.points;
	                        fs.writeFile('users/' + data.getSettingsChat.mathgame.pvp_game.player2.id + '.txt', JSON.stringify(info2) ,  (err) => {
	                            if (err) throw err;
	                        });
	                    }
	                });
	                data.getSettingsChat.mathgame.pvp = false;                    
	                data.getSettingsChat.mathgame.pvp_game.player1.points = data.getSettingsChat.mathgame.pvp_game.player1.mistakes = 0;
	                save();
	            } else {
	                send("Не верно!")
	            }
	        }
	    }
	}
	if(data.getSettingsChat.mathgame.gamestart){
		if(data.msg.text.replace(/\[club175696240\|([^]+)\]( |, )/,'') == data.getSettingsChat.mathgame.answer && data.msg.from_id == data.getSettingsChat.mathgame.gamestarter.id){
			data.getSettingsChat.mathgame.points++;
			mathgame_moves(Math.round(Math.random() * (4 - 1)));
	        save();
		} else if(data.msg.text.replace(/\[club175696240\|([^]+)\]( |, )/,'') != data.getSettingsChat.mathgame.answer && data.msg.from_id == data.getSettingsChat.mathgame.gamestarter.id && (data.msg.text.replace(/\[club175696240\|([^]+)\]( |, )/,'') > 1000000 || data.msg.text.replace(/\[club175696240\|([^]+)\]( |, )/,'') < 1000000)){
			data.getSettingsChat.mathgame.mistakes++;
            save();
			if(data.getSettingsChat.mathgame.mistakes >= 3){
				send("Вы проиграли! \n\nОчков: " + data.getSettingsChat.mathgame.points);
                if(data.getSettingsUser.mathgame.points < data.getSettingsChat.mathgame.points){
                    data.getSettingsUser.mathgame.points = data.getSettingsChat.mathgame.points;
                    fs.writeFile('users/' + data.msg.from_id + '.txt', JSON.stringify(data.getSettingsUser) ,  (err) => {
                        if (err) throw err;
                    });
                }
				data.getSettingsChat.mathgame.gamestart = false;
				data.getSettingsChat.mathgame.points = data.getSettingsChat.mathgame.mistakes = 0;
                save();
			} else {
				send("Не верно!")
			}
		} else if(data.msg.from_id != data.getSettingsChat.mathgame.gamestarter.id && (data.msg.text.replace(/\[club175696240\|([^]+)\]( |, )/,'') > 1000000 || data.msg.text.replace(/\[club175696240\|([^]+)\]( |, )/,'') < 1000000)){
			send("Сейчас играет другой пользователь")
		}
	} //Mathgame
})

bot.on(/(mathgame|матигра)( [^]+|)/i, (msg, text, text2) => {
	var subcommand = text2.toLowerCase().replace(/\s+/g,'');
	if(text2 == ''){
		if(getSettingsChat.mathgame.gamestart || getSettingsChat.mathgame.gamestartpvp || getSettingsChat.mathgame.pvp) return send("Игра уже идет");
		api.call('users.get',{user_id:msg.from_id},(err, res) => {
			getSettingsChat.mathgame.gamestarter.id = msg.from_id;
			getSettingsChat.mathgame.gamestarter.name = res.response[0].first_name;
			getSettingsChat.mathgame.gamestart = true;
			mathgame_moves(Math.round(Math.random() * (4 - 1)));
			api.call('utils.getServerTime',{}, (error, response) => {
			    getSettingsChat.mathgame.timer = response.response + 180;
			    save();
		    })
		})
	} else if(subcommand == 'accept'){
		if(getSettingsChat.mathgame.accepted){
			if(msg.from_id == getSettingsChat.mathgame.pvp_game.player2.id){
				getSettingsChat.mathgame.accepted = false;
	            send('Вы приняли вызов от [id' + getSettingsChat.mathgame.pvp_game.player1.id + '|' + getSettingsChat.mathgame.pvp_game.player1.name + ']')
	            getSettingsChat.mathgame.pvp_game.player1.mistakes = 0;
	            getSettingsChat.mathgame.pvp_game.player2.mistakes = 0;
	            getSettingsChat.mathgame.pvp = true;
	            getSettingsChat.mathgame.pvp_game.pvpeshers = '[id'+getSettingsChat.mathgame.pvp_game.player1.id+'|'+getSettingsChat.mathgame.pvp_game.player1.name+']';
	            getSettingsChat.mathgame.pvp_game.turn = true;
	            mathgame_moves_pvp(Math.round(Math.random() * (4 - 1)), getSettingsChat.mathgame.pvp_game.pvpeshers);
	            api.call('utils.getServerTime',{}, (error, response) => {
				    getSettingsChat.mathgame.pvp_game.time_move = response.response + 30;
				    getSettingsChat.mathgame.timer = response.response + 180;
				    save();
			    })
			} else {
	            if(msg.from_id == getSettingsChat.mathgame.pvp_game.player1.id) return send('Вы не можете принять свой вызов');
	            send('Вам не бросали вызова');
	        }
		} else if(getSettingsChat.mathgame.acceptedall){
			if(msg.from_id == getSettingsChat.mathgame.pvp_game.player1.id) return send('Вы не можете принять свой вызов');
			getSettingsChat.mathgame.acceptedall = false;
	        getSettingsChat.mathgame.pvp_game.player2.id = msg.from_id;
	        api.call('users.get',{user_id:msg.from_id},(err, res) => {
	        	getSettingsChat.mathgame.pvp_game.player2.name = res.response[0].first_name;
				send('Вы приняли вызов от [id' + getSettingsChat.mathgame.pvp_game.player1.id + '|' + getSettingsChat.mathgame.pvp_game.player1.name + ']')
	        	getSettingsChat.mathgame.pvp_game.player1.mistakes = 0;
	            getSettingsChat.mathgame.pvp_game.player2.mistakes = 0;
	            getSettingsChat.mathgame.pvp = true;
	            getSettingsChat.mathgame.pvp_game.pvpeshers = '[id'+getSettingsChat.mathgame.pvp_game.player1.id+'|'+getSettingsChat.mathgame.pvp_game.player1.name+']';
	            getSettingsChat.mathgame.pvp_game.turn = true;
	            mathgame_moves_pvp(Math.round(Math.random() * (4 - 1)), getSettingsChat.mathgame.pvp_game.pvpeshers);
	            api.call('utils.getServerTime',{}, (error, response) => {
				    getSettingsChat.mathgame.timer = response.response + 180;
				    save();
			    })
	        });
		} else {
	        send('Вам не бросали вызова');
	    }
	} else if(subcommand == 'deny'){
		if(!getSettingsChat.mathgame.accepted || msg.from_id != getSettingsChat.mathgame.pvp_game.player2.id) return send('Вам не бросали вызова');
		getSettingsChat.mathgame.accepted = false;
	    getSettingsChat.mathgame.pvp = false;
	    send('Вы отклонили вызов от [id' + getSettingsChat.mathgame.pvp_game.player1.id + '|' + getSettingsChat.mathgame.pvp_game.player1.name + ']');
	    save();
	} else if(subcommand == 'all'){
		if(getSettingsChat.mathgame.gamestart || getSettingsChat.mathgame.gamestartpvp || getSettingsChat.mathgame.pvp) return send("Игра уже идет");
		getSettingsChat.mathgame.acceptedall = true;
		getSettingsChat.mathgame.pvp_game.player1.id = msg.from_id;
		api.call('users.get',{user_id:msg.from_id},(err, res) => {
			getSettingsChat.mathgame.pvp_game.player1.name = res.response[0].first_name;
			send('[id' + getSettingsChat.mathgame.pvp_game.player1.id + '|' + getSettingsChat.mathgame.pvp_game.player1.name + '] бросил вызов! Напишите "'+getSettingsChat.keyCommand+'mathgame accept" чтобы принять вызов. Вызов будет автоматически отклонён через 5 минут');
            api.call('utils.getServerTime',{}, (error, response) => {
				getSettingsChat.mathgame.timer = response.response + 300;
				save();
			})
		});
	} else if(subcommand == 'leaders'){
		fs.readFile('other/leaders.txt', (err, dat) => {
			//console.log('Подготовка')
	        var leaders = JSON.parse(dat);
	        var d = '';
	        var limit = 10;
	        if(leaders.length < limit) limit = leaders.length;
	        for(var i = 0;i < limit;i++){
	        	//console.log('Проверка пользователя ' + (i+1))
	            if(leaders[i].first_name != undefined){
	                d += `${i + 1}. ` + leaders[i].first_name + ' ' + leaders[i].last_name + ' - ' + leaders[i].points + '\n';
	            } else {
	                d += `${i + 1}. ` + leaders[i].username + ' - ' + leaders[i].points + '\n';
	            }
	        }
	        send(d);
	        //console.log('Отправка: ' + d);
	    })
	} else if(subcommand == 'cancel' || subcommand == 'stop'){
		if(getSettingsChat.mathgame.gamestart && getSettingsChat.mathgame.gamestarter.id != msg.from_id) return send('Вы не можете остановить игру, так как начали её не вы');
	    if(getSettingsChat.mathgame.pvp && (getSettingsChat.mathgame.pvp_game.player1.id != msg.from_id && getSettingsChat.mathgame.pvp_game.player2.id != msg.from_id)) return send('Вы не можете остановить игру, так как вы не начали её и не являетесь участником');
	    getSettingsChat.mathgame.gamestart = false;
	    getSettingsChat.mathgame.pvp = false;
	    getSettingsChat.mathgame.accepted = false;
	    getSettingsChat.mathgame.acceptedall = false;
	    save();
	    send('Mathgame отменена');
	} else {
		if(text2.replace(/\s+/g,'').substr(0,3) == '[id'){userid = +text2.replace(/\s+/g,'').split('|')[0].substr(3)}else if(text2.replace(/\s+/g,'').substr(0,2) == 'id'){userid = +text2.replace(/\s+/g,'').substr(2)}else{userid = +text2.replace(/\s+/g,'')};
	    if(userid <= 1000000000 && userid >= 0 && userid != msg.from_id){
	        if(!getSettingsChat.mathgame.pvp){
	            getSettingsChat.mathgame.pvp_game.player1.id = msg.from_id;
	            getSettingsChat.mathgame.pvp_game.player2.id = userid;
	            api.call('users.get',{user_ids:`${getSettingsChat.mathgame.pvp_game.player1.id},${getSettingsChat.mathgame.pvp_game.player2.id}`}, (err,res) => {
	                getSettingsChat.mathgame.pvp_game.player1.name = res.response[0].first_name;
	                getSettingsChat.mathgame.pvp_game.player2.name = res.response[1].first_name;
	                
	                send('Вы бросили пользователю [id' + getSettingsChat.mathgame.pvp_game.player2.id + '|' + getSettingsChat.mathgame.pvp_game.player2.name + '] вызов');
	                send('[id' + getSettingsChat.mathgame.pvp_game.player2.id + '|' + getSettingsChat.mathgame.pvp_game.player2.name + '], напишите "'+getSettingsChat.keyCommand+'mathgame accept" чтобы принять вызов или "'+getSettingsChat.keyCommand+'mathgame deny" чтобы отклонить. Вызов будет автоматически отклонён через 5 минут');
	                getSettingsChat.mathgame.accepted = true;
	                
	                api.call('utils.getServerTime',{}, (error, response) => {
	                    getSettingsChat.mathgame.timer = response.response + 300;
	                    save();
	                });
	            });
	        } else {
	            send("Игра уже идет")
	        }
	    } else if(userid == msg.from_id){
	        send('Вы не можете бросить вызов самому себе');
	    } else {
	        send('Необходимо указать id пользователя или упомянуть его');
	    }
	}
}, {
normal:'\n!mathgame',
command:['mathgame','матигра'],
desc:'!mathgame - Чат-игра в которой нужно решить как можно больше примеров. Чтобы бросить кому либо вызов укажите его id или упомяньте его \n\nПравила: \n1. Игра идет 3 минуты \n2. При игре с игроками время на ответ: 30 секунд \n\nПример:\n!mathgame stop - Остановит/прекратит игру \n!mathgame - Вы начнёте игру с ботом \n!mathgame 1234 - Вы бросите пользователю с id 1234 вызов, так же можно !mathgame @id1234 \n!mathgame all - Вы бросите вызов и принять его сможет любой желающий \n!mathgame leaders - посмотреть таблицу лидеров'
});


