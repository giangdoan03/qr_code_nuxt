<script setup>
import tw from 'twin.macro'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCookie } from '#app'
import { message } from 'ant-design-vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const register = async () => {
    if (password.value !== confirmPassword.value) {
        message.error('Mật khẩu không khớp!')
        return
    }

    const { $axios } = useNuxtApp()

    try {
        const res = await $axios.post('/auth/register', {
            email: email.value,
            password: password.value
        })

        message.success('Đăng ký thành công! Đăng nhập ngay.')
        router.push('/login')
    } catch (err) {
        message.error('Email đã tồn tại hoặc lỗi đăng ký!')
    }
}
</script>

<template>
    <div :class="tw`flex items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500`">
        <div :class="tw`bg-white p-8 rounded-lg shadow-md w-full max-w-md`">
            <h2 :class="tw`text-2xl font-bold text-center text-gray-700 mb-6`">Đăng ký</h2>
            <form @submit.prevent="register">
                <div :class="tw`mb-4`">
                    <label :class="tw`block text-gray-600 mb-2`">Email</label>
                    <input v-model="email" type="email" required :class="tw`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400`" />
                </div>
                <div :class="tw`mb-4`">
                    <label :class="tw`block text-gray-600 mb-2`">Mật khẩu</label>
                    <input v-model="password" type="password" required :class="tw`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400`" />
                </div>
                <div :class="tw`mb-6`">
                    <label :class="tw`block text-gray-600 mb-2`">Nhập lại mật khẩu</label>
                    <input v-model="confirmPassword" type="password" required :class="tw`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400`" />
                </div>
                <button type="submit" :class="tw`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded`">Đăng ký</button>
                <p :class="tw`mt-4 text-center text-gray-600`">
                    Đã có tài khoản?
                    <nuxt-link to="/login" :class="tw`text-green-500 hover:underline`">Đăng nhập</nuxt-link>
                </p>
            </form>
        </div>
    </div>
</template>
