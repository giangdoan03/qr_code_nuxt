<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <a-spin :spinning="loading">
            <a-row gutter="24">
                <!-- Cột 1: Form chỉnh sửa -->
                <a-col :xs="24" :md="12" :lg="14">
                    <a-card title="✏️ Chỉnh sửa Campaign">
                        <a-form layout="vertical" @submit.prevent="updateCampaign">
                            <a-form-item label="Tên campaign">
                                <a-input v-model:value="form.name" placeholder="Tên campaign" required />
                            </a-form-item>

                            <a-form-item label="Mô tả">
                                <a-textarea v-model:value="form.description" rows="3" placeholder="Mô tả" />
                            </a-form-item>

                            <a-form-item label="Trạng thái">
                                <a-select v-model:value="form.status">
                                    <a-select-option value="active">Hoạt động</a-select-option>
                                    <a-select-option value="inactive">Tạm dừng</a-select-option>
                                </a-select>
                            </a-form-item>

                            <template v-if="form.type === 'product'">
                                <a-divider>Thông tin sản phẩm</a-divider>
                                <a-form-item label="Tên sản phẩm">
                                    <a-input v-model:value="form.content.name" required />
                                </a-form-item>
                                <a-form-item label="Giá">
                                    <a-input-number v-model:value="form.content.price" class="w-full" />
                                </a-form-item>
                                <a-form-item label="Link sản phẩm">
                                    <a-input v-model:value="form.content.link" />
                                </a-form-item>
                            </template>

                            <template v-else-if="form.type === 'vcard'">
                                <a-divider>Thông tin vCard</a-divider>
                                <a-form-item label="Họ tên">
                                    <a-input v-model:value="form.content.fullName" required />
                                </a-form-item>
                                <a-form-item label="Số điện thoại">
                                    <a-input v-model:value="form.content.phone" required />
                                </a-form-item>
                                <a-form-item label="Email">
                                    <a-input v-model:value="form.content.email" />
                                </a-form-item>
                                <a-form-item label="Địa chỉ">
                                    <a-input v-model:value="form.content.address" />
                                </a-form-item>
                                <a-form-item label="Website">
                                    <a-input v-model:value="form.content.website" />
                                </a-form-item>
                            </template>

                            <template v-else-if="form.type === 'business'">
                                <a-divider>Thông tin doanh nghiệp</a-divider>
                                <a-form-item label="Tên công ty">
                                    <a-input v-model:value="form.content.companyName" required />
                                </a-form-item>
                                <a-form-item label="Địa chỉ">
                                    <a-input v-model:value="form.content.address" required />
                                </a-form-item>
                                <a-form-item label="Số điện thoại">
                                    <a-input v-model:value="form.content.phone" />
                                </a-form-item>
                                <a-form-item label="Email">
                                    <a-input v-model:value="form.content.email" />
                                </a-form-item>
                                <a-form-item label="Website">
                                    <a-input v-model:value="form.content.website" />
                                </a-form-item>
                                <a-form-item label="Mã số thuế">
                                    <a-input v-model:value="form.content.taxCode" />
                                </a-form-item>
                            </template>

                            <a-button type="primary" html-type="submit" block :loading="updating">
                                {{ updating ? 'Đang cập nhật...' : 'Cập nhật Campaign' }}
                            </a-button>
                        </a-form>
                    </a-card>
                </a-col>

                <!-- Cột 2: Preview + QR -->
                <a-col :xs="24" :md="12" :lg="10">
                    <a-card title="📱 Preview & QR">
                        <div class="mb-4">
                            <h3 class="text-base font-semibold mb-2">Thông tin:</h3>
                            <p><strong>{{ form.name }}</strong></p>
                            <p class="text-sm text-gray-500">{{ form.description }}</p>
                        </div>

                        <template v-if="form.type === 'product'">
                            <p>🛒 {{ form.content.name }}</p>
                            <p>💰 {{ formatCurrency(form.content.price) }}</p>
                            <a :href="form.content.link" target="_blank" class="text-blue-500 underline text-sm">🔗 Link sản phẩm</a>
                        </template>

                        <template v-else-if="form.type === 'vcard'">
                            <p>👤 {{ form.content.fullName }}</p>
                            <p>📞 {{ form.content.phone }}</p>
                            <p>✉️ {{ form.content.email }}</p>
                            <p>🏠 {{ form.content.address }}</p>
                        </template>

                        <template v-else-if="form.type === 'business'">
                            <p>🏢 {{ form.content.companyName }}</p>
                            <p>📍 {{ form.content.address }}</p>
                            <p>📞 {{ form.content.phone }}</p>
                        </template>

                        <div class="mt-6" v-if="campaign && campaign.url">
                            <p class="text-sm text-gray-500 mb-2">URL Campaign:</p>
                            <a :href="campaign.url" target="_blank" class="text-blue-600 hover:underline break-all">
                                {{ campaign.url }}
                            </a>
                        </div>

                        <client-only>
                            <VueQrcode
                                v-if="campaign && campaign.url"
                                ref="qrRef"
                                :value="campaign.url"
                                :options="{ width: 180 }"
                                class="mx-auto my-4"
                            />
                        </client-only>

                        <a-button block type="dashed" @click="downloadQR">
                            📥 Tải QR Code
                        </a-button>
                    </a-card>
                </a-col>
            </a-row>
        </a-spin>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { message } from 'ant-design-vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'

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
const qrRef = ref(null)

const fetchCampaignDetail = async () => {
    loading.value = true
    try {
        const res = await $axios.get(`/api/campaigns/${route.params.id}`)
        campaign.value = res.data.data

        Object.assign(form, {
            name: campaign.value.name,
            description: campaign.value.description,
            status: campaign.value.status,
            type: campaign.value.type,
            content: { ...campaign.value.content }
        })

        await nextTick()
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

const downloadQR = () => {
    const canvas = qrRef.value?.$el
    if (!canvas) {
        alert('QR chưa sẵn sàng!')
        return
    }

    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${campaign.value?.name || 'qr-code'}.png`
    link.click()
}

onMounted(fetchCampaignDetail)
</script>


<style scoped>
textarea {
    min-height: 80px;
}
</style>
