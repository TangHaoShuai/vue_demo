<template>
  <div style="font-size:small;">
    <el-row style="float: left;">
      <el-input :clearable="true" placeholder="请输入内容" v-model="inputValue" class="input-with-select"
        style="width: 600px;">
        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 100px;">
          <el-option label="物品ID" value="1"></el-option>
          <el-option label="物品名称" value="2"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="getShareList"></el-button>
      </el-input>
    </el-row>
    <el-row style="float: right;margin-bottom: 10px;">
      <el-button type="primary" @click="add_share_dialog = true">添加物品</el-button>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%;text-align: center;">
      <el-table-column fixed prop="uuid" label="物品ID" width="200">
      </el-table-column>
      <el-table-column prop="name" label="物品名称" width="200">
      </el-table-column>
      <el-table-column prop="description" label="描述" width="300">
      </el-table-column>
      <el-table-column prop="userid" label="当前租聘用户" width="200">
      </el-table-column>
      <el-table-column prop="begdate" label="开始时间" width="200">
      </el-table-column>
      <el-table-column prop="enddate" label="截至时间" width="200">
      </el-table-column>
      <!-- <el-table-column prop="img" label="物品图片" width="200">
      </el-table-column> -->
      <el-table-column label="物品图片" width="200">
        <template slot-scope="scope">
          <el-row v-if=scope.row.img>
            <el-image :src="url+scope.row.img">
            </el-image>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="物品二维码" width="200">
        <template slot-scope="scope">
          <el-row v-if=scope.row.qrimg>
            <el-image :src="qrurl+scope.row.qrimg">
            </el-image>
          </el-row>
        </template>
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
    <!-- 删除对话框 -->
    <el-dialog title="警告" :visible.sync="del_share_dialog" width="30%">
      <span>是否确定删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="del_share_dialog = false">取 消</el-button>
        <el-button type="primary" @click="delShare">确 定</el-button>
      </span>
    </el-dialog>
    <el-pagination @current-change="current_change" @size-change="size_change" :page-sizes="page_sizes"
      style="margin-top: 20px;" :current-page="current_page" :page-size="page_size" background
      layout="sizes, prev, pager, next" :total="total">
    </el-pagination>
    <!-- 添加对话框 -->
    <div>
      <el-dialog title="添加物品" :visible.sync="add_share_dialog">
        <el-form :model="form">
          <el-form-item label="物品名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input v-model="form.description" autocomplete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="物品图片" :label-width="formLabelWidth">
            <el-input v-model="form.province" autocomplete="off"></el-input>
          </el-form-item> -->
          <el-upload :auto-upload="false" :limit="1" class="upload-demo" ref="upload" :on-success="upFile"
            :on-change="fileChange" action="up_share" name="file" :data="data" :on-preview="handlePreview"
            :on-remove="handleRemove" :file-list="fileList" list-type="picture">
            <el-button size="medium" type="primary">点击上传物品的图片</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传一张</div> -->
          </el-upload>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="add_user_dialog = false">取 消</el-button>
          <el-button type="primary" @click="addShare">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 修改对话框 -->
    <div>
      <el-dialog title="修改物品信息" :visible.sync="up_share_dialog">
        <el-form :model="form">
          <el-form-item label="物品ID" :label-width="formLabelWidth">
            <el-input v-model="form.uuid" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="物品名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input v-model="form.description" autocomplete="off" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="当前租聘用户" :label-width="formLabelWidth">
            <el-input v-model="form.userid" autocomplete="off" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" :label-width="formLabelWidth">
            <el-input v-model="form.begdate" autocomplete="off" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="截至时间" :label-width="formLabelWidth">
            <el-input v-model="form.enddate" autocomplete="off" :disabled="disabled"></el-input>
          </el-form-item>

          <el-upload :auto-upload="false" :limit="1" class="upload-demo" ref="upload" :on-success="upFile"
            :on-change="fileChange" :action="up_share" name="file" :data="data" :on-preview="handlePreview"
            :on-remove="handleRemove" :file-list="fileList" list-type="picture">
            <el-button size="medium" type="primary" :disabled="disabled">点击上传物品的图片</el-button>
          </el-upload>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="up_share_dialog = false">取 消</el-button>
          <el-button type="primary" @click="upShare" :disabled="disabled">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    // 租聘
    // eslint-disable-next-line vue/multi-word-component-names
    name: "lease",
    data() {
      return {
        up_share: this.$up_share, // 共享图片上传路径
        tmp_del_share: {},
        disabled: false,
        qrurl: this.$qrurl,
        url: this.$sharePath,
        formLabelWidth: '120px',
        tableData: [],
        select: '',
        inputValue: '',
        del_share_dialog: false,
        up_share_dialog: false,
        add_share_dialog: false,
        form: {
          uuid: '',
          name: '',
          description: '',
          userid: '',
          begdate: '',
          enddate: '',
          state: '',
          img: ''
        },
        page_size: 5, //每页显示数量
        page_sizes: [5, 10, 15, 20, 30],
        total: 0, //总页数
        current_page: 1, //当前页
        data: {
          shareId: '62d9bb9159ac4ce98e8fecfdbb2124df',
          imgId: ''
        },
        fileList: []
      };
    },
    onShow() {},
    onLoad() {},
    mounted() {
      this.getShareList()
    },
    methods: {
      showDelDialog(row) {
        this.del_share_dialog = true
        this.tmp_del_share = JSON.parse(JSON.stringify(row))
      },
      delShare() {

        this.$axios('share/deleteShare', this.tmp_del_share, 'POST').then(data => {
          if (data) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getShareList()
            this.del_share_dialog = false;
          }
          if (!data) {
            this.$message.error('删除失败！！！！！');
          }
        }).catch(err => {
          this.$message.error('删除错误！！！！！' + err);
        })
      },
      upShare() {
        let mzz = this;
        this.disabled = true
        if (mzz.form.name == '' || mzz.form.description == '') {
          mzz.$message.error('名字和描述不能为空！！！！！');
        } else {
          mzz.$axios('share/upShare', mzz.form, 'POST').then(res => { //先修改数据库数据
            if (res.state == 'succeed') {
              if (mzz.fileList.length > 0 && mzz.fileList[0].status != "success") {
                mzz.data.shareId = res.message
                if (res.imgId != '' && res.imgId != null) {
                  mzz.data.imgId = res.imgId //在修改服务器图片数据 根据imgID去删除原来的图片 在新增新的图片
                } else {
                  mzz.data.imgId = ''
                }
                mzz.$refs.upload.submit() //提交图片上传
              } else {
                mzz.$message({
                  message: '修改成功',
                  type: 'success'
                });
                mzz.getShareList()
                mzz.up_share_dialog = false
              }
            } else {
              mzz.$message.error('修改失败！！！！！');
            }
          }).catch(err => {
            console.log(2222)
            mzz.$message.error('系统错误！！！！！' + err);
          })
        }
      },
      //表单工具栏 查看修改
      handleClick(row, disabled) {
        this.form = JSON.parse(JSON.stringify(row))
        this.up_share_dialog = true
        this.disabled = disabled
        let shaerPath = this.$sharePath
        if (row.img && row.name) {
          this.fileList = [{
            name: row.name,
            url: shaerPath + row.img
          }]
        } else {
          this.fileList = []
        }
      },
      // fileList 是文件列表发生变化后，返回的修改后的列表对象，这里直接赋值
      fileChange(file, fileList) {
        // console.log(file, fileList)
        this.fileList = fileList
      },
      //模糊查询
      getShareList() {
        var tmp = this.select == '1' ? {
          "current": this.current_page,
          "size": this.page_size,
          "uuid": this.inputValue
        } : {
          "current": this.current_page,
          "size": this.page_size,
          "name": this.inputValue
        }
        this.$axios('share/selectPage', tmp, 'POST').then(data => {
          this.tableData = data.list
          this.current_page = data.current
          this.total = data.total
          // console.log(this.tableData)
        }).catch(err => {
          console.log(err)
        })
      },
      //文件上传成功回调
      upFile(response, file, fileList) {
        if (response.state == 'succeed') {
          this.getShareList()
          if (this.add_share_dialog) {
            this.add_share_dialog = false;
            this.$message({
              message: '添加成功',
              type: 'success'
            });
          } else if (this.up_share_dialog) {
            this.up_share_dialog = false
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          }
        }
        console.log(response, file, fileList)
      },
      // 添加共享物品
      addShare() {
        if (this.form.name == '' || this.form.description == '') {
          this.$message.error('名字和描述不能为空！！！！！');
        } else {
          this.$axios('share/addShare', this.form, 'POST').then(res => {
            if (res.state == 'succeed') {
              if (this.fileList.length > 0) {
                this.data.shareId = res.message
                this.data.imgId = ''
                this.$refs.upload.submit() //提交图片上传
              } else {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.getShareList()
                this.add_share_dialog = false
              }
            } else {
              this.$message.error('修改失败！！！！！');
            }
          }).catch(err => {
            this.$message.error('系统错误！！！！！' + err);
          })
        }
      },
      //pageSize 改变时会触发
      size_change(pageSize) {
        this.page_size = pageSize
        this.getShareList();
      },
      //currentPage 改变时会触发
      current_change(currentPage) {
        this.current_page = currentPage
        this.getShareList();
      },
      //删除待上传文件回调
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      }
    },
  };
</script>

<style>
</style>