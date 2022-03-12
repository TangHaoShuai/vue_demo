<template>
	<div style="font-size:small;">
		<el-row style="float: left;">
			<el-input :clearable="true" placeholder="请输入内容" v-model="input3" class="input-with-select"
				style="width: 600px;">
				<el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 100px;">
					<el-option label="用户名" value="1"></el-option>
					<el-option label="账号" value="2"></el-option>
				</el-select>
				<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
			</el-input>
		</el-row>
		<el-row style="float: right;margin-bottom: 10px;">
			<el-button type="primary" @click="add_user_dialog = true">添加用户</el-button>
		</el-row>
		<!-- 表格 -->
		<el-table :data="tableData" border style="width: 100%;text-align: center;">
			<el-table-column fixed prop="phone" label="账户" width="200">
			</el-table-column>
			<el-table-column prop="username" label="用户名" width="200">
			</el-table-column>
			<el-table-column prop="province" label="地址" width="300">
			</el-table-column>
			<el-table-column prop="uDescribe" label="个性签名" width="600">
			</el-table-column>
			<el-table-column prop="age" label="年龄" width="80">
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="80">
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
		<!-- 对话框 查看和修改 -->
		<div>
			<el-dialog :title="form.username" :visible.sync="dialogFormVisible">
				<el-form :model="form">
					<el-form-item label="账户" :label-width="formLabelWidth">
						<el-input v-model="form.phone" autocomplete="off" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="用户名" :label-width="formLabelWidth">
						<el-input v-model="form.username" autocomplete="off" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="地址" :label-width="formLabelWidth">
						<el-input v-model="form.province" autocomplete="off" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="个性签名" :label-width="formLabelWidth">
						<el-input v-model="form.uDescribe" autocomplete="off" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="年龄" :label-width="formLabelWidth">
						<el-input v-model="form.age" autocomplete="off" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="性别" :label-width="formLabelWidth">
						<el-input v-model="form.sex" autocomplete="off" :disabled="disabled"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="updateUser">确 定</el-button>
				</div>
			</el-dialog>
		</div>
		<!-- 添加用户对话框 -->
		<div>
			<el-dialog title="添加用户" :visible.sync="add_user_dialog">
				<el-form :model="form">
					<el-form-item label="账户" :label-width="formLabelWidth">
						<el-input v-model="form.phone" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="用户名" :label-width="formLabelWidth">
						<el-input v-model="form.username" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="地址" :label-width="formLabelWidth">
						<el-input v-model="form.province" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="个性签名" :label-width="formLabelWidth">
						<el-input v-model="form.uDescribe" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="年龄" :label-width="formLabelWidth">
						<el-input v-model="form.age" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="性别" :label-width="formLabelWidth">
						<el-input v-model="form.sex" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="密码" :label-width="formLabelWidth">
						<el-input v-model="form.password" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="add_user_dialog = false">取 消</el-button>
					<el-button type="primary" @click="addUser">确 定</el-button>
				</div>
			</el-dialog>
		</div>
		<!-- 删除对话框 -->
		<div>
			<el-dialog title="警告" :visible.sync="del_user_dialog" width="30%">
				<span>是否确定删除</span>
				<span slot="footer" class="dialog-footer">
					<el-button @click="del_user_dialog = false">取 消</el-button>
					<el-button type="primary" @click="delUser">确 定</el-button>
				</span>
			</el-dialog>


		</div>
	</div>
</template>

<script>
	//用户
	export default {
		// eslint-disable-next-line vue/multi-word-component-names
		name: "user",
		data() {
			return {
				page_sizes: [5, 10, 15, 20, 30],
				add_user_dialog: false, //添加用户对话框
				tmp_del_user: '', //待删除user
				del_user_dialog: false,
				disabled: true,
				formLabelWidth: '120px',
				form: {
					age: '',
					imgge: '',
					phone: '',
					sex: '',
					uDescribe: '',
					username: '',
					password: ''
				},
				dialogFormVisible: false,
				page_size: 5,
				total: 0,
				current_page: 1, //当前页
				select: '',
				input3: '',
				tableData: [],
			};
		},
		onShow() {},
		onLoad() {},
		mounted() {
			this.getUserList()
		},
		methods: {
			//pageSize 改变时会触发
			size_change(pageSize) {
				this.page_size = pageSize
				this.getUserList();
			},
			//currentPage 改变时会触发
			current_change(currentPage) {
				this.current_page = currentPage
				this.getUserList();
			},
			updateUser() {
				if (this.disabled) {
					this.dialogFormVisible = false
				} else {
					if (this.form.phone != '') {
						this.$axios('user/updateUser', this.form, 'POST').then(data => {
							if (data) {
								this.$message({
									message: '修改成功',
									type: 'success'
								});
								this.getUserList()
								this.dialogFormVisible = false
							} else {
								this.$message.error('修改失败！！！！！');
							}
						}).catch(err => {
							this.$message.error('系统错误！！！！！' + err);
						})
					} else {
						this.$message.error('账户为空！！！！！');
					}
				}
			},
			getUserList() {
				var tmp = this.select == '1' ? {
					"current": this.current_page,
					"size": this.page_size,
					"username": this.input3
				} : {
					"current": this.current_page,
					"size": this.page_size,
					"phone": this.input3
				}
				this.$axios('user/selectPage', tmp, 'POST').then(data => {
					this.tableData = data.list
					this.current_page = data.current
					this.total = data.total
					console.log(this.tableData)
				}).catch(err => {
					console.log(err)
				})
			},
			handleClick(row, disabled) {
				this.form = JSON.parse(JSON.stringify(row))
				this.dialogFormVisible = true
				this.disabled = disabled
			},
			showDelDialog(row) {
				this.del_user_dialog = true
				this.tmp_del_user = JSON.parse(JSON.stringify(row))
			},
			delUser() {
				this.del_user_dialog = false
				this.$axios('user/deleteUser', this.tmp_del_user, 'POST').then(data => {
					if (data) {
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUserList()
						this.add_user_dialog = false;
					}
					if (!data) {
						this.$message.error('删除失败！！！！！');
					}
				}).catch(err => {
					this.$message.error('删除错误！！！！！' + err);
				})
			},
			addUser() {
				if (this.form.name != '' && this.form.phone != '' && this.form.password != '') {
					this.$axios('user/addUser', this.form, 'POST').then(data => {
						if (data == '200') {
							this.$message({
								message: '添加成功',
								type: 'success'
							});
							this.getUserList()
							this.add_user_dialog = false;
						}
						if (data == '500') {
							this.$message.error('添加失败！！！！！');
						}
					}).catch(err => {
						this.$message.error('系统错误！！！！！' + err);
					})
				} else {
					this.$message.error('用户名与账户与密码不允许为空！！！！！');
				}
			}
		},
	};
</script>

<style>
</style>