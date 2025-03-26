<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useNuxtApp } from '#app'
import { message } from 'ant-design-vue'

definePageMeta({ layout: 'default' })

const { $axios } = useNuxtApp()

const campaigns = ref([])
const loading = ref(false)
const page = ref(1)
const limit = 5
const total = ref(0)

const filters = reactive({
    type: '',
    status: ''
})

// Gọi API
const fetchCampaigns = async () => {
    loading.value = true
    try {
        const res = await $axios.get('/api/campaigns', {
            params: {
                page: page.value,
                limit,
                type: filters.type,
                status: filters.status
            }
        })

        campaigns.value = res.data.data
        total.value = res.data.pagination.total
    } catch (err) {
        message.error('Lỗi khi tải dữ liệu')
        console.error(err)
    } finally {
        loading.value = false
    }
}

// Lọc
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

// Toggle trạng thái
const toggleStatus = async (item) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active'
    try {
        await $axios.put(`/api/campaigns/${item._id}/status`, { status: newStatus })
        item.status = newStatus
        message.success(`Đã chuyển sang "${newStatus}"`)
    } catch (err) {
        message.error('Không thể cập nhật trạng thái')
    }
}

// Xoá
const deleteCampaign = async (id) => {
    try {
        await $axios.delete(`/api/campaigns/${id}`)
        message.success('Xoá thành công!')
        fetchCampaigns()
    } catch (err) {
        message.error('Không thể xoá!')
    }
}

// Xuất CSV
const exportCSV = () => {
    const headers = ['Tên Campaign', 'Loại', 'Trạng thái', 'Lượt quét', 'Ngày tạo']
    const rows = campaigns.value.map(item => [
        item.name, item.type, item.status, item.scanCount || 0, formatDate(item.createdAt)
    ])

    let csv = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n'
    rows.forEach(row => { csv += row.join(',') + '\n' })

    const link = document.createElement('a')
    link.href = encodeURI(csv)
    link.download = 'campaigns.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN')
}

watch(() => [filters.type, filters.status], applyFilter)
onMounted(fetchCampaigns)
</script>

<template>
    <div class="bg-white p-6 rounded shadow">
        <h2 class="text-2xl font-bold">📋 Quản lý QR code</h2>

        <!-- Bộ lọc -->
        <div class="mb-4">
            <a-space wrap>
                <a-select
                    v-model:value="filters.type"
                    placeholder="Loại QR"
                    allow-clear
                    style="min-width: 180px"
                >
                    <a-select-option value="vcard">👤 vCard</a-select-option>
                    <a-select-option value="product">📦 Sản phẩm</a-select-option>
                    <a-select-option value="business">🏢 Doanh nghiệp</a-select-option>
                </a-select>

                <a-select
                    v-model:value="filters.status"
                    placeholder="Trạng thái"
                    allow-clear
                    style="min-width: 180px"
                >
                    <a-select-option value="active">Hoạt động</a-select-option>
                    <a-select-option value="inactive">Tạm dừng</a-select-option>
                </a-select>

                <a-button type="primary" @click="applyFilter">Lọc</a-button>
                <a-button @click="resetFilter">Xoá lọc</a-button>
                <a-button type="success" @click="exportCSV">📤 Xuất CSV</a-button>
            </a-space>
        </div>

        <!-- Bảng dữ liệu -->
        <a-table
            :dataSource="campaigns"
            :loading="loading"
            :pagination="false"
            rowKey="_id"
            bordered
        >
            <a-table-column title="Tên Campaign" dataIndex="name" key="name" />
            <a-table-column title="Loại" dataIndex="type" key="type">
                <template #default="{ text }">
                    <a-tag :color="text === 'vcard' ? 'green' : text === 'product' ? 'blue' : 'orange'">{{ text }}</a-tag>
                </template>
            </a-table-column>

            <a-table-column title="Trạng thái" key="status">
                <template #default="{ record }">
                    <a-switch
                        :checked="record.status === 'active'"
                        checked-children="Hoạt động"
                        un-checked-children="Tạm dừng"
                        @change="() => toggleStatus(record)"
                    />
                </template>
            </a-table-column>

            <a-table-column title="Lượt quét" key="scanCount">
                <template #default="{ record }">
                    {{ record.scanCount || 0 }}
                </template>
            </a-table-column>

            <a-table-column title="Ngày tạo" key="createdAt">
                <template #default="{ record }">
                    {{ formatDate(record.createdAt) }}
                </template>
            </a-table-column>

            <a-table-column title="Hành động" key="actions">
                <template #default="{ record }">
                    <a-space>
                        <NuxtLink :to="`/campaigns/${record._id}`">👁️</NuxtLink>
                        <NuxtLink :to="`/campaigns/edit/${record._id}`">✏️</NuxtLink>
                        <a @click="deleteCampaign(record._id)" class="text-red-600">🗑️</a>
                        <a :href="`/public/${record._id}`" target="_blank">🌐</a>
                    </a-space>
                </template>
            </a-table-column>
        </a-table>

        <!-- Phân trang -->
        <div class="mt-4 text-center">
            <a-pagination
                :current="page"
                :total="total"
                :pageSize="limit"
                show-less-items
                @change="(p) => { page = p; fetchCampaigns() }"
            />
        </div>
    </div>
</template>
