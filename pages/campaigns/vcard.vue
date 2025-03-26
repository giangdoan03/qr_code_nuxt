<template>
    <div class="flex flex-col md:flex-row gap-6 p-6">
        <!-- CỘT 1: Form nhập liệu -->
        <a-card title="👤 Tạo QR vCard" class="flex-1">
            <a-form layout="vertical" :model="form" @submit.prevent="createVCardQR">
                <a-form-item label="Họ và tên đầy đủ" required>
                    <a-input v-model:value="form.fullName" placeholder="Nguyễn Văn A" />
                </a-form-item>

                <a-form-item label="Số điện thoại" required>
                    <a-input v-model:value="form.phone" placeholder="0123456789" />
                </a-form-item>

                <a-form-item label="Email">
                    <a-input v-model:value="form.email" type="email" placeholder="you@example.com" />
                </a-form-item>

                <a-form-item label="Địa chỉ">
                    <a-input v-model:value="form.address" placeholder="123 Đường ABC, Quận X" />
                </a-form-item>

                <a-form-item label="Website">
                    <a-input v-model:value="form.website" type="url" placeholder="https://example.com" />
                </a-form-item>

                <a-form-item label="Ảnh đại diện">
                    <a-radio-group v-model:value="avatarType" option-type="button">
                        <a-radio-button value="upload">Tải ảnh</a-radio-button>
                        <a-radio-button value="link">Link ảnh</a-radio-button>
                    </a-radio-group>
                </a-form-item>

                <a-form-item v-if="avatarType === 'upload'">
                    <input type="file" accept="image/*" @change="handleFileUpload" />
                </a-form-item>

                <a-form-item v-if="avatarType === 'link'" label="Link ảnh đại diện">
                    <a-input v-model:value="form.avatar" type="url" placeholder="https://..." />
                </a-form-item>

                <div class="flex justify-center mb-4">
                    <img
                        v-if="previewAvatar"
                        :src="previewAvatar"
                        alt="Avatar"
                        class="w-24 h-24 rounded-full border object-cover"
                    />
                </div>

                <a-form-item>
                    <a-button type="primary" html-type="submit" block :loading="loading">
                        {{ loading ? 'Đang tạo...' : 'Tạo QR' }}
                    </a-button>
                </a-form-item>
            </a-form>
        </a-card>

        <!-- CỘT 2: Preview -->
        <a-card title="📱 Preview vCard" class="w-full md:w-1/3 flex flex-col items-center">
            <div class="border rounded p-4 w-full max-w-xs bg-gray-50 text-center">
                <img
                    v-if="previewAvatar"
                    :src="previewAvatar"
                    alt="Avatar"
                    class="w-24 h-24 rounded-full border mx-auto mb-4 object-cover"
                />

                <p class="font-bold text-lg mb-2">{{ form.fullName || 'Tên khách hàng' }}</p>
                <p class="text-sm text-gray-600 mb-1">📞 {{ form.phone || 'Số điện thoại' }}</p>
                <p class="text-sm text-gray-600 mb-1">✉️ {{ form.email || 'Email' }}</p>
                <p class="text-sm text-gray-600 mb-1">🏠 {{ form.address || 'Địa chỉ' }}</p>
                <p class="text-sm text-gray-600 mb-3">🌐 {{ form.website || 'Website' }}</p>

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
import { ref, watch } from 'vue'
import { useNuxtApp } from '#app'
import { message } from 'ant-design-vue'

definePageMeta({ layout: 'default' })

const { $axios } = useNuxtApp()

const form = ref({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    avatar: ''
})

const avatarType = ref('upload')
const previewAvatar = ref('')
const loading = ref(false)
const qrResult = ref(null)

watch(() => form.value.avatar, (val) => {
    if (avatarType.value === 'link') previewAvatar.value = val
})

const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
        previewAvatar.value = event.target.result
    }
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('file', file)

    try {
        const res = await $axios.post('/api/campaigns/upload-avatar', formData)
        if (res.data.success) {
            form.value.avatar = res.data.imagePath
            message.success('Tải ảnh lên thành công!')
        } else {
            message.error('Upload thất bại!')
        }
    } catch (err) {
        console.error(err)
        message.error('Có lỗi xảy ra khi upload!')
    }
}

const createVCardQR = async () => {
    loading.value = true
    try {
        const res = await $axios.post('/api/campaigns/create', {
            name: `Chiến dịch vCard - ${form.value.fullName || 'Không tên'}`,
            type: 'vcard',
            description: `Thông tin cá nhân của ${form.value.fullName}`,
            content: {
                fullName: form.value.fullName,
                phone: form.value.phone,
                email: form.value.email,
                address: form.value.address,
                website: form.value.website,
                avatar: form.value.avatar
            }
        })

        qrResult.value = res.data.data
        message.success('✅ Tạo QR vCard thành công!')
    } catch (error) {
        console.error('❌ Lỗi tạo QR:', error)
        message.error('Tạo QR thất bại!')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
</style>
