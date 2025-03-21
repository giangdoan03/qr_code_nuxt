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
                    <li>
                        <NuxtLink to="/dashboard" class="block p-2 rounded hover:bg-blue-100">📊 Dashboard</NuxtLink>
                    </li>

                    <!-- QR Campaigns Menu -->
                    <li>
                        <div
                            @click="toggleQRMenu"
                            class="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-blue-100"
                        >
                            <span>🎯 QR Campaigns</span>
                            <span>{{ isQRMenuOpen ? '▲' : '▼' }}</span>
                        </div>
                        <Transition name="submenu">
                            <ul v-if="isQRMenuOpen" class="pl-4 space-y-2 mt-2">
                                <li>
                                    <NuxtLink to="/campaigns/create" class="block p-2 rounded hover:bg-blue-100">➕ Tạo Campaign</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink to="/campaigns/vcard" class="block p-2 rounded hover:bg-blue-100">👤 QR vCard</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink to="/campaigns/product" class="block p-2 rounded hover:bg-blue-100">📦 QR Sản phẩm</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink to="/campaigns/business" class="block p-2 rounded hover:bg-blue-100">🏢 QR Doanh nghiệp</NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink to="/campaigns/manage" class="block p-2 rounded hover:bg-blue-100">📋 Quản lý Campaign</NuxtLink>
                                </li>
                            </ul>
                        </Transition>
                    </li>

                    <li>
                        <NuxtLink to="/analytics" class="block p-2 rounded hover:bg-blue-100">📈 Analytics</NuxtLink>
                    </li>

                    <li>
                        <NuxtLink to="/users" class="block p-2 rounded hover:bg-blue-100">👤 Users</NuxtLink>
                    </li>

                    <li>
                        <NuxtLink to="/settings" class="block p-2 rounded hover:bg-blue-100">⚙️ Cài đặt</NuxtLink>
                    </li>
                </ul>
            </nav>
        </aside>
    </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
    isOpen: Boolean
})

const emit = defineEmits(['toggleSidebar'])

const isQRMenuOpen = ref(false)
const toggleQRMenu = () => {
    isQRMenuOpen.value = !isQRMenuOpen.value
}

const isDesktop = ref(false)

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
/* Fade in/out for overlay */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

/* Submenu transition */
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