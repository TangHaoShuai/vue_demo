<template>
    <div style="font-size:small;">
        <!-- 搜索 -->
        <el-row style="float: left;margin-bottom: 20px;">
            <el-input :clearable="true" placeholder="请输入内容" v-model="inputValue" class="input-with-select"
                style="width: 600px;">
                <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 100px;">
                    <el-option label="状态" value="1"></el-option>
                    <el-option label="内容" value="2"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="getCommunityServicesList"></el-button>
            </el-input>
        </el-row>

        <!-- 表格 -->
        <el-table :data="tableData" border style="width: 100%;text-align: center;">
            <el-table-column fixed prop="uuid" label="事件ID" width="300">
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
            <el-table-column prop="message" label="内容" width="600">
            </el-table-column>
            <el-table-column prop="date" label="时间" width="200">
            </el-table-column>
            <el-table-column prop="state" label="状态" width="150">
            </el-table-column>

            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row,true)" type="text" size="small">查看</el-button>
                    <el-button @click="handleClick(scope.row,false)" type="text" size="small">编辑</el-button>
                    <el-button @click="del_cs(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
        <!-- 分页 -->
        <el-pagination @current-change="current_change" @size-change="size_change" :page-sizes="page_sizes"
            style="margin-top: 20px;" :current-page="current_page" :page-size="page_size" background
            layout="sizes, prev, pager, next" :total="total">
        </el-pagination>
        <!-- beg删除对话框 -->
        <div>
            <el-dialog title="警告" :visible.sync="del_CS_dialog" width="30%" append-to-body>
                <span>是否确定删除</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="del_CS_dialog = false">取 消</el-button>
                    <el-button type="primary" @click="del_CS">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <!-- end -->
        <!-- 修改对话框 -->
        <div>
            <el-dialog title="修改数据" :visible.sync="up_cs_dialog" :close-on-click-modal="false">
                <el-form :model="form">
                    <el-form-item label="消息ID" :label-width="formLabelWidth">
                        <el-input v-model="form.uuid" :disabled="true" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="发布人ID" :label-width="formLabelWidth">
                        <el-input v-model="form.userid" autocomplete="off" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="内容" :label-width="formLabelWidth">
                        <el-input v-model="form.message" autocomplete="off" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="时间" :label-width="formLabelWidth">
                        <el-input v-model="form.date" autocomplete="off" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" :label-width="formLabelWidth">
                        <el-select v-model="form.state" placeholder="选择状态" style="width: 100%;" :disabled="disabled">
                            <el-option label="等待处理" value="等待处理"></el-option>
                            <el-option label="正在处理" value="正在处理"></el-option>
                            <el-option label="处理完成" value="处理完成"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <!-- 更新进度按钮 -->
                <el-button type="primary" @click="add_schedule_dialog = true" style="width: 100%;text-align: center;"
                    :disabled="disabled">
                    点击处理进度
                </el-button>
                <!-- 对话框进度表格 -->
                <el-table :data="form.scheduleList" border style="width: 100%;text-align: center;">
                    <el-table-column prop="title" label="处理标题" width="150">
                    </el-table-column>
                    <el-table-column prop="message" label="处理消息" width="379">
                    </el-table-column>
                    <el-table-column prop="date" label="处理时间" width="200">
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button @click="up_schedule_item(scope.row)" type="text" size="small"
                                :disabled="disabled">编辑</el-button>
                            <el-button @click="del_schedule_item(scope.row)" type="text" size="small"
                                :disabled="disabled">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="up_cs_dialog = false">取 消</el-button>
                    <el-button type="primary" @click="upCs" :disabled="disabled">确 定</el-button>
                </div>
                <!-- beg修改进度的对话框 -->
                <el-dialog title="修改进度" :visible.sync="up_schedule_dialog" :close-on-click-modal="false" append-to-body>
                    <el-form :model="from_schedule">
                        <el-form-item label="标题" :label-width="formLabelWidth">
                            <el-input v-model="from_schedule.title" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="处理消息" :label-width="formLabelWidth">
                            <el-input v-model="from_schedule.message" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="up_schedule_dialog = false">取 消</el-button>
                        <el-button type="primary" @click="up_schedule">确 定</el-button>
                    </div>
                </el-dialog>
                <!-- end -->
                <!-- beg添加进度的对话框 -->
                <el-dialog title="添加进度" :visible.sync="add_schedule_dialog" :close-on-click-modal="false"
                    append-to-body>
                    <el-form :model="from_schedule">
                        <el-form-item label="标题" :label-width="formLabelWidth">
                            <el-input v-model="from_schedule.title" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="处理消息" :label-width="formLabelWidth">
                            <el-input v-model="from_schedule.message" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="add_schedule_dialog = false">取 消</el-button>
                        <el-button type="primary" @click="add_schedule">确 定</el-button>
                    </div>
                </el-dialog>
                <!-- end -->
                <!-- beg删除对话框 -->
                <el-dialog title="警告" :visible.sync="del_schedule_dialog" width="30%" append-to-body>
                    <span>是否确定删除</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="del_schedule_dialog = false">取 消</el-button>
                        <el-button type="primary" @click="del_schedule">确 定</el-button>
                    </span>
                </el-dialog>
                <!-- end -->
            </el-dialog>

        </div>
    </div>

</template>

<script>
    // 新闻
    export default {
        // eslint-disable-next-line vue/multi-word-component-names
        name: "community_services",
        data() {
            return {
                del_schedule_dialog: false, //删除进度提示对话框
                up_schedule_dialog: false, //服务进度修改对话框
                add_schedule_dialog: false, //服务进度添加对话框
                up_cs_dialog: false, //服务对话框
                del_CS_dialog: false, //服务删除对话框
                form: {
                    uuid: '', //uuid
                    message: '', //内容
                    userid: '', //发布人
                    date: '', //时间
                    state: '', //状态
                },
                from_schedule: {
                    uuid: '',
                    title: '', //消息标题
                    message: '', //处理的消息
                    serviceid: '', //对应服务uuid
                },
                inputValue: '', //搜索框值
                page_sizes: [5, 10, 15, 20, 30],
                page_size: 5, //每页显示数量
                total: 0, //总数
                current_page: 1, //当前页
                select: '2',
                tableData: [],
                formLabelWidth: '120px',
                disabled: false,
            };
        },
        mounted() {
            this.getCommunityServicesList()
        },
        methods: {
            //删除进度
            del_schedule() {
                let mzz = this
                if (mzz.from_schedule.uuid != '') {
                    mzz.$axios('schedule/deleteSchedule', mzz.from_schedule, 'POST').then(data => {
                        if (data) {
                            mzz.$message({
                                message: '进度删除成功',
                                type: 'success'
                            });
                            mzz.del_schedule_dialog = false
                            mzz.get_schedule()
                        } else {
                            mzz.$message.error('进度删除失败！！！！！');
                        }
                    }).catch(err => {
                        mzz.$message.error('系统错误！！！！！' + err);
                    })
                } else {
                    mzz.$message.error('数据错误！！！！');
                }
            },
            //进度修改
            up_schedule() {
                let mzz = this
                if (mzz.from_schedule.uuid != '') {
                    mzz.$axios('schedule/updateSchedule', mzz.from_schedule, 'POST').then(data => {
                        if (data) {
                            mzz.$message({
                                message: '进度更新成功',
                                type: 'success'
                            });
                            mzz.up_schedule_dialog = false
                            mzz.get_schedule()
                        } else {
                            mzz.$message.error('进度更新失败！！！！！');
                        }
                    }).catch(err => {
                        mzz.$message.error('系统错误！！！！！' + err);
                    })
                } else {
                    mzz.$message.error('数据错误！！！！');
                }
            },
            //对话框里面进度表格的工具栏
            up_schedule_item(row) {
                this.up_schedule_dialog = true
                this.from_schedule = row
            },
            //对话框里面进度表格的工具栏
            del_schedule_item(row) {
                this.del_schedule_dialog = true
                this.from_schedule = row
            },
            //刷新进度（重修查数据库赋值）
            get_schedule() {
                let mzz = this
                if (mzz.from_schedule.serviceid != '') {
                    mzz.$axios('schedule/getSchedule', mzz.from_schedule, 'POST').then(data => {
                        if (data.length > 0) {
                            mzz.form.scheduleList = data
                        } else {
                            mzz.$message.error('进度加载失败！！！！！');
                        }
                    }).catch(err => {
                        mzz.$message.error('系统错误！！！！！' + err);
                    })
                } else {
                    mzz.$message.error('数据错误！！！！');
                }
            },
            // 添加进度
            add_schedule() {
                let mzz = this
                mzz.from_schedule.serviceid = mzz.form.scheduleList[0].serviceid
                if (mzz.from_schedule.title != '' && mzz.from_schedule.message != '') {
                    mzz.$axios('schedule/addSchedule', mzz.from_schedule, 'POST').then(data => {
                        if (data) {
                            mzz.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            mzz.get_schedule() //重修查询加载进度
                            mzz.add_schedule_dialog = false
                        } else {
                            mzz.$message.error('添加失败！！！！！');
                        }
                    }).catch(err => {
                        mzz.$message.error('系统错误！！！！！' + err);
                    })
                } else {
                    mzz.$message.error('小伙子记得填数据！！！！');
                }

            },
            //更新服务的基本信息（不包括进度）
            upCs() {
                let mzz = this
                if (mzz.form.uuid != '') {
                    mzz.$axios('community-services/updateCommunityServices', mzz.form, 'POST').then(data => {
                        if (data) {
                            mzz.$message({
                                message: '更新成功',
                                type: 'success'
                            });
                            mzz.getCommunityServicesList(); //重修查询加载进度
                            mzz.add_schedule_dialog = false
                        } else {
                            mzz.$message.error('更新失败！！！！！');
                        }
                    }).catch(err => {
                        mzz.$message.error('系统错误！！！！！' + err);
                    })
                } else {
                    mzz.$message.error('数据错误！！！！');
                }
            },
            //删除服务
            del_CS() {
                let mzz = this
                if (mzz.form.uuid != '') {
                    mzz.$axios('community-services/deleteCommunityServices', mzz.form, 'POST').then(data => {
                        if (data) {
                            mzz.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            mzz.getCommunityServicesList(); //重修查询加载进度
                            mzz.del_CS_dialog = false
                        } else {
                            mzz.$message.error('删除失败！！！！！');
                        }
                    }).catch(err => {
                        mzz.$message.error('系统错误！！！！！' + err);
                    })
                } else {
                    mzz.$message.error('数据错误！！！！');
                }
            },
            //pageSize 改变时会触发
            size_change(pageSize) {
                this.page_size = pageSize
                this.getCommunityServicesList();
            },
            //currentPage 改变时会触发
            current_change(currentPage) {
                this.current_page = currentPage
                this.getCommunityServicesList();
            },
            getCommunityServicesList() {
                let mzz = this
                var tmp = this.select == '1' ? {
                    "current": this.current_page,
                    "size": this.page_size,
                    "state": this.inputValue
                } : {
                    "current": this.current_page,
                    "size": this.page_size,
                    "message": this.inputValue
                }
                mzz.$axios('community-services/selectPage', tmp, 'POST').then(data => {
                    mzz.tableData = data.list
                    mzz.current_page = data.current
                    mzz.total = data.total
                }).catch(err => {
                    console.log(err)
                })
            },
            //表单工具栏监听
            handleClick(row, disabled) {
                this.form = JSON.parse(JSON.stringify(row))
                this.up_cs_dialog = true
                this.disabled = disabled
            },
            del_cs(row) {
                this.form = JSON.parse(JSON.stringify(row))
                this.del_CS_dialog = true
            }
        },
    };
</script>

<style>
</style>