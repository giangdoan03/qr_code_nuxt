<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
        <a-spin :spinning="loading">
            <a-card
                v-if="campaign"
                class="w-full max-w-md shadow"
                :title="campaign.name"
            >
                <template #extra>
                    <a-tag :color="typeColorMap[campaign.type]" class="capitalize">{{ campaign.type }}</a-tag>
                </template>

                <p class="text-gray-600 mb-4">{{ campaign.description }}</p>

                <!-- Product -->
                <template v-if="campaign.type === 'product'">
                    <div class="text-center mb-4">
                        <img
                            :src="campaign.content.image || 'https://via.placeholder.com/150'"
                            alt="Product"
                            class="w-32 h-32 object-contain mx-auto rounded border"
                        />
                    </div>
                    <a-descriptions bordered size="middle" :column="1">
                        <a-descriptions-item label="Tên sản phẩm">
                            {{ campaign.content.name }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Giá">
                            {{ formatCurrency(campaign.content.price) }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Link">
                            <a :href="campaign.content.link" target="_blank" class="text-blue-600 hover:underline">
                                {{ campaign.content.link }}
                            </a>
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-button
                        type="primary"
                        block
                        class="mt-4"
                        :href="campaign.content.link"
                        target="_blank"
                    >
                        🛒 Mua ngay
                    </a-button>
                </template>

                <!-- vCard -->
                <template v-else-if="campaign.type === 'vcard'">
                    <div class="text-center mb-4">
                        <a-avatar
                            v-if="campaign.content.avatar"
                            :src="campaign.content.avatar"
                            size="large"
                            style="width: 96px; height: 96px; margin: auto"
                        />
                    </div>
                    <a-descriptions
                        title="👤 Thông tin vCard"
                        bordered
                        :column="1"
                        layout="horizontal"
                        size="middle"
                        class="vcard-descriptions"
                    >
                        <a-descriptions-item label="Họ tên">{{ campaign.content.fullName }}</a-descriptions-item>
                        <a-descriptions-item label="Điện thoại">{{ campaign.content.phone }}</a-descriptions-item>
                        <a-descriptions-item label="Email">{{ campaign.content.email }}</a-descriptions-item>
                        <a-descriptions-item label="Địa chỉ">{{ campaign.content.address }}</a-descriptions-item>
                        <a-descriptions-item label="Website">
                            <a :href="campaign.content.website" target="_blank" class="text-blue-600 hover:underline">
                                {{ campaign.content.website }}
                            </a>
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-button
                        block
                        class="mt-4"
                        @click="downloadVCard"
                    >
                        📥 Tải vCard
                    </a-button>
                </template>

                <!-- Business -->
                <template v-else-if="campaign.type === 'business'">
                    <div class="text-center mb-4">
                        <img
                            v-if="campaign.content.logo"
                            :src="campaign.content.logo"
                            alt="Logo"
                            class="w-20 h-20 mx-auto object-contain border rounded"
                        />
                    </div>
                    <a-descriptions title="🏢 Doanh nghiệp" bordered :column="1" size="middle">
                        <a-descriptions-item label="Tên công ty">{{ campaign.content.companyName }}</a-descriptions-item>
                        <a-descriptions-item label="Địa chỉ">{{ campaign.content.address }}</a-descriptions-item>
                        <a-descriptions-item label="Điện thoại">{{ campaign.content.phone }}</a-descriptions-item>
                        <a-descriptions-item label="Email">{{ campaign.content.email }}</a-descriptions-item>
                        <a-descriptions-item label="Website">
                            <a :href="campaign.content.website" target="_blank">{{ campaign.content.website }}</a>
                        </a-descriptions-item>
                        <a-descriptions-item label="Mã số thuế">{{ campaign.content.taxCode }}</a-descriptions-item>
                    </a-descriptions>
                </template>

                <!-- QR -->
                <div class="text-center mt-6" v-if="campaign.qrCodeUrl">
                    <p class="text-sm text-gray-500 mb-2">Quét QR để xem thông tin</p>
                    <img :src="campaign.qrCodeUrl" alt="QR Code" class="w-40 h-40 mx-auto" />
                </div>
            </a-card>
        </a-spin>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'empty'
})

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import { useHead } from '#imports'

const route = useRoute()
const { $axios } = useNuxtApp()

const campaign = ref(null)
const loading = ref(true)

const typeColorMap = {
    product: 'blue',
    vcard: 'green',
    business: 'orange'
}

const fetchPublicCampaign = async () => {
    loading.value = true
    try {
        const res = await $axios.get(`/api/campaigns/${route.params.id}`)
        campaign.value = res.data.data

        useHead({
            title: campaign.value.name,
            meta: [
                { name: 'description', content: campaign.value.description },
                { property: 'og:title', content: campaign.value.name },
                { property: 'og:description', content: campaign.value.description },
                { property: 'og:image', content: campaign.value.qrCodeUrl },
                { property: 'og:url', content: `https://qr.giang.vn/public/${campaign.value._id}` },
                { name: 'twitter:card', content: 'summary_large_image' }
            ]
        })
    } catch (err) {
        console.error('❌ Không tìm thấy campaign public:', err)
    } finally {
        loading.value = false
    }
}

const formatCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(number || 0)
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

onMounted(fetchPublicCampaign)
</script>

<style scoped>
h1, h2 {
    text-align: center;
}
</style>
