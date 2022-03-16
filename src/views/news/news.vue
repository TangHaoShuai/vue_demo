<template>
  <div style="font-size:small;">
    <!-- 搜索 -->
    <el-row style="float: left;">
      <el-input :clearable="true" placeholder="请输入内容" v-model="inputValue" class="input-with-select"
        style="width: 600px;">
        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 100px;">
          <el-option label="标题" value="1"></el-option>
          <!-- <el-option label="账号" value="2"></el-option> -->
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getNewsList"></el-button>
      </el-input>
    </el-row>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%;text-align: center;">
      <el-table-column fixed prop="title" label="标题" width="200">
      </el-table-column>
      <el-table-column prop="imgUrl" label="图片地址" width="200">
      </el-table-column>
      <el-table-column prop="newTime" label="时间" width="300">
      </el-table-column>
      <el-table-column prop="url" label="内容地址" width="600">
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row,true)" type="text" size="small">查看</el-button>
          <el-button @click="handleClick(scope.row,false)" type="text" size="small">编辑</el-button>
          <el-button @click="showDelDialog(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="current_change" @size-change="size_change" :page-sizes="page_sizes"
      style="margin-top: 20px;" :current-page="current_page" :page-size="page_size" background
      layout="sizes, prev, pager, next" :total="total">
    </el-pagination>
  </div>

</template>

<script>
  // 新闻
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "news",
    data() {
      return {
        form: {
          title: '', //新闻标题
          imgUrl: '', //新闻图片地址
          newTime: '', //时间
          url: '', //内容地址
        },
        inputValue: '', //搜索框值
        page_sizes: [5, 10, 15, 20, 30],
        page_size: 5, //每页显示数量
        total: 0, //总数
        current_page: 1, //当前页
        select: '1',
        tableData: [],
      };
    },
    mounted() {
      this.getNewsList()
    },
    methods: {
      //pageSize 改变时会触发
      size_change(pageSize) {
        this.page_size = pageSize
        this.getNewsList();
      },
      //currentPage 改变时会触发
      current_change(currentPage) {
        this.current_page = currentPage
        this.getNewsList();
      },
      getNewsList() {
        var tmp = this.select == '1' ? {
          "current": this.current_page,
          "size": this.page_size,
          "title": this.inputValue
        } : {
          "current": this.current_page,
          "size": this.page_size,
          "title": this.inputValue
        }
        this.$axios('news/getNewsPage', tmp, 'POST').then(data => {
          this.tableData = data.list
          this.current_page = data.current
          this.total = data.total
          console.log(this.tableData)
        }).catch(err => {
          console.log(err)
        })
      },
      //表单工具栏监听
      handleClick() {

      }
    },
  };
</script>

<style>
</style>