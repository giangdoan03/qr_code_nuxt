<template>
    <div class="space-y-4">
        <h3 class="text-lg font-semibold">📋 Thông tin hệ thống</h3>
        <form @submit.prevent="saveAppSettings" class="space-y-4">
            <div>
                <label class="block text-sm font-medium mb-1">Tên hệ thống</label>
                <input v-model="settings.appName" type="text" class="w-full border rounded p-2" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Logo (URL)</label>
                <input v-model="settings.logoUrl" type="url" class="w-full border rounded p-2" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Website</label>
                <input v-model="settings.website" type="url" class="w-full border rounded p-2" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Email liên hệ</label>
                <input v-model="settings.contactEmail" type="email" class="w-full border rounded p-2" />
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Lưu thông tin
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
    appName: 'QR Marketing App',
    logoUrl: '',
    website: '',
    contactEmail: ''
})

const saveAppSettings = async () => {
    try {
        await $axios.put('/api/settings/app', settings)
        message.success('Đã lưu thông tin hệ thống!')
    } catch (err) {
        console.error('Lỗi lưu appSettings:', err)
        message.error('Không thể lưu thông tin hệ thống!')
    }
}
</script>
