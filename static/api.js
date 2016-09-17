var api = new webRest([
  'POST /upload',
  'GET /article',
  'GET /article/:articleId',
  'POST /article',
  'PUT /article/:id',
  'GET /category',
  'GET /category/:categoryId/articles'
],{
  // host:'http://0.0.0.0:8000/',
  host:'http://180.76.132.102:19991/',
  promise:Promise,
  http:function(request){
    if (request.method === 'GET' && request.data) {
      var  queryString = [];
      for (var i in request.data) {
        var value = request.data[i];
        if (value === null) value = '';
        if (value === void 0) continue;
        queryString.push(encodeURIComponent(i) + '=' + encodeURIComponent(value));
      }
      if (queryString.length) {
        if (!~request.path.indexOf('?')) request.path += '?';
        if (!/[?&]$/.test(request.path)) request.path += '&';
        request.path += queryString.join('&');
      }
      delete request.data;
    }
    // function ajax(method, url, data) {
    //   var request = new XMLHttpRequest();
    //
    //   return new Promise(function (resolve, reject) {
    //     request.onreadystatechange = function () {
    //       if (request.readyState === 4) {
    //         if (request.status === 200) {
    //           resolve(JSON.parse(request.responseText));
    //         } else {
    //           reject(JSON.parse(request.responseText));
    //         }
    //       }
    //     };
    //     request.open(method, url);
    //     if () {
    //       request.setRequestHeader('Content-Type','application/json');
    //     }
    //     request.send(data);
    //
    //   });
    // }
    var headers = {'Content-Type':'application/json'}
    var parmas = {
      method:request.method,
      headers:headers,
      body:request.data
    }
    if (request.data instanceof FormData) {
      delete parmas.headers
    }


    return fetch(request.path,parmas);

  }
});
