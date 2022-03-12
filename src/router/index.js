import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index/Index.vue'
import User from '../views/user/user.vue'
import news from '../views/news/news.vue'
import home from '../views/home/home.vue'
import article from '@/views/article/article'
import lease from '@/views/lease/lease'
import message from '@/views/message/message'

Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'Index',
		component: Index,
		redirect: '/home',
		children: [{
			path: '/home',
			name: 'home',
			component: home
		}, {
			path: '/user',
			name: 'User',
			component: User
		}, {
			path: '/news',
			name: 'news',
			component: news
		}, {
			path: '/lease',
			name: 'lease',
			component: lease
		}, {
			path: '/article',
			name: 'article',
			component: article
		}, {
			path: '/message',
			name: 'message',
			component: message
		}]
	},
	{
		path: '/about',
		name: 'about',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/AboutView.vue')
	}
]

const router = new VueRouter({
	routes
})

export default router