<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getMenuTree, createMenu, updateMenu, deleteMenu, type MenuItem } from '@/api/menu'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增菜单')
const currentMenu = ref<MenuItem | null>(null)

// 表单引用
const menuFormRef = ref<FormInstance>()

// 表单数据
const menuForm = reactive<Partial<MenuItem>>({
  id: 0,
  name: '',
  path: '',
  component: '',
  meta: {
    title: '',
    icon: '',
    permissions: [],
    roles: [],
    hidden: false,
    keepAlive: false,
    activeMenu: ''
  },
  sort: 0,
  parentId: undefined,
  type: 1,
  permission: '',
  visible: true
})

// 表单验证规则
const menuFormRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }]
})

// 菜单树数据
const menuTree = ref<MenuItem[]>([])

// 父级菜单选项
const menuOptions = computed(() => [
  { id: 0, name: '根目录', children: menuTree.value }
])

// 加载菜单树
const loadMenuData = async () => {
  loading.value = true
  try {
    const res = await getMenuTree()
    menuTree.value = res.data
  } catch (err) {
    ElMessage.error('菜单数据加载失败')
  } finally {
    loading.value = false
  }
}

// 新增菜单
const handleAddMenu = () => {
  dialogTitle.value = '新增菜单'
  currentMenu.value = null
  resetMenuForm()
  dialogVisible.value = true
}

// 编辑菜单
const handleEditMenu = (menu: MenuItem) => {
  dialogTitle.value = '编辑菜单'
  currentMenu.value = menu
  Object.assign(menuForm, JSON.parse(JSON.stringify(menu)))
  dialogVisible.value = true
}

// 新增下级菜单
const handleAddChild = (menu: MenuItem) => {
  dialogTitle.value = '新增下级菜单'
  currentMenu.value = null
  resetMenuForm()
  menuForm.parentId = menu.id
  menuForm.type = menu.type === 1 ? 2 : 3
  dialogVisible.value = true
}

// 删除菜单
const handleDeleteMenu = async (menu: MenuItem) => {
  try {
    await deleteMenu(menu.id)
    ElMessage.success(`删除菜单 "${menu.name}" 成功`)
    loadMenuData()
  } catch (e) {
    ElMessage.error('删除失败')
  }
}

// 提交表单
const submitMenuForm = async () => {
  if (!menuFormRef.value) return
  await menuFormRef.value.validate()
  submitLoading.value = true
  try {
    if (currentMenu.value) {
      await updateMenu(menuForm.id!, menuForm)
      ElMessage.success('编辑菜单成功')
    } else {
      await createMenu(menuForm)
      ElMessage.success('新增菜单成功')
    }
    dialogVisible.value = false
    loadMenuData()
  } catch (err) {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

// 重置表单
const resetMenuForm = () => {
  Object.assign(menuForm, {
    id: 0,
    name: '',
    path: '',
    component: '',
    meta: {
      title: '',
      icon: '',
      permissions: [],
      roles: [],
      hidden: false,
      keepAlive: false,
      activeMenu: ''
    },
    sort: 0,
    parentId: undefined,
    type: 1,
    permission: '',
    visible: true
  })
}

// 关闭对话框
const handleDialogClose = () => {
  menuFormRef.value?.resetFields()
  resetMenuForm()
}

onMounted(() => {
  loadMenuData()
})
</script>
