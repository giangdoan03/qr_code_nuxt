<template>
    <div>
        <h2 class="text-2xl font-bold mb-6">📈 Thống kê Analytics</h2>

        <!-- Bộ lọc -->
        <a-card class="mb-6">
            <a-row :gutter="16" align="bottom">
                <a-col :xs="24" :sm="12" :md="8">
                    <a-form-item label="Khoảng thời gian">
                        <a-range-picker v-model:value="dateRange" format="YYYY-MM-DD" />
                    </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="12" :md="4">
                    <a-button type="primary" @click="fetchAnalytics">Lọc</a-button>
                </a-col>
            </a-row>
        </a-card>

        <!-- Tổng quan -->
        <a-row :gutter="16" class="mb-6">
            <a-col :xs="24" :sm="12" :md="6">
                <a-card>
                    <a-statistic
                        title="Tổng lượt quét"
                        :value="summary.totalScans"
                        :value-style="statStyles.blue"
                    />
                </a-card>
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
                <a-card>
                    <a-statistic
                        title="Lượt quét hôm nay"
                        :value="summary.todayScans"
                        :value-style="statStyles.green"
                    />
                </a-card>
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
                <a-card>
                    <a-statistic
                        title="Campaign hoạt động"
                        :value="summary.activeCampaigns"
                        :value-style="statStyles.purple"
                    />
                </a-card>
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
                <a-card>
                    <a-statistic
                        title="Người dùng mới"
                        :value="summary.newUsers"
                        :value-style="statStyles.orange"
                    />
                </a-card>
            </a-col>
        </a-row>

        <!-- Biểu đồ -->
        <a-card title="📊 Biểu đồ lượt quét theo ngày">
            <div style="height: 300px">
                <canvas ref="chartCanvas"></canvas>
            </div>
        </a-card>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import dayjs from 'dayjs'
import Chart from 'chart.js/auto'

definePageMeta({ layout: 'default' })

const { $axios } = useNuxtApp()

const summary = reactive({
    totalScans: 0,
    todayScans: 0,
    activeCampaigns: 0,
    newUsers: 0
})

const statStyles = {
    blue: { color: '#1d4ed8', fontSize: '28px' },
    green: { color: '#16a34a', fontSize: '28px' },
    purple: { color: '#7c3aed', fontSize: '28px' },
    orange: { color: '#f97316', fontSize: '28px' }
}

const dateRange = ref([dayjs().subtract(7, 'day'), dayjs()])
const chartCanvas = ref(null)
const chartData = ref([])
let chartInstance = null

const fetchAnalytics = async () => {
    try {
        const [start, end] = dateRange.value || []
        const res = await $axios.get('/api/analytics', {
            params: {
                startDate: start?.format('YYYY-MM-DD'),
                endDate: end?.format('YYYY-MM-DD')
            }
        })

        const { summary: s, dailyStats } = res.data

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

const renderChart = () => {
    if (!chartCanvas.value) return
    if (chartInstance) chartInstance.destroy()

    const labels = chartData.value.map(item => item.date)
    const data = chartData.value.map(item => item.scans)

    chartInstance = new Chart(chartCanvas.value, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Lượt quét',
                    data,
                    borderColor: '#1890ff',
                    backgroundColor: 'rgba(24,144,255,0.1)',
                    fill: true,
                    tension: 0.3
                }
            ]
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
.text-3xl {
    font-size: 1.875rem;
}
</style>
