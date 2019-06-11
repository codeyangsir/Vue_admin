<template>
  <div class="role">
    <!-- 路径导航--面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin-top: 15px;">
      <el-button type="success" plain @click="showAddDialog">添加角色</el-button>
    </div>
    <!-- 展开行效果的表格 -->
    <el-table :data="roleList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一定要写key不然会报错 first(一级权限)名字随便取-->
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-top:15px;border-bottom:1px dashed #ccc"
          >
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <!-- Tag标签可移除 closable就是那个xx按钮,只有按钮不能删除-->
                <el-tag
                  closable
                  :type="'success'"
                  @close="removeSingleRight(scope.row,first.id)"
                >{{first.authName}}</el-tag>
              </div>
            </el-col>
            <!-- 一定要写key不然会报错 second(二级权限)名字随便取-->
            <el-col :span="20">
              <div class="grid-content bg-purple-light">
                <el-row
                  v-for="second in first.children"
                  :key="second.id"
                  style="margin-bottom:15px"
                >
                  <el-col :span="6">
                    <div class="grid-content bg-purple">
                      <el-tag
                        closable
                        :type="'info'"
                        @close="removeSingleRight(scope.row,second.id)"
                      >{{second.authName}}</el-tag>
                    </div>
                  </el-col>
                  <!-- 一定要写key不然会报错 third(三级权限)名字随便取-->
                  <!-- @close实现删除,看网站文档 -->
                  <el-col :span="18">
                    <div class="grid-content bg-purple">
                      <el-tag
                        closable
                        :type="'warning'"
                        v-for="third in second.children"
                        :key="third.id"
                        style="margin-right:5px;margin-bottom:15px"
                        @close="removeSingleRight(scope.row,third.id)"
                      >{{third.authName}}</el-tag>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>

          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">没有任何的权限，请先分配</el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-end">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权" placement="top-end">
            <el-button type="success" icon="el-icon-share" @click='showGrantDialog(scope.row)'></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules="rules" ref="addForm" :label-width="'120px'">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加角色授权对话框 -->
    <el-dialog title="角色授权" :visible.sync="grantDialogFormVisible">
      <div class="rightListBox">
          <!-- 树形控件 -->
          <el-tree
            ref='rightTree'
            :data="rightList"
            show-checkbox
            node-key="id"
            :default-expand-all='true'
            :default-checked-keys="selectedKeys"
            :props="defaultProps"
          ></el-tree>
      </div>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRoleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllRoleList,
  removeRightByUserId,
  addRole,
  grantRoleSubmit
} from '@/api/role_index.js'
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      roleId: '',
      // 当前树形控件中默认被选择节点数组，这个数组中的每一个值都是对应的权限id
      selectedKeys: [],
      // 树状结构需要的数据
      defaultProps: {
        children: 'children',
        // 这样是没有数据的
        // label: 'label'
        // 要拿到这些名字：authName
        label: 'authName'
      },
      rightList: [],
      // 授权对话框显示
      grantDialogFormVisible: false,
      // 授权对话框数据
      granForm: [],
      // 角色数据
      roleList: [],
      // 显示隐藏角色对话框数据
      addDialogFormVisible: false,
      // 添加角色对话框数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色对话框数据验证规则
      rules: {
        roleName: [
          { required: true, message: '🙅‍角色名称不能为空', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '🙅‍角色描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  // 添加钩子函数
  mounted () {
    // 调用获取角色数据的getRoleList方法
    this.getRoleList()
  },

  methods: {
    // 实现角色授权提交
    async grantRoleSubmit () {
      // console.log(this.$refs.rightTree.getCheckedKeys())
      // console.log(this.$refs.rightTree.getCheckedNodes())
      // 1.通过getCheckedNodes获取当前所有被选中的节点对象
      var allNodes = this.$refs.rightTree.getCheckedNodes()
      // 2.遍历，获取每一个对象中的id和pid
      // map可以将回调函数的操作结果存储到一个数组中并返回
      var arr = allNodes.map(value => {
        return value.id + ',' + value.pid
      })
      // 我们以选择两个权限为例，现在获取的arr结果是：["109,107,102", "154,107,102"]
      console.log(arr)
      // 3.将Arr拼接成字符串:   109,107,102,154,107,102
      // join() 方法用于把数组中的所有元素放入一个字符串。元素是通过指定的分隔符进行分隔的。
      var ids = arr.join(',')
      console.log(ids)
      // 4.数组去除重复--先将字符串转换为数组：[109,107,102,154,107,102]
      // split() 方法用于把一个字符串分割成字符串数组。
      var temp = ids.split(',')
      console.log(temp)
      // 5.实现数组去重  浏览器打印看到的Set(4){"109", "107", "102", "154"}
      // var obj = [...new Set(temp)]
      // ["109", "107", "102", "154"]
      // 两种方法
      // var obj = [...new Set(temp)]
      // console.log(obj)
      // Array.from() 方法从一个类似数组或可迭代对象中创建一个新的，浅拷贝的数组实例。
      // 拿到了一个数组，虽然不能传数组，但可以把数组转换一下再传
      var finalIds = Array.from(new Set(temp))
      console.log(finalIds)
      let result = await grantRoleSubmit(this.roleId, finalIds.join(','))
      console.log(result)
      if (result.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        this.grantDialogFormVisible = false
        this.getRoleList()
      }
    },

    // 打开授权角色对话框
    // row☞授权按钮传的值
    async showGrantDialog (row) {
      // 显示对话框
      this.grantDialogFormVisible = true
      // 获取并加载树形控件的数据
      var result = await getAllRightList('tree')
      console.log(result)
      this.rightList = result.data.data
      // 将当前角色id存储到data属性
      this.roleId = row.id

      // 我们还需要获取这个角色所对应的权限id
      // getCheckedKeys 饿了么组件里面树状结构里面最下面的自带方法
      // 我们要获取的其实是三级权限所对应的id,树有一个特点，如果子节点被选择，父节点默认就会被展开
      // 我们这里所要获取的权限id是这个角色所拥有的权限，而不能直接通过Result进行获取
      // row:就是当前这一行数据所对应的数据对象，这个数据对象中就包含着这个角色所拥有的权限数据
      console.log(row)
      // 在新的角色权限获取之前，将上一个角色的权限数据清除
      this.selectedKeys = []
      // 找啊找啊找朋友，找到了一个好朋友
      if (row.children && row.children.length > 0) {
        // forEach() 方法用于调用数组的每个元素，并将元素传递给回调函数。
        // 注意: forEach() 对于空数组是不会执行回调函数的。
        row.children.forEach(first => {
          if (first.children && first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children && second.children.length > 0) {
                second.children.forEach(third => {
                  // push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
                  this.selectedKeys.push(third.id)
                })
              }
            })
          }
        })
      }
    },
    // 角色授权对话框
    dialogFormVisible () {},
    // 显示添加角色对话框
    showAddDialog () {
      this.addDialogFormVisible = true
    },
    // 实现添加角色对话框添加角色
    async addRole () {
      let result = await addRole(this.addForm)
      if (result.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        this.addDialogFormVisible = false
        this.getRoleList()
      }
    },
    // 删除角色权限
    // 看文档接口怎么做:删除指定角色的指定权限,所以要传入两个参数roleId(角色id)，rightId(权限id)
    async removeSingleRight (row, rightid) {
      // 测试一下点击能不能打印
      // console.log('123')
      // console.log(row)
      console.log(rightid)
      let result = await removeRightByUserId(row.id, rightid)
      // console.log(result, '------------')
      this.$message({
        type: 'success',
        message: '权限删除成功'
      })
      // 局部刷新,只重置当前角色的对应权限数据---不会造成页面的整体刷新
      row.children = result.data.data
    },
    // 获取角色数据
    async getRoleList () {
      // let result = await getAllRoleList('里面的参数是根据role_index.js里面的getAllRoleList这个方法里面有没有参数决定的')
      let result = await getAllRoleList()
      console.log(result)
      this.roleList = result.data
      console.log(this.roleList)
    }
  }
}
</script>

<style lang="less" scoped>
.rightListBox{
  height: 400px;
  overflow: scroll
}
</style>
