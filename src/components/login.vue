<template lang="html">
  <div class="container">
    <div class="row">
      <div class="col-sm-6 offset-sm-3 form-box">
        <div class="form-top">
          <div class="form-top-left">
            <h3>Login to Sakura</h3>
            <p>Enter username and password to log in:</p>
          </div>
          <div class="form-top-right">
            <i class="fa fa-key"></i>
          </div>
        </div>
        <div class="form-bottom">
          <form role="form" action="" method="post" class="login-form">
            <div class="form-group">
              <label class="sr-only" for="form-username">Username</label>
              <input type="text" name="form-username" placeholder="Username..."
              class="form-username form-control" v-model="username">
            </div>
            <div class="form-group">
              <label class="sr-only" for="form-password">Password</label>
              <input type="password" name="form-password"
              placeholder="Password..." class="form-password form-control"
              v-model="password">
            </div>
            <button type="button" class="btn" @click="login">Sign in!</button>
          </form>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import MessageBox from "vue-msgbox"
export default {
  data() {
    return {
      username:"",
      password:""
    };
  },
  computed: {

  },
  ready() {
  },
  attached() {},
  methods: {
    login(){
      let a = {username:this.username,password:this.password}
      a = JSON.stringify(a)
      api.login.post(a).then((info)=>{
        if(info.ok){
          info.json().then((data)=>{
            if(data.message){
              MessageBox({
                message: data.message,
                type: 'error'
              })
            }else {
              let timestamp=new Date().getTime();
              let stimes=new Date(data.server_time).valueOf()-timestamp
              let cookieVal = data.access_token+"$$"+data.refresh_token+"$$"+
              data.mac_key+"$$"+data.user_id+"$$"+stimes;
              this.setCookie('login_access',cookieVal,0.5)
              this.setCookie('user_id',data.user_id,0.5)
              MessageBox({
                message: "login success",
                type: 'success',
              }).then((action)=>{
                this.$route.router.go('/article/list')
              })
            }

          })
        }
      })
    },
    setCookie:(cname, cvalue, ehours)=> {
      let d = new Date();
      d.setTime(d.getTime() + (ehours*60*60*1000));
      let expires = "expires="+d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    }
  },
  components: {}
};
</script>

<style lang="css">
.form-box {
  margin-top: 35px;
}
.form-top {
  overflow: hidden;
  padding: 0 25px 15px 25px;
  background: #ccc;
  -moz-border-radius: 4px 4px 0 0; -webkit-border-radius: 4px 4px 0 0; border-radius: 4px 4px 0 0;
  text-align: left;
}

.form-top-left {
  float: left;
  width: 75%;
  padding-top: 25px;
}

.form-top-right {
  float: left;
  width: 25%;
  padding-top: 5px;
  font-size: 66px;
  color: #ddd;
  line-height: 100px;
  text-align: right;
}
.form-bottom {
  padding: 25px 25px 30px 25px;
  background: #eee;
  -moz-border-radius: 0 0 4px 4px; -webkit-border-radius: 0 0 4px 4px; border-radius: 0 0 4px 4px;
  text-align: left;
}

.form-bottom form textarea {
  height: 100px;
}

.form-bottom form button.btn {
  width: 100%;
}

.form-bottom form .input-error {
  border-color: #4aaf51;
}
</style>
