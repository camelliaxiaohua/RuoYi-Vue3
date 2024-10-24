<template>
  <div class="app-container">
     <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="身份主键" prop="identityId" v-show=false>
        <el-input
          v-model="queryParams.identityId"
          placeholder="请输入身份主键"
          clearable
          @keyup.enter="handleQuery"
          v-show=false
        />
      </el-form-item>
      <el-form-item label="身份名称" prop="identityName">
        <el-input
          v-model="queryParams.identityName"
          placeholder="请输入身份名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份标识" prop="identityType">
        <el-input
          v-model="queryParams.identityType"
          placeholder="请输入身份标识"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> 

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['housdata:datas:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['housdata:datas:edit']"
          v-show= false
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['housdata:datas:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['housdata:datas:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="datasList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户名" align="center" prop="username">
        {{ data.queryParams.username }}
      </el-table-column>
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="身份名称" align="center" prop="identityName" />
      <el-table-column label="身份标识" align="center" prop="identityType" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['housdata:datas:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['housdata:datas:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" v-model="open" width="500px" append-to-body >
      <el-form ref="datasRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="身份名称" prop="identityName">
          <el-input v-model="form.identityName" placeholder="请输入身份名称" />
        </el-form-item>
        <el-form-item label="身份标识" prop="identityType">
          <el-input v-model="form.identityType" placeholder="请输入身份标识" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel" v-show=false>取 消</el-button>
      </div>
    </template>
    </el-dialog>
  </div>

</template>

<script setup name="Datas">
import { ref, reactive, toRefs, onMounted } from "vue";
import { useRoute } from "vue-router"; // 用于获取路由参数
import { listDatas, getDatas, delDatas, addDatas, updateDatas } from "@/api/housdata/datas";

const { proxy } = getCurrentInstance();
const route = useRoute(); // 使用 useRoute 获取当前路由信息

const datasList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    identityId: route.params.identityId || null, // 从路由参数中获取 identityId
    username: route.query.username || null, // 从查询参数中获取 username
    identityName: null,
    identityType: null,
  },
  rules: {}
});

 
const { queryParams, form, rules } = toRefs(data);
/** 查询用户身份标识列表 */
function getList() {
  listDatas({ ...queryParams.value }).then((response) => {
    datasList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}




/** 重置查询表单 */
function reset() {
  form.value = {
    identityId: null,
    id: null,
    identityName: null,
    identityType: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("datasRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.identityId);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加用户身份标识";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value; // 使用选中行的 id
  // 获取用户身份数据时传递 id
  getDatas(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改用户身份标识";
  });
}


/** 提交按钮操作 */
function submitForm() {
  proxy.$refs["datasRef"].validate((valid) => {
    if (valid) {
      form.value.identityId = queryParams.value.identityId; // 确保 identityId 被传递
      if (form.value.id != null) {
        // 修改操作
        updateDatas(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        // 新增操作
        addDatas({ ...form.value, identityId: queryParams.value.identityId }).then(() => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
/** 删除按钮操作 */
function handleDelete(row) {
  const _id = row.id || ids.value; 
  proxy.$modal.confirm('是否确认删除用户身份标识编号为"' + _id + '"的数据项？').then(() => {
    // 删除时直接传递 id
    return delDatas(_id); // 传递 id
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  // 导出时传递 identityId
  proxy.download("housdata/datas/export", { ...queryParams.value, identityId: queryParams.value.identityId }, `datas_${new Date().getTime()}.xlsx`);
}

// 当组件挂载时，自动查询数据
onMounted(() => {
  if (queryParams.value.identityId) {
    getList(); // 如果 identityId 存在，则立即加载数据
  }
});
</script>
