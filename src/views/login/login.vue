<template>
    <div id="poster" style="font-size:small;">
        <div class="main">
            <div class="body">
                <div class="login">
                    <div style="margin-bottom: 10px;color: #ffffff ;">智慧社区管理系统</div>
                    <div>
                        <el-input style="width: 300px" placeholder="请输入账号" type="tel" :clearable="true"
                            v-model="username">
                        </el-input>
                    </div>
                    <div>
                        <el-input style="width: 300px" placeholder="请输入密码" v-model="password" show-password></el-input>
                    </div>
                    <div>
                        <el-button style="width: 300px" @click="login" type="success">登录</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        // eslint-disable-next-line vue/multi-word-component-names
        name: "article_t",
        data() {
            return {
                username: "",
                password: "",
            };
        },
        methods: {
            login() {
                let mzz = this
                let data = {
                    username: mzz.username,
                    password: mzz.password
                }
                if (mzz.username == '' || mzz.password == '') {
                    mzz.$message.error('别闹了，请输入账户密码！！！！！');
                    return
                }
                mzz.$axios('admin-user/adminLogin', data, 'POST').then(data => {
                    if (data) {
                        mzz.$message.success('登录成功！！！！！');
                        this.$router.push({
                            path: '/home'
                        })
                    } else {
                        mzz.$message.error('账户密码错误！！！！！');
                    }
                }).catch(err => {
                    mzz.$message.error('系统错误！！！！！' + err);
                })
            }
        }
    };
</script>

<style>
    #poster {
        background: url("../../assets/login.jpg") no-repeat;
        background-position: center;
        height: 100%;
        width: 100%;
        background-size: cover;
        position: fixed;
    }

    .main {
        width: 100%;
        height: 654px;
        display: flex;
        flex-wrap: wrap;
        margin-top: 100px;
    }

    .header {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 70px;
        background-color: rgb(235, 245, 237);
        align-content: center;
    }

    .header>h3 {
        width: 50%;
    }

    .body {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 584px;
        align-content: center;
        justify-content: center;
    }

    .login {
        width: 500px;
        height: 350px;
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
        border: 1px solid rgb(216, 225, 232);
        border-radius: 20px;
    }

    .login>div {
        width: 60%;
        height: 40px;
        margin-top: 10px;
        font-size: 30px;
    }

    /* 这是登录 div 的css文件 */
    .login>div:first-child {
        width: 60%;
        height: 40px;
        margin-top: -20px;
        font-size: 30px;
    }
</style>