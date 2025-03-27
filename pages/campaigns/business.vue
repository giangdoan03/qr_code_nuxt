<template>
    <div class="flex flex-col md:flex-row gap-6">
        <!-- Cột 1: Form tạo doanh nghiệp -->
        <a-card title="🏢 Tạo QR Doanh Nghiệp" class="flex-1">
            <a-form layout="vertical" :model="form" @submit.prevent="submitForm">
                <a-form-item label="Tên công ty" required>
                    <a-input v-model:value="form.companyName" placeholder="Nhập tên công ty" />
                </a-form-item>

                <a-form-item label="Số điện thoại" required>
                    <a-input v-model:value="form.phone" type="tel" placeholder="Nhập số điện thoại" />
                </a-form-item>

                <a-form-item label="Email" required>
                    <a-input v-model:value="form.email" type="email" placeholder="Nhập email liên hệ" />
                </a-form-item>

                <a-form-item label="Website">
                    <a-input v-model:value="form.website" type="url" placeholder="https://example.com" />
                </a-form-item>

                <a-form-item label="Địa chỉ">
                    <a-input v-model:value="form.address" placeholder="Địa chỉ công ty" />
                </a-form-item>

                <a-form-item label="Mô tả công ty">
                    <a-textarea v-model:value="form.description" :rows="4" placeholder="Nhập mô tả" />
                </a-form-item>

                <a-form-item label="Logo công ty (URL)">
                    <a-input v-model:value="form.logo" type="url" placeholder="https://example.com/logo.png" />
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" html-type="submit" :loading="loading" block>
                        {{ loading ? 'Đang tạo...' : 'Tạo QR' }}
                    </a-button>
                </a-form-item>
            </a-form>
        </a-card>

        <!-- Cột 2: Preview -->
        <a-card title="🔍 Preview Doanh Nghiệp" class="w-full md:w-1/3 flex flex-col items-center">
            <div class="border rounded p-4 w-full max-w-xs text-center">
                <!-- Logo -->
                <img
                    v-if="form.logo"
                    :src="form.logo"
                    alt="Logo công ty"
                    class="mx-auto mb-4 w-20 h-20 object-contain border rounded"
                />
                <div
                    v-else
                    class="mx-auto mb-4 w-20 h-20 bg-gray-100 flex items-center justify-center text-gray-400 border rounded"
                >
                    Logo
                </div>

                <p class="font-bold text-lg mb-2">{{ form.companyName || 'Tên công ty' }}</p>
                <p class="text-sm text-gray-600 mb-1">📞 {{ form.phone || 'Số điện thoại' }}</p>
                <p class="text-sm text-gray-600 mb-1">✉️ {{ form.email || 'Email' }}</p>
                <p class="text-sm text-gray-600 mb-1">🌐 {{ form.website || 'Website' }}</p>
                <p class="text-sm text-gray-600 mb-1">🏠 {{ form.address || 'Địa chỉ' }}</p>
                <p class="text-xs text-gray-500 mt-2">{{ form.description || 'Mô tả công ty' }}</p>

                <!-- QR Code -->
                <div class="mt-4">
                    <img
                        v-if="qrResult?.qrCodeUrl"
                        :src="qrResult.qrCodeUrl"
                        alt="QR Code"
                        class="mx-auto w-32 h-32"
                    />
                    <div
                        v-else
                        class="w-32 h-32 bg-gray-100 flex items-center justify-center text-gray-400"
                    >
                        QR Code
                    </div>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { message } from 'ant-design-vue'

definePageMeta({
    layout: 'default'
})

const { $axios } = useNuxtApp()

const form = ref({
    companyName: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    description: '',
    logo: ''
})

const loading = ref(false)
const qrResult = ref(null)

const submitForm = async () => {
    loading.value = true
    try {
        const res = await $axios.post('/api/campaigns/create', {
            name: form.value.companyName,
            type: 'business',
            content: { ...form.value },
            status: 'active'
        })

        message.success('✅ Tạo QR Doanh nghiệp thành công!')
        qrResult.value = res.data.data
    } catch (err) {
        console.error('❌ Lỗi tạo campaign:', err)
        message.error('Đã xảy ra lỗi khi tạo QR Doanh nghiệp!')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* Bổ sung tùy chỉnh nếu cần */
</style>
