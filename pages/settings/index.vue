<template>
    <a-card class="w-full bg-white">
        <template #title>
            ⚙️ Cài đặt hệ thống
        </template>

        <a-tabs v-model:activeKey="activeTab" tabPosition="top">
            <a-tab-pane key="app" tab="Thông tin">
                <AppSettings />
            </a-tab-pane>
            <a-tab-pane key="qr" tab="QR Code">
                <QRSettings />
            </a-tab-pane>
            <a-tab-pane key="api" tab="API Keys">
                <APIKeys />
            </a-tab-pane>
            <a-tab-pane key="security" tab="Bảo mật">
                <SecuritySettings />
            </a-tab-pane>
        </a-tabs>
    </a-card>
</template>

<script setup>
import { ref } from 'vue'
import AppSettings from '~/components/settings/AppSettings.vue'
import QRSettings from '~/components/settings/QRSettings.vue'
import APIKeys from '~/components/settings/APIKeys.vue'
import SecuritySettings from '~/components/settings/SecuritySettings.vue'

const activeTab = ref('app')
</script>

<style scoped>
/* Tuỳ chọn nếu muốn style thêm */
</style>
