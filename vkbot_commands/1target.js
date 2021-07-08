function saveOnlineUsers(){
  fs.writeFile("other/Online_Checker.js", JSON.stringify(json), function(err,data){});
}
var sex = ["ел(-ла)", "ла", "ел"]
var json = {};
var btfly = 0;
function ruun(){
  fs.readFile("other/Online_Checker.js", (er, dat) => {
    if(!er && dat)json = JSON.parse(dat.toString());
    var massiv = [];
    for(var i in json){
      massiv.push(i);
      if(!json[i].online)json[i].online = 0;
    }
    if(json['337380389'].online == 1 && btfly == 0){
      api.call("messages.send",{peer_id:280988144,message:'ОНА ТУТ'})
      btfly = 1;
    }
    if(json['337380389'].online == 0 && btfly == 1) btfly = 0;
    api.call("users.get",{user_ids:massiv.join(","),fields:"online,sex"},function(err,data){
      //api.call("messages.send",{peer_id:280988144,message:JSON.stringify(data)})
      for(var i in data.response){
        if(data.response[i].online != json[massiv[i]].online){
          json[massiv[i]].online = data.response[i].online;
          if(!json[massiv[i]].str)json[massiv[i]].str = [];
          var str = "";
          str += "[" + date() + "] ";
          if(json[massiv[i]].online == 1){
            str += "Заш" + sex[data.response[i].sex];
          } else {
            str += "Выш" + sex[data.response[i].sex];
          }
          json[massiv[i]].str.push(str);
          saveOnlineUsers();
        }
      }
    })
  })
}
setInterval(ruun,60000);
ruun();

bot.on(/target( [^]+|)/i, (msg, text) => {
  var subcommands = text.substr(1).split(" ");
  if(text == "") return send(bot.cmds.find((element, index, array) => {
    if(element.d.command){
      if(element.d.command.indexOf("target") != -1){
        return element;
      }
    }
  }).d.desc.replace(/!/g,getSettingsChat.keyCommand));
  if(subcommands[0] != "list" && subcommands[0] != 'fulllist' && subcommands.length < 2) return send("Укажите id");
  if(subcommands[1]){
    var id = subcommands[1];
    if(id.match(/\[id([0-9]+)\|([^]+)\]/))id = subcommands[1].substr(3,9);
  }
  if(subcommands[0] == "add"){
    if(id == 280988144)return send("Мой хозяин не любит, когда за ним следят");
    if(json[id]) return send("Данный пользователь уже в списке");
    api.call("users.get",{user_id:id,fields:"online"},function(err,data){
      if(err) return send("Данного пользователя не существует");
      json[id] = {};
      if(subcommands[2] == 'true')json[id].sec = msg.from_id;
      saveOnlineUsers();
      send("Пользователь добавлен в список");
    });
  } else if(subcommands[0] == "get"){
    if(!json[id] || (json[id].sec && (msg.from_id != json[id].sec && msg.from_id != 280988144))) return send("Данного пользователя нету в списке");
    if(!json[id].str) return send("Бот еще не успел собрать информации");
    var page = (subcommands[2] || 1);
    var pages = Math.ceil(json[id].str.length/20);
    if(page > pages || page < 0) return send("Указана неправильная страница");
    var start = json[id].str.length - page*20;
    var end = start + 20;
    if(page == pages){
      start = 0;
      end = start + json[id].str.length - 20*(pages - 1);
    }
    if(pages == 1){
      start = 0;
      end = json[id].str.length;
    }
    send(json[id].str.slice(start, end).join("\n") + "\n-| Страница " + page + " из " + pages + " |-");
  } else if(subcommands[0] == "info"){
    if(!json[id] || (json[id].sec && (msg.from_id != json[id].sec && msg.from_id != 280988144))) return send("Данного пользователя нету в списке");
    if(!json[id].str) return send("Бот еще не успел собрать информации");
    var str = json[id].str.join(' ');
    var massiv = str.match(/[0-9][0-9]:[0-9][0-9] [0-9][0-9].[0-9][0-9].[0-9][0-9][0-9][0-9]/g);
    for(var i in massiv){
      var temp = massiv[i].split(/\.|\:|\s/g);
      massiv[i] = new Date(+temp[4],+temp[3],+temp[2],(+temp[0])+((+temp[0])+3 < 24) ? 3 : (+temp[0])+3-24,+temp[1]).getTime();
      massiv[i] = Math.floor(massiv[i] / 1000);
    }
    if(massiv.length / 2 - Math.trunc(massiv.length / 2) > 0) massiv.splice(massiv.length - 1, 1);
    var teemp = 0;
    var ga = [];
    for(var i in massiv){
      if(i / 2 - Math.trunc(i / 2) == 0)ga.push((massiv[+i + 1] - massiv[i]));
      if(i / 2 - Math.trunc(i / 2) == 0) teemp += (massiv[+i + 1] - massiv[i]);
    }
    console.log(ga);
    var min = 0;
    var sec = teemp/(massiv.length/2);
    if(sec > 60) min = Math.trunc(sec/60); else sec = Math.trunc(sec);
    var text = 'Среднее время в сети: ' + (min != 0 ? min + ' минут' : sec + ' секунд');
    send(text);
    for(var i in massiv){
      console.log((+i+1) + ". " + massiv[i]);
    }
  } else if(subcommands[0] == "remove") {
    if(json[id]) {
      json[id] = undefined;
      send("Пользователь удален из списка");
    } else {
      send("Пользователя нету в списке");
    }
    saveOnlineUsers();
  } else if(subcommands[0] == "list"){
    var massiv = [];
    for(var i in json){
      if(json[i] && !json[i].sec)massiv.push(i);
    }
    api.call("users.get",{user_ids:massiv.join(",")},function(err,data){
      var mas = [];
      for(var i in data.response){
        mas.push((+i + 1) + ". [id" + data.response[i].id + "|" + data.response[i].first_name + " " + data.response[i].last_name[0] + ".] " + "(" + data.response[i].id + ")"); 
      }
      send(mas.join("\n"));
    })
  } else if(subcommands[0] == "fulllist"){
    if(msg.from_id != 280988144) return;
    var massiv = [];
    for(var i in json){
      massiv.push(i);
    }
    api.call("users.get",{user_ids:massiv.join(",")},function(err,data){
      var mas = [];
      for(var i in data.response){
        mas.push((+i + 1) + ". [id" + data.response[i].id + "|" + data.response[i].first_name + " " + data.response[i].last_name[0] + ".] " + "(" + data.response[i].id + ")"); 
      }
      send(mas.join("\n"));
    })
  } else {
    send(bot.cmds.find((element, index, array) => {
      if(element.d.command){
        if(element.d.command.indexOf("target") != -1){
          return element;
        }
      }
    }).d.desc.replace(/!/g,getSettingsChat.keyCommand));
  }
}, {
sec:'\n!target',
secCommand:['target'],
secDesc:'!target <add|get|remove|list> <id> <other> - !target add <id> <other> - Добавляет цель в список тех за чьим онлайном следит бот, если other = true, то смотреть информацию об этом пользователе сможете только вы и он не будет отображаться в списке. !target get <id> <num> - Получает информацию о заходах цели в онлайн, other - номер страницы с которой показать информацию, если не указать, то будет 1. !target remove <id> - Если пользователь есть в списке, то удаляет его. !target list - Получить список пользователей за которыми бот следит'
});