<template>
    <div class="flex flex-col md:flex-row gap-6 p-6">
        <!-- CỘT 1: Form Ant Design -->
        <div class="md:w-1/2 w-full bg-white rounded shadow p-6">
            <h2 class="text-2xl font-bold mb-6">📦 Tạo QR Sản phẩm</h2>

            <a-form :model="form" @finish="createProductQR" layout="vertical">
                <a-form-item label="Tên sản phẩm" name="productName" :rules="[{ required: true, message: 'Vui lòng nhập tên!' }]">
                    <a-input v-model:value="form.productName" placeholder="Nhập tên sản phẩm" />
                </a-form-item>

                <a-form-item label="Giá sản phẩm" name="price" :rules="[{ required: true, message: 'Vui lòng nhập giá!' }]">
                    <a-input v-model:value="form.price" placeholder="VD: 1.200.000đ" />
                </a-form-item>

                <a-form-item label="Liên kết sản phẩm (URL)" name="link" :rules="[{ required: true, message: 'Vui lòng nhập link!' }]">
                    <a-input v-model:value="form.link" type="url" placeholder="https://..." />
                </a-form-item>

                <a-form-item label="Mô tả sản phẩm" name="description">
                    <a-textarea v-model:value="form.description" :rows="3" placeholder="Mô tả sản phẩm" />
                </a-form-item>

                <a-form-item label="Link ảnh sản phẩm (URL)" name="imageUrl">
                    <a-input v-model:value="form.imageUrl" type="url" placeholder="https://example.com/image.jpg" />
                </a-form-item>

                <a-form-item label="Ảnh sản phẩm">
                    <client-only>
                        <a-upload
                            v-model:file-list="productImages"
                            name="file"
                            list-type="picture-card"
                            :custom-request="handleUpload"
                            :multiple="true"
                            :show-upload-list="true"
                            @preview="handlePreview"
                        >
                            <div v-if="productImages.length < 10">
                                <plus-outlined />
                                <div style="margin-top: 8px">Tải ảnh</div>
                            </div>
                        </a-upload>

                        <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                            <img alt="preview" :src="previewImage" style="width: 100%" />
                        </a-modal>
                    </client-only>
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" html-type="submit" :loading="loading" block>
                        {{ loading ? "Đang tạo..." : "Tạo QR" }}
                    </a-button>
                </a-form-item>
            </a-form>
        </div>

        <!-- CỘT 2: Preview + QR -->
        <div class="md:w-1/2 w-full flex flex-col items-center">
            <div class="w-[320px] border border-gray-300 rounded-xl shadow-lg overflow-hidden bg-white">
                <div class="h-12 bg-blue-600 flex items-center justify-center text-white font-semibold">
                    Xem trước sản phẩm
                </div>

                <div class="p-4">
                    <div v-if="form.imageUrl" class="mb-4">
                        <img :src="form.imageUrl" alt="Ảnh sản phẩm" class="rounded w-full object-cover h-48" />
                    </div>

                    <h3 class="text-lg font-bold mb-1">
                        {{ form.productName || 'Tên sản phẩm' }}
                    </h3>

                    <p class="text-blue-600 font-bold mb-2">
                        {{ form.price || 'Giá sản phẩm' }}
                    </p>

                    <p class="text-sm text-gray-700 mb-4">
                        {{ form.description || 'Mô tả sản phẩm...' }}
                    </p>

                    <a
                        v-if="form.link"
                        :href="form.link"
                        target="_blank"
                        class="text-blue-500 text-sm hover:underline"
                    >
                        🔗 Xem chi tiết
                    </a>
                </div>
            </div>

            <!-- QR -->
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
                    <a :href="qrResult.url" target="_blank" class="text-blue-500 hover:underline">
                        Link QR: {{ qrResult.url }}
                    </a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

definePageMeta({
    layout: 'default'
})

const { $axios } = useNuxtApp()

const form = ref({
    productName: '',
    price: '',
    link: '',
    description: '',
    imageUrl: ''
})

const loading = ref(false)
const qrResult = ref(null)


const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')
const productImages = ref([]) // Đây là mảng ảnh đã upload

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

const handleCancel = () => {
    previewVisible.value = false
    previewTitle.value = ''
}

const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
    }
    previewImage.value = file.url || file.preview
    previewVisible.value = true
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
}

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}

// Xử lý upload custom (gửi lên server của bạn)
const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
        const res = await $fetch('/api/campaigns/upload-image', {
            method: 'POST',
            body: formData
        })

        if (res.success && res.imagePath) {
            // Không cần push vào productImages, vì v-model:file-list tự xử lý
            file.status = 'done'
            file.url = res.imagePath
            onSuccess()
            message.success('Upload thành công!')
        } else {
            throw new Error('Lỗi khi upload')
        }
    } catch (err) {
        onError()
        message.error('❌ Upload thất bại!')
    }
}

</script>

<style scoped>
/* Tuỳ chỉnh nếu cần */
</style>
