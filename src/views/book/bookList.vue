<template>
  <el-main>
    <!--搜索栏 -->
    <el-form :model="listPram" :inline="true" size="small">
      <el-form-item>
        <el-select v-model="listPram.categoryId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.categoryId"
            :label="item.categoryName"
            :value="item.categoryId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入图书名称"
          v-model="listPram.bookName"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入书架号"
          v-model="listPram.bookPlaceNum"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入作者"
          v-model="listPram.bookAuther"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">查询</el-button>
        <el-button style="color: #ff7670" icon="el-icon-close" @click="resetBtn"
          >重置</el-button
        >
        <el-button
          v-permission="['sys:bookList:add']"
          type="primary"
          icon="el-icon-plus"
          @click="addBtn"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableData" border stripe>
      <el-table-column label="图书名称" prop="bookName"></el-table-column>
      <el-table-column label="图书分类" prop="categoryName"></el-table-column>
      <el-table-column label="书架号" prop="bookPlaceNum"></el-table-column>
      <el-table-column label="作者" prop="bookAuther"></el-table-column>
      <el-table-column label="出版社" prop="bookProduct"></el-table-column>
      <el-table-column label="价格" prop="bookPrice"></el-table-column>
      <el-table-column label="库存" prop="bookStore"></el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button
            v-permission="['sys:bookList:edit']"
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-permission="['sys:bookList:delete']"
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="deleteBtn(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="listPram.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="listPram.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listPram.total"
      background
    >
    </el-pagination>
    <!-- 新增弹框 -->
    <sys-dialog
      :title="dialog.title"
      :height="dialog.height"
      :width="dialog.width"
      :visible="dialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="addModel"
          ref="addRef"
          :rules="rules"
          label-width="80px"
          size="small"
          style="margin-right: 10px"
        >
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="categoryId" label="图书分类">
                <el-select v-model="addModel.categoryId" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.categoryId"
                    :label="item.categoryName"
                    :value="item.categoryId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="bookName" label="图书名称">
                <el-input v-model="addModel.bookName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="bookCode" label="图书编码">
                <el-input v-model="addModel.bookCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="bookPlaceNum" label="书架号">
                <el-input v-model="addModel.bookPlaceNum"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="bookAuther" label="图书作者">
                <el-input v-model="addModel.bookAuther"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="bookProduct" label="出版社">
                <el-input v-model="addModel.bookProduct"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="bookPrice" label="图书价格">
                <el-input v-model="addModel.bookPrice"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="bookStore" label="图书库存">
                <el-input v-model="addModel.bookStore"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import SysDialog from "@/components/dialog/SysDialog.vue";
import {
  getListApi,
  getCateListApi,
  addBookApi,
  editBookApi,
  deleteBookApi,
} from "@/api/book";
export default {
  components: {
    SysDialog,
  },
  data() {
    return {
      //表单验证规则
      rules: {
        categoryId: [
          {
            required: true,
            trigger: "blur",
            message: "请选择图书分类",
          },
        ],
        bookCode: [
          {
            required: true,
            trigger: "blur",
            message: "请填写图书编码",
          },
        ],
        bookPlaceNum: [
          {
            required: true,
            trigger: "blur",
            message: "请填写书架号",
          },
        ],
        bookProduct: [
          {
            required: true,
            trigger: "blur",
            message: "请填写图书出版社",
          },
        ],
        bookAuthor: [
          {
            required: true,
            trigger: "blur",
            message: "请填写作者",
          },
        ],
        bookPrice: [
          {
            required: true,
            trigger: "blur",
            message: "请填写价格",
          },
        ],
        bookStore: [
          {
            required: true,
            trigger: "blur",
            message: "请填写库存",
          },
        ],
        bookName: [
          {
            required: true,
            trigger: "blur",
            message: "请填写图书名称",
          },
        ],
      },
      //表单绑定的数据
      addModel: {
        bookId: "",
        categoryId: "",
        bookName: "",
        categoryName: "",
        bookCode: "",
        bookPlaceNum: "",
        bookProduct: "",
        bookAuthor: "",
        bookPrice: "",
        bookStore: "",
        type: "",
      },
      //弹框属性
      dialog: {
        height: 250,
        width: 650,
        visible: false,
        title: "",
      },
      //下拉数据
      options: [],
      //表格高度
      tableHeight: 0,
      //表格数据
      tableData: [],
      //列表查询参数
      listPram: {
        currentPage: 1,
        pageSize: 10,
        categoryId: "",
        bookName: "",
        bookPlaceNum: "",
        bookAuthor: "",
        total: 0,
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220;
    });
  },
  created() {
    this.getCateList();
    this.getList();
  },
  methods: {
    //列表查询
    async getList() {
      let res = await getListApi(this.listPram);
      if (res && res.code == 200) {
        console.log(res);
        this.tableData = res.data.records;
        this.listPram.total = res.data.total;
      }
    },
    //弹框确定事件
    onConfirm() {
      this.$refs.addRef.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.type == "0") {
            res = await addBookApi(this.addModel);
          } else {
            res = await editBookApi(this.addModel);
          }
          if (res && res.code == 200) {
            //信息提示
            this.$message({ type: "success", message: res.msg });
            //刷新表格
            this.getList();
            this.dialog.visible = false;
          }
        }
      });
    },
    //新增弹框关闭
    onClose() {
      this.dialog.visible = false;
    },
    //查询分类列表
    async getCateList() {
      let res = await getCateListApi();
      if (res && res.code == 200) {
        console.log(res);
        this.options = res.data;
      }
    },
    //页数改变时触发
    currentChange(val) {
      this.listPram.currentPage = val;
      this.getList();
    },
    //页容量改变时触发
    sizeChange(val) {
      this.listPram.pageSize = val;
      this.getList();
    },
    //删除按钮
    async deleteBtn(row) {
      let confirm = await this.$myconfirm("确定删除该数据吗?");
      if (confirm) {
        let res = await deleteBookApi({ bookId: row.bookId });
        if (res && res.code == 200) {
          //信息提示
          this.$message({ type: "success", message: res.msg });
          //刷新表格
          this.getList();
        }
      }
    },
    //编辑按钮
    editBtn(row) {
      this.dialog.title = "编辑图书";
      this.dialog.visible = true;
      //清空表单
      this.$resetForm("addRef", this.addModel);
      //把当前要编辑的数据复制到表单绑定的数据域里面
      this.$objCoppy(row, this.addModel);
      this.addModel.type = "1";
    },
    //新增按钮
    addBtn() {
      this.dialog.title = "新增图书";
      this.dialog.visible = true;
      //清空表单
      this.$resetForm("addRef", this.addModel);
      this.addModel.type = "0";
    },
    //重置按钮
    resetBtn() {
      this.listPram.categoryId = "";
      this.listPram.bookName = "";
      this.listPram.bookPlaceNum = "";
      this.listPram.bookAuthor = "";
      this.getList();
    },
    //搜索按钮
    searchBtn() {
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
