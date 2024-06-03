<template>
  <div class="logincontainer">
    <el-form
      class="loginForm"
      :model="loginForm"
      ref="loginForm"
      :rules="rules"
      label-width="80px"
      :inline="false"
      size="normal"
    >
      <el-form-item>
        <span class="loginTitle">高校图书管理系统</span>
      </el-form-item>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="userType">
        <el-radio-group v-model="loginForm.userType">
          <el-radio :label="'0'">读者</el-radio>
          <el-radio :label="'1'">管理员</el-radio>
        </el-radio-group>
        <span
          @click="registerBtn"
          style="
            color: #ff7670;
            float: right;
            margin-right: 15px;
            cursor: pointer;
          "
          >无账号，读者注册</span
        >
      </el-form-item>
      <el-form-item>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-button type="primary" class="mybtn" @click="onSubmit"
              >登录</el-button
            >
          </el-col>
          <el-col :span="12" :offset="0">
            <el-button class="mybtn">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <!-- 注册弹框 -->
    <sys-dialog
      :title="dialog.title"
      :width="dialog.width"
      :height="dialog.height"
      :visible="dialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="addModel"
          ref="addRef"
          :rules="registeRules"
          label-width="80px"
          size="small"
          style="margin-right: 30px"
        >
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="learnNum" label="姓名">
                <el-input v-model="addModel.learnNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="phone" label="电话">
                <el-input v-model="addModel.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="username" label="学号">
                <el-input v-model="addModel.username"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="className" label="班级">
                <el-input v-model="addModel.className"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="idCard" label="身份证">
                <el-input v-model="addModel.idCard"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="password" label="密码">
                <el-input type="password" v-model="addModel.password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="confirmPassword" label="确认密码">
                <el-input type="password" v-model="addModel.confirmPassword"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="性别">
                <el-radio-group v-model="addModel.sex">
                  <el-radio :label="'0'">男</el-radio>
                  <el-radio :label="'1'">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sys-dialog>
  </div>
</template>

<script>
import {setUserType} from '@/utils/auth'
import { registerApi } from "@/api/reader";
import SysDialog from "@/components/dialog/SysDialog.vue";
export default {
  components: {
    SysDialog,
  },
  data() {
    return {
      registeRules: {
        learnNum: [{ required: true, message: "请填写姓名", trigger: "blur" }],
        username: [{ required: true, message: "请填写学号", trigger: "blur" }],
        idCard: [
          { required: true, message: "请填写身份证号", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请填写电话", trigger: "blur" }],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }],
        confirmPassword: [
          { required: true, message: "请填写确认密码", trigger: "blur" },
        ],
        className: [{ required: true, message: "请填写班级", trigger: "blur" }],
      },
      //表单属性
      addModel: {
        type: "",
        readerId: "",
        learnNum: "",
        username: "",
        idCard: "",
        sex: "",
        phone: "",
        password: "",
        confirmPassword: "",
        // type: "",
        className: "",
      },
      dialog: {
        title: "读者注册",
        width: 650,
        height: 250,
        visible: false,
      },
      //登录表单绑定数据源
      loginForm: {
        username: "",
        password: "",
        userType: "", //0：读者  1： 管理员
      },
      //表单验证规则
      rules: {
        username: [
          {
            trigger: "change",
            required: true,
            message: "请输入用户名",
          },
        ],
        password: [
          {
            trigger: "change",
            required: true,
            message: "请输入密码",
          },
        ],
        userType: [
          {
            trigger: "change",
            required: true,
            message: "请选择用户类型",
          },
        ],
      },
    };
  },
  methods: {
    onClose() {
      this.dialog.visible = false;
    },
    onConfirm() {
      if (this.addModel.confirmPassword != this.addModel.password) {
        this.$message.warning("两次密码不一致!");
        return;
      }
      this.$refs.addRef.validate(async (valid) => {
        if (valid) {
          let res = await registerApi(this.addModel);
          if (res && res.code == 200) {
            this.$message.success(res.msg);
            this.dialog.visible = false;
          }
        }
      });
    },
    //读者注册
    registerBtn() {
      //清空表单
      this.$resetForm("addRef", this.addModel);
      this.dialog.visible = true;
    },
    //登录提交事件
    onSubmit() {
      //表单验证
      this.$refs.loginForm.validate((valid) => {
        //验证通过才提交表单
        if (valid) {
          this.loading = true;
          setUserType(this.loginForm.userType)
          //调用store里面的login方法
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              //跳转路由
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch((error) => {
              this.loading = false;
              if (error.response && error.response.status === 400 && error.response.data.error === "账号/密码错误") {
                // 密码错误的提示逻辑
                this.$message.error('账号或密码错误，请重新输入！');
              }
            });
        }
      });
    },
  },
};
</script>

<style  scoped>
.logincontainer {
  height: 100%;
  background: #fff;
  background-image: url("../../assets/images/login_bg.png");
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: 100% 100%;
}
.loginForm {
  height: 350px;
  width: 450px;
  background: #fff;
  padding: 35px 20px;
  border-radius: 10px;
}
.loginTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  color: #409eff;
}
.logincontainer ::v-deep .el-form-item__content {
  margin-left: 0px !important;
}
.mybtn {
  width: 100%;
}
</style>
