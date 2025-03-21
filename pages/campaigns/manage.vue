<template>
    <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">📋 Quản lý Campaign</h2>

        <!-- Bộ lọc -->
        <div class="flex flex-wrap gap-4 mb-6">
            <div>
                <label class="block mb-1 text-sm font-medium">Loại Campaign</label>
                <select v-model="filters.type" class="border rounded px-2 py-1">
                    <option value="">Tất cả</option>
                    <option value="vcard">👤 vCard</option>
                    <option value="product">📦 Sản phẩm</option>
                    <option value="business">🏢 Doanh nghiệp</option>
                </select>
            </div>

            <div>
                <label class="block mb-1 text-sm font-medium">Trạng thái</label>
                <select v-model="filters.status" class="border rounded px-2 py-1">
                    <option value="">Tất cả</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm dừng</option>
                </select>
            </div>

            <div class="flex items-end">
                <button @click="applyFilter" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Lọc
                </button>
                <button @click="resetFilter" class="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                    Xóa lọc
                </button>
            </div>
        </div>

        <!-- Danh sách Campaigns -->
        <div v-if="loading" class="text-center py-10">
            <span>Đang tải dữ liệu...</span>
        </div>

        <div v-else>
            <div v-if="campaigns.length === 0" class="text-center py-10">
                <p>Không tìm thấy campaign nào!</p>
            </div>

            <div v-else class="overflow-x-auto">
                <table class="min-w-full bg-white rounded shadow">
                    <thead>
                    <tr class="bg-gray-100">
                        <th class="py-3 px-4 text-left">Tên Campaign</th>
                        <th class="py-3 px-4 text-left">Loại</th>
                        <th class="py-3 px-4 text-left">Trạng thái</th>
                        <th class="py-3 px-4 text-left">Ngày tạo</th>
                        <th class="py-3 px-4 text-center">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in campaigns" :key="item._id" class="border-t">
                        <td class="py-3 px-4">{{ item.name }}</td>
                        <td class="py-3 px-4 capitalize">{{ item.type }}</td>
                        <td class="py-3 px-4">
                <span :class="item.status === 'active' ? 'text-green-600' : 'text-red-600'">
                  {{ item.status }}
                </span>
                        </td>
                        <td class="py-3 px-4">{{ formatDate(item.createdAt) }}</td>
                        <td class="py-3 px-4 text-center space-x-2">
                            <NuxtLink :to="`/campaigns/${item._id}`" class="text-blue-600 hover:underline">Xem</NuxtLink>
                            <button @click="deleteCampaign(item._id)" class="text-red-600 hover:underline">Xóa</button>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <!-- Pagination -->
                <div class="flex justify-between items-center mt-4">
                    <button @click="prevPage" :disabled="page === 1" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50">Trang trước</button>
                    <span>Trang {{ page }}</span>
                    <button @click="nextPage" :disabled="!hasMore" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50">Trang sau</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useNuxtApp } from '#app'

definePageMeta({
    middleware: 'auth',
    layout: 'default'
})

const { $axios } = useNuxtApp()

const campaigns = ref([])
const loading = ref(true)
const page = ref(1)
const limit = 5
const hasMore = ref(false)

const filters = reactive({
    type: '',
    status: ''
})

// Fetch danh sách campaigns
const fetchCampaigns = async () => {
    loading.value = true
    try {
        const res = await $axios.get('/api/campaigns', {
            params: {
                page: page.value,
                limit: limit,
                type: filters.type,
                status: filters.status
            }
        })

        campaigns.value = res.data.data
        hasMore.value = page.value * limit < res.data.pagination.total
    } catch (err) {
        console.error('❌ Lỗi fetch campaigns:', err)
    } finally {
        loading.value = false
    }
}

const applyFilter = () => {
    page.value = 1
    fetchCampaigns()
}

const resetFilter = () => {
    filters.type = ''
    filters.status = ''
    page.value = 1
    fetchCampaigns()
}

const nextPage = () => {
    if (hasMore.value) {
        page.value++
        fetchCampaigns()
    }
}

const prevPage = () => {
    if (page.value > 1) {
        page.value--
        fetchCampaigns()
    }
}

const deleteCampaign = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa campaign này không?')) return

    try {
        await $axios.delete(`/api/campaigns/${id}`)
        alert('Xóa campaign thành công!')
        fetchCampaigns()
    } catch (err) {
        console.error('❌ Xóa thất bại:', err)
        alert('Xóa thất bại!')
    }
}

const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN')
}

onMounted(() => {
    fetchCampaigns()
})
</script>

<style scoped>
th, td {
    white-space: nowrap;
}
</style>
