<template>
    <div class="flex flex-col md:flex-row gap-6">
        <!-- Cột 1: Form nhập thông tin -->
        <div class="flex-1 bg-white rounded shadow p-4">
            <h2 class="text-xl font-bold mb-4">🏢 Tạo QR Doanh Nghiệp</h2>

            <form @submit.prevent="submitForm" class="space-y-4">
                <div>
                    <label class="block mb-1 text-sm font-medium">Tên công ty</label>
                    <input
                        v-model="form.companyName"
                        type="text"
                        placeholder="Nhập tên công ty"
                        required
                        class="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label class="block mb-1 text-sm font-medium">Số điện thoại</label>
                    <input
                        v-model="form.phone"
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        required
                        class="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label class="block mb-1 text-sm font-medium">Email</label>
                    <input
                        v-model="form.email"
                        type="email"
                        placeholder="Nhập email liên hệ"
                        required
                        class="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label class="block mb-1 text-sm font-medium">Website</label>
                    <input
                        v-model="form.website"
                        type="url"
                        placeholder="Nhập địa chỉ website"
                        class="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label class="block mb-1 text-sm font-medium">Địa chỉ</label>
                    <input
                        v-model="form.address"
                        type="text"
                        placeholder="Nhập địa chỉ công ty"
                        class="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label class="block mb-1 text-sm font-medium">Mô tả công ty</label>
                    <textarea
                        v-model="form.description"
                        rows="4"
                        placeholder="Nhập mô tả ngắn về công ty"
                        class="w-full p-2 border rounded"
                    ></textarea>
                </div>

                <div>
                    <label class="block mb-1 text-sm font-medium">Logo công ty (URL)</label>
                    <input
                        v-model="form.logo"
                        type="url"
                        placeholder="Nhập URL hình ảnh logo"
                        class="w-full p-2 border rounded"
                    />
                </div>

                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    {{ loading ? 'Đang tạo...' : 'Tạo QR' }}
                </button>
            </form>
        </div>

        <!-- Cột 2: Preview doanh nghiệp và QR Code -->
        <div class="w-full md:w-1/3 bg-white rounded shadow p-6 flex flex-col items-center">
            <h3 class="text-lg font-semibold mb-4">Preview Doanh Nghiệp</h3>

            <div class="border rounded p-4 w-full max-w-xs text-center">
                <!-- Logo -->
                <img
                    v-if="form.logo"
                    :src="form.logo"
                    alt="Logo công ty"
                    class="mx-auto mb-4 w-20 h-20 object-contain border rounded"
                />
                <div v-else class="mx-auto mb-4 w-20 h-20 bg-gray-100 flex items-center justify-center text-gray-400 border rounded">
                    Logo
                </div>

                <!-- Thông tin công ty -->
                <p class="font-bold text-lg mb-2">{{ form.companyName || 'Tên công ty' }}</p>
                <p class="text-sm text-gray-600 mb-1">📞 {{ form.phone || 'Số điện thoại' }}</p>
                <p class="text-sm text-gray-600 mb-1">✉️ {{ form.email || 'Email' }}</p>
                <p class="text-sm text-gray-600 mb-1">🌐 {{ form.website || 'Website' }}</p>
                <p class="text-sm text-gray-600 mb-1">🏠 {{ form.address || 'Địa chỉ' }}</p>

                <p class="text-xs text-gray-500 mt-2">{{ form.description || 'Mô tả công ty' }}</p>

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
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { message } from 'ant-design-vue'

definePageMeta({
    layout: 'default'
})

const router = useRouter()
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

        qrResult.value = res.data.data // giả định backend trả về { qrCodeUrl, url }
    } catch (err) {
        console.error('❌ Lỗi tạo campaign:', err)
        message.error('Đã xảy ra lỗi khi tạo QR Doanh nghiệp!')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* Tuỳ chỉnh thêm nếu cần */
</style>
