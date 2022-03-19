<template>
  <!-- 外层容器 -->
  <el-container style=" border: 1px solid #eee" :style={height:vdaH}>

    <!-- 侧边栏容器。 -->
    <el-aside width="200px" background-color="#545c64">
      <div style="
          width: 199px;
          height: 60px;
          background-color: darkcyan;
          font-size: 24px;
          line-height: 60px;
        ">
        <el-row> 管理系统 </el-row>
      </div>
      <el-menu :router="true" @open="handleOpen" @close="handleClose" @select="jihuo" :default-active="activerouter"
        :style={height:vdaB} background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="/home">
          <i class="el-icon-menu"></i>
          <span slot="title">主页</span>
        </el-menu-item>

        <el-menu-item index="/user">
          <i class="el-icon-menu"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>

        <el-menu-item index="/news">
          <i class="el-icon-menu"></i>
          <span slot="title">新闻管理</span>
        </el-menu-item>

        <el-menu-item index="/article">
          <i class="el-icon-menu"></i>
          <span slot="title">帖子管理</span>
        </el-menu-item>

        <el-menu-item index="/message">
          <i class="el-icon-menu"></i>
          <span slot="title">公告管理</span>
        </el-menu-item>

        <el-menu-item index="/lease">
          <i class="el-icon-menu"></i>
          <span slot="title">租聘管理</span>
        </el-menu-item>

        <el-menu-item index="/community_services">
          <i class="el-icon-menu"></i>
          <span slot="title">社区服务</span>
        </el-menu-item>

      </el-menu>
    </el-aside>

    <!-- 外层容器 -->
    <el-container>
      <!-- 顶栏容器 -->
      <el-header style="
          text-align: right;
          font-size: 15px;
          background-color: cornflowerblue;
        ">
        <el-dropdown style="display: inline-block; margin-right: 15px; text-align: center">
          <div style="padding-top: 8px; float: left">
            <el-avatar size="small" :src="circleUrl"></el-avatar>
          </div>
          <span style="padding-left: 10px">唐好帅</span>
          <!-- <i class="el-icon-user-solid" style="margin-right: 15px"></i> -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="exit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <!-- 主要区域容器 -->
      <el-main id="main" style="padding: 0%;border: 20px solid #f0f8ff; padding: 10px;">
        <!-- <el-table :data="tableData">
					<el-table-column prop="date" label="日期" width="140">
					</el-table-column>
					<el-table-column prop="name" label="姓名" width="120">
					</el-table-column>
					<el-table-column prop="address" label="地址">
					</el-table-column>
				</el-table> -->
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
  import eyeOne from "@/assets/log.jpeg";
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Index",
    data() {
      const item = {
        date: "2016-05-02",
        name: "王小虎",
        address: "上海市普陀区金沙江路 1518 弄",
      };
      return {
        activerouter: "/home",
        vdaH: 0,
        vdaB: 0,
        circleUrl: eyeOne,
        tableData: Array(5).fill(item),
      };
    },
    methods: {
      //退出登录
      exit() {
        this.$message.success('退出账户！！！！！');
        this.$router.push({
          path: '/'
        })
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      jihuo(key, keyPath) {
        console.log(key, keyPath);
      },
    },
    created() {
      let h = document.documentElement.clientHeight || document.body.clientHeight;
      this.vdaH = h + 'px';
      this.vdaB = h - 62 + 'px';
    },
    mounted() {
      // 页面手动刷新指定路由
      //获取地址栏中的路由，设置elementui中的导航栏选中状态
      let defaultMenu = window.location.hash.substr(
        window.location.hash.indexOf("/")
      );
      this.activerouter = defaultMenu;
    }
  };
</script>

<style>
  .el-header {
    background-color: #b3c0d1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>