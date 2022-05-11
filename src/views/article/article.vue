<template>
  <div style="font-size:small;">
    <!-- 搜索 -->
    <el-row style="float: left;margin-bottom: 10px;">
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
    <!-- 查看和修改帖子数据对话框 -->
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
      <el-button type="primary" style="width: 100%;text-align: center;">
        点赞列表
      </el-button>
      <el-table :data="form.praiseList" border style="width: 100%;text-align: center;">
        <el-table-column prop="user.username" label="点赞用户名" width="100">
        </el-table-column>
        <el-table-column prop="user.phone" label="账户" width="120">
        </el-table-column>
        <el-table-column prop="date" label="点赞时间" width="510">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- <el-button @click="up_schedule_item(scope.row)" type="text" size="small" :disabled="disabled">编辑</el-button> -->
            <el-button @click="del_param_item(scope.row)" type="text" size="small" :disabled="disabled">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" style="width: 100%;text-align: center;margin-top: 20px;">
        评论列表
      </el-button>
      <el-table :data="form.commentList" border style="width: 100%;text-align: center;">
        <el-table-column prop="user.username" label="评论用户名" width="100">
        </el-table-column>
        <el-table-column prop="user.phone" label="账户" width="120">
        </el-table-column>
        <el-table-column prop="message" label="消息" width="320">
        </el-table-column>
        <el-table-column prop="date" label="点赞时间" width="190">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- <el-button @click="up_schedule_item(scope.row)" type="text" size="small" :disabled="disabled">编辑</el-button> -->
            <el-button @click="del_comment_item(scope.row)" type="text" size="small" :disabled="disabled">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" style="width: 100%;text-align: center;margin-top: 20px;margin-bottom: 10px;">
        文章图片
      </el-button>
      <!-- 文件上传 :auto-upload="false" -->
      <div>
        <el-upload :on-change="fileChange" :data="up_data" :action="up_article" ref="upload" list-type="picture-card"
          :on-success="upFile" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" name="file"
          :disabled="disabled" :file-list="upimgList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="img_dialog" append-to-body>
          <el-image :src="my_img_url">
          </el-image>
        </el-dialog>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="up_article_dialog = false">取 消</el-button>
        <el-button type="primary" @click="upSrticle" :disabled="disabled">确 定</el-button>
      </div>



    </el-dialog>
    <!-- beg删除对话框 -->
    <el-dialog title="警告" :visible.sync="del_article_dialog" width="30%" append-to-body>
      <span>是否确定删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="del_article_dialog = false">取 消</el-button>
        <el-button type="primary" @click="del_article">确 定</el-button>
      </span>
    </el-dialog>
    <!-- end -->
  </div>
</template>

<script>
  // 帖子
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "article_t",
    data() {
      return {

        del_article_dialog: false, //删除文章对话框状态
        up_data: {},
        disabled: false,
        upimgList: [], //待上传文件
        my_img_url: '',
        img_dialog: false, //图片放大对话框
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
          commentList: [], //评论集合
          user: {}, //用户集合
        },
        formLabelWidth: '120px',
        inputValue: '', //搜索框值
        page_sizes: [5, 10, 15, 20, 30],
        page_size: 5, //每页显示数量
        total: 0, //总数
        current_page: 1, //当前页
        select: '2',
        tableData: [],
        up_article: this.$up_article, //文章图片上传地址
      };
    },
    mounted() {
      this.getArticleList()
    },
    methods: {
      //删除文章
      del_article() {
        let mzz = this
        let temp = {
          imgid: mzz.form.imgid,
          articleid: mzz.form.uuid
        }
        mzz.$axios('article/deleteArticle', temp, 'POST').then(data => {
          if (data == '200') {
            mzz.$message.success('删除成功！！！！！');
            mzz.del_article_dialog = false
            mzz.getArticleList() //刷新全部数据
          } else {
            mzz.$message.error('删除失败！！！！！');
          }
        }).catch(err => {
          mzz.$message.error('系统错误！！！！！' + err);
        })
      },
      //表格工具栏的删除按钮
      showDelDialog(row) {
        this.form = JSON.parse(JSON.stringify(row))
        this.del_article_dialog = true
      },
      //删除评论
      del_comment_item(row) {
        console.log(row)
        let mzz = this
        let temp_del = {
          uuid: row.uuid
        }
        let temp_get = {
          id: row.articleid
        }
        mzz.$axios('comment/deleteComment', temp_del, 'POST').then(data => {
          if (data) {
            mzz.$message.success('删除成功！！！！！');
            mzz.getArticleList() //刷新全部数据
            mzz.$axios('article/getOneArticle', temp_get, 'POST').then(data => { //刷新当前文章的数据 
              mzz.form = JSON.parse(JSON.stringify(data))
            }).catch(err => {
              this.$message.error('系统错误！！！！！' + err);
            })
          } else {
            mzz.$message.error('删除失败！！！！！');
          }
        }).catch(err => {
          mzz.$message.error('系统错误！！！！！' + err);
        })
      },
      //删除点赞
      del_param_item(row) {
        let mzz = this
        let temp_del = {
          uuid: row.uuid
        }
        let temp_get = {
          id: row.articleid
        }
        mzz.$axios('praise/deleteParam', temp_del, 'POST').then(data => {
          if (data) {
            mzz.$message.success('删除成功！！！！！');
            mzz.getArticleList() //刷新全部数据
            mzz.$axios('article/getOneArticle', temp_get, 'POST').then(data => { //刷新点赞数据
              mzz.form = JSON.parse(JSON.stringify(data))
            }).catch(err => {
              this.$message.error('系统错误！！！！！' + err);
            })
          } else {
            mzz.$message.error('删除失败！！！！！');
          }
        }).catch(err => {
          mzz.$message.error('系统错误！！！！！' + err);
        })
      },
      //文件上传成功回调
      upFile(response, file, fileList) {
        let mzz = this
        let tempimgID = {}
        if (response == 'succeed') {
          tempimgID = {
            imgid: mzz.up_data.imgID
          }
          mzz.$axios('img-list/getByUserImgList', tempimgID, 'POST').then(data => {
            if (data.length > 0) {
              let temp = []
              for (var i = 0; i < data.length; i++) {
                let tempImgUrl = mzz.$articlePath + data[i].imgUrl
                let temurl = {
                  name: data[i].uuid,
                  url: tempImgUrl
                }
                temp.push(temurl)
              }
              mzz.upimgList = temp
            } else {
              mzz.$message.error('添加失败！！！！！');
            }
          }).catch(err => {
            mzz.$message.error('系统错误！！！！！' + err);
          })
          //刷新数据
          mzz.getArticleList()
        }
        console.log(response, file, fileList)
      },
      upSrticle() {
        let mzz = this
        mzz.$axios('article/upArticle', mzz.form, 'POST').then(data => {
          if (data) {
            mzz.$message({
              message: '修改成功',
              type: 'success'
            });
            mzz.getArticleList()
            mzz.up_article_dialog = false
          }
          if (!data) {
            mzz.$message.error('修改失败！！！！！');
          }
        }).catch(err => {
          mzz.$message.error('修改错误！！！！！' + err);
        })
        // mzz.$refs.upload.submit() //提交图片上传
      },
      // fileList 是文件列表发生变化后，返回的修改后的列表对象，这里直接赋值
      fileChange(file, fileList) {
        // console.log(file, fileList)
        this.upimgList = fileList
      },
      // 图片删除
      handleRemove(file, fileList) {
        console.log(file, fileList);
        let data = {
          uuid: file.name
        }
        this.$axios('img-list/deImgList', data, 'POST').then(data => {
          if (data) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getArticleList()
          }
          if (!data) {
            this.$message.error('删除失败！！！！！');
          }
        }).catch(err => {
          this.$message.error('删除错误！！！！！' + err);
        })
      },
      // 图片预览
      handlePictureCardPreview(file) {
        this.my_img_url = file.url
        this.img_dialog = true;
        console.log(file)
      },
      //pageSize 改变时会触发
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
      //表格工具栏监听
      handleClick(row, disabled) {
        let mzz = this
        mzz.disabled = disabled
        let tmp = {
          id: row.uuid
        }
        mzz.$axios('article/getOneArticle', tmp, 'POST').then(data => {
          mzz.form = JSON.parse(JSON.stringify(data))
          mzz.up_data = JSON.parse(JSON.stringify({
            imgID: mzz.form.imgid
          }))
          let temp = []
          for (var i = 0; i < data.imgLists.length; i++) {
            let tempImgUrl = mzz.$articlePath + data.imgLists[i].imgUrl
            let
              temurl = {
                name: data.imgLists[i].uuid,
                url: tempImgUrl
              }
            temp.push(temurl)
          }
          mzz.upimgList = temp
          mzz.up_article_dialog = true
        }).catch(err => {
          this.$message.error('系统错误！！！！！' + err);
        })


      }
    },
  };
</script>

<style>
</style>