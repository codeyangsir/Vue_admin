<template>
  <div class="login">
    <!-- 画布 -->
    <canvas id="canvas" style="background:#111"></canvas>
    <div class="container">
      <el-form
      :model="LoginForm"
      :rules="rules"
      ref="LoginForm"
      class="demo-ruleForm"

      >
        <img src="../assets/avatar.jpg" class="avatar">
        <el-form-item label="" prop="username">
          <el-input v-model="LoginForm.username"   prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="LoginForm.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item>
            <!-- （）里面传实参名字固定LoginForm-->
          <el-button type="primary" class="login-btn" @click='loginSubmit("LoginForm")'>登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>

import { login } from '@/api/index.js'
window.onload = function () {
  // 获取画布对象
  var canvas = document.getElementById('canvas')
  // 获取画布的上下文
  var context = canvas.getContext('2d')
  // 获取浏览器屏幕的宽度和高度
  var W = window.innerWidth
  var H = window.innerHeight
  // 设置canvas的宽度和高度
  canvas.width = W
  canvas.height = H
  // 每个文字的字体大小
  var fontSize = 16
  // 计算列
  var colunms = Math.floor(W / fontSize)
  // 记录每列文字的y轴坐标
  var drops = []
  // 给每一个文字初始化一个起始点的位置
  for (var i = 0; i < colunms; i++) {
    drops.push(0)
  }

  // 运动的文字
  var str = 'javascript html5 canvas'
  // 4:fillText(str,x,y);原理就是去更改y的坐标位置
  // 绘画的函数
  function draw () {
    context.fillStyle = 'rgba(0,0,0,0.05)'
    context.fillRect(0, 0, W, H)
    // 给字体设置样式
    context.font = '700 ' + fontSize + 'px  微软雅黑'
    // 给字体添加颜色
    context.fillStyle = '#00cc33'// 可以rgb,hsl, 标准色，十六进制颜色
    // 写入画布中
    for (var i = 0; i < colunms; i++) {
      var index = Math.floor(Math.random() * str.length)
      var x = i * fontSize
      var y = drops[i] * fontSize
      context.fillText(str[index], x, y)
      // 如果要改变时间，肯定就是改变每次他的起点
      if (y >= canvas.height && Math.random() > 0.99) {
        drops[i] = 0
      }
      drops[i]++
    }
  }

  function randColor () {
    var r = Math.floor(Math.random() * 256)
    var g = Math.floor(Math.random() * 256)
    var b = Math.floor(Math.random() * 256)
    return 'rgb(' + r + ',' + g + ',' + b + ')'
  }

  draw()
  setInterval(draw, 30)
}
export default {
  data () {
    return {
      LoginForm: {
        username: '',
        password: ''
      },
      rules: {
        // required:是否必须  message：如果不合法的提示信息  trigger：什么时候触发
        // 用户名验证
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        // 密码验证
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // fromname表单名字，随便取
    loginSubmit (LoginForm) {
      console.log('我执行了吗')
      // 回调函数有一个参数，如果验证通过则返回True,否则返回False
      // valid名字随便取
      // $refs唯一标识对应第七行的ref="LoginForm"
      // validate表单验证
      this.$refs[LoginForm].validate((valid) => {
        if (valid) {
          //   说明用户输入合法，那么就可以提交
          //   发送登陆验证请求
          login(this.LoginForm)
            .then((result) => {
              if (result.meta.status === 200) {
                //   要进行路由的跳转
                this.$router.push({ name: 'Home' })
              } else {
                this.$message.error(result.meta.msg)
              }
            })
          // console.log('ok')
        } else {
          this.$message({
            showClose: true,
            message: '错了哦，数据输入不合法',
            type: 'error'
          })
        }
      })
    }
  }
}

</script>
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  // background-color: #2f4050;
  // opacity: 0.5;
  vertical-align: middle;
  #canvas{
 position: fixed;
  }

  .container {
    position: absolute;
    opacity: 0.9;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
