<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="lookPram" label-width="80px" :inline="true" size="mini">
      <el-form-item v-if="userType == '1'" label="读者学号">
        <el-input v-model="lookPram.username"></el-input>
      </el-form-item>
      <el-form-item v-if="userType == '1'" label="读者姓名">
        <el-input v-model="lookPram.learnNum"></el-input>
      </el-form-item>
      <el-form-item label="图书名称">
        <el-input v-model="lookPram.bookName"></el-input>
      </el-form-item>
      <el-form-item label="借书状态">
        <el-select v-model="lookPram.borrowStatus" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="异常状态">
        <el-select v-model="lookPram.returnStatus" placeholder="请选择">
          <el-option
            v-for="item in exceoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="到期状态">
        <el-select v-model="lookPram.timeStatus" placeholder="请选择">
          <el-option
            v-for="item in timetions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="lookPram.applyStatus" placeholder="请选择">
          <el-option
            v-for="item in applytions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button style="color: #ff7670" @click="resetBtn" icon="el-icon-close"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableData" border stripe>
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="bookName" label="图书名称"> </el-table-column>
      <el-table-column prop="bookPlaceNum" label="书架号"> </el-table-column>
      <el-table-column prop="username" label="学号"> </el-table-column>
      <el-table-column prop="learnNum" label="读者"> </el-table-column>
      <el-table-column prop="className" label="班级"> </el-table-column>
      <el-table-column prop="phone" label="电话"> </el-table-column>
      <el-table-column prop="borrowTime" label="借书时间"> </el-table-column>
      <el-table-column prop="returnTime" label="还书时间"> </el-table-column>
      <!-- <el-table-column prop="applyText" label="审核备注"> </el-table-column> -->
      <el-table-column prop="excepionText" label="还书备注"> </el-table-column>
      <el-table-column
        prop="borrowStatus"
        label="借书状态"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.borrowStatus == '0'"
            >审核中</el-tag
          >
          <el-tag v-if="scope.row.borrowStatus == '1'">在借中</el-tag>
          <el-tag type="success" v-if="scope.row.borrowStatus == '2'"
            >已还</el-tag
          >
          <el-tag type="danger" v-if="scope.row.borrowStatus == '3'"
            >拒绝</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="timeStatus"
        label="到期状态"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.timeStatus == '1'">到期</el-tag>
          <el-tag type="success" v-if="scope.row.timeStatus == '0'"
            >未到期</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="applyStatus"
        label="审核状态"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.applyStatus == '0'"
            >待审核</el-tag
          >
          <el-tag type="success" v-if="scope.row.applyStatus == '1'"
            >已审核</el-tag
          >
          <el-tag type="danger" v-if="scope.row.applyStatus == '2'"
            >拒绝</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.applyStatus == '0'"
            v-permission="['sys:borrowLook:apply']"
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="applyBtn(scope.row)"
            >同意借阅</el-button
          >
          <el-button
            v-if="scope.row.borrowStatus != '2'"
            v-permission="['sys:borrowLook:addTime']"
            icon="el-icon-plus"
            type="primary"
            size="small"
            @click="addTimeBtn(scope.row)"
            >续期</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="lookPram.currentPage"
      :page-sizes="[7, 20, 40, 80, 100]"
      :page-size="lookPram.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="lookPram.total"
      background
    >
    </el-pagination>
    <!-- 续期弹框 -->
    <sys-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      :width="dialog.width"
      :height="dialog.height"
      @onConfirm="onConfirm"
      @onClose="onClose"
    >
      <div slot="content">
        <el-form
          :model="addTime"
          ref="addTime"
          :rules="rules"
          label-width="80px"
          :inline="false"
          size="small"
        >
          <el-form-item prop="returnTime" label="还书时间">
            <el-date-picker
              v-model="addTime.returnTime"
              type="date"
              placeholder="选择还书时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import SysDialog from "@/components/dialog/SysDialog.vue";
import { getUserId, getUserType } from "@/utils/auth";
import { getLookBorrowListApi, applyBookApi, addTimeApi } from "@/api/borrow";
export default {
  components: {
    SysDialog
  },
  data() {
    return {
      userType: getUserType(),
      rules: {
        addTime: [
          { required: true, message: "请选择还书时间", trigger: "blur" }
        ]
      },
      addTime: {
        borrowId: "",
        returnTime: ""
      },
      dialog: {
        title: "借书续期",
        visible: false,
        width: 650,
        height: 150
      },
      tableHeight: 0,
      tableData: [],
      applytions: [
        {
          value: "0",
          label: "待审核"
        },
        {
          value: "1",
          label: "已审核"
        },
        {
          value: "2",
          label: "拒绝"
        }
      ],
      timetions: [
        {
          value: "1",
          label: "到期"
        },
        {
          value: "0",
          label: "未到期"
        }
      ],
      exceoptions: [
        {
          value: "1",
          label: "正常还书"
        },
        {
          value: "2",
          label: "异常还书"
        }
      ],
      options: [
        {
          value: "1",
          label: "在借中"
        },
        {
          value: "2",
          label: "已还"
        },
        {
          value: "3",
          label: "拒绝"
        }
      ],
      lookPram: {
        userId: getUserId(),
        total: 0,
        currentPage: 1,
        pageSize: 7,
        username: "",
        learnNum: "",
        bookName: "",
        applyStatus: "",
        borrowStatus: "",
        returnStatus: "",
        timeStatus: ""
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 250;
    });
  },
  created() {
    this.getLookBorrowList();
  },
  methods: {
    onClose() {
      this.dialog.visible = false;
    },
    onConfirm() {
      this.$refs.addTime.validate(async valid => {
        if (valid) {
          let res = await addTimeApi(this.addTime);
          if (res && res.code == 200) {
            this.$message.success(res.msg);
            this.getLookBorrowList();
            this.dialog.visible = false;
          }
        }
      });
    },
    //借书续期
    addTimeBtn(row) {
      console.log(row);
      this.addTime.borrowId = row.borrowId;
      this.dialog.visible = true;
    },
    async applyBtn(row) {
      console.log(row);
      let confirm = await this.$myconfirm("确定审核吗?");
      if (confirm) {
        let res = await applyBookApi({ borrowId: row.borrowId });
        if (res && res.code == 200) {
          this.$message.success(res.msg);
          this.getLookBorrowList();
        }
      }
    },
    searchBtn() {
      this.getLookBorrowList();
    },
    resetBtn() {
      //清空表单
      this.lookPram.username = "";
      this.lookPram.learnNum = "";
      this.lookPram.bookName = "";
      this.lookPram.applyStatus = "";
      this.lookPram.borrowStatus = "";
      this.lookPram.returnStatus = "";
      this.lookPram.timeStatus = "";
      this.getLookBorrowList();
    },
    currentChange(val) {
      this.lookPram.currentPage = val;
      this.getLookBorrowList();
    },
    sizeChange(val) {
      this.lookPram.pageSize = val;
      this.getLookBorrowList();
    },
    async getLookBorrowList() {
      let res = await getLookBorrowListApi(this.lookPram);
      if (res && res.code == 200) {
        this.tableData = res.data.records;
        this.lookPram.total = res.data.total;
      }
    }
  }
};
</script>

<style></style>
