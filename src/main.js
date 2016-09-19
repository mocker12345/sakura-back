import Vue from 'vue'
import App from './App'
import Router from 'vue-router'
/* eslint-disable no-new */
import ArticleView from './components/ArticleView.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import categoryView from './components/categoryView.vue'
import login from './components/login.vue'
import 'whatwg-fetch'
import fetchIntercept from 'fetch-intercept'
Vue.use(Router)

var router = new Router()

router.map({
  '/article/list':{
    component: ArticleView
  },
  '/':{
    component:ArticleView
  },
  '/article/add':{
    component:ArticleEdit
  },
  '/article/edit/:articleId':{
    component:ArticleEdit
  },
  '/category':{
    component:categoryView
  },
  '/login':{
    component:login
  }

})
router.beforeEach(function () {
  window.scrollTo(0, 0)
})

// router.redirect({
//   '*': '/article/list'
// })


router.start(App, 'app')

const getAuthHeader = (url, method,access_token,mac_key,nonce)=>{
  var strAuth = "MAC id=\"" + access_token + "\",nonce=\"";
  strAuth += nonce + "\",mac=\"";
  var i = url.indexOf('/',7);
  var host = "180.76.132.102:19991";
  var path = url.substring(i);
  path=path.replace("/"+host,"");
  var request_content = nonce + '\n' + method + '\n' + path + '\n' +host+'\n';
  var hash = CryptoJS.HmacSHA256(request_content, mac_key);
  var mac = hash.toString(CryptoJS.enc.Base64);strAuth += mac+"\"";
  return strAuth;
}

const generateMixed = (n)=>{
  var chars = ['0','1','2','3','4','5','6','7','8','9',
  'A','B','C','D','E','F','G','H','I','J','K','L','M',
  'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  var res = "";
  for(var i = 0; i < n ; i ++) {
    var id = Math.ceil(Math.random()*35);res += chars[id];
  }
  return res;
}

const getCookie =(objname)=>{//获取指定名称的cookie的值
  var arrstr = document.cookie.split("; ");
  for(var i = 0;i < arrstr.length;i ++){
    var temp = arrstr[i].split("=");
    if(temp[0] == objname) return unescape(temp[1]);
  }
}

const unregister = fetchIntercept.register({
  request: function (url, config) {
    // Modify the url or config here
    var host = '180.76.132.102:19991';

    var authCookie = getCookie('login_access')
    debugger;
    if(authCookie == undefined){
      router.go('/login')
    }else {
      debugger;
      // config.headers['Authorization'] =
      var uc_arr=authCookie.split("$$");
      var stimes = uc_arr[4];
      var timestamp=new Date().getTime()+parseInt(stimes);
      var nonce=timestamp+":"+generateMixed(8);
      var access_token=uc_arr[0];
      var mac_key=uc_arr[2];
      var header = getAuthHeader(url, config.method,access_token,mac_key,nonce)
      debugger;
      config.headers['Authorization'] = header
    }

    return [url, config];
  },

  requestError: function (error) {
    // Called when an error occured during another 'request' interceptor call
    return Promise.reject(error);
  },

  response: function (response) {
    // Modify the reponse object
    return response;
  },

  responseError: function (error) {
    // Handle an fetch error
    return Promise.reject(error);
  }
});

// new Vue({
//   el: 'body',
//   components: { App }
// })
