<template>
    <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
        <h2 class="text-2xl font-bold mb-6">➕ Tạo Campaign Mới</h2>

        <!-- Thông tin cơ bản -->
        <div class="space-y-4">
            <div>
                <label class="block mb-1">Tên Campaign</label>
                <input v-model="campaign.name" type="text" class="w-full p-2 border rounded" />
            </div>

            <div>
                <label class="block mb-1">Mô tả Campaign</label>
                <textarea v-model="campaign.description" class="w-full p-2 border rounded"></textarea>
            </div>

            <div>
                <label class="block mb-1">Chọn loại QR Code</label>
                <select v-model="campaign.type" class="w-full p-2 border rounded">
                    <option disabled value="">-- Chọn loại --</option>
                    <option value="vcard">👤 vCard</option>
                    <option value="product">📦 Sản phẩm</option>
                    <option value="business">🏢 Doanh nghiệp</option>
                </select>
            </div>
        </div>

        <!-- Form chi tiết theo loại QR -->
        <div v-if="campaign.type" class="mt-6 space-y-4 border-t pt-4">
            <h3 class="text-lg font-semibold">Nội dung QR {{ labelByType[campaign.type] }}</h3>

            <div v-if="campaign.type === 'vcard'">
                <input v-model="campaign.content.name" placeholder="Họ và Tên" class="w-full p-2 border rounded" />
                <input v-model="campaign.content.phone" placeholder="Số điện thoại" class="w-full p-2 border rounded mt-2" />
                <input v-model="campaign.content.email" placeholder="Email" class="w-full p-2 border rounded mt-2" />
            </div>

            <div v-else-if="campaign.type === 'product'">
                <input v-model="campaign.content.productName" placeholder="Tên sản phẩm" class="w-full p-2 border rounded" />
                <input v-model="campaign.content.price" placeholder="Giá sản phẩm" class="w-full p-2 border rounded mt-2" />
                <input v-model="campaign.content.link" placeholder="Link sản phẩm" class="w-full p-2 border rounded mt-2" />
            </div>

            <div v-else-if="campaign.type === 'business'">
                <input v-model="campaign.content.company" placeholder="Tên doanh nghiệp" class="w-full p-2 border rounded" />
                <input v-model="campaign.content.address" placeholder="Địa chỉ" class="w-full p-2 border rounded mt-2" />
                <input v-model="campaign.content.website" placeholder="Website" class="w-full p-2 border rounded mt-2" />
            </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex justify-between items-center">
            <button @click="resetForm" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Đặt lại
            </button>

            <button @click="submitCampaign" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Tạo Campaign
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
    layout: 'default' // Có thể bỏ nếu default là mặc định
})

const router = useRouter()

const campaign = ref({
    name: '',
    description: '',
    type: '',
    content: {}
})

const labelByType = {
    vcard: 'vCard',
    product: 'Sản phẩm',
    business: 'Doanh nghiệp'
}

const resetForm = () => {
    campaign.value = {
        name: '',
        description: '',
        type: '',
        content: {}
    }
}

const submitCampaign = async () => {
    try {
        console.log('➡️ Tạo Campaign:', campaign.value)

        // Giả lập API gọi backend để lưu
        // Thay bằng gọi axios hoặc useFetch thực tế
        // const res = await $fetch('/api/campaigns/create', { method: 'POST', body: campaign.value })

        alert('Tạo campaign thành công!')

        // Chuyển hướng về danh sách
        router.push('/campaigns')
    } catch (error) {
        console.error(error)
        alert('Lỗi khi tạo campaign')
    }
}
</script>

<style scoped>
input,
textarea,
select {
    outline: none;
}
</style>
