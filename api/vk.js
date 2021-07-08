const request = require('request');
var TS;


var VK = function(VERSION, ACCESS_TOKEN){
	var methods = [];
	function check(){
		var meths = methods.splice(0, 25);
		if(meths.length == 0) return;
		var length = meths.length <= 25 ? meths.length : 25;
		var code = `var a = [API.${meths[0].method}(${JSON.stringify(meths[0].data)})];` + (meths.length == 1 ? 'return a;' : '');
		for(var i = 1; i < length; i++){
			code += `a.push(API.${meths[i].method}(${JSON.stringify(meths[i].data)}));`;
		}
		if(meths.length > 1) code += 'return a;';
		var errors = 0;
	 var url = `https://api.vk.com/method/execute?code=${encodeURI(code).replace(/\+/g,'%2B').replace(/\//g,'%2F').replace(/\&/g,'%26')}&v=${VERSION}&access_token=${ACCESS_TOKEN}`
	 request(url, function (error, response, body) {
			if(error) {
			  console.log(error);
			  for(var i in meths){
				   meths[i].callback(error);
				 }
			} else {
			try{
				var res = JSON.parse(body);
				if(res.error){
				  console.log("url:" + url);
				  console.log("urlDecoded:" + decodeURI(url));
				  console.log("res: " + JSON.stringify(res));
				  for(var i in meths){
				    meths[i].callback(res.error);
				  }
				} else {
				for(var i = 0; i < res.response.length; i++){
					var err = (!res.response[i] && res.response[i].toString() != '0') ? {error: res.execute_errors[errors]} : null;
					var bod = (res.response[i] && res.response[i] != 0) ? {response: res.response[i]} : null;
					if(!res.response[i]) errors++;
					if(meths[i].callback) meths[i].callback(err, bod);
				}
				}
			} catch(err) {
				console.log(response);
				console.log(body);
				console.log(err);
			}
			}
		})
	}
	setInterval(check, 50);
	return {
		call: function(method, data, callback){
			methods.push({i: methods.length, method: method, data: data, callback: callback});
		},
		BotsLongPollListen: function(group_id, callback, call, blpl){
			var BotsLongPollListen = blpl || this.BotsLongPollListen;
			var call = call || this.call;
			call('groups.getLongPollServer', {group_id:group_id}, (err, res) => {
			  if(err) {
			    setTimeout(function(){
			      BotsLongPollListen(group_id, callback, call, BotsLongPollListen);
			    }, 60000);
			    return;
			  }
				request(`${res.response.server}?act=a_check&key=${res.response.key}&ts=${res.response.ts}&wait=25`, function (error, response, body){
					callback(JSON.parse(body));
					BotsLongPollListen(group_id, callback, call, BotsLongPollListen);
				})
			})
		}
	}
}

var Constructor = function(data){
	if(!data.access_token){
		console.error('Access_token required');
		return;
	}
	var ACCESS_TOKEN = data.access_token;
	var VERSION = data.version || 5.81;
	return VK(VERSION, ACCESS_TOKEN);
}

exports.Constructor = Constructor;