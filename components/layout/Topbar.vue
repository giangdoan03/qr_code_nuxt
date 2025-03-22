<template>
    <header class="h-16 flex items-center justify-between bg-white shadow px-4 fixed top-0 left-0 right-0 z-30 md:left-64">
        <!-- Hamburger Icon -->
        <button class="md:hidden text-xl" @click="toggleSidebar">☰</button>

        <h1 class="text-lg font-semibold text-gray-700">QR Marketing Dashboard</h1>

        <div class="flex items-center space-x-4">
            <!-- Chỉ hiển thị khi userInfo.name tồn tại -->
            <span
                v-if="userInfo?.name"
                class="hidden md:inline text-sm text-gray-600"
            >
        Xin chào, {{ userInfo.name }}
      </span>

            <button @click="logout" class="text-red-500 hover:text-red-700 text-sm">
                Đăng xuất
            </button>
        </div>
    </header>
</template>

<script setup>
import { computed } from 'vue'
import { useCookie } from '#app'

// Nhận event từ layout cha
const emit = defineEmits(['toggleSidebar'])
const toggleSidebar = () => {
    emit('toggleSidebar')
}

// Đọc cookie user từ SSR và Client
const user = useCookie('user', { path: '/' })

// Computed để lấy user info (tránh undefined)
const userInfo = computed(() => user.value || {})

// Hàm logout
const logout = () => {
    const token = useCookie('token', { path: '/' })
    const userCookie = useCookie('user', { path: '/' })

    // Điều hướng về login trước
    window.location.href = '/login'

    // Sau đó xoá cookies và clear local/sessionStorage
    token.value = null
    userCookie.value = null
    localStorage.clear()
    sessionStorage.clear()
}
</script>
