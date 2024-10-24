import request from '@/utils/request'

// 查询信息查询列表
export function listUsers(query) {
  return request({
    url: '/housdata/users/list',
    method: 'get',
    params: query
  })
}

// 查询信息查询详细
export function getUsers(id) {
  return request({
    url: '/housdata/users/' + id,
    method: 'get'
  })
}

// 新增信息查询
export function addUsers(data) {
  return request({
    url: '/housdata/users',
    method: 'post',
    data: data
  })
}

// 修改信息查询
export function updateUsers(data) {
  return request({
    url: '/housdata/users',
    method: 'put',
    data: data
  })
}

// 删除信息查询
export function delUsers(id) {
  return request({
    url: '/housdata/users/' + id,
    method: 'delete'
  })
}
