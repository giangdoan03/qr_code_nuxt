<template>
    <div class="flex flex-col md:flex-row gap-6 p-6">
        <!-- Cột nhập liệu -->
        <div class="flex-1 bg-white rounded shadow p-6">
            <h2 class="text-xl font-bold mb-4">Tạo QR vCard</h2>

            <form @submit.prevent="createVCardQR" class="space-y-4">
                <input
                    v-model="form.name"
                    placeholder="Tên"
                    class="border p-2 rounded w-full"
                    required
                />
                <input
                    v-model="form.phone"
                    placeholder="Số điện thoại"
                    class="border p-2 rounded w-full"
                    required
                />
                <input
                    v-model="form.email"
                    placeholder="Email"
                    type="email"
                    class="border p-2 rounded w-full"
                />
                <input
                    v-model="form.website"
                    placeholder="Website"
                    type="url"
                    class="border p-2 rounded w-full"
                />

                <button
                    type="submit"
                    :disabled="loading"
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                >
                    {{ loading ? "Đang tạo..." : "Tạo QR" }}
                </button>
            </form>
        </div>

        <!-- Cột preview -->
        <div class="w-full md:w-1/3 bg-white rounded shadow p-6 flex flex-col items-center">
            <h3 class="text-lg font-semibold mb-4">Preview vCard</h3>

            <div class="border rounded p-4 w-full max-w-xs text-center">
                <p class="font-bold text-lg mb-2">{{ form.name || 'Tên khách hàng' }}</p>
                <p class="text-sm text-gray-600 mb-1">📞 {{ form.phone || 'Số điện thoại' }}</p>
                <p class="text-sm text-gray-600 mb-1">✉️ {{ form.email || 'Email' }}</p>
                <p class="text-sm text-gray-600 mb-3">🌐 {{ form.website || 'Website' }}</p>

                <!-- QR code preview -->
                <div class="mt-4">
                    <img
                        v-if="qrResult?.qrCodeUrl"
                        :src="qrResult.qrCodeUrl"
                        alt="QR Code"
                        class="mx-auto w-32 h-32"
                    />
                    <div v-else class="w-32 h-32 bg-gray-100 flex items-center justify-center text-gray-400">
                        QR Code
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { message } from 'ant-design-vue'

definePageMeta({
    layout: 'default',
})

const { $axios } = useNuxtApp()

const form = ref({
    name: '',
    phone: '',
    email: '',
    website: '',
})

const loading = ref(false)
const qrResult = ref(null)

const createVCardQR = async () => {
    loading.value = true

    try {
        const res = await $axios.post('/api/campaigns/create', {
            name: form.value.name,
            type: 'vcard',
            content: {
                name: form.value.name,
                phone: form.value.phone,
                email: form.value.email,
                website: form.value.website,
            },
        })

        message.success('Tạo QR vCard thành công!')
        qrResult.value = res.data.data // { qrCodeUrl: '', url: '' } giả định backend trả về
    } catch (error) {
        console.error('❌ Lỗi tạo vCard:', error)
        message.error('Tạo QR thất bại!')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* Responsive tweaks */
@media (max-width: 767px) {
    .flex-col {
        flex-direction: column;
    }
}
</style>
