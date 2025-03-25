<template>
    <div class="flex flex-col md:flex-row gap-6 p-6">
        <!-- CỘT 1: Form nhập liệu -->
        <div class="flex-1 bg-white rounded shadow p-6">
            <h2 class="text-xl font-bold mb-4">👤 Tạo QR vCard</h2>

            <form @submit.prevent="createVCardQR" class="space-y-4">
                <!-- Họ tên -->
                <input
                    v-model="form.fullName"
                    placeholder="Họ và tên đầy đủ"
                    class="border p-2 rounded w-full"
                    required
                />

                <!-- Số điện thoại -->
                <input
                    v-model="form.phone"
                    placeholder="Số điện thoại"
                    class="border p-2 rounded w-full"
                    required
                />

                <!-- Email -->
                <input
                    v-model="form.email"
                    placeholder="Email"
                    type="email"
                    class="border p-2 rounded w-full"
                />

                <!-- Địa chỉ -->
                <input
                    v-model="form.address"
                    placeholder="Địa chỉ"
                    class="border p-2 rounded w-full"
                />

                <!-- Website -->
                <input
                    v-model="form.website"
                    placeholder="Website"
                    type="url"
                    class="border p-2 rounded w-full"
                />

                <!-- Chọn loại ảnh -->
                <div class="flex gap-4 mb-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value="upload" v-model="avatarType" />
                        Upload ảnh
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value="link" v-model="avatarType" />
                        Link ảnh
                    </label>
                </div>

                <!-- Upload từ máy -->
                <input
                    v-if="avatarType === 'upload'"
                    type="file"
                    accept="image/*"
                    @change="handleFileUpload"
                />

                <!-- Link ảnh -->
                <input
                    v-if="avatarType === 'link'"
                    v-model="form.avatar"
                    type="url"
                    placeholder="Link ảnh đại diện (Avatar)"
                    class="border p-2 rounded w-full"
                />

                <!-- Preview ảnh avatar -->
                <div class="flex justify-center my-4">
                    <img
                        v-if="previewAvatar"
                        :src="previewAvatar"
                        alt="Avatar"
                        class="w-24 h-24 rounded-full border object-cover"
                    />
                </div>

                <!-- Submit -->
                <button
                    type="submit"
                    :disabled="loading"
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                >
                    {{ loading ? "Đang tạo..." : "Tạo QR" }}
                </button>
            </form>
        </div>

        <!-- CỘT 2: Preview vCard -->
        <div class="w-full md:w-1/3 bg-white rounded shadow p-6 flex flex-col items-center">
            <h3 class="text-lg font-semibold mb-4">📱 Preview vCard</h3>

            <div
                class="border rounded p-4 w-full max-w-xs bg-gray-50 shadow-inner"
            >
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

                <!-- QR code preview -->
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
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useNuxtApp } from '#app'
import { message } from 'ant-design-vue'

// Khai báo layout nếu cần
definePageMeta({
    layout: 'default'
})

const { $axios } = useNuxtApp()

// Form state
const form = ref({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    avatar: '' // link ảnh sau khi upload hoặc nhập link
})

const avatarType = ref('upload') // 'upload' hoặc 'link'
const previewAvatar = ref('')     // ảnh preview (base64 hoặc link)
const loading = ref(false)
const qrResult = ref(null)

// Theo dõi avatar link khi chọn type link
watch(() => form.value.avatar, (newVal) => {
    if (avatarType.value === 'link') {
        previewAvatar.value = newVal
    }
})

// Xử lý upload file và preview
const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Preview ảnh trước
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
            form.value.avatar = res.data.imagePath // dùng khi submit dữ liệu
            message.success('Tải ảnh lên thành công!')
        } else {
            message.error('Upload thất bại!')
        }
    } catch (err) {
        console.error(err)
        message.error('Có lỗi xảy ra khi upload!')
    }
}

// Tạo QR cho vCard
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
                avatar: form.value.avatar   // ✅ Thêm avatar vào content
            }
        })

        message.success('✅ Tạo QR vCard thành công!')
        qrResult.value = res.data.data
    } catch (error) {
        console.error('❌ Lỗi tạo vCard:', error)
        message.error('Tạo QR thất bại!')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
@media (max-width: 767px) {
    .flex-col {
        flex-direction: column;
    }
}
</style>
