console.log('Running bot');

setTimeout(function(){
    console.log('Restarting...');
    setTimeout(function(){
        process.kill();
    }, 100);
}, 18000000);

function date(){
  var a = new Date();
  a = ((a.getHours()<10)?"0"+a.getHours():a.getHours())+":"+((a.getMinutes()<10)?"0"+a.getMinutes():a.getMinutes())+" "+((a.getDate()<10)?"0"+a.getDate():a.getDate())+"."+(((a.getMonth()+1)<10)?"0"+(a.getMonth()+1):(a.getMonth()+1))+"."+a.getFullYear();
  return a;
}

const fs = require('fs');
const VK = require('./api/vk');
const ACCESS_TOKEN = ''

const api = VK.Constructor({
    access_token: ACCESS_TOKEN,
    version: 5.81
});

var apiUser = VK.Constructor({
    access_token: "9cedd661c92c158a6b93d48b4449296cb5f29cfe45234b6390d1939f2d79585b52b048014fe52592e2721",
    version: 5.81
});

fs.readdir(__dirname + '/vkbot_addons', (err, data) => {
    //console.log(data);
    for(var i in data){
        fs.readFile(__dirname + '/vkbot_addons/' + data[i], (err, dat) => {
            eval(dat.toString());
        })
    }
})

/*
api.call('users.get',{user_id:280988144}, (error, response) => {
    console.log(`response: ${JSON.stringify(response)}\nerror: ${JSON.stringify(error)}`);
})
*/

api.onError = function(err){
    if(err.error_msg == 'You don\'t have access to this chat') return;
    console.log('VKAPI Error: ', err);
}

var testmode = false;
const admins = ["444122293","280988144","271863144","349602316", "337380389"];
var iadmin = false;

var bot = {
    cmds: [],
    on(r, f, d = {}) {
        this.cmds.push({
            r,
            f,
            d
        });
    }
};

var pingMeter = {
    delay: 0,
    interval: null,
    meter: false
}

var checker = {
    checks: [],
    addCheck: function(name, func, funcOnTrue, funcOnFalse){
        if(!name) throw 'No name specified';
        if(!func) throw 'No function specified';
        this.checks.push({
            name: name,
            func: func
        })
    }
}

function listen(_cb){
    api.BotsLongPollListen(175696240, function(updates){
        //console.log('updates: ', updates);

        if(updates.updates == undefined || updates.updates.length == 0 || updates.updates[0].type != 'message_new')return clearInterval(pingMeter.interval);
        var msg = updates.updates[0].object;
        //console.log('msg: ', msg);

        pingMeter.delay = 0;
        if(pingMeter.meter)pingMeter.interval = setInterval(function(){
            ++pingMeter.delay;
        }, 1);

        send = function(text){
            if(!text) return;
            if(text.toString().match(ACCESS_TOKEN)) return send('Нененененене');
            api.call('messages.send',{peer_id:msg.peer_id,message:text});
        }

        save = function(){
            fs.writeFile('chats/' + msg.peer_id + '.txt', JSON.stringify(getSettingsChat,null,'\t') ,  (err) => {
                if (err) throw err;
            });
        }

        api.call('users.get', {user_id:msg.from_id}, (err, response) => {
            fs.readFile('users/' + msg.from_id + '.txt', (err, data) => {
                if (err){
                    fs.writeFile('users/' + msg.from_id + '.txt', JSON.stringify(DefaultUserJSON(msg.from_id, response.response[0].first_name, response.response[0].last_name),null,'\t') ,  (err) => {
                        if (err) {
                            fs.mkdir('users', (err) => {
                                fs.writeFile('users/' + msg.from_id + '.txt', JSON.stringify(DefaultUserJSON(msg.from_id, response.response[0].first_name, response.response[0].last_name),null,'\t') ,  (err) => {
                                    if (err) throw err
                                });
                            })
                        }
                        //console.log('The file user has been saved!');
                        getSettingsUser = DefaultUserJSON(msg.from_id, response.response[0].first_name, response.response[0].last_name)
                    });
                } else {
                    getSettingsUser = JSON.parse(data.toString())
                }
                if(msg.id == 0){
                    fs.readFile('chats/' + msg.peer_id + '.txt', (err, data) => {
                        if (err){
                            fs.writeFile('chats/' + msg.peer_id + '.txt', JSON.stringify(DefaultChatJSON(msg.peer_id),null,'\t') ,  (err) => {
                                if (err) {
                                    fs.mkdir('chats', (err) => {
                                        fs.writeFile('chats/' + msg.peer_id + '.txt', JSON.stringify(DefaultChatJSON(msg.peer_id),null,'\t') ,  (err) => {
                                            if (err) throw err
                                        });
                                    })
                                }
                                getSettingsChat = DefaultChatJSON(msg.peer_id);
                                _cb(msg);
                            });
                        } else {
                            //console.log(data.toString());
                            getSettingsChat = JSON.parse(data.toString());
                            api.call('messages.getConversationMembers',{ peer_id:msg.peer_id }, (err, res) => {
                                //console.log(res);
                                if(err){
                                    iadmin = false;
                                    _cb(msg);
                                    return;
                                }
                                iadmin = true;
                                if(getSettingsChat.admins.indexOf(res.response.items.find(z => z.is_admin == true).member_id) == -1){
                                    getSettingsChat.admins.push(res.response.items.find(z => z.is_admin == true).member_id);
                                    getSettingsChat.whitelistUsers.push(res.response.items.find(z => z.is_admin == true).member_id)
                                    fs.writeFile('chats/' + msg.peer_id + '.txt', JSON.stringify(getSettingsChat,null,'\t') ,  (err) => {
                                        if (err) throw err;
                                    });
                                }
                                _cb(msg);
                            })
                        }
                    });
                } else {
                    iadmin = false;
                    getSettingsChat = DefaultChatJSON(msg.peer_id);
                    _cb(msg);
                }
            });  
        });
    });
}


listen(msg => {

    for(var i in checker.checks){
        checker.checks[i].func({msg: msg, getSettingsChat: getSettingsChat, getSettingsUser: getSettingsUser});
    }

    clearInterval(pingMeter.interval);
    msg.text = msg.text.replace(/\[club175696240\|@public175696240\](, |,| )/, '');
    if(testmode && msg.from_id != 280988144) return;
    if(msg.text.substr(0,getSettingsChat.keyCommand.length) != getSettingsChat.keyCommand && !msg.text.match(/keycomand/)) return;
    var c = bot.cmds.find(e => e.r.test(msg.text));
    if (!c) return;
    if(c.d.admin && msg.id != 0) return send('Эта команда может использоваться только в беседе');
    if(c.d.admin && !iadmin && admins.indexOf(`${msg.from_id}`) == -1) return send('Я не администратор');
    if(c.d.admin && admins.indexOf(`${msg.from_id}`) == -1 && getSettingsChat.admins.indexOf(`${msg.from_id}`) == -1) return send('У вас недостаточно прав');
    if(c.d.sec && admins.indexOf(`${msg.from_id}`) == -1) return;
    var args = msg.text.match(c.r) || [];
    args[0] = msg;
    c.f.apply(this, args);
})

fs.readdir(__dirname + '/vkbot_commands', (err, data) => {
    //console.log(data);
    for(var i in data){
        fs.readFile(__dirname + '/vkbot_commands/' + data[i], (err, dat) => {
            eval(dat.toString());
            //console.log(dat.toString());
        })
    }
})


const DefaultUserJSON = function(id, first_name, last_name){
    return {
        id: id,
        first_name: first_name,
        last_name: last_name,
        mathgame: {
            points : 0
        }
    }
}

const DefaultChatJSON = function(msg){
    return {
        welcome : false,
        welcomeMessage : 'undefined',
        admins : [],
        peer_id : msg.peer_id,
        chat_id : msg.peer_id - 2000000000,
        banned : [],
        muted : [],
        mathgame : {
            botvsall : false,
            botvsall_data : {},
            gamestart : false,
            pvp : false,
            pvp_game: {
                player1 : {},
                player2 : {},
                turn : true,
                pvpeshers : 'undefined'
            },
            accepted : false,
            acceptedall : false,
            answer : 'undefined',
            gamestarter : {}
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
        warn : [],
        keyCommand : '!'
    }
}

const userinfo = function(id){
    fs.readFile('users/' + id + '.txt',(err, data) => {
        if(err){
            api.call('users.get',{user_id:id},(err, res) => {
                getSettingsUser = {
                 type : 'user',
                 id : id,
                 first_name : res.response[0].first_name,
                 last_name : res.response[0].last_name,
                 mathgame : {
                  points : 0
                 }
                }

                fs.writeFile('users/' + id + '.txt', JSON.stringify(getSettingsUser) , 'utf8' , (e, da) => {
                    if(e) throw err
                })

                send(`id : ${getSettingsUser.id}\nИмя : ${getSettingsUser.first_name}\nФамилия : ${getSettingsUser.last_name}\nОчков : ${getSettingsUser.mathgame.points}\nМесто в топе : 0`)
                if(err){
                    send('Результатов не найдено');
                }
            })
        } else {
            fs.readFile('other/leaders.txt',(er, dat) => {
                var leaders = JSON.parse(dat);
                var inf = JSON.parse(data);
                send(`id : ${inf.id}\nИмя : ${inf.first_name}\nФамилия : ${inf.last_name}\nОчков : ${inf.mathgame.points}\nМесто в топе : ${leaders.indexOf(leaders.find(z => z.id == id)) + 1}`)
            })
        }
    })
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

function mathgame_moves(act){
    switch (act) {
        case 1:
            example = Math.round(Math.random() * (1000 - 1));
            example2 = Math.round(Math.random() * (1000 - 1));
            getSettingsChat.mathgame.answer = example + example2;
            save();
            send(example + ' + ' + example2);
            break;
        case 2:
            example = Math.round(Math.random() * (1000 - 600));
            example2 = Math.round(Math.random() * (400 - 1));
            for(;example2 >= example;example2 = Math.round(Math.random() * (400 - 1))){}
            getSettingsChat.mathgame.answer = example - example2;
            save();
            send(example + " - " + example2);
            break;
        case 3:
            example = Math.round(Math.random() * (50 - 1));
            example2 = Math.round(Math.random() * (9 - 1));
            getSettingsChat.mathgame.answer = (example * example2);
            save();
            send(example + " * " + example2);
            break;
        /*
        case 4:
            example = Math.round(Math.random() * (maxNum - 1));
            example2 = Math.round(Math.random() * (maxNum - 1));
            getSettingsChat.mathgame.answer = example / example2;
            save();
            msg.send(example + " / " + example2);
            break;
        */
        default:
            example = Math.round(Math.random() * (1000 - 1));
            example2 = Math.round(Math.random() * (1000 - 1));
            getSettingsChat.mathgame.answer = example + example2;
            save();
            send(example + ' + ' + example2);
            break;
        } // 1 = + , 2 = - , 3 = * , 4 = :
}

function mathgame_moves_pvp(act, pvpeshers){
    switch (act) {
        case 1:
            example = Math.round(Math.random() * (1000 - 1));
            example2 = Math.round(Math.random() * (1000 - 1));
            getSettingsChat.mathgame.answer = example + example2;
            save();
            send('Ходит ' + pvpeshers + ' : ' + example + ' \u002B ' + example2);
            break;
        case 2:
            example = Math.round(Math.random() * (1000 - 600));
            example2 = Math.round(Math.random() * (400 - 1));
            for(;example2 >= example;example2 = Math.round(Math.random() * (400 - 1))){}
            getSettingsChat.mathgame.answer = example - example2;
            save();
            send('Ходит ' + pvpeshers + ' : ' + example + " - " + example2);
            break;
        case 3:
            example = Math.round(Math.random() * (50 - 1));
            example2 = Math.round(Math.random() * (9 - 1));
            getSettingsChat.mathgame.answer = (example * example2);
            save();
            send('Ходит ' + pvpeshers + ' : ' + example + " * " + example2);
            break;
        /*
        case 4:
            example = Math.round(Math.random() * (maxNum - 1));
            example2 = Math.round(Math.random() * (maxNum - 1));
            getSettingsChat.mathgame.answer = example / example2;
            msg.send(example + " / " + example2);
            break;
        */
        default:
            example = Math.round(Math.random() * (1000 - 1));
            example2 = Math.round(Math.random() * (1000 - 1));
            getSettingsChat.mathgame.answer = example + example2;
            save();
            send('Ходит ' + pvpeshers + ' : ' + example + ' + ' + example2);
            break;
        } // 1 = + , 2 = - , 3 = * , 4 = :
}

function timeTranslate(time){
    var sec = +time ;
    var h = sec/3600 ^ 0 ;
    var m = (sec-h*3600)/60 ^ 0 ;
    var s = sec-h*3600-m*60 ;
    var time = (h<10?"0"+h:h)+" ч. "+(m<10?"0"+m:m)+" мин. "+(s<10?"0"+s:s)+" сек."
    return time;
}

console.log('Bot is running');