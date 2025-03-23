<template>
    <div class="bg-white rounded shadow w-full p-6">
        <div v-if="loading" class="text-center py-10">
            Đang tải dữ liệu...
        </div>

        <div v-else-if="!campaign" class="text-center py-10">
            Không tìm thấy campaign!
        </div>

        <div v-else>
            <h2 class="text-2xl font-bold mb-4">📝 Chi tiết Campaign</h2>

            <div class="mb-4">
                <p><strong>Tên campaign:</strong> {{ campaign.name }}</p>
                <p><strong>Mô tả:</strong> {{ campaign.description }}</p>
                <p><strong>Loại:</strong> {{ campaign.type }}</p>
                <p><strong>Trạng thái:</strong> {{ campaign.status }}</p>
                <p><strong>Ngày tạo:</strong> {{ formatDate(campaign.createdAt) }}</p>
            </div>

            <!-- Nội dung content tuỳ theo loại -->
            <div v-if="campaign.type === 'product'" class="bg-gray-50 p-4 rounded mb-4">
                <h3 class="font-semibold mb-2">📦 Thông tin sản phẩm</h3>
                <p><strong>Tên sản phẩm:</strong> {{ campaign.content.name }}</p>
                <p><strong>Giá:</strong> {{ formatCurrency(campaign.content.price) }}</p>
                <p><strong>Link:</strong> <a :href="campaign.content.link" target="_blank" class="text-blue-600 hover:underline">{{ campaign.content.link }}</a></p>
            </div>

            <div v-else-if="campaign.type === 'vcard'" class="bg-gray-50 p-4 rounded mb-4">
                <h3 class="font-semibold mb-2">👤 Thông tin vCard</h3>
                <p><strong>Họ tên:</strong> {{ campaign.content.fullName }}</p>
                <p><strong>Phone:</strong> {{ campaign.content.phone }}</p>
                <p><strong>Email:</strong> {{ campaign.content.email }}</p>
                <p><strong>Địa chỉ:</strong> {{ campaign.content.address }}</p>
                <p><strong>Website:</strong> <a :href="campaign.content.website" target="_blank" class="text-blue-600 hover:underline">{{ campaign.content.website }}</a></p>
            </div>

            <div v-else-if="campaign.type === 'business'" class="bg-gray-50 p-4 rounded mb-4">
                <h3 class="font-semibold mb-2">🏢 Thông tin Doanh nghiệp</h3>
                <p><strong>Tên công ty:</strong> {{ campaign.content.companyName }}</p>
                <p><strong>Địa chỉ:</strong> {{ campaign.content.address }}</p>
                <p><strong>Phone:</strong> {{ campaign.content.phone }}</p>
                <p><strong>Email:</strong> {{ campaign.content.email }}</p>
                <p><strong>Website:</strong> <a :href="campaign.content.website" target="_blank" class="text-blue-600 hover:underline">{{ campaign.content.website }}</a></p>
                <p><strong>Mã số thuế:</strong> {{ campaign.content.taxCode }}</p>
            </div>

            <!-- QR Code & URL nếu có -->
            <div class="mt-6">
                <p><strong>URL Campaign:</strong> <a :href="campaign.url" target="_blank" class="text-blue-600 hover:underline">{{ campaign.url }}</a></p>
                <div v-if="campaign.qrCodeUrl" class="mt-4">
                    <img :src="campaign.qrCodeUrl" alt="QR Code" class="w-40 h-40" />
                </div>
            </div>

            <div class="mt-6">
                <NuxtLink to="/campaigns" class="text-gray-700 hover:underline">← Quay lại danh sách</NuxtLink>
            </div>
            <!-- 💥 Quan trọng: ĐÂY là nơi hiển thị route con edit.vue -->
            <NuxtPage />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'

const route = useRoute()
const { $axios } = useNuxtApp()

const campaign = ref(null)
const loading = ref(true)

const fetchCampaignDetail = async () => {
    loading.value = true
    try {
        const res = await $axios.get(`/api/campaigns/${route.params.id}`)
        campaign.value = res.data.data
    } catch (err) {
        console.error('❌ Lỗi lấy chi tiết campaign:', err)
    } finally {
        loading.value = false
    }
}

const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN')
}

const formatCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
}

onMounted(() => {
    fetchCampaignDetail()
})
</script>

<style scoped>
h3 {
    font-size: 1.2rem;
}
</style>
