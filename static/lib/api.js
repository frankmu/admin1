API = new Object();
//API.queue = new Object();
API.uuid = function(){return("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(d){var b=Math.random()*16|0,a=d=="x"?b:(b&3|8);return a.toString(16)}))}

API.get = function(method, authed, onErr, onSuc) {
	var reqObj={
		type:'GET',
		url: CONF['api-host']+'/'+method,
		success: function(res){
			onSuc(res);
		}
	}
	
	reqObj.beforeSend = function(xhr) {
		if (authed) {
		  xhr.setRequestHeader('Authorization','Basic ZGFuaGFrOndlYmkyMDEyIQ==');
		}
	}
	$.ajax(reqObj);
}

/*
API.get = function(method, authed, onErr, onSuc) {
  var id = API.uuid();
  var reqObj = {
    id: id,
    type: 'GET',
    cache: false,
    method: method,
    authed: authed,
    url: CONF['api-host']+'/'+method,
    success: function(res) {
      if (typeof res=='string') {res = JSON.parse(res)};
      delete API.queue[id];
      onSuc(res);
    },
    error: onErr
  }
  reqObj.beforeSend = function(xhr) {
    if (authed) {
      xhr.setRequestHeader('Authorization', 'Basic '+btoa(Main.Login.creds.user+':'+Main.Login.creds.password));
    }
    xhr.setRequestHeader('X-WebiTap-requestID', reqObj.id);
  }
  API.queue[reqObj.id] = reqObj;
  $.ajax(reqObj);
}
*/

API.post = function(method, body, authed, onErr, onSuc) {
	var reqObj={
		type:'POST',
		data: JSON.stringify(body),
		url: CONF['api-host']+'/'+method,
		success: function(res){
			if (onSuc) {onSuc(res)};
		}	
	}
	
	reqObj.beforeSend = function(xhr) {
		if (authed) {
		  xhr.setRequestHeader('Authorization','Basic ZGFuaGFrOndlYmkyMDEyIQ==');
		}
	}
	
	$.ajax(reqObj);

}
/*
API.post = function(method, body, authed, onErr, onSuc) {
  var id = API.uuid();
  var reqObj = {
    id: id,
    type: 'POST',
    cache: false,
    data: JSON.stringify(body),
    method: method,
    authed: authed,
    url: CONF['api-host']+'/'+method,
    success: function(res) {
      try {
        res = JSON.parse(res);
      } catch(err) {};
      delete API.queue[id];
      if (onSuc) {onSuc(res)};
    },
    error: onErr
  }
  if (authed) {
    reqObj.beforeSend = function(xhr) {
      xhr.setRequestHeader('X-WebiTap-requestID', reqObj.id);
      xhr.setRequestHeader('Authorization', 'Basic '+btoa(Main.Login.creds.user+':'+Main.Login.creds.password));
    }
  } else {
    xhr.setRequestHeader('X-WebiTap-requestID', reqObj.id);
  }
  API.queue[reqObj.id] = reqObj;
  $.ajax(reqObj);
}
*/

API.logError = function(err) {
  console.log(err.status);
}
