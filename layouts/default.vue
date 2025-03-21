<template>
    <div class="flex min-h-screen bg-gray-100">
        <!-- Sidebar -->
        <Sidebar :is-open="sidebarOpen" @toggleSidebar="toggleSidebar" />

        <!-- Main content -->
        <div class="flex flex-col flex-1 transition-all">
            <!-- Topbar -->
            <Topbar @toggleSidebar="toggleSidebar" />

            <!-- Nội dung page -->
            <main class="flex-1 p-4 pt-20 md:pt-20">
                <slot />
            </main>

            <!-- Footer -->
            <Footer />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '~/components/layout/Sidebar.vue'
import Topbar from '~/components/layout/Topbar.vue'
import Footer from '~/components/layout/Footer.vue'

const sidebarOpen = ref(false)

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
}
</script>
