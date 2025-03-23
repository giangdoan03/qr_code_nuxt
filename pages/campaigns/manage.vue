<template>
    <div class="bg-white rounded shadow w-full">
        <div class="p-4">
            <h2 class="text-2xl font-bold mb-4">📋 Quản lý QR code</h2>

            <!-- Bộ lọc -->
            <div class="flex flex-wrap gap-4 mb-6">
                <div>
                    <label class="block mb-1 text-sm font-medium">Loại QR code</label>
                    <select v-model="filters.type" class="border rounded px-2 py-2">
                        <option value="">Tất cả</option>
                        <option value="vcard">👤 vCard</option>
                        <option value="product">📦 Sản phẩm</option>
                        <option value="business">🏢 Doanh nghiệp</option>
                    </select>
                </div>

                <div>
                    <label class="block mb-1 text-sm font-medium">Trạng thái</label>
                    <select v-model="filters.status" class="border rounded px-2 py-2">
                        <option value="">Tất cả</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Tạm dừng</option>
                    </select>
                </div>

                <div class="flex items-end gap-2">
                    <button @click="applyFilter" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Lọc
                    </button>
                    <button @click="resetFilter" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Xóa
                        lọc
                    </button>
                    <button @click="exportCSV" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">📤
                        Xuất CSV
                    </button>
                </div>
            </div>

            <!-- Danh sách Campaigns -->
            <div v-if="loading" class="text-center py-10">Đang tải dữ liệu...</div>

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
                            <th class="py-3 px-4 text-left">Số lượt quét</th>
                            <th class="py-3 px-4 text-left">Ngày tạo</th>
                            <th class="py-3 px-4 text-center">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in campaigns" :key="item._id" class="border-t">
                            <td class="py-3 px-4">{{ item.name }}</td>
                            <td class="py-3 px-4 capitalize">{{ item.type }}</td>

                            <td class="py-3 px-4">
                                <label class="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        class="sr-only"
                                        :checked="item.status === 'active'"
                                        @change="toggleStatus(item)"
                                    />
                                    <div :class="['w-11 h-6 rounded-full transition',item.status === 'active' ? 'bg-green-500' : 'bg-gray-300']"></div>
                                </label>
                            </td>

                            <td class="py-3 px-4 text-center">{{ item.scanCount || 0 }}</td>
                            <td class="py-3 px-4">{{ formatDate(item.createdAt) }}</td>

                            <td class="py-3 px-4 text-center space-x-2">
                                <!-- Xem chi tiết campaign -->
                                <NuxtLink
                                    :to="`/campaigns/${item._id}`"
                                    class="text-blue-600 text-lg hover:underline"
                                    title="Xem chi tiết campaign"
                                >
                                    👁️
                                </NuxtLink>

                                <!-- Sửa campaign -->
                                <NuxtLink
                                    :to="`/campaigns/edit/${item._id}`"
                                    class="text-yellow-600 text-lg hover:underline"
                                    title="Chỉnh sửa campaign"
                                >
                                    ✏️
                                </NuxtLink>

                                <!-- Xóa campaign -->
                                <button
                                    @click="deleteCampaign(item._id)"
                                    class="text-red-600 text-lg hover:underline"
                                    title="Xóa campaign"
                                >
                                    🗑️
                                </button>

                                <!-- Link Public Viewer campaign (cho khách xem) -->
                                <a
                                    :href="`/public/${item._id}`"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-green-600 text-lg hover:underline"
                                    title="Xem công khai"
                                >
                                    🌐
                                </a>
                            </td>

                        </tr>
                        </tbody>
                    </table>

                    <!-- Pagination -->
                    <div class="flex justify-between items-center mt-4">
                        <button @click="prevPage" :disabled="page === 1"
                                class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50">Trang trước
                        </button>
                        <span>Trang {{ page }}</span>
                        <button @click="nextPage" :disabled="!hasMore"
                                class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50">Trang sau
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, watch} from 'vue'
import {useNuxtApp} from '#app'

definePageMeta({layout: 'default'})

const {$axios} = useNuxtApp()

// States
const campaigns = ref([])
const loading = ref(true)
const page = ref(1)
const limit = 5
const hasMore = ref(false)

// Filters
const filters = reactive({
    type: '',
    status: ''
})

// Fetch data
const fetchCampaigns = async () => {
    loading.value = true
    try {
        console.log('🔎 Fetching campaigns with filters:', filters, 'Page:', page.value)

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

// Filter handlers
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

// Pagination handlers
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

// CRUD actions
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

const toggleStatus = async (item) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active'
    try {
        await $axios.put(`/api/campaigns/${item._id}/status`, {status: newStatus})
        item.status = newStatus
    } catch (err) {
        console.error('❌ Cập nhật trạng thái thất bại:', err)
    }
}

// Export CSV
const exportCSV = () => {
    const headers = ['Tên Campaign', 'Loại', 'Trạng thái', 'Số lượt quét', 'Ngày tạo']
    const rows = campaigns.value.map(item => [
        item.name,
        item.type,
        item.status,
        item.scanCount || 0,
        formatDate(item.createdAt)
    ])

    let csvContent = 'data:text/csv;charset=utf-8,'
    csvContent += headers.join(',') + '\n'
    rows.forEach(row => {
        csvContent += row.join(',') + '\n'
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'campaigns.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// Utils
const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN')
}

// Auto-fetch on filters change (Optional: realtime filter)
watch(() => [filters.type, filters.status], () => {
    page.value = 1
    fetchCampaigns()
})

// Init fetch
onMounted(() => {
    fetchCampaigns()
})
</script>

<style scoped>
th, td {
    white-space: nowrap;
}
</style>
