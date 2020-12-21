import { getRouters } from '@/api/user'
const getDefaultState = () => {
  return {
    routes: []
  }
}
const state = getDefaultState()
const mutations = {
  INIT_ROUTERS(state, data) {
    state.routes = data
  }
}
const actions = {
  initRouters({ commit }) {
    return new Promise((resolve, reject) => {
      getRouters(state.token).then((resp) => {
        var resproutes = formatRoutes(resp.obj)
        console.log('formate:' + resproutes)
        commit('INIT_ROUTERS', resproutes)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export const formatRoutes = (routes) => {
  const fmRoutes = []
  routes.forEach(router => {
    var {
      path,
      component,
      name,
      children
    } = router
    // let childrenarry =[];
    // if (children && children instanceof Array) {
    //   childrenarry.push(formatRoutes(children))
    // }
    if (children && children instanceof Array) {
      children = formatRoutes(children)
    }
    if (!(path === null && path.length === 0)) {
      const fmRouter = {
        path: path,
        name: name,
        children: children,
        component: (resolve) => {
          if (component.startsWith('Home')) {
            require(['../../components/' + component + '.vue'], resolve)
          } else if (component.startsWith('Admin')) {
            require(['../../views/Admin/' + component + '.vue'], resolve)
          }
        }
      }
      if (fmRouter.path === '/') {
        // alert('fmroutes path null: ' + fmRoutes.length + ' route: ' + fmRouter.path + ' child: ' + fmRouter.children)
      } else {
        fmRoutes.push(fmRouter)
      }
      // console.log('fmroutes len: ' + fmRoutes.length + ' route: ' + fmRouter.path + 'child: ' + fmRouter.children)
    }
  })
  return fmRoutes
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
