<template>
  	<div class="login_page">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer">
          <div class='titleArea rflex'>
            <img class="logo" :src="logo" alt="Hadoop监控系统">
            <span class='title'><i>注册</i></span>
          </div>
		    	<el-form :model="loginForm" :rules="rules" ref="loginForm" class="loginForm">
					<el-form-item prop="username" class="login-item">
					    <span class="loginTips"><icon-svg icon-class="iconuser" /></span>
						<el-input @keyup.enter.native ="submitForm('loginForm')"  class="area" type="text" placeholder="用户名" v-model="loginForm.username" ></el-input>
					</el-form-item>
					<el-form-item prop="password" class="login-item"> 
					    <span class="loginTips"><icon-svg icon-class="iconLock" /></span>
						<el-input @keyup.enter.native ="submitForm('loginForm')" class="area" type="password" placeholder="密码" v-model="loginForm.password"></el-input>
					</el-form-item>
                    <el-form-item prop="repassword" class="login-item"> 
					    <span class="loginTips"><icon-svg icon-class="iconLock" /></span>
						<el-input @keyup.enter.native ="submitForm('loginForm')" class="area" type="password" placeholder="确认密码" v-model="loginForm.repassword"></el-input>
					</el-form-item>
					
					<el-form-item>
				    	<el-button type="primary"  @click="submitForm('loginForm')" class="submit_btn">注册</el-button>
				  	</el-form-item>
				</el-form>
	  		</section>
	  	</transition>
  	</div>
</template>

<script>
	import logoImg from "@/assets/img/satellite.png";
	//import { login } from "@/api/user";
    //import { setToken } from '@/utils/auth'

	export default {
	    data(){
            //检查两次密码输入是否一致
            var validateRePassword = (rule, value, callback) => {
                if (value === '') {
                callback(new Error('请再次输入密码'));
                } else if (value !== this.loginForm.password) {
                callback(new Error('两次输入密码不一致!'));
                } else {
                callback();
                }
            };
            //检查用户名是否可用
            var vaildateUsername = async (rule, value, callback) => {
                const {data:result} = await this.$http.get('User/checkUsername?username='+value);
                if(result[0].amount !== 0){
                    callback(new Error('该用户名已经被使用！'));
                }else{
                    callback();
                }
            };
			return {
				logo:logoImg,
				loginForm: {
					username: '',
                    password: '',
                    repassword:''
				},
				rules: {
					username: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
                        { trigger: 'blur', validator: vaildateUsername }
			        ],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    repassword: [
                        {trigger: 'blur',validator: validateRePassword }
                    ]
				}
			}
		},
		mounted(){
		},
		methods: {
			loginByWechat(){
			},
			showMessage(type,message){
                this.$message({
                    type: type,
                    message: message
                });
            },
		    submitForm(loginForm) {
				this.$refs[loginForm].validate(async(valid) => {
					if (valid) {
                        const {data:result} = await this.$http.post('User/regist',this.loginForm);
                        //console.log(result);
                        //{fieldCount: 0, affectedRows: 1, insertId: 2, serverStatus: 2, warningCount: 0, …}affectedRows: 1changedRows: 0fieldCount: 0insertId: 2message: ""protocol41: trueserverStatus: 2warningCount: 0}
                        if(result.affectedRows > 0){
                            this.showMessage('success','注册成功！');
                            this.$router.push('/login');
                        }else{
                            this.showMessage.error('注册失败！');
                        }
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.login_page{
		position: absolute;
		width: 100%;
		height: 100%;
		background: url(../assets/img/bg9.jpg) no-repeat center center;
		background-size: 100% 100%;
	}
	.form_contianer{
		position: absolute;
		top: 50%;
        left: 50%;
		transform: translate(-50%,-50%);
		background: #fff;
		width:370px;
		border-radius: 5px;
		padding: 25px;
		text-align: center;
		.titleArea{
			justify-content: center;
   			align-items: center;
			text-transform: uppercase;
			font-size: 22px;
			width: 100%;
			padding-bottom: 20px;
			.logo{
				width: 40px;
    			margin-right: 10px;
			}
			.title{
				i{
				   color: #FF6C60;
				}
			}
		}
	
		.loginForm{
			.submit_btn{
				width: 100%;
				padding:13px 0;
				font-size: 16px;
			}
			.loginTips{
				position: absolute;
				left: 10px;
				z-index: 20;
				// color: #FF7C1A;
				font-size: 18px;
				top: 50%;
				transform: translateY(-50%);
			}
	    }
	}

	.manage_tip{
		margin-bottom:20px;
		.title{
			font-family: cursive;
			font-weight: bold;
			font-size: 26px;
			color:#fff;
		}
		.logo{
			width:60px;
			height:60px;
		}
	}
	
	.tiparea{
		text-align:left;
		font-size: 12px;
		color: #4cbb15;
		padding: 10px 0;
		.tip{
			margin-left: 54px;
		}
	}
	
	.form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}
	.loginForm{
		.el-button--primary{
			background-color:#FF7C1A;
			border:1px solid #FF7C1A;
		}
	}
	.sanFangArea{
		border-top: 1px solid #DCDFE6;
		padding: 10px 0;
		display: none;
		.title{
			font-size: 14px;
			color: #8b9196;
			margin-bottom: 10px;
		}
		ul{
			li{
				flex:1;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				.svg-icon{
					font-size: 24px;
				}
			}
		}
	}
</style>
