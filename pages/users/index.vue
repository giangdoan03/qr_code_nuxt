<template>
    <div class="p-6 flex-1 bg-white rounded shadow">
        <h2 class="text-2xl font-bold mb-6">👥 Quản lý Người dùng</h2>

        <!-- Bộ lọc -->
        <div class="flex flex-wrap gap-4 mb-4">
            <div>
                <label class="block mb-1 text-sm font-medium">Quyền</label>
                <select v-model="filters.role" class="border rounded px-2 py-1">
                    <option value="">Tất cả</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </div>

            <div>
                <label class="block mb-1 text-sm f\ont-medium">Trạng thái</label>
                <select v-model="filters.status" class="border rounded px-2 py-1">
                    <option value="">Tất cả</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div class="flex items-end gap-2">
                <button @click="applyFilter" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Lọc
                </button>
                <button @click="resetFilter" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                    Xóa lọc
                </button>
            </div>
        </div>

        <!-- Nút thêm user -->
        <div class="mb-4">
            <button @click="openAddModal" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                ➕ Thêm user
            </button>
        </div>

        <!-- Bảng danh sách user -->
        <div v-if="loading" class="text-center py-10">
            Đang tải dữ liệu...
        </div>

        <div v-else class="overflow-x-auto">
            <table class="min-w-full bg-white rounded shadow text-sm">
                <thead>
                <tr class="bg-gray-100">
                    <th class="py-3 px-4 text-left">Tên</th>
                    <th class="py-3 px-4 text-left">Email</th>
                    <th class="py-3 px-4 text-left">Quyền</th>
                    <th class="py-3 px-4 text-left">Trạng thái</th>
                    <th class="py-3 px-4 text-left">Đăng nhập cuối</th>
                    <th class="py-3 px-4 text-left">Ngày tạo</th>
                    <th class="py-3 px-4 text-center">Hành động</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in users" :key="user._id" class="border-t">
                    <td class="py-3 px-4">{{ user.name }}</td>
                    <td class="py-3 px-4">{{ user.email }}</td>
                    <td class="py-3 px-4 capitalize">{{ user.role }}</td>
                    <td class="py-3 px-4">
              <span :class="user.status === 'active' ? 'text-green-600' : 'text-red-600'">
                {{ user.status }}
              </span>
                    </td>
                    <td class="py-3 px-4">{{ formatDate(user.lastLogin) }}</td>
                    <td class="py-3 px-4">{{ formatDate(user.createdAt) }}</td>
                    <td class="py-3 px-4 text-center space-x-3">
                        <button @click="openEditModal(user)" class="hover:text-yellow-600 text-lg">✏️</button>
                        <button @click="deleteUser(user._id)" class="hover:text-red-600 text-lg">🗑️</button>
                        <button @click="toggleStatus(user)" class="hover:text-blue-600 text-lg">
                            {{ user.status === 'active' ? '⏸️' : '✅' }}
                        </button>
                        <button @click="viewHistory(user)" class="hover:text-purple-600 text-lg">📜</button>
                    </td>

                </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="flex justify-between items-center mt-4">
                <button @click="prevPage" :disabled="page === 1"
                        class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50">
                    Trang trước
                </button>
                <span>Trang {{ page }}</span>
                <button @click="nextPage" :disabled="!hasMore"
                        class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50">
                    Trang sau
                </button>
            </div>
        </div>

        <!-- Modal thêm/sửa user -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded shadow w-full max-w-md relative">
                <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-black">✖️</button>
                <h3 class="text-lg font-semibold mb-4">{{ editMode ? 'Sửa' : 'Thêm' }} User</h3>

                <form @submit.prevent="saveUser" class="space-y-4">
                    <input v-model="modalForm.name" placeholder="Tên" class="w-full p-2 border rounded" required/>
                    <input v-model="modalForm.email" placeholder="Email" class="w-full p-2 border rounded" required/>
                    <select v-model="modalForm.role" class="w-full p-2 border rounded">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <select v-model="modalForm.status" class="w-full p-2 border rounded">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        Lưu
                    </button>
                </form>
            </div>
        </div>

        <!-- Modal lịch sử login -->
        <div v-if="showHistory" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded shadow w-full max-w-lg relative">
                <button @click="closeHistory" class="absolute top-2 right-2 text-gray-500 hover:text-black">✖️</button>
                <h3 class="text-lg font-semibold mb-4">Lịch sử đăng nhập</h3>
                <ul class="space-y-2">
                    <li v-for="(log, idx) in selectedHistory" :key="idx" class="border p-2 rounded text-sm">
                        🕒 {{ formatDate(log.date) }} - IP: {{ log.ip }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import {useNuxtApp} from '#app'
import {message} from 'ant-design-vue'

definePageMeta({
    layout: 'default'
})

const {$axios} = useNuxtApp()

const users = ref([])
const loading = ref(false)
const page = ref(1)
const limit = 10
const hasMore = ref(false)

const filters = reactive({
    role: '',
    status: ''
})

const showModal = ref(false)
const editMode = ref(false)
const modalForm = reactive({
    _id: '',
    name: '',
    email: '',
    role: 'user',
    status: 'active'
})

const showHistory = ref(false)
const selectedHistory = ref([])

// Fetch users
const fetchUsers = async () => {
    loading.value = true
    try {
        const res = await $axios.get('/api/users', {
            params: {
                page: page.value,
                limit,
                ...filters
            }
        })

        users.value = res.data.data
        hasMore.value = page.value * limit < res.data.pagination.total
    } catch (err) {
        console.error('❌ Lỗi fetch users:', err)
    } finally {
        loading.value = false
    }
}

const applyFilter = () => {
    page.value = 1
    fetchUsers()
}

const resetFilter = () => {
    filters.role = ''
    filters.status = ''
    page.value = 1
    fetchUsers()
}

const nextPage = () => {
    if (hasMore.value) {
        page.value++
        fetchUsers()
    }
}

const prevPage = () => {
    if (page.value > 1) {
        page.value--
        fetchUsers()
    }
}

const openAddModal = () => {
    editMode.value = false
    Object.assign(modalForm, {
        _id: '',
        name: '',
        email: '',
        role: 'user',
        status: 'active'
    })
    showModal.value = true
}

const openEditModal = (user) => {
    editMode.value = true
    Object.assign(modalForm, {...user})
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
}

const saveUser = async () => {
    try {
        if (editMode.value) {
            await $axios.put(`/api/users/${modalForm._id}`, modalForm)
            message.success('Cập nhật user thành công!')
        } else {
            await $axios.post('/api/users', modalForm)
            message.success('Thêm user thành công!')
        }
        fetchUsers()
        closeModal()
    } catch (err) {
        console.error('❌ Lỗi lưu user:', err)
        message.error('Lỗi lưu user!')
    }
}

const deleteUser = async (id) => {
    if (!confirm('Bạn có chắc muốn xoá user này không?')) return
    try {
        await $axios.delete(`/api/users/${id}`)
        message.success('Xoá user thành công!')
        fetchUsers()
    } catch (err) {
        console.error('❌ Lỗi xoá user:', err)
        message.error('Lỗi xoá user!')
    }
}

const toggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    try {
        await $axios.put(`/api/users/${user._id}/status`, {status: newStatus})
        message.success(`Đã cập nhật trạng thái user!`)
        fetchUsers()
    } catch (err) {
        console.error('❌ Lỗi cập nhật status:', err)
        message.error('Lỗi cập nhật trạng thái!')
    }
}

const viewHistory = (user) => {
    selectedHistory.value = user.loginHistory || []
    showHistory.value = true
}

const closeHistory = () => {
    showHistory.value = false
}

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN')
}

onMounted(() => {
    fetchUsers()
})
</script>

<style scoped>
th,
td {
    white-space: nowrap;
}
</style>
