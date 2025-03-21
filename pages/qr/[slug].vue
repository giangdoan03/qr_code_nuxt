<script setup>
const route = useRoute()
const { data: qrData } = await useFetch(`/api/qr/${route.params.slug}`)

if (!qrData.value) {
    // Chuyển hướng 404 hoặc hiển thị thông báo
}
</script>

<template>
    <div v-if="qrData.type === 'product'">
        <h1>{{ qrData.name }}</h1>
        <img :src="qrData.images[0]" alt="" />
        <p>{{ qrData.description }}</p>
    </div>
</template>
