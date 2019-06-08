<template>
  <div class="home">
    <!-- 左边 -->
    <el-container>
      <el-aside width="200px">
          <img src="../assets/logo.png" class="logo">
        <el-menu
          :router="true"
          :unique-opened="true"
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 导航一 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <!-- 分组 -->
            <el-menu-item index="/home/user">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 导航二 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <!-- 分组 -->
            <el-menu-item index="2-1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>角色列表</span>
              </template>
            </el-menu-item>
            <el-menu-item index="2-2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 导航三 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <!-- 分组 -->
            <el-menu-item-group>
              <el-menu-item index="3-1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>商品列表</span>
                </template>
              </el-menu-item>
              <el-menu-item index="3-2">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>分类参数</span>
                </template>
              </el-menu-item>
              <el-menu-item index="3-3">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>商品分类</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- 导航四-->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <!-- 分组 -->
            <el-menu-item>
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 导航五-->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <!-- 分组 -->
            <el-menu-item>
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 上边 -->
        <el-header>
            <span class="myicon myicon-menu toggle-btn"></span>
            <span class="system-title">电商后台管理系统</span>
            <div class="welcome">
                <span>你好：admin </span>
                <a href="javascript:;">退出</a>
            </div>
        </el-header>
        <!-- 中间 -->
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  methods: {
    handleClose () {},
    handleOpen () {}
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292CF;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome{
    color: white;
  }
}
</style>
