<template>
    <div class="">
        <h2 class="text-2xl font-bold mb-6">📈 Thống kê Analytics</h2>

        <!-- Bộ lọc thời gian -->
        <div class="flex gap-4 mb-6 flex-wrap">
            <div>
                <label class="block text-sm font-medium mb-1">Từ ngày</label>
                <input v-model="filters.startDate" type="date" class="border px-2 py-2 rounded"/>
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Đến ngày</label>
                <input v-model="filters.endDate" type="date" class="border px-2 py-2 rounded"/>
            </div>

            <div class="flex items-end">
                <button @click="fetchAnalytics" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Lọc
                </button>
            </div>
        </div>

        <!-- Tổng quan -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white p-6 rounded shadow text-center">
                <h3 class="text-lg font-semibold">Tổng lượt quét</h3>
                <p class="text-3xl font-bold text-blue-600">{{ summary.totalScans }}</p>
            </div>
            <div class="bg-white p-6 rounded shadow text-center">
                <h3 class="text-lg font-semibold">Lượt quét hôm nay</h3>
                <p class="text-3xl font-bold text-green-600">{{ summary.todayScans }}</p>
            </div>
            <div class="bg-white p-6 rounded shadow text-center">
                <h3 class="text-lg font-semibold">Campaign hoạt động</h3>
                <p class="text-3xl font-bold text-purple-600">{{ summary.activeCampaigns }}</p>
            </div>
            <div class="bg-white p-6 rounded shadow text-center">
                <h3 class="text-lg font-semibold">Người dùng mới</h3>
                <p class="text-3xl font-bold text-orange-600">{{ summary.newUsers }}</p>
            </div>
        </div>

        <!-- Biểu đồ -->
        <div class="bg-white p-6 rounded shadow">
            <h3 class="text-lg font-semibold mb-4">Biểu đồ lượt quét hàng ngày</h3>
            <canvas ref="chartCanvas" height="100"></canvas>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, watch} from 'vue'
import {useNuxtApp} from '#app'
import Chart from 'chart.js/auto'

definePageMeta({
    layout: 'default'
})

const {$axios} = useNuxtApp()

// Dữ liệu
const summary = reactive({
    totalScans: 0,
    todayScans: 0,
    activeCampaigns: 0,
    newUsers: 0
})

const chartData = ref([])
const chartCanvas = ref(null)
let chartInstance = null

const filters = reactive({
    startDate: '',
    endDate: ''
})

// Lấy dữ liệu Analytics
const fetchAnalytics = async () => {
    try {
        const res = await $axios.get('/api/analytics', {
            params: {
                startDate: filters.startDate,
                endDate: filters.endDate
            }
        })

        const {summary: s, dailyStats} = res.data

        summary.totalScans = s.totalScans
        summary.todayScans = s.todayScans
        summary.activeCampaigns = s.activeCampaigns
        summary.newUsers = s.newUsers

        chartData.value = dailyStats
        renderChart()
    } catch (err) {
        console.error('❌ Lỗi lấy analytics:', err)
    }
}

// Vẽ biểu đồ
const renderChart = () => {
    if (!chartCanvas.value) return

    if (chartInstance) {
        chartInstance.destroy()
    }

    const labels = chartData.value.map(item => item.date)
    const data = chartData.value.map(item => item.scans)

    chartInstance = new Chart(chartCanvas.value, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Lượt quét',
                data,
                fill: true,
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    })
}

onMounted(() => {
    fetchAnalytics()
})
</script>

<style scoped>
canvas {
    width: 100% !important;
    height: 300px !important;
}
</style>
