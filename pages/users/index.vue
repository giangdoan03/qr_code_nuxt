<template>
    <a-card title="👥 Quản lý người dùng">
        <!-- Bộ lọc -->
        <div class="mb-4">
            <a-space wrap>
                <a-select v-model:value="filters.role" placeholder="Quyền" allow-clear style="width: 150px">
                    <a-select-option value="admin">Admin</a-select-option>
                    <a-select-option value="user">User</a-select-option>
                </a-select>

                <a-select v-model:value="filters.status" placeholder="Trạng thái" allow-clear style="width: 150px">
                    <a-select-option value="active">Active</a-select-option>
                    <a-select-option value="inactive">Inactive</a-select-option>
                </a-select>

                <a-button type="primary" @click="applyFilter">Lọc</a-button>
                <a-button @click="resetFilter">Xóa lọc</a-button>
                <a-button type="success" @click="openAddModal">+ Thêm user</a-button>
            </a-space>
        </div>

        <a-table
            :columns="columns"
            :data-source="users"
            :loading="loading"
            :pagination="false"
            rowKey="_id"
            bordered
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                    <a-tag :color="record.status === 'active' ? 'green' : 'red'">
                        {{ record.status }}
                    </a-tag>
                </template>

                <template v-if="column.key === 'actions'">
                    <a-space>
                        <a @click="openEditModal(record)">✏️</a>
                        <a @click="deleteUser(record._id)" class="text-red-600">🗑️</a>
                        <a @click="toggleStatus(record)">{{ record.status === 'active' ? '⏸️' : '✅' }}</a>
                        <a @click="viewHistory(record)">📜</a>
                    </a-space>
                </template>

                <template v-if="column.key === 'lastLogin' || column.key === 'createdAt'">
                    {{ formatDate(record[column.key]) }}
                </template>
            </template>
        </a-table>

        <a-pagination
            class="mt-4 text-center"
            :current="page"
            :total="total"
            :page-size="limit"
            show-less-items
            @change="(p) => { page = p; fetchUsers() }"
        />

        <!-- Modal Thêm/Sửa -->
        <a-modal v-model:open="showModal" :title="editMode ? 'Sửa user' : 'Thêm user'" @ok="saveUser" ok-text="Lưu">
            <a-form layout="vertical">
                <a-form-item label="Tên">
                    <a-input v-model:value="modalForm.name" required />
                </a-form-item>
                <a-form-item label="Email">
                    <a-input v-model:value="modalForm.email" required />
                </a-form-item>
                <a-form-item label="Quyền">
                    <a-select v-model:value="modalForm.role">
                        <a-select-option value="user">User</a-select-option>
                        <a-select-option value="admin">Admin</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="Trạng thái">
                    <a-select v-model:value="modalForm.status">
                        <a-select-option value="active">Active</a-select-option>
                        <a-select-option value="inactive">Inactive</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- Modal Lịch sử ĐN -->
        <a-modal v-model:open="showHistory" title="Lịch sử đăng nhập" footer={null}>
            <a-list :data-source="selectedHistory" bordered size="small">
                <template #renderItem="item">
                    <a-list-item>🕒 {{ formatDate(item.date) }} - IP: {{ item.ip }}</a-list-item>
                </template>
            </a-list>
        </a-modal>
    </a-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { message } from 'ant-design-vue'

const { $axios } = useNuxtApp()

const users = ref([])
const loading = ref(false)
const page = ref(1)
const limit = 10
const total = ref(0)

const filters = reactive({ role: '', status: '' })

const showModal = ref(false)
const editMode = ref(false)
const modalForm = reactive({ _id: '', name: '', email: '', role: 'user', status: 'active' })

const showHistory = ref(false)
const selectedHistory = ref([])

const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Quyền', dataIndex: 'role', key: 'role' },
    { title: 'Trạng thái', key: 'status' },
    { title: 'Đăng nhập cuối', key: 'lastLogin' },
    { title: 'Ngày tạo', key: 'createdAt' },
    { title: 'Hành động', key: 'actions' }
]

const fetchUsers = async () => {
    loading.value = true
    try {
        const res = await $axios.get('/api/users', {
            params: { page: page.value, limit, ...filters }
        })
        users.value = res.data.data
        total.value = res.data.pagination.total
    } catch (err) {
        message.error('Lỗi tải dữ liệu')
    } finally {
        loading.value = false
    }
}

const applyFilter = () => { page.value = 1; fetchUsers() }
const resetFilter = () => { filters.role = ''; filters.status = ''; applyFilter() }
const openAddModal = () => { editMode.value = false; Object.assign(modalForm, { _id: '', name: '', email: '', role: 'user', status: 'active' }); showModal.value = true }
const openEditModal = (user) => { editMode.value = true; Object.assign(modalForm, { ...user }); showModal.value = true }
const saveUser = async () => {
    try {
        if (editMode.value) await $axios.put(`/api/users/${modalForm._id}`, modalForm)
        else await $axios.post('/api/users', modalForm)
        message.success(editMode.value ? 'Cập nhật user thành công' : 'Thêm user thành công')
        fetchUsers(); showModal.value = false
    } catch (err) {
        message.error('Lỗi khi lưu user')
    }
}
const deleteUser = async (id) => {
    try {
        await $axios.delete(`/api/users/${id}`)
        message.success('Xóa user thành công')
        fetchUsers()
    } catch (err) {
        message.error('Lỗi khi xóa user')
    }
}
const toggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    try {
        await $axios.put(`/api/users/${user._id}/status`, { status: newStatus })
        message.success('Cập nhật trạng thái thành công')
        fetchUsers()
    } catch (err) {
        message.error('Lỗi trạng thái')
    }
}
const viewHistory = (user) => {
    selectedHistory.value = user.loginHistory || []
    showHistory.value = true
}
const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('vi-VN')
}
onMounted(fetchUsers)
</script>

<style scoped>
.mt-4 { margin-top: 1rem; }
</style>