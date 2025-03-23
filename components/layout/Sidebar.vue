<template>
    <!-- Overlay trên mobile -->
    <Transition name="fade">
        <div
            v-if="isOpen && !isDesktop"
            class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            @click="$emit('toggleSidebar')"
        ></div>
    </Transition>

    <!-- Sidebar -->
    <Transition name="slide">
        <aside
            v-show="isOpen || isDesktop"
            class="fixed top-0 left-0 w-64 bg-white shadow h-full z-50 md:translate-x-0 md:static md:h-screen"
        >
            <div class="flex items-center justify-between h-16 px-4 border-b">
                <h2 class="text-xl font-bold text-blue-600">QR Admin</h2>
                <button class="md:hidden" @click="$emit('toggleSidebar')">✕</button>
            </div>

            <nav class="flex-1 overflow-y-auto p-4">
                <ul class="space-y-2">

                    <!-- Dashboard -->
                    <li>
                        <NuxtLink
                            to="/dashboard"
                            :class="linkClass('/dashboard')"
                        >
                            📊 Dashboard
                        </NuxtLink>
                    </li>

                    <!-- QR Campaigns -->
                    <li>
                        <div
                            @click="toggleQRMenu"
                            class="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-blue-100"
                            :class="{ 'bg-blue-100 font-semibold': isQRMenuActive }"
                        >
                            <span>🎯 QR Marketing</span>
                            <span>{{ isQRMenuOpen ? '▲' : '▼' }}</span>
                        </div>

                        <Transition name="submenu">
                            <ul v-if="isQRMenuOpen" class="pl-4 space-y-2 mt-2">
<!--                                <li>-->
<!--                                    <NuxtLink :to="'/campaigns/create'" :class="linkClass('/campaigns/create')">-->
<!--                                        ➕ Tạo Campaign-->
<!--                                    </NuxtLink>-->
<!--                                </li>-->
                                <li>
                                    <NuxtLink :to="'/campaigns/vcard'" :class="linkClass('/campaigns/vcard')">
                                        👤 QR vCard
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink :to="'/campaigns/product'" :class="linkClass('/campaigns/product')">
                                        📦 QR Sản phẩm
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink :to="'/campaigns/business'" :class="linkClass('/campaigns/business')">
                                        🏢 QR Doanh nghiệp
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink :to="'/campaigns/manage'" :class="linkClass('/campaigns/manage')">
                                        📋 Quản lý QR code
                                    </NuxtLink>
                                </li>
                            </ul>
                        </Transition>
                    </li>

                    <!-- Analytics -->
                    <li>
                        <NuxtLink
                            to="/analytics"
                            :class="linkClass('/analytics')"
                        >
                            📈 Analytics
                        </NuxtLink>
                    </li>

                    <!-- Users -->
                    <li>
                        <NuxtLink
                            to="/users"
                            :class="linkClass('/users')"
                        >
                            👤 Users
                        </NuxtLink>
                    </li>

                    <!-- Settings -->
                    <li>
                        <NuxtLink
                            to="/settings"
                            :class="linkClass('/settings')"
                        >
                            ⚙️ Cài đặt
                        </NuxtLink>
                    </li>

                </ul>
            </nav>
        </aside>
    </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'

// Props & Emits
defineProps({ isOpen: Boolean })
const emit = defineEmits(['toggleSidebar'])

// State
const isQRMenuOpen = ref(false)
const isDesktop = ref(false)
const route = useRoute()

// Kiểm tra route hiện tại
const linkClass = (path) => {
    return [
        'block p-2 rounded hover:bg-blue-100 transition',
        route.path === path ? 'bg-blue-100 font-semibold text-blue-600' : 'text-gray-700'
    ]
}

// Mở submenu QR nếu đang ở các page thuộc QR Campaigns
const isQRMenuActive = computed(() => {
    return route.path.startsWith('/campaigns')
})

// Đồng bộ menu QR open theo URL
onMounted(() => {
    if (isQRMenuActive.value) {
        isQRMenuOpen.value = true
    }
})

const toggleQRMenu = () => {
    isQRMenuOpen.value = !isQRMenuOpen.value
}

const checkWindow = () => {
    isDesktop.value = window.innerWidth >= 768
}

onMounted(() => {
    checkWindow()
    window.addEventListener('resize', checkWindow)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkWindow)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.submenu-enter-active, .submenu-leave-active {
    transition: all 0.3s ease;
    transform-origin: top;
}
.submenu-enter-from {
    opacity: 0;
    transform: scaleY(0.95);
}
.submenu-enter-to {
    opacity: 1;
    transform: scaleY(1);
}
.submenu-leave-from {
    opacity: 1;
    transform: scaleY(1);
}
.submenu-leave-to {
    opacity: 0;
    transform: scaleY(0.95);
}
</style>
