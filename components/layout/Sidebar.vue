<template>
    <Transition name="fade">
        <div
            v-if="isOpen && !isDesktop"
            class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            @click="$emit('toggleSidebar')"
        />
    </Transition>

    <Transition name="slide">
        <a-layout-sider
            v-show="isOpen || isDesktop"
            class="fixed z-50 top-0 left-0 h-full md:static md:h-screen shadow"
            :width="250"
            breakpoint="md"
            collapsed-width="0"
            :trigger="null"
        >
            <div class="h-16 px-4 flex items-center justify-between border-b border-gray-200">
                <h2 class="text-xl font-bold text-blue-600">QR Admin</h2>
                <a-button type="text" class="md:hidden" @click="$emit('toggleSidebar')">✕</a-button>
            </div>
            <ClientOnly>
                <a-menu
                    mode="inline"
                    :selected-keys="[route.path]"
                    :default-open-keys="isQRMenuActive ? ['qr'] : []"
                    class="h-full"
                >
                    <a-menu-item key="/dashboard">
                        <NuxtLink to="/dashboard">📊 Dashboard</NuxtLink>
                    </a-menu-item>

                    <a-sub-menu key="qr">
                        <template #title>🎯 QR Marketing</template>
                        <a-menu-item key="/campaigns/vcard">
                            <NuxtLink to="/campaigns/vcard">👤 QR vCard</NuxtLink>
                        </a-menu-item>
                        <a-menu-item key="/campaigns/product">
                            <NuxtLink to="/campaigns/product">📦 QR Sản phẩm</NuxtLink>
                        </a-menu-item>
                        <a-menu-item key="/campaigns/business">
                            <NuxtLink to="/campaigns/business">🏢 QR Doanh nghiệp</NuxtLink>
                        </a-menu-item>
                        <a-menu-item key="/campaigns/manage">
                            <NuxtLink to="/campaigns/manage">📋 Quản lý QR code</NuxtLink>
                        </a-menu-item>
                    </a-sub-menu>

                    <a-menu-item key="/analytics">
                        <NuxtLink to="/analytics">📈 Analytics</NuxtLink>
                    </a-menu-item>

                    <a-menu-item key="/users">
                        <NuxtLink to="/users">👤 Users</NuxtLink>
                    </a-menu-item>

                    <a-menu-item key="/settings">
                        <NuxtLink to="/settings">⚙️ Cài đặt</NuxtLink>
                    </a-menu-item>
                </a-menu>
            </ClientOnly>
        </a-layout-sider>
    </Transition>
</template>

<script setup>
import {ref, onMounted, onUnmounted, computed} from 'vue'
import {useRoute} from 'vue-router'
import {ClientOnly} from '#components'

defineProps({isOpen: Boolean})
const emit = defineEmits(['toggleSidebar'])

const route = useRoute()
const isDesktop = ref(false)

// Active QR submenu nếu URL khớp
const isQRMenuActive = computed(() => route.path.startsWith('/campaigns'))

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

.slide-enter-active, .slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from {
    transform: translateX(-100%);
}

.slide-enter-to {
    transform: translateX(0%);
}

.slide-leave-from {
    transform: translateX(0%);
}

.slide-leave-to {
    transform: translateX(-100%);
}
</style>
