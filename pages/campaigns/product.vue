<template>
    <div class="flex flex-col md:flex-row gap-6 p-4">
        <!-- CỘT 1: Tạo QR Sản phẩm -->
        <div class="md:w-1/2 w-full bg-white rounded shadow p-6">
            <h2 class="text-2xl font-bold mb-6">📦 Tạo QR Sản phẩm</h2>

            <form @submit.prevent="createProductQR" class="space-y-4">
                <!-- Tên sản phẩm -->
                <div>
                    <label class="block font-medium mb-1">Tên sản phẩm</label>
                    <input
                        v-model="form.productName"
                        type="text"
                        class="w-full p-2 border rounded"
                        placeholder="Nhập tên sản phẩm"
                        required
                    />
                </div>

                <!-- Giá -->
                <div>
                    <label class="block font-medium mb-1">Giá sản phẩm</label>
                    <input
                        v-model="form.price"
                        type="text"
                        class="w-full p-2 border rounded"
                        placeholder="Nhập giá sản phẩm (VD: 1.200.000đ)"
                        required
                    />
                </div>

                <!-- Link sản phẩm -->
                <div>
                    <label class="block font-medium mb-1">Liên kết sản phẩm (URL)</label>
                    <input
                        v-model="form.link"
                        type="url"
                        class="w-full p-2 border rounded"
                        placeholder="Nhập link chi tiết sản phẩm"
                        required
                    />
                </div>

                <!-- Mô tả -->
                <div>
                    <label class="block font-medium mb-1">Mô tả sản phẩm</label>
                    <textarea
                        v-model="form.description"
                        rows="3"
                        class="w-full p-2 border rounded"
                        placeholder="Nhập mô tả sản phẩm"
                    ></textarea>
                </div>

                <!-- Ảnh sản phẩm (link ảnh) -->
                <div>
                    <label class="block font-medium mb-1">Link hình ảnh sản phẩm (URL)</label>
                    <input
                        v-model="form.imageUrl"
                        type="url"
                        class="w-full p-2 border rounded"
                        placeholder="Nhập link ảnh minh họa sản phẩm"
                    />
                </div>

                <!-- Button -->
                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                >
                    {{ loading ? "Đang tạo..." : "Tạo QR" }}
                </button>
            </form>
        </div>

        <!-- CỘT 2: Preview Thông tin Sản phẩm + QR -->
        <div class="md:w-1/2 w-full flex flex-col items-center justify-start">
            <!-- Mobile Preview Container -->
            <div class="w-[320px] border border-gray-300 rounded-xl shadow-lg overflow-hidden bg-white">
                <!-- Header -->
                <div class="h-12 bg-blue-600 flex items-center justify-center text-white font-semibold">
                    Xem trước sản phẩm
                </div>

                <!-- Nội dung sản phẩm -->
                <div class="p-4">
                    <!-- Ảnh sản phẩm -->
                    <div v-if="form.imageUrl" class="mb-4">
                        <img
                            :src="form.imageUrl"
                            alt="Ảnh sản phẩm"
                            class="rounded w-full object-cover h-48"
                        />
                    </div>

                    <!-- Tên sản phẩm -->
                    <h3 class="text-lg font-bold mb-1">
                        {{ form.productName || 'Tên sản phẩm' }}
                    </h3>

                    <!-- Giá sản phẩm -->
                    <p class="text-blue-600 font-bold mb-2">
                        {{ form.price || 'Giá sản phẩm' }}
                    </p>

                    <!-- Mô tả -->
                    <p class="text-sm text-gray-700 mb-4">
                        {{ form.description || 'Mô tả sản phẩm...' }}
                    </p>

                    <!-- Link chi tiết -->
                    <a
                        v-if="form.link"
                        :href="form.link"
                        target="_blank"
                        class="text-blue-500 text-sm hover:underline"
                    >🔗 Xem chi tiết</a>
                </div>
            </div>

            <!-- QR Code demo -->
            <div class="mt-6 text-center">
                <h4 class="font-semibold mb-2">🎉 QR Code</h4>
                <div class="flex justify-center">
                    <img
                        v-if="qrResult"
                        :src="qrResult.qrCodeUrl"
                        alt="QR Code"
                        class="w-40 h-40"
                    />
                    <div v-else class="w-40 h-40 bg-gray-100 flex items-center justify-center text-gray-400 border border-dashed">
                        QR Code
                    </div>
                </div>

                <p v-if="qrResult" class="text-sm mt-2 text-gray-500">
                    <a
                        :href="qrResult.url"
                        target="_blank"
                        class="text-blue-500 hover:underline"
                    >Link QR: {{ qrResult.url }}</a>
                </p>
            </div>
        </div>
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

// Form data
const form = ref({
    productName: '',
    price: '',
    link: '',
    description: '',
    imageUrl: ''
})

const loading = ref(false)
const qrResult = ref(null)

const createProductQR = async () => {
    loading.value = true
    try {
        const res = await $axios.post('/api/campaigns/create', {
            name: form.value.productName,
            type: 'product',
            content: {
                productName: form.value.productName,
                price: form.value.price,
                link: form.value.link,
                description: form.value.description,
                imageUrl: form.value.imageUrl
            }
        })

        message.success('✅ Tạo QR sản phẩm thành công!')
        qrResult.value = res.data.data
    } catch (err) {
        console.error('❌ Lỗi tạo campaign:', err)
        message.error('Tạo QR thất bại!')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* Tuỳ chỉnh thêm nếu cần */
</style>
