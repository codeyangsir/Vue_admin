import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么?获取token,传递
  // 1.获取token
  var token = localStorage.getItem('itcastpro_token')
  if (token) {
    // 2.在发送请求的时候传递token
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 获取所有角色列表
export const getAllRoleList = () => {
  return axios.get('roles')
    .then((result) => {
      return result.data
    })
}

// 授权角色提交
// 分配用户角色提交
export const grantRole = (id, rid) => {
  return axios.put(`users/${id}/role`, { rid: rid })
    .then((result) => {
      return result.data
    })
}

// 添加用户
export const addUser = (obj) => {
  return axios.post(`users`, obj)
    .then((result) => {
      return result.data
    })
}

// 删除指定角色的指定权限
// delete:--看接口文档:删除角色指定权限
export const removeRightByUserId = (roleid, rightid) => {
  return axios.delete(`roles/${roleid}/rights/${rightid}`)

  // 错误方发
  // axios({
  //   type:'delete',
  //   url:`roles/${roleid}/rights/${rightid}`
  // })
}

// 添加角色
export const addRole = (params) => {
  return axios({
    method: 'post',
    url: 'roles',
    data: params
  })
}

// 实现角色授权提交，看接口文档操作
// - 请求路径：roles/:roleId/rights
// - 请求方法：post
// - 请求参数roleld,rids
export const grantRoleSubmit = (roleid, ids) => {
  return axios({
    // ids是数组,后期出来可能会报错
    method: 'post',
    // url: `roles/${'roleld'}/rights`,
    url: `roles/${roleid}/rights`,
    data: { rids: ids }
  })
}
