<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCookie } from '#app'
import { message } from 'ant-design-vue'

const router = useRouter()
const email = ref('')
const password = ref('')

// Dùng layout rỗng cho trang login
definePageMeta({
    layout: 'empty'
})

const login = async () => {
    try {
        const { data, error } = await useFetch('/api/auth/login', {
            method: 'POST',
            body: {
                email: email.value,
                password: password.value
            }
        })

        if (error.value) {
            console.log('❌ Lỗi trả về từ server:', error.value)
            message.error(error.value?.data?.message || 'Đăng nhập thất bại!')
            return
        }

        console.log('📥 Response data:', data.value)

        if (data.value?.token && data.value?.user) {
            // Lưu token
            const token = useCookie('token', { path: '/' })
            token.value = data.value.token

            // Lưu thông tin user vào cookie (có thể dùng pinia store để reactive thêm)
            const user = useCookie('user', { path: '/' })
            user.value = data.value.user

            message.success('Đăng nhập thành công!')

            // Điều hướng về dashboard
            router.push('/dashboard')
        } else {
            message.error('Sai thông tin đăng nhập!')
        }
    } catch (err) {
        console.log('🔥 Lỗi catch:', err)
        message.error('Đăng nhập thất bại! Hệ thống đang bảo trì hoặc lỗi kết nối.')
    }
}
</script>

<template>
    <div class="flex justify-center items-center h-screen bg-gray-100">
        <form @submit.prevent="login" class="bg-white p-8 rounded shadow w-full max-w-md">
            <h2 class="text-2xl font-bold text-center mb-6">Đăng nhập</h2>

            <div class="mb-4">
                <label class="block mb-1">Email</label>
                <input
                    v-model="email"
                    type="email"
                    required
                    placeholder="Nhập email"
                    class="w-full p-2 border rounded"
                />
            </div>

            <div class="mb-6">
                <label class="block mb-1">Mật khẩu</label>
                <input
                    v-model="password"
                    type="password"
                    required
                    placeholder="Nhập mật khẩu"
                    class="w-full p-2 border rounded"
                />
            </div>

            <button
                type="submit"
                class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
                Đăng nhập
            </button>

            <p class="text-center mt-4 text-sm">
                Chưa có tài khoản?
                <nuxt-link to="/register" class="text-blue-500 hover:underline">Đăng ký</nuxt-link>
            </p>
        </form>
    </div>
</template>
