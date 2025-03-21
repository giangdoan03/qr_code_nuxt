<script setup>
definePageMeta({
    layout: 'default' // có thể không cần viết nếu là layout mặc định
})
</script>

<template>
    <h2 class="text-2xl font-bold mb-6">Dashboard quản lý QR Campaigns</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-2">Số campaign đã tạo</h3>
            <p class="text-3xl font-bold text-blue-600">12</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-2">Lượt quét hôm nay</h3>
            <p class="text-3xl font-bold text-green-600">230</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-2">Tổng lượt quét</h3>
            <p class="text-3xl font-bold text-purple-600">5,320</p>
        </div>
    </div>
</template>
