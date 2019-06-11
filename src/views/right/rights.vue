<template>
  <div class="rights">
    <!-- 路径导航--面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格数据 -->
    <el-table :data="rightList" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column type="index" width="50"></el-table-column>
      <!-- prop="这里的值是从下面result.data.data拿到" -->
      <el-table-column prop="authName" label="权限" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <!-- |管道符 -->
      <!-- <el-table-column prop="level" label="层级">{{level | levelFor}}</el-table-column> -->
      <!-- 使用局部过滤器 -->
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span>{{scope.row.level | levelFormat}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      // 权限表格数据
      rightList: []
    }
  },
  // 添加局部过滤器(对象)来获取到一级,二级
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  },
  mounted () {
    // 调用getRightList
    this.getRightList()
  },
  methods: {
    // 获取异步请求的数据结构
    async getRightList () {
      // result拿到data里面的数据
      // list 看文档所有权限列表里面有说明
      let result = await getAllRightList('list')
      // console.log(result)
      // 把拿到的数据在这里
      this.rightList = result.data.data
    },
    // 隔行换色
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
