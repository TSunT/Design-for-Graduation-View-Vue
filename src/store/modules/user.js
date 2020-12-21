import { login, logout, getInfo, getRouters } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  INIT_ROUTERS(state, data) {
    state.routes = data
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { obj } = response
        commit('SET_TOKEN', obj.access_token)
        setToken(obj.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { obj } = response

        if (!obj) {
          return reject('Verification failed, please Login again.')
        }

        const { username, avatar } = obj
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        resolve(obj)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  initRouters({ commit }) {
    return new Promise((resolve, reject) => {
      getRouters(state.token).then((resp) => {
        var resproutes = formatRoutes(resp.obj)
        console.log(resproutes)
        commit('INIT_ROUTERS', resproutes)
        resolve(resproutes)
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
      console.log('fmroutes len: ' + fmRoutes.length + ' route: ' + fmRouter.path + 'child: ' + fmRouter.children)
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

