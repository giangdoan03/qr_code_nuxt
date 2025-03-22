<template>
    <div class="space-y-4">
        <h3 class="text-lg font-semibold">🔑 API Keys</h3>
        <form @submit.prevent="saveAPIKeys" class="space-y-4">
            <div>
                <label class="block text-sm font-medium mb-1">Stripe API Key</label>
                <input v-model="keys.stripe" type="text" class="w-full border rounded p-2" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">PayPal Client ID</label>
                <input v-model="keys.paypal" type="text" class="w-full border rounded p-2" />
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Lưu API Keys
            </button>
        </form>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useNuxtApp } from '#app'
import { message } from 'ant-design-vue'

const { $axios } = useNuxtApp()

const keys = reactive({
    stripe: '',
    paypal: ''
})

const saveAPIKeys = async () => {
    try {
        await $axios.put('/api/settings/api', keys)
        message.success('Đã lưu API Keys!')
    } catch (err) {
        console.error('Lỗi lưu APIKeys:', err)
        message.error('Không thể lưu API Keys!')
    }
}
</script>
