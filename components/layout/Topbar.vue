<template>
    <a-layout-header class="flex items-center justify-between px-4 bg-white shadow fixed top-0 left-0 right-0 z-30 md:left-64 !h-16">
        <!-- Nút mở sidebar -->
        <a-button
            type="text"
            size="large"
            class="md:hidden"
            @click="toggleSidebar"
            :icon="h(MenuOutlined)"
        />

        <!-- Tiêu đề -->
        <h1 class="text-base font-semibold text-gray-700">QR Marketing Dashboard</h1>

        <!-- Thông tin người dùng + Logout -->
        <div class="flex items-center gap-4">
            <a-typography-text v-if="userInfo?.name" class="hidden md:inline" type="secondary">
                Xin chào, {{ userInfo.name }}
            </a-typography-text>

            <a-button type="link" danger size="small" @click="logout">
                Đăng xuất
            </a-button>
        </div>
    </a-layout-header>
</template>

<script setup>
import { computed, h } from 'vue'
import { MenuOutlined } from '@ant-design/icons-vue'
import { useCookie } from '#app'

// Gửi emit toggle
const emit = defineEmits(['toggleSidebar'])
const toggleSidebar = () => emit('toggleSidebar')

// Lấy thông tin người dùng từ cookie
const user = useCookie('user', { path: '/' })
const userInfo = computed(() => user.value || {})

// Hàm logout
const logout = () => {
    const token = useCookie('token', { path: '/' })
    const userCookie = useCookie('user', { path: '/' })

    // Điều hướng về login
    window.location.href = '/login'

    // Xoá dữ liệu
    token.value = null
    userCookie.value = null
    localStorage.clear()
    sessionStorage.clear()
}
</script>

<style scoped>
/* Ghi đè chiều cao mặc định của a-layout-header */
:deep(.ant-layout-header) {
    height: 64px !important;
    line-height: 64px;
    padding: 0 16px;
}
</style>
