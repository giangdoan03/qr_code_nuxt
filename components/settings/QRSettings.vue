<template>
    <div class="p-4 bg-white rounded shadow w-full max-w-xl">
        <h3 class="text-xl font-bold mb-4">🎨 Cài đặt QR Code</h3>

        <a-form layout="vertical" :model="form">
            <a-form-item label="Nội dung QR">
                <a-input v-model:value="form.value" placeholder="https://example.com" />
            </a-form-item>

            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="Màu QR (foreground)">
                        <a-input type="color" v-model:value="form.color" class="w-full" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="Màu nền (background)">
                        <a-input type="color" v-model:value="form.bgColor" class="w-full" />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-form-item label="Mức độ phục hồi lỗi (Error Level)">
                <a-segmented
                    v-model:value="form.errorLevel"
                    :options="errorLevels"
                    block
                />
            </a-form-item>

            <a-form-item label="Icon trong QR (URL)">
                <a-input
                    v-model:value="form.icon"
                    placeholder="https://example.com/logo.png"
                />
            </a-form-item>
        </a-form>

        <div class="mt-6 text-center">
            <h4 class="font-semibold mb-2">🔍 Xem trước</h4>
            <a-qrcode
                :value="form.value"
                :color="form.color"
                :bg-color="form.bgColor"
                :error-level="form.errorLevel"
                :icon="form.icon"
                type="canvas"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
    value: 'https://example.com',
    color: '#000000',
    bgColor: '#ffffff',
    errorLevel: 'M',
    icon: 'https://www.antdv.com/assets/logo.1ef800a8.svg'
})

const errorLevels = ['L', 'M', 'Q', 'H']
</script>

<style scoped>
/* Tùy chỉnh thêm nếu cần */
</style>
