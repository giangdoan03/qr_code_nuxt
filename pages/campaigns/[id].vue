<template>
    <div class="bg-gray-100 min-h-screen flex flex-col gap-6 p-4">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-10 text-gray-500">
            Đang tải dữ liệu...
        </div>

        <!-- Not Found -->
        <div v-else-if="!campaign" class="text-center py-10 text-red-500">
            Không tìm thấy campaign!
        </div>

        <!-- Main Content -->
        <div v-else class="grid md:grid-cols-3 gap-6">
            <!-- Chi tiết -->
            <a-card>
                <template #title>
                    📝 Chi tiết Campaign
                </template>

                <template #extra>
                    <a-badge :color="typeColorMap[campaign.type]">
                        <span class="capitalize">{{ campaign.type }}</span>
                    </a-badge>
                </template>

                <a-descriptions bordered :column="1">
                    <a-descriptions-item label="Tên campaign">{{ campaign.name }}</a-descriptions-item>
                    <a-descriptions-item label="Trạng thái">{{ campaign.status }}</a-descriptions-item>
                    <a-descriptions-item label="Mô tả">{{ campaign.description }}</a-descriptions-item>
                    <a-descriptions-item label="Ngày tạo">{{ formatDate(campaign.createdAt) }}</a-descriptions-item>
                    <a-descriptions-item label="Loại">
                        <a-tag :color="typeColorMap[campaign.type]">{{ campaign.type }}</a-tag>
                    </a-descriptions-item>
                </a-descriptions>

                <div class="mt-6">
                    <!-- Product -->
                    <a-card v-if="campaign.type === 'product'">
                        <template #title>📦 Sản phẩm</template>
                        <a-descriptions :column="2">
                            <a-descriptions-item label="Tên">{{ campaign.content.name }}</a-descriptions-item>
                            <a-descriptions-item label="Giá">{{
                                    formatCurrency(campaign.content.price)
                                }}
                            </a-descriptions-item>
                            <a-descriptions-item label="Link">
                                <a :href="campaign.content.link" target="_blank">{{ campaign.content.link }}</a>
                            </a-descriptions-item>
                        </a-descriptions>
                    </a-card>

                    <!-- vCard -->
                    <a-card v-else-if="campaign.type === 'vcard'">
                        <template #title>👤 vCard</template>
                        <a-descriptions :column="1">
                            <a-descriptions-item label="Họ tên">{{ campaign.content.fullName }}</a-descriptions-item>
                            <a-descriptions-item label="Điện thoại">{{ campaign.content.phone }}</a-descriptions-item>
                            <a-descriptions-item label="Email">{{ campaign.content.email }}</a-descriptions-item>
                            <a-descriptions-item label="Địa chỉ">{{ campaign.content.address }}</a-descriptions-item>
                            <a-descriptions-item label="Website">
                                <a :href="campaign.content.website" target="_blank">{{ campaign.content.website }}</a>
                            </a-descriptions-item>
                        </a-descriptions>
                    </a-card>

                    <!-- Business -->
                    <a-card v-else-if="campaign.type === 'business'">
                        <template #title>🏢 Doanh nghiệp</template>
                        <a-descriptions :column="2">
                            <a-descriptions-item label="Tên công ty">{{campaign.content.companyName }}
                            </a-descriptions-item>
                            <a-descriptions-item label="Địa chỉ">{{ campaign.content.address }}</a-descriptions-item>
                            <a-descriptions-item label="Điện thoại">{{ campaign.content.phone }}</a-descriptions-item>
                            <a-descriptions-item label="Email">{{ campaign.content.email }}</a-descriptions-item>
                            <a-descriptions-item label="Mã số thuế">{{ campaign.content.taxCode }}</a-descriptions-item>
                            <a-descriptions-item label="Website">
                                <a :href="campaign.content.website" target="_blank">{{ campaign.content.website }}</a>
                            </a-descriptions-item>
                        </a-descriptions>
                    </a-card>
                </div>
            </a-card>

            <!-- QR Code + URL -->
            <a-card>
                <template #title>🔗 URL & QR Code</template>
                <div class="text-center mb-4">
                    <p class="text-sm text-gray-500">URL Campaign:</p>
                    <a :href="campaign.url" target="_blank" class="break-all text-blue-500">{{ campaign.url }}</a>
                </div>
                <client-only>
                    <VueQrcode
                        ref="qrRef"
                        :value="campaign.url"
                        :options="{ width: 200 }"
                        class="mx-auto"
                    />
                </client-only>

                <a-button block type="primary" class="mt-4" @click="downloadQR">
                    📥 Tải QR Code
                </a-button>
            </a-card>
            <!-- Mobile Preview -->
            <a-card>
                <template #title>📱 Preview Mobile</template>
                <div class="border rounded-lg p-4 bg-gray-50 shadow-inner text-sm text-gray-700 max-w-xs mx-auto">
                    <p class="font-bold text-lg mb-3 text-center">{{ campaign.name }}</p>

                    <div v-if="campaign.type === 'product'">
                        <p>🛒 {{ campaign.content.name }}</p>
                        <p>💰 {{ formatCurrency(campaign.content.price) }}</p>
                        <a :href="campaign.content.link" target="_blank" class="text-blue-600 hover:underline">
                            🔗 Link sản phẩm
                        </a>
                    </div>

                    <div v-else-if="campaign.type === 'vcard'">
                        <div v-if="campaign.content.avatar" class="mb-3 flex justify-center">
                            <img
                                :src="campaign.content.avatar"
                                alt="Avatar"
                                class="w-24 h-24 rounded-full border object-cover"
                            />
                        </div>
                        <p>👤 {{ campaign.content.fullName }}</p>
                        <p>📞 {{ campaign.content.phone }}</p>
                        <p>✉️ {{ campaign.content.email }}</p>
                        <p>🏠 {{ campaign.content.address }}</p>
                    </div>

                    <div v-else-if="campaign.type === 'business'">
                        <p>🏢 {{ campaign.content.companyName }}</p>
                        <p>📍 {{ campaign.content.address }}</p>
                        <p>📞 {{ campaign.content.phone }}</p>
                        <p>🌐 {{ campaign.content.website }}</p>
                    </div>
                </div>
            </a-card>
        </div>

        <!-- Back link -->
        <div class="text-center mt-6">
            <NuxtLink to="/campaigns/manage" class="text-gray-600 hover:underline">
                ← Quay lại danh sách
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted, nextTick} from 'vue'
import {useRoute} from 'vue-router'
import {useNuxtApp} from '#app'
import VueQrcode from '@chenfengyuan/vue-qrcode'

const route = useRoute()
const {$axios} = useNuxtApp()

const campaign = ref(null)
const loading = ref(true)
const qrRef = ref(null)

const typeColorMap = {
    product: 'blue',
    vcard: 'green',
    business: 'orange'
}

const fetchCampaignDetail = async () => {
    loading.value = true
    try {
        const res = await $axios.get(`/api/campaigns/${route.params.id}`)
        campaign.value = res.data.data
        await nextTick()
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
    if (!number) return '0 ₫'
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(number)
}

const downloadQR = () => {
    const canvas = qrRef.value?.$el
    if (!canvas) return alert('QR chưa sẵn sàng!')
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${campaign.value.name || 'qr-code'}.png`
    link.click()
}

onMounted(fetchCampaignDetail)
</script>

<style scoped>
h3 {
    font-size: 1.2rem;
}
</style>
