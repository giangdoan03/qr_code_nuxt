<template>
    <div class="bg-gray-100 min-h-screen flex flex-col gap-6">
        <!-- Đang tải dữ liệu -->
        <div v-if="loading" class="text-center py-10 text-gray-500">
            Đang tải dữ liệu...
        </div>

        <!-- Không tìm thấy campaign -->
        <div v-else-if="!campaign" class="text-center py-10 text-red-500">
            Không tìm thấy campaign!
        </div>

        <!-- Nội dung chính -->
        <div v-else class="flex flex-col md:flex-row gap-6 max-w-12xl mx-auto">
            <!-- Cột 1: Thông tin chi tiết -->
            <div class="flex-1 bg-white rounded shadow p-6">
                <h2 class="text-2xl font-bold mb-4">📝 Chi tiết Campaign</h2>

                <div class="space-y-2 mb-4">
                    <p><strong>Tên campaign:</strong> {{ campaign.name }}</p>
                    <p><strong>Mô tả:</strong> {{ campaign.description }}</p>
                    <p><strong>Loại:</strong> {{ campaign.type }}</p>
                    <p><strong>Trạng thái:</strong> {{ campaign.status }}</p>
                    <p><strong>Ngày tạo:</strong> {{ formatDate(campaign.createdAt) }}</p>
                </div>

                <!-- Nội dung theo loại -->
                <div v-if="campaign.type === 'product'" class="bg-gray-50 p-4 rounded">
                    <h3 class="font-semibold mb-2">📦 Sản phẩm</h3>
                    <p><strong>Tên:</strong> {{ campaign.content.name }}</p>
                    <p><strong>Giá:</strong> {{ formatCurrency(campaign.content.price) }}</p>
                    <p>
                        <strong>Link:</strong>
                        <a :href="campaign.content.link" target="_blank" class="text-blue-600 hover:underline">
                            {{ campaign.content.link }}
                        </a>
                    </p>
                </div>

                <div v-else-if="campaign.type === 'vcard'" class="bg-gray-50 p-4 rounded">
                    <h3 class="font-semibold mb-2">👤 vCard</h3>
                    <p><strong>Họ tên:</strong> {{ campaign.content.fullName }}</p>
                    <p><strong>Điện thoại:</strong> {{ campaign.content.phone }}</p>
                    <p><strong>Email:</strong> {{ campaign.content.email }}</p>
                    <p><strong>Địa chỉ:</strong> {{ campaign.content.address }}</p>
                    <p>
                        <strong>Website:</strong>
                        <a :href="campaign.content.website" target="_blank" class="text-blue-600 hover:underline">
                            {{ campaign.content.website }}
                        </a>
                    </p>
                </div>

                <div v-else-if="campaign.type === 'business'" class="bg-gray-50 p-4 rounded">
                    <h3 class="font-semibold mb-2">🏢 Doanh nghiệp</h3>
                    <p><strong>Tên công ty:</strong> {{ campaign.content.companyName }}</p>
                    <p><strong>Địa chỉ:</strong> {{ campaign.content.address }}</p>
                    <p><strong>Điện thoại:</strong> {{ campaign.content.phone }}</p>
                    <p><strong>Email:</strong> {{ campaign.content.email }}</p>
                    <p><strong>Mã số thuế:</strong> {{ campaign.content.taxCode }}</p>
                    <p>
                        <strong>Website:</strong>
                        <a :href="campaign.content.website" target="_blank" class="text-blue-600 hover:underline">
                            {{ campaign.content.website }}
                        </a>
                    </p>
                </div>
            </div>

            <!-- Cột 2: Preview Mobile -->
            <div class="w-full md:w-1/3 bg-white rounded shadow p-6 flex flex-col items-center">
                <h3 class="text-lg font-semibold mb-4">📱 Preview Mobile</h3>

                <div class="border rounded-lg p-4 w-full max-w-xs bg-gray-50 shadow-inner text-sm text-gray-700">
                    <p class="font-bold text-lg mb-3">{{ campaign.name }}</p>

                    <div v-if="campaign.type === 'product'">
                        <p>🛒 {{ campaign.content.name }}</p>
                        <p>💰 {{ formatCurrency(campaign.content.price) }}</p>
                        <a :href="campaign.content.link" target="_blank" class="text-blue-600 hover:underline">
                            🔗 Link sản phẩm
                        </a>
                    </div>

                    <div v-else-if="campaign.type === 'vcard'">
                        <p>👤 {{ campaign.content.fullName }}</p>
                        <p>📞 {{ campaign.content.phone }}</p>
                        <p>✉️ {{ campaign.content.email }}</p>
                        <p>🏠 {{ campaign.content.address }}</p>
                    </div>

                    <div v-else-if="campaign.type === 'business'">
                        <p>🏢 {{ campaign.content.companyName }}</p>
                        <p>📍 {{ campaign.content.address }}</p>
                        <p>📞 {{ campaign.content.phone }}</p>
                    </div>
                </div>
            </div>

            <!-- Cột 3: QR Code + URL -->
            <div class="w-full md:w-1/4 bg-white rounded shadow p-6 flex flex-col items-center">
                <h3 class="text-lg font-semibold mb-4">🔗 URL & QR Code</h3>

                <!-- URL Campaign -->
                <div class="text-center mb-4 w-full break-all">
                    <p class="text-sm mb-1 text-gray-500">URL Campaign:</p>
                    <a :href="campaign.url" target="_blank" class="text-blue-600 hover:underline text-sm">
                        {{ campaign.url }}
                    </a>
                </div>

                <!-- QR Code (Canvas) -->
                <VueQrcode
                    ref="qrRef"
                    :value="campaign.url"
                    :options="{ width: 200 }"
                    class="mx-auto"
                />

                <!-- Tải QR -->
                <button
                    @click="downloadQR"
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm mt-4"
                >
                    📥 Tải QR Code
                </button>
            </div>
        </div>

        <!-- Link quay lại -->
        <div class="text-center mt-6">
            <NuxtLink to="/campaigns/manage" class="text-gray-600 hover:underline">
                ← Quay lại danh sách
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import VueQrcode from '@chenfengyuan/vue-qrcode'

const route = useRoute()
const { $axios } = useNuxtApp()

const campaign = ref(null)
const loading = ref(true)
const qrRef = ref(null)

// Lấy chi tiết campaign
const fetchCampaignDetail = async () => {
    loading.value = true
    try {
        const res = await $axios.get(`/api/campaigns/${route.params.id}`)
        campaign.value = res.data.data

        await nextTick() // Đợi DOM render xong
    } catch (err) {
        console.error('❌ Lỗi lấy chi tiết campaign:', err)
    } finally {
        loading.value = false
    }
}

// Định dạng ngày
const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN')
}

// Định dạng giá tiền
const formatCurrency = (number) => {
    if (!number) return '0 ₫'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
}

// Tải QR code
const downloadQR = () => {
    const canvas = qrRef.value?.$el
    if (!canvas) {
        alert('QR chưa sẵn sàng!')
        return
    }

    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${campaign.value.name || 'qr-code'}.png`
    link.click()
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
