<template>
    <div class="bg-white rounded shadow w-full p-6">
        <div v-if="loading" class="text-center py-10">Đang tải dữ liệu...</div>

        <div v-else-if="!campaign" class="text-center py-10">Không tìm thấy campaign!</div>

        <div v-else>
            <h2 class="text-2xl font-bold mb-4">📝 Chỉnh sửa Campaign</h2>

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
                <select v-model="form.status" class="border rounded px-2 py-1 w-full">
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm dừng</option>
                </select>

                <!-- Nội dung content tuỳ loại -->
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
        router.push(`/campaigns/${route.params.id}`) // Quay lại chi tiết campaign

    } catch (err) {
        console.error('❌ Lỗi cập nhật campaign:', err)
        message.error('Cập nhật thất bại!')
    } finally {
        updating.value = false
    }
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
