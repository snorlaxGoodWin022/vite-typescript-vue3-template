import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
 import { ElMessage } from 'element-plus';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// import.meta.glob 为 vite 提供的特殊导入方式
// 它可以将模块中全部内容导入并返回一个Record对象
// 默认为懒加载模式 加入配置项 eager 取消懒加载
const modules: Record<string, any> = import.meta.glob(['./modules/*.ts'], {
  eager: true,// 立即加载，而非动态 import
});

const routes: Array<RouteRecordRaw> = [];

// 将路由全部导入数组
Object.keys(modules).forEach((key) => {
  routes.push(modules[key].default);
});

//导入生成的路由数据
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach(async (_to, _from, next) => {
   // 可在此处添加权限校验、登录状态检查等逻辑
  next()
});

// 全局后置钩子
router.afterEach((_to) => {
  NProgress.done();
});

export default router;