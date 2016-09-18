import Vue from 'vue'
import App from './App'
import Router from 'vue-router'
/* eslint-disable no-new */
import ArticleView from './components/ArticleView.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import categoryView from './components/categoryView.vue'
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
    }

})
router.beforeEach(function () {
  window.scrollTo(0, 0)
})

// router.redirect({
//   '*': '/article/list'
// })


router.start(App, 'app')
// new Vue({
//   el: 'body',
//   components: { App }
// })
