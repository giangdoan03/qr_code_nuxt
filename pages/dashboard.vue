<script setup>
definePageMeta({
    layout: 'default'
})
</script>

<template>
    <div>
        <a-typography-title :level="2" class="mb-6">Dashboard quản lý QR Campaigns</a-typography-title>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <a-card>
                <a-statistic
                    title="Số campaign đã tạo"
                    :value="12"
                    value-style="color: #1d4ed8; font-size: 28px;"
                />
            </a-card>

            <a-card>
                <a-statistic
                    title="Lượt quét hôm nay"
                    :value="230"
                    value-style="color: #16a34a; font-size: 28px;"
                />
            </a-card>

            <a-card>
                <a-statistic
                    title="Tổng lượt quét"
                    :value="5320"
                    value-style="color: #7c3aed; font-size: 28px;"
                />
            </a-card>
        </div>
    </div>
</template>
