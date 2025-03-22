<template>
    <div class="p-6 w-full bg-white rounded shadow">
        <h2 class="text-2xl font-bold mb-6">⚙️ Cài đặt hệ thống</h2>

        <div class="border-b mb-4">
            <button @click="activeTab = 'app'" :class="tabClass('app')">Thông tin</button>
            <button @click="activeTab = 'qr'" :class="tabClass('qr')">QR Code</button>
            <button @click="activeTab = 'api'" :class="tabClass('api')">API Keys</button>
            <button @click="activeTab = 'security'" :class="tabClass('security')">Bảo mật</button>
        </div>

        <div v-if="activeTab === 'app'">
            <AppSettings />
        </div>
        <div v-if="activeTab === 'qr'">
            <QRSettings />
        </div>
        <div v-if="activeTab === 'api'">
            <APIKeys />
        </div>
        <div v-if="activeTab === 'security'">
            <SecuritySettings />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import AppSettings from '~/components/settings/AppSettings.vue'
import QRSettings from '~/components/settings/QRSettings.vue'
import APIKeys from '~/components/settings/APIKeys.vue'
import SecuritySettings from '~/components/settings/SecuritySettings.vue'

const activeTab = ref('app')

const tabClass = (tab) => activeTab.value === tab
    ? 'py-2 px-4 border-b-2 border-blue-500 font-semibold'
    : 'py-2 px-4 text-gray-500'
</script>
