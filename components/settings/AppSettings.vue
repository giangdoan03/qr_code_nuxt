<template>
    <div class="space-y-4">
        <h3 class="text-lg font-semibold">📋 Thông tin hệ thống</h3>

        <a-form
            layout="vertical"
            :model="settings"
            @submit.prevent="saveAppSettings"
        >
            <a-form-item label="Tên hệ thống" name="appName">
                <a-input v-model:value="settings.appName" placeholder="VD: QR Marketing App" />
            </a-form-item>

            <a-form-item label="Logo (URL)" name="logoUrl">
                <a-input v-model:value="settings.logoUrl" placeholder="https://example.com/logo.png" />
            </a-form-item>

            <a-form-item label="Website" name="website">
                <a-input v-model:value="settings.website" type="url" placeholder="https://..." />
            </a-form-item>

            <a-form-item label="Email liên hệ" name="contactEmail">
                <a-input v-model:value="settings.contactEmail" type="email" placeholder="you@example.com" />
            </a-form-item>

            <a-form-item>
                <a-button type="primary" html-type="submit" block :loading="loading">
                    {{ loading ? 'Đang lưu...' : 'Lưu thông tin' }}
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {useNuxtApp} from '#app'
import {message} from 'ant-design-vue'

const {$axios} = useNuxtApp()
const loading = ref(false)

const settings = reactive({
    appName: 'QR Marketing App',
    logoUrl: '',
    website: '',
    contactEmail: ''
})

const saveAppSettings = async () => {
    loading.value = true
    try {
        await $axios.put('/api/settings/app', settings)
        message.success('✅ Đã lưu thông tin hệ thống!')
    } catch (err) {
        console.error('❌ Lỗi lưu appSettings:', err)
        message.error('Không thể lưu thông tin hệ thống!')
    } finally {
        loading.value = false
    }
}
</script>
