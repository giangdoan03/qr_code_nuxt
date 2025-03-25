<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
        <div v-if="loading" class="text-center text-gray-500 py-10">
            Đang tải thông tin...
        </div>

        <div v-else-if="!campaign" class="text-center text-red-500 py-10">
            Không tìm thấy campaign!
        </div>

        <div v-else class="bg-white rounded shadow-lg w-full max-w-md p-6">
            <!-- Tên và mô tả campaign -->
            <h1 class="text-2xl font-bold mb-2">{{ campaign.name }}</h1>
            <p class="text-gray-600 mb-4">{{ campaign.description }}</p>

            <!-- Preview nội dung -->
            <div v-if="campaign.type === 'product'" class="space-y-3">
                <h2 class="font-semibold text-lg mb-2">🛒 Thông tin Sản phẩm</h2>
                <p><strong>Tên sản phẩm:</strong> {{ campaign.content.name }}</p>
                <p><strong>Giá:</strong> {{ formatCurrency(campaign.content.price) }}</p>
                <a
                    :href="campaign.content.link"
                    target="_blank"
                    class="block mt-2 bg-blue-500 text-white text-center px-4 py-2 rounded hover:bg-blue-600"
                >
                    Mua ngay
                </a>
            </div>

            <div v-else-if="campaign.type === 'vcard'" class="space-y-3">
                <!-- Avatar nếu có -->
                <div v-if="campaign.content.avatar" class="flex justify-center mb-4">
                    <img
                        :src="campaign.content.avatar"
                        alt="Avatar"
                        class="w-24 h-24 rounded-full object-cover border shadow"
                        @error="e => e.target.src = '/default-avatar.png'"
                    />

                </div>

                <h2 class="font-semibold text-lg mb-2">👤 Thông tin vCard</h2>
                <p><strong>Họ tên:</strong> {{ campaign.content.fullName }}</p>
                <p><strong>Điện thoại:</strong> {{ campaign.content.phone }}</p>
                <p><strong>Email:</strong> {{ campaign.content.email }}</p>
                <p><strong>Địa chỉ:</strong> {{ campaign.content.address }}</p>

                <a
                    :href="campaign.content.website"
                    target="_blank"
                    class="block mt-2 bg-green-500 text-white text-center px-4 py-2 rounded hover:bg-green-600"
                >
                    Website
                </a>

                <button
                    @click="downloadVCard"
                    class="block w-full mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    📥 Tải vCard
                </button>
            </div>


            <div v-else-if="campaign.type === 'business'" class="space-y-3">
                <h2 class="font-semibold text-lg mb-2">🏢 Thông tin Doanh nghiệp</h2>
                <p><strong>Tên công ty:</strong> {{ campaign.content.companyName }}</p>
                <p><strong>Địa chỉ:</strong> {{ campaign.content.address }}</p>
                <p><strong>Điện thoại:</strong> {{ campaign.content.phone }}</p>
                <p><strong>Email:</strong> {{ campaign.content.email }}</p>
                <a
                    :href="campaign.content.website"
                    target="_blank"
                    class="block mt-2 bg-blue-500 text-white text-center px-4 py-2 rounded hover:bg-blue-600"
                >
                    Truy cập Website
                </a>

                <p class="text-sm mt-2 text-gray-500">Mã số thuế: {{ campaign.content.taxCode }}</p>
            </div>

            <!-- QR Code và URL (nếu có) -->
            <div v-if="campaign.qrCodeUrl" class="mt-6 text-center">
                <p class="mb-2 text-sm text-gray-600">Quét QR để xem thông tin</p>
                <img :src="campaign.qrCodeUrl" alt="QR Code" class="w-40 h-40 mx-auto"/>
            </div>
        </div>
    </div>
</template>

<script setup>

definePageMeta({
    layout: 'empty'
})

import {ref, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {useNuxtApp} from '#app'

const route = useRoute()
const {$axios} = useNuxtApp()

const campaign = ref(null)
const loading = ref(true)

const fetchPublicCampaign = async () => {
    loading.value = true
    try {
        const res = await $axios.get(`/api/campaigns/${route.params.id}`)
        campaign.value = res.data.data

        // SEO Head
        useHead({
            title: campaign.value.name,
            meta: [
                {name: 'description', content: campaign.value.description},
                {property: 'og:title', content: campaign.value.name},
                {property: 'og:description', content: campaign.value.description},
                {property: 'og:image', content: campaign.value.qrCodeUrl}, // Hoặc hình khác nếu có
                {property: 'og:url', content: `https://qr.giang.vn/public/${campaign.value._id}`},
                {name: 'twitter:card', content: 'summary_large_image'}
            ]
        })

    } catch (err) {
        console.error('❌ Không tìm thấy campaign public:', err)
    } finally {
        loading.value = false
    }
}

const formatCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(number)
}

const downloadVCard = () => {
    if (!campaign.value || !campaign.value.content) return

    const { fullName, phone, email, address, website } = campaign.value.content

    const vCardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${fullName}`,
        `TEL:${phone}`,
        `EMAIL:${email}`,
        `ADR:${address}`,
        `URL:${website}`,
        'END:VCARD'
    ].join('\n')

    const blob = new Blob([vCardData], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${fullName || 'vcard'}.vcf`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}


onMounted(() => {
    fetchPublicCampaign()
})
</script>

<style scoped>
h1, h2 {
    text-align: center;
}
</style>
