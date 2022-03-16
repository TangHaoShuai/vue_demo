<template>
  <div style="font-size:small;">
    <!-- 搜索 -->
    <el-row style="float: left;">
      <el-input :clearable="true" placeholder="请输入内容" v-model="inputValue" class="input-with-select"
        style="width: 600px;">
        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 100px;">
          <el-option label="内容" value="1"></el-option>
          <!-- <el-option label="账号" value="2"></el-option> -->
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getMessageList"></el-button>
      </el-input>
    </el-row>
    <!-- 添加 -->
    <el-row style="float: right;margin-bottom: 10px;">
      <el-button type="primary" @click="add_mes_dialog = true">添加消息</el-button>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%;text-align: center;">
      <el-table-column fixed prop="uuid" label="消息ID" width="300">
      </el-table-column>
      <el-table-column prop="message" label="消息内容" width="500">
      </el-table-column>
      <el-table-column prop="date" label="时间" width="300">
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="showDelDialog(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="current_change" @size-change="size_change" :page-sizes="page_sizes"
      style="margin-top: 20px;" :current-page="current_page" :page-size="page_size" background
      layout="sizes, prev, pager, next" :total="total">
    </el-pagination>

    <!-- 添加对话框 -->
    <div>
      <el-dialog title="添加数据" :visible.sync="add_mes_dialog">
        <el-form :model="form">
          <el-form-item label="消息内容" :label-width="formLabelWidth">
            <el-input v-model="form.message" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="add_mes_dialog = false">取 消</el-button>
          <el-button type="primary" @click="addMessage">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 修改对话框 -->
    <div>
      <el-dialog title="修改数据" :visible.sync="up_mes_dialog">
        <el-form :model="form">
          <el-form-item label="消息ID" :label-width="formLabelWidth">
            <el-input v-model="form.uuid" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="消息内容" :label-width="formLabelWidth">
            <el-input v-model="form.message" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="up_mes_dialog = false">取 消</el-button>
          <el-button type="primary" @click="upMessage">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 删除对话框 -->
    <div>
      <el-dialog title="警告" :visible.sync="del_mes_dialog" width="30%">
        <span>是否确定删除</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="del_mes_dialog = false">取 消</el-button>
          <el-button type="primary" @click="delMes">确 定</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  // 通知
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "message",
    data() {
      return {
        form: {
          uuid: '', //uuid
          message: '', //消息
          date: '' //时间
        },
        inputValue: '', //搜索框值
        page_sizes: [5, 10, 15, 20, 30],
        page_size: 5, //每页显示数量
        total: 0, //总数
        current_page: 1, //当前页
        select: '1',
        tableData: [],
        formLabelWidth: '120px',
        add_mes_dialog: false,
        del_mes_dialog: false,
        up_mes_dialog: false,
        tmp_mes_user: '',
      };
    },
    mounted() {
      this.getMessageList()
    },
    methods: {
      upMessage() {
        this.$axios('message/updateMessage', this.form, 'POST').then(data => {
          if (data) {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.getMessageList()
            this.up_mes_dialog = false
          } else {
            this.$message.error('修改失败！！！！！');
          }
        }).catch(err => {
          this.$message.error('系统错误！！！！！' + err);
        })
      },
      delMes() {
        this.del_mes_dialog = false
        this.$axios('message/deleteMessage', this.tmp_mes_user, 'POST').then(data => {
          if (data) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getMessageList()
          }
          if (!data) {
            this.$message.error('删除失败！！！！！');
          }
        }).catch(err => {
          this.$message.error('删除错误！！！！！' + err);
        })
      },
      showDelDialog(row) {
        this.del_mes_dialog = true
        this.tmp_mes_user = JSON.parse(JSON.stringify(row))
      },
      addMessage() {
        if (this.form.message != '' && this.form.message != null) {
          this.$axios('message/addMessage', this.form, 'POST').then(data => {
            if (data) {
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.getMessageList()
              this.add_mes_dialog = false;
            } else {
              this.$message.error('添加失败！！！！！');
            }
          }).catch(err => {
            this.$message.error('系统错误！！！！！' + err);
          })
        } else {
          this.$message.error('添加个寂寞?！！！！！');
        }
      },
      getMessageList() {
        var tmp = this.select == '1' ? {
          "current": this.current_page,
          "size": this.page_size,
          "message": this.inputValue
        } : {
          "current": this.current_page,
          "size": this.page_size,
          "message": this.inputValue
        }
        this.$axios('message/selectPage', tmp, 'POST').then(data => {
          this.tableData = data.list
          this.current_page = data.current
          this.total = data.total
        }).catch(err => {
          console.log(err)
        })
      },
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
      //表单工具栏监听
      handleClick(row) {
        this.form = JSON.parse(JSON.stringify(row))
        this.up_mes_dialog = true
      },
    },
  };
</script>

<style>
</style>