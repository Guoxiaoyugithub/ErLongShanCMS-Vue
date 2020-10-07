import adminConfig from './admin'
import miniappConfig from './miniapp'
import curriculumConfig from './curriculum'
import pluginsConfig from './plugin'
import Utils from '@/lin/util/util'

// eslint-disable-next-line import/no-mutable-exports
let homeRouter = [
  {
    title: '林间有风',
    type: 'view',
    name: Symbol('about'),
    route: '/about',
    filePath: 'view/about/about.vue',
    inNav: true,
    icon: 'iconfont icon-iconset0103',
    order: 1,
  },
  {
    title: '服务监控',
    type: 'view',
    name: Symbol('servermoniter'),
    route: '/servermoniter',
    filePath: 'view/servermoniter/servermoniter.vue',
    inNav: true,
    icon: 'iconfont icon-iconset0103',
    order: 1,
  },
  {
    title: '日志管理',
    type: 'view',
    name: Symbol('log'),
    route: '/log',
    filePath: 'view/log/log.vue',
    inNav: true,
    icon: 'iconfont icon-rizhiguanli',
    order: 2,
    permission: ['查询所有日志'],
  },
  {
    title: '客户端用户管理',
    type: 'view',
    name: Symbol('usermanage'),
    route: '/usermanage',
    filePath: 'view/usermanage/usermanage.vue',
    inNav: true,
    icon: 'iconfont icon-rizhiguanli',
    order:2
  },
  {
    title: '校园导览',
    type: 'view',
    name: Symbol('schoolnav'),
    route: '/schoolnav',
    filePath: 'view/schoolnav/schoolnav.vue',
    inNav: true,
    icon: 'iconfont icon-iconset0103',
    order: 3,
  },
  {
    title: '校园电话簿',
    type: 'view',
    name: Symbol('phonebook'),
    route: '/phonebook',
    filePath: 'view/phonebook/phonebook.vue',
    inNav: true,
    icon: 'iconfont icon-rizhiguanli',
    order: 4,
  },
  curriculumConfig,
  {
    title: '个人中心',
    type: 'view',
    name: Symbol('center'),
    route: '/center',
    filePath: 'view/center/center.vue',
    inNav: true,
    icon: 'iconfont icon-rizhiguanli',
  },
  {
    title: '404',
    type: 'view',
    name: Symbol('404'),
    route: '/404',
    filePath: 'view/error-page/404.vue',
    inNav: false,
    icon: 'iconfont icon-rizhiguanli',
  },
  miniappConfig,
  adminConfig,
  
]

const plugins = [...pluginsConfig]

// 筛除已经被添加的插件
function filterPlugin(data) {
  if (plugins.length === 0) {
    return
  }
  if (Array.isArray(data)) {
    data.forEach(item => {
      filterPlugin(item)
    })
  } else {
    const findResult = plugins.findIndex(item => data === item)
    if (findResult >= 0) {
      plugins.splice(findResult, 1)
    }
    if (data.children) {
      filterPlugin(data.children)
    }
  }
}

filterPlugin(homeRouter)

homeRouter = homeRouter.concat(plugins)

// 处理顺序
homeRouter = Utils.sortByOrder(homeRouter)

// 使用 Symbol 处理 name 字段, 保证唯一性
const deepReduceName = target => {
  if (Array.isArray(target)) {
    target.forEach(item => {
      if (typeof item !== 'object') {
        return
      }
      deepReduceName(item)
    })
    return
  }
  if (typeof target === 'object') {
    if (typeof target.name !== 'symbol') {
      // eslint-disable-next-line no-param-reassign
      target.name = target.name || Utils.getRandomStr()
      // eslint-disable-next-line no-param-reassign
      target.name = Symbol(target.name)
    }

    if (Array.isArray(target.children)) {
      target.children.forEach(item => {
        if (typeof item !== 'object') {
          return
        }
        deepReduceName(item)
      })
    }
  }
}

deepReduceName(homeRouter)

export default homeRouter
