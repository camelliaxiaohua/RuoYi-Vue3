import request from '@/utils/request'

// 查询用户身份标识列表
export function listDatas(query) {
  return request({
    url: '/housdata/datas/list',
    method: 'get',
    params: query
  })
}

// 查询用户身份标识详细
export function getDatas(identityId) {
  return request({
    url: '/housdata/datas/' + identityId,
    method: 'get'
  })
}

// 新增用户身份标识
export function addDatas(data) {
  return request({
    url: '/housdata/datas',
    method: 'post',
    data: data
  })
}

// 修改用户身份标识
export function updateDatas(data) {
  return request({
    url: '/housdata/datas',
    method: 'put',
    data: data
  })
}

// 删除用户身份标识
export function delDatas(identityId) {
  return request({
    url: '/housdata/datas/' + identityId,
    method: 'delete'
  })
}
