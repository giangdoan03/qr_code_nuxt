<template>
    <div class="p-6 bg-white rounded shadow">
        <h2 class="text-xl font-bold mb-4">Tạo QR vCard</h2>

        <form @submit.prevent="createVCardQR" class="space-y-4">
            <input v-model="form.name" placeholder="Tên" class="border p-2 rounded w-full" />
            <input v-model="form.phone" placeholder="Số điện thoại" class="border p-2 rounded w-full" />
            <input v-model="form.email" placeholder="Email" class="border p-2 rounded w-full" />
            <input v-model="form.website" placeholder="Website" class="border p-2 rounded w-full" />

            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Tạo QR
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
    layout: 'default' // Có thể bỏ nếu default là mặc định
})
const form = ref({
    name: '',
    phone: '',
    email: '',
    website: ''
})

const createVCardQR = () => {
    console.log('Tạo QR vCard với dữ liệu:', form.value)
    // Call API hoặc generate QR
}
</script>
