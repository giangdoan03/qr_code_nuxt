<template>
    <div class="bg-white rounded shadow w-full p-6">
        <div v-if="loading" class="text-center py-10">Đang tải dữ liệu...</div>

        <div v-else-if="!campaign" class="text-center py-10">Không tìm thấy campaign!</div>

        <div v-else class="flex flex-col md:flex-row gap-6">
            <!-- Cột 1: Form chỉnh sửa -->
            <div class="flex-1 bg-white rounded shadow p-4">
                <h2 class="text-2xl font-bold mb-4">✏️ Chỉnh sửa Campaign</h2>

                <form @submit.prevent="updateCampaign" class="space-y-4">
                    <!-- Tên campaign -->
                    <input
                        v-model="form.name"
                        placeholder="Tên campaign"
                        class="border p-2 rounded w-full"
                        required
                    />

                    <!-- Mô tả -->
                    <textarea
                        v-model="form.description"
                        placeholder="Mô tả"
                        class="border p-2 rounded w-full"
                    ></textarea>

                    <!-- Trạng thái -->
                    <select v-model="form.status" class="border rounded px-2 py-2 w-full">
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Tạm dừng</option>
                    </select>

                    <!-- Nội dung content tùy loại -->
                    <div v-if="form.type === 'product'" class="space-y-2">
                        <input v-model="form.content.name" placeholder="Tên sản phẩm" class="border p-2 rounded w-full" required />
                        <input v-model.number="form.content.price" placeholder="Giá sản phẩm" class="border p-2 rounded w-full" required />
                        <input v-model="form.content.link" placeholder="Link sản phẩm" class="border p-2 rounded w-full" />
                    </div>

                    <div v-else-if="form.type === 'vcard'" class="space-y-2">
                        <input v-model="form.content.fullName" placeholder="Họ tên" class="border p-2 rounded w-full" required />
                        <input v-model="form.content.phone" placeholder="Số điện thoại" class="border p-2 rounded w-full" required />
                        <input v-model="form.content.email" placeholder="Email" class="border p-2 rounded w-full" />
                        <input v-model="form.content.address" placeholder="Địa chỉ" class="border p-2 rounded w-full" />
                        <input v-model="form.content.website" placeholder="Website" class="border p-2 rounded w-full" />
                    </div>

                    <div v-else-if="form.type === 'business'" class="space-y-2">
                        <input v-model="form.content.companyName" placeholder="Tên công ty" class="border p-2 rounded w-full" required />
                        <input v-model="form.content.address" placeholder="Địa chỉ" class="border p-2 rounded w-full" required />
                        <input v-model="form.content.phone" placeholder="Số điện thoại" class="border p-2 rounded w-full" />
                        <input v-model="form.content.email" placeholder="Email" class="border p-2 rounded w-full" />
                        <input v-model="form.content.website" placeholder="Website" class="border p-2 rounded w-full" />
                        <input v-model="form.content.taxCode" placeholder="Mã số thuế" class="border p-2 rounded w-full" />
                    </div>

                    <!-- Nút cập nhật -->
                    <button
                        type="submit"
                        :disabled="updating"
                        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                    >
                        {{ updating ? "Đang cập nhật..." : "Cập nhật Campaign" }}
                    </button>
                </form>
            </div>

            <!-- Cột 2: Preview mobile -->
            <div class="w-full md:w-1/3 bg-white rounded shadow p-4 flex flex-col items-center">
                <h3 class="text-lg font-semibold mb-4">📱 Preview Mobile</h3>

                <div class="border rounded-lg p-4 w-full max-w-xl bg-gray-50 shadow-inner">
                    <p class="font-bold text-lg mb-2">{{ form.name }}</p>

                    <div v-if="form.type === 'product'">
                        <p class="text-sm text-gray-600 mb-1">🛒 {{ form.content.name }}</p>
                        <p class="text-sm text-gray-600 mb-1">💰 {{ formatCurrency(form.content.price) }}</p>
                        <a :href="form.content.link" target="_blank" class="block text-sm text-blue-500 underline">🔗 Link sản phẩm</a>
                    </div>

                    <div v-else-if="form.type === 'vcard'">
                        <p class="text-sm text-gray-600 mb-1">👤 {{ form.content.fullName }}</p>
                        <p class="text-sm text-gray-600 mb-1">📞 {{ form.content.phone }}</p>
                        <p class="text-sm text-gray-600 mb-1">✉️ {{ form.content.email }}</p>
                        <p class="text-sm text-gray-600 mb-1">🏠 {{ form.content.address }}</p>
                    </div>

                    <div v-else-if="form.type === 'business'">
                        <p class="text-sm text-gray-600 mb-1">🏢 {{ form.content.companyName }}</p>
                        <p class="text-sm text-gray-600 mb-1">📍 {{ form.content.address }}</p>
                        <p class="text-sm text-gray-600 mb-1">📞 {{ form.content.phone }}</p>
                    </div>
                </div>
            </div>

            <!-- Cột 3: QR Code & URL -->
            <div class="w-full md:w-1/4 bg-white rounded shadow p-4 flex flex-col items-center justify-start">
                <h3 class="text-lg font-semibold mb-4">🔗 URL & QR Code</h3>

                <div class="text-center mb-4">
                    <p class="text-sm">URL Campaign:</p>
                    <a :href="campaign.url" target="_blank" class="text-blue-600 hover:underline break-all">{{ campaign.url }}</a>
                </div>

                <div v-if="campaign.qrCodeUrl" class="mt-4">
                    <img :src="campaign.qrCodeUrl" alt="QR Code" class="w-40 h-40 mx-auto" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const { $axios } = useNuxtApp()

const campaign = ref(null)

const form = reactive({
    name: '',
    description: '',
    status: 'active',
    type: '',
    content: {}
})

const loading = ref(true)
const updating = ref(false)

const fetchCampaignDetail = async () => {
    loading.value = true
    try {
        const res = await $axios.get(`/api/campaigns/${route.params.id}`)
        campaign.value = res.data.data

        // Gán vào form để chỉnh sửa
        Object.assign(form, {
            name: campaign.value.name,
            description: campaign.value.description,
            status: campaign.value.status,
            type: campaign.value.type,
            content: { ...campaign.value.content }
        })

    } catch (err) {
        console.error('❌ Lỗi lấy chi tiết campaign:', err)
        message.error('Không tìm thấy campaign!')
    } finally {
        loading.value = false
    }
}

const updateCampaign = async () => {
    updating.value = true
    try {
        await $axios.put(`/api/campaigns/${route.params.id}`, {
            name: form.name,
            description: form.description,
            status: form.status,
            content: form.content
        })

        message.success('Cập nhật campaign thành công!')
        router.push(`/campaigns/${route.params.id}`)

    } catch (err) {
        console.error('❌ Lỗi cập nhật campaign:', err)
        message.error('Cập nhật thất bại!')
    } finally {
        updating.value = false
    }
}

const formatCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
}

onMounted(() => {
    fetchCampaignDetail()
})
</script>

<style scoped>
textarea {
    min-height: 80px;
}
</style>
