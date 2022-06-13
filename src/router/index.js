import Vue from "vue";
import Router from "vue-router";
import { Layout, Content } from "../layout"; // 页面整体布局
import { topRouterMap } from "./topRouter";

Vue.use(Router)
function filterTopRouterMap(name) {
  let router = topRouterMap.find((item) => {
    return item.parentName === name;
  });
  return router.data; // arr
}

/**
 * 1、roles:后台返回的权限结构;
 *
 */
//手动跳转的页面白名单
const whiteList = ["./"];
/**
 * path:''与path:'*'的区别：
 * 1、path:'*', 会匹配所有路径
 * 2、path:''，也是会匹配到路由
 *
 */

//默认不需要权限的页面
export const constantRouterMap = [
  {
    path: "",
    component: Layout,
    redirect: "/index/index",
    hidden: true,
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/page/login"),
    hidden: true,
  },
  {
    path: "/regist",
    component: () => import("@/page/regist"),
    hidden:true,
  },
  {
    path: "/404",
    component: () => import("@/page/errorPage/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/page/errorPage/401"),
    hidden: true,
  },
  {
    path: "/index",
    name: "index",
    component: Layout,
    meta: {
      title: "首页",
      icon: "icondashboard",
    },
    noDropdown: true,
    children: [
      {
        path: "index",
        meta: {
          title: "首页",
          icon: "icondashboard",
          routerType: "leftmenu",
        },
        component: () => import("@/page/index/index"),
      },

    ],
  },
];

export default new Router({
  // mode: "history", // 默认为'hash'模式
  base: "/satellite-vue/#/", // 添加跟目录,对应服务器部署子目录
  routes: constantRouterMap,
});

//异步路由（需要权限的页面）
export const asyncRouterMap = [
  {
    path: '/screen',
    name: "screen",
    
    meta: {
      title: "数据大屏",
      icon: "iconinfo",
    },
    component: Layout,
    noDropdown: true,
    hidden: true,
    children: [
      {
        path: "errorDispose",
        meta: {
          title: "数据大屏",
          icon: "iconinfo",
          routerType: "leftmenu",
        },
        component: (resolve) => require(['@/page/system/screen/index'], resolve),
      },

    ],
  },
  {
    path: "/dataStatistics",
    name: "dataStatistics",
    meta: {
      title: "数据统计",
      icon: "iconinfo",
    },
    component: Layout,
    children: [
      {
        path: "SucceedJob",
        name: "SucceedJob",
        meta: {
          title: "成功任务统计",
          icon: "iconinfo",
          routerType: "leftmenu",
        },
        component: () => import("@/page/data-statistics/SucceedJob"),
      },
      {
        path: "ErrorJob",
        name: "ErrorJob",
        meta: {
          title: "错误任务统计",
          icon: "iconinfo",
          routerType: "leftmenu",
        },
        component: () => import("@/page/data-statistics/ErrorJob"),
      },
    ],
  },
  {
    path: "/dataVisual",
    name: "dataVisual",
    meta: {
      title: "全流程可视化",
      icon: "iconecharts",
    },
    component: Layout,
    noDropdown: true,
    redirect: "/dataVisual/dataDispose",
    children: [
      // {
      //   path: "nodeJob",
      //   name: "nodeJob",
      //   meta: {
      //     title: "节点任务可视化",
      //   },
      //   component: () => import("@/page/data-visual/NodeJob"),
      // },
      {
        path: "dataDispose",
        name: "dataDispose",
        meta: {
          title: "数据处理可视化",
        },
        component: () => import("@/page/data-visual/DataDispose"),
      },
      // {
      //   path: "pushData",
      //   name: "pushData",
      //   meta: {
      //     title: "省份数据推送可视化",
      //   },
      //   component: () => import("@/page/data-visual/PushData"),
      // },
    ],
  },
  // {
  //   path: "/errorDispose",
  //   name: "errorDispose",
  //   component: Layout,
  //   meta: {
  //     title: "错误处理",
  //     icon: "iconinfo",
  //   },
  //   noDropdown: true,
  //   children: [
  //     {
  //       path: "errorDispose",
  //       meta: {
  //         title: "错误处理",
  //         icon: "iconinfo",
  //         routerType: "leftmenu",
  //       },
  //       component: () => import("@/page/dispose/ErrorDispose"),
  //     },

  //   ],
  // },
  // 数据分析
  {
    path: '/dataAnalysis',
    name: 'dataAnalysis',
    meta: {
      title: "数据分析",
      icon: "iconecharts",
    },
    component: Layout,
    redirect: '/dataAnalysis/processTime',
    children: [
      {
        path: "clusterStatus",
        name: "clusterStatus",
        meta: {
          title: "集群整体状态",
        },
        component: () => import("@/page/data-analysis/ClusterStatus"),
      },
      {
        path: "nodeStatus",
        name: "nodeStatus",
        meta: {
          title: "节点状态",
        },
        component: () => import("@/page/data-analysis/NodeStatus"),
      },
      {
        path: "processTime",
        name: "processTime",
        meta: {
          title: "任务处理时间",
        },
        component: () => import("@/page/data-analysis/ProcessTime"),
      },
      {
        path: "successRate",
        name: "successRate",
        meta: {
          title: "任务成功率",
        },
        component: () => import("@/page/data-analysis/SuccessRate"),
      },
    ]
  },
  {
    path: "/config",
    name: "config",
    meta: {
      title: "程序配置",
      icon: "iconpermission",
      roles: ["admin", "editor"], // you can set roles in root nav
    },
    component: Layout,
    redirect: "/config/page",
    children: [
      {
        path: "nodeConfig",
        name: "nodeConfig",
        meta: {
          title: "节点信息配置",
          roles: ["admin"], // or you can only set roles in sub nav
        },
        component: () => import("@/page/system-config/NodeConfig"),
      },
      {
        path: "provinceConfig",
        name: "provinceConfig",
        meta: {
          title: "省份信息配置",
          roles: ["admin"],
        },
        component: () => import("@/page/system-config/ProvinceConfig"),
      },
      {
        path: "satelliteConfig",
        name: "satelliteConfig",
        meta: {
          title: "卫星配置",
          roles: ["admin"],
        },
        component: () => import("@/page/system-config/SatelliteConfig"),
      },
      {
        path: "stepConfig",
        name: "stepConfig",
        meta: {
          title: "处理步骤配置",
          roles: ["admin"],
        },
        component: () => import("@/page/system-config/StepConfig"),
      },
      // {
      //   path: "userManagement",
      //   name: "userManagement",
      //   meta: {
      //     title: "用户信息配置",
      //     roles: ["admin"],
      //   },
      //   component: () => import("@/page/system-config/UserManagement"),
      // },
    ],
  },
  
  { path: "*", redirect: "/404", hidden: true },
];

/**
 *  路由设置要求：
 * 1、该路由有子菜单,可以设置多层嵌套路由children;如果没有子菜单,不需要设置children;通过item.children.length来判断路由的级数;
 * 2、登录成功后,定位到系统首页时,需要加载页面整体布局组件Layout并进行子路由定向加载;
 *
 * 按需加载路由组件的2种方法：
 * 1、component: () => import('@/page/login')
 * 2、component:resolve => require(['@/page/fundPosition'], resolve)
 *
 *
 *
 * 什么情况下，路由会定位到404页面?
 * 路由中redirect:'',不起作用？
 * 三级子菜单要在顶部展示？
 *
 *
 *
 */
