const curriculumRouter = {
    route: null,
    name: null,
    title: '课表管理',
    type: 'folder', // 类型: folder, tab, view
    icon: 'iconfont icon-tushuguanli',
    filePath: 'view/curriculum/', // 文件路径
    order: null,
    inNav: true,
    children: [
      {
        title: '系统课表库',
        type: 'view',
        name: 'BookCreate',
        route: '/curriculum/sys_curriculum',
        filePath: 'view/curriculum/sys_curriculum.vue',
        inNav: true,
        icon: 'iconfont icon-tushuguanli',
      },
      {
        title: '用户自定义课表',
        type: 'view',
        name: 'BookCreate',
        route: '/book/list',
        filePath: 'view/book/book-list.vue',
        inNav: true,
        icon: 'iconfont icon-tushuguanli',
      },
      {
        title: '系统课表库修改',
        type: 'view',
        name: 'BookCreate',
        route: '/book/list',
        filePath: 'view/book/book-list.vue',
        inNav: true,
        icon: 'iconfont icon-tushuguanli',
      },
    ],
  }
  
  export default curriculumRouter