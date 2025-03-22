<template>
    <div class="space-y-4">
        <h3 class="text-lg font-semibold">🔧 Cài đặt QR Code</h3>
        <form @submit.prevent="saveQRSettings" class="space-y-4">
            <div>
                <label class="block text-sm font-medium mb-1">Kích thước (px)</label>
                <input v-model="settings.size" type="number" class="w-full border rounded p-2" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Định dạng</label>
                <select v-model="settings.format" class="w-full border rounded p-2">
                    <option value="png">PNG</option>
                    <option value="svg">SVG</option>
                    <option value="jpg">JPG</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Thời gian hết hạn QR (ngày)</label>
                <input v-model="settings.expireDays" type="number" class="w-full border rounded p-2" />
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Lưu cài đặt QR
            </button>
        </form>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useNuxtApp } from '#app'
import { message } from 'ant-design-vue'

const { $axios } = useNuxtApp()

const settings = reactive({
    size: 300,
    format: 'png',
    expireDays: 30
})

const saveQRSettings = async () => {
    try {
        await $axios.put('/api/settings/qr', settings)
        message.success('Đã lưu cài đặt QR!')
    } catch (err) {
        console.error('Lỗi lưu QRSettings:', err)
        message.error('Không thể lưu cài đặt QR!')
    }
}
</script>
