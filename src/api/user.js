import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/doLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/system/userinfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getRouters(token) {
  return request({
    url: '/system/menu/navigate',
    method: 'get',
    params: { token }
  })
}
