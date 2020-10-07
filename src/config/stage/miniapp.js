const miniappRouter = {
    route: null,
    name: null,
    title: '小程序内容管理',
    type: 'folder', // 类型: folder, tab, view
    icon: 'iconfont icon-tushuguanli',
    filePath: 'view/miniapp/', // 文件路径
    order: null,
    inNav: true,
    children: [
      {
        title: '静态资源上传',
        type: 'view',
        name: 'BookCreate',
        route: '/miniapp/fileupload',
        filePath: 'view/miniapp/fileupload.vue',
        inNav: true,
        icon: 'iconfont icon-tushuguanli',
      },
      {
        title: '首页轮播图',
        type: 'view',
        name: 'BookCreate',
        route: '/miniapp/indexbanner',
        filePath: 'view/miniapp/indexbanner.vue',
        inNav: true,
        icon: 'iconfont icon-tushuguanli',
      },
      {
        title: '文章管理',
        type: 'view',
        name: 'BookCreate',
        route: '/miniapp/article',
        filePath: 'view/miniapp/article.vue',
        inNav: true,
        icon: 'iconfont icon-tushuguanli',
      },
      {
        title: '文章编辑页面',
        type: 'view',
        name: 'BookCreate',
        route: '/miniapp/articleedit',
        filePath: 'view/miniapp/articleedit.vue',
        inNav: false,
        icon: 'iconfont icon-tushuguanli',
      },
      {
        title: '文章分类管理',
        type: 'view',
        name: 'BookCreate',
        route: '/miniapp/articlecategory',
        filePath: 'view/miniapp/articlecategory.vue',
        inNav: true,
        icon: 'iconfont icon-tushuguanli',
      }
    ],
  }
  
  export default miniappRouter