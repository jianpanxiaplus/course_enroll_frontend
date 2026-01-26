import Vue from 'vue'
import Router from 'vue-router'

// 懒加载组件（推荐，提升首屏速度）
// const Login = () => import('@/views/Login.vue')
// const HomePage = () => import('@/views/HomePage.vue')
const CourseManage = () => import('@/views/CourseManage.vue')
const ParentCourseView = () => import('@/views/ParentCourseView.vue')
const MyEnrollments = () => import('@/views/MyEnrollments.vue')
const CourseDetail = () => import('@/views/CourseDetail.vue')

Vue.use(Router)

const router = new Router({
    mode: 'hash', // Vue2 项目常用 hash 模式，无需后端支持
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/courses',
            name: 'CourseManage',
            component: CourseManage,
        },
        {
            path: '/coursesView',
            name: 'ParentCourseView',
            component: ParentCourseView,
        },
        {
            path: '/myEnrollments',
            name: 'MyEnrollments',
            component: MyEnrollments
        },
        {
            path: '/course/detail/:id',
            name: 'CourseDetail',
            component: CourseDetail,
            props: true // 允许将 route.params 作为 props 传入
        },
        // {
        //     path: '/',
        //     redirect: '/login' // 默认跳转到登录页
        // },
        // {
        //     path: '/login',
        //     name: 'Login',
        //     component: Login,
        //     meta: { public: true } // 标记为无需登录
        // },
        // {
        //     path: '/homePage',
        //     name: 'HomePage',
        //     component: HomePage,
        //     children: [
        //         {
        //             path: 'courses',
        //             name: 'CourseManage',
        //             component: CourseManage
        //         }
        //         // 可在此添加其他子页面，如 /homePage/enrollments
        //     ]
        // },
        // {
        //     path: '*',
        //     redirect: '/home' // 未匹配路径重定向到登录
        //     // redirect: '/login' // 未匹配路径重定向到登录
        // },
    ]
})

// 全局前置守卫：校验登录状态
// router.beforeEach((to, from, next) => {
//     const token = localStorage.getItem('token')
//     const isPublic = to.meta.public
//
//     if (!isPublic && !token) {
//         // 需要登录但未登录 → 跳转登录页
//         next('/login')
//     } else {
//         next()
//     }
// })

export default router