<template>
  <div style="font-size:small;">
    <!-- 搜索 -->
    <el-row style="float: left;">
      <el-input :clearable="true" placeholder="请输入内容" v-model="inputValue" class="input-with-select"
        style="width: 600px;">
        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 120px;">
          <el-option label="发布人ID" value="1"></el-option>
          <el-option label="文章内容" value="2"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getArticleList"></el-button>
      </el-input>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%;text-align: center;">
      <el-table-column fixed prop="uuid" label="文章ID" width="300">
      </el-table-column>

      <el-table-column prop="user" label="发布人" width="100">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>用户名: {{ scope.row.user.username }}</p>
            <p>账户: {{ scope.row.user.phone }}</p>
            <p>个性签名: {{ scope.row.user.uDescribe }}</p>
            <p>性别: {{ scope.row.user.sex }}</p>
            <p>年龄: {{ scope.row.user.age }}</p>
            <p>小区: {{ scope.row.user.house }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.user.username }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="date" label="发布时间" width="100">
      </el-table-column>
      <el-table-column prop="content" label="文章内容" width="600">
      </el-table-column>
      <el-table-column prop="readCount" label="阅读人数" width="100">
      </el-table-column>
      <el-table-column prop="commentCount" label="评论人数" width="100">
      </el-table-column>
      <el-table-column prop="praiseCount" label="点赞人数" width="100">
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

    <el-dialog title="修改数据" :visible.sync="up_article_dialog" :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="消息ID" :label-width="formLabelWidth">
          <el-input v-model="form.uuid" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发布人ID" :label-width="formLabelWidth">
          <el-input v-model="form.userid" autocomplete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" :label-width="formLabelWidth">
          <el-input v-model="form.date" autocomplete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="文章内容" :label-width="formLabelWidth">
          <el-input v-model="form.content" autocomplete="off" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="阅读人数" :label-width="formLabelWidth">
          <el-input v-model="form.readCount" autocomplete="off" :disabled="disabled"></el-input>
        </el-form-item>

      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  // 帖子
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "article",
    data() {
      return {
        up_article_dialog: false, //修改帖子对话框
        form: {
          uuid: '', //文章ID
          userid: '', //发布人ID
          date: '', //发布时间
          content: '', //文章内容
          readCount: '', //阅读人数
          commentCount: '', //评论人数
          praiseCount: '', //点赞人数
          imgid: '', //图片ID 根据这个ID 可以检索出这个帖子所有的图片
          imgLists: [], //帖子图片集合
          praiseList: [], //点赞集合
          user: [], //用户集合
        },
        formLabelWidth: '120px',
        inputValue: '', //搜索框值
        page_sizes: [5, 10, 15, 20, 30],
        page_size: 5, //每页显示数量
        total: 0, //总数
        current_page: 1, //当前页
        select: '2',
        tableData: [],
      };
    },
    mounted() {
      this.getArticleList()
    },
    methods: { //pageSize 改变时会触发
      size_change(pageSize) {
        this.page_size = pageSize
        this.getArticleList();
      },
      //currentPage 改变时会触发
      current_change(currentPage) {
        this.current_page = currentPage
        this.getArticleList();
      },
      getArticleList() {
        let mzz = this
        var tmp = mzz.select == '1' ? {
          "current": mzz.current_page,
          "size": mzz.page_size,
          "userid": mzz.inputValue
        } : {
          "current": mzz.current_page,
          "size": mzz.page_size,
          "content": mzz.inputValue
        }
        mzz.$axios('article/getList', tmp, 'POST').then(data => {
          mzz.tableData = data.list
          mzz.current_page = data.current
          mzz.total = data.total
        }).catch(err => {
          console.log(err)
        })
      },
      //表单工具栏监听
      handleClick(row) {
        this.form = JSON.parse(JSON.stringify(row))
        this.up_article_dialog = true
      }
    },
  };
</script>

<style>
</style>