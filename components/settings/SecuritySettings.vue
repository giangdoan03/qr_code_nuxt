<template>
    <div class="space-y-4">
        <h3 class="text-lg font-semibold">🔒 Bảo mật & 2FA</h3>
        <div class="flex items-center justify-between">
            <span>Bật xác thực 2 lớp (2FA)</span>
            <input type="checkbox" v-model="security.enable2FA" class="w-5 h-5" />
        </div>
        <div class="flex items-center justify-between">
            <span>Giới hạn IP đăng nhập</span>
            <input type="checkbox" v-model="security.restrictIP" class="w-5 h-5" />
        </div>
        <button @click="saveSecuritySettings" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Lưu bảo mật
        </button>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useNuxtApp } from '#app'
import { message } from 'ant-design-vue'

const { $axios } = useNuxtApp()

const security = reactive({
    enable2FA: false,
    restrictIP: false
})

const saveSecuritySettings = async () => {
    try {
        await $axios.put('/api/settings/security', security)
        message.success('Đã lưu bảo mật!')
    } catch (err) {
        console.error('Lỗi lưu securitySettings:', err)
        message.error('Không thể lưu bảo mật!')
    }
}
</script>
