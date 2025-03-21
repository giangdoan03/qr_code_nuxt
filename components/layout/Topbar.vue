<template>
    <header
        class="h-16 flex items-center justify-between bg-white shadow px-4 fixed top-0 left-0 right-0 z-30 md:left-64">
        <!-- Hamburger Icon -->
        <button class="md:hidden text-xl" @click="toggleSidebar">☰</button>

        <h1 class="text-lg font-semibold text-gray-700">QR Marketing Dashboard</h1>

        <div class="flex items-center space-x-4">
            <span class="hidden md:inline text-sm text-gray-600">Xin chào, Giang</span>
            <button @click="logout" class="text-red-500 hover:text-red-700 text-sm">Đăng xuất</button>
        </div>
    </header>
</template>

<script setup>
const emit = defineEmits(['toggleSidebar'])

const toggleSidebar = () => emit('toggleSidebar')

const logout = () => {
    useCookie('token').value = null
    useRouter().push('/login')
}
</script>
