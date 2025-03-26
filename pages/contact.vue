<template>
    <header id="masthead" class="bg-white shadow">
        <div class="site-branding text-center py-4">
            <h1 class="site-title text-3xl font-bold text-blue-600">
                <NuxtLink to="/">QR Code Marketing</NuxtLink>
            </h1>
            <p class="site-description text-sm text-gray-600">Giải pháp QR Marketing & Thiết kế website</p>
        </div>

        <nav id="site-navigation" class="bg-blue-600">
            <div class="container mx-auto flex justify-between items-center px-4 py-3">
                <button class="menu-toggle md:hidden text-white" @click="toggleMenu">☰ Menu</button>
                <ul :class="['flex flex-col md:flex-row md:space-x-6 text-white font-medium mb-0 text-sm md:text-base w-full md:w-auto', isMenuOpen ? 'block' : 'hidden md:flex']">
                    <li>
                        <NuxtLink to="/" class="block py-2 px-4 hover:bg-blue-700">Trang chủ</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="#services" class="block py-2 px-4 hover:bg-blue-700">Dịch vụ</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="#qr-code-types" class="block py-2 px-4 hover:bg-blue-700">QR Code</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/contact" class="block py-2 px-4 hover:bg-blue-700">Liên hệ</NuxtLink>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
    <div class="max-w-2xl mx-auto p-6 pt-12 bg-white shadow rounded mt-8">
        <h1 class="text-3xl font-bold mb-6">📬 Liên hệ với chúng tôi</h1>

        <a-form
            :model="form"
            :rules="rules"
            layout="vertical"
            @finish="handleSubmit"
        >
            <a-form-item label="Họ và tên" name="name">
                <a-input v-model:value="form.name" placeholder="Nhập họ và tên của bạn"/>
            </a-form-item>

            <a-form-item label="Email" name="email">
                <a-input v-model:value="form.email" placeholder="you@example.com"/>
            </a-form-item>

            <a-form-item label="Tiêu đề" name="subject">
                <a-input v-model:value="form.subject" placeholder="Tiêu đề liên hệ"/>
            </a-form-item>

            <a-form-item label="Nội dung" name="message">
                <a-textarea v-model:value="form.message" :rows="4"/>
            </a-form-item>

            <a-form-item>
                <a-button type="primary" html-type="submit" :loading="loading" block>
                    {{ loading ? 'Đang gửi...' : 'Gửi liên hệ' }}
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup>

definePageMeta({
    layout: 'empty'
})


import {ref} from 'vue'
import {message} from 'ant-design-vue'

const form = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
})

const loading = ref(false)

const isMenuOpen = ref(false)
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}


const rules = {
    name: [{required: true, message: 'Vui lòng nhập họ tên!'}],
    email: [
        {required: true, message: 'Vui lòng nhập email!'},
        {type: 'email', message: 'Email không hợp lệ!'}
    ],
    subject: [{required: true, message: 'Vui lòng nhập tiêu đề!'}],
    message: [{required: true, message: 'Vui lòng nhập nội dung!'}]
}

const handleSubmit = async () => {
    loading.value = true
    try {
        // Gửi dữ liệu form đến server hoặc API tại đây
        await new Promise(resolve => setTimeout(resolve, 1000)) // giả lập API call

        message.success('✅ Gửi liên hệ thành công!')
        form.value = {
            name: '',
            email: '',
            subject: '',
            message: ''
        }
    } catch (error) {
        message.error('❌ Gửi liên hệ thất bại!')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* Tuỳ chỉnh thêm nếu muốn */
</style>
