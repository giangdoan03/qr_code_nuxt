<template>
    <div class="flex flex-col min-h-screen font-sans">
        <!-- Header -->
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
                    <ul :class="['flex flex-col md:flex-row md:space-x-6 text-white font-medium text-sm md:text-base w-full md:w-auto', isMenuOpen ? 'block' : 'hidden md:flex']">
                        <li><NuxtLink to="/" class="block py-2 px-4 hover:bg-blue-700">Trang chủ</NuxtLink></li>
                        <li><NuxtLink to="#services" class="block py-2 px-4 hover:bg-blue-700">Dịch vụ</NuxtLink></li>
                        <li><NuxtLink to="#qr-code-types" class="block py-2 px-4 hover:bg-blue-700">QR Code</NuxtLink></li>
                        <li><NuxtLink to="/contact" class="block py-2 px-4 hover:bg-blue-700">Liên hệ</NuxtLink></li>
                    </ul>
                </div>
            </nav>
        </header>

        <!-- Main -->
        <main id="site-content" class="flex-grow">
            <!-- Hero Section -->
            <section class="bg-blue-50 text-center py-20 px-4">
                <h1 class="text-4xl font-bold mb-4">Giải pháp QR Code Marketing & Thiết Kế Website</h1>
                <p class="text-lg text-gray-600 mb-6">Đưa doanh nghiệp của bạn tiếp cận khách hàng thông minh hơn!</p>
                <NuxtLink to="#services" class="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
                    Khám phá ngay
                </NuxtLink>
            </section>

            <!-- About -->
            <section class="py-16 text-center bg-white px-4">
                <div class="container mx-auto max-w-4xl">
                    <h2 class="text-3xl font-bold mb-4">Về Chúng Tôi</h2>
                    <p class="text-lg text-gray-600">
                        Chúng tôi cung cấp giải pháp tạo QR Code thông minh giúp bạn dễ dàng kết nối khách hàng, tăng trưởng doanh thu và xây dựng thương hiệu bền vững. Đồng thời, dịch vụ thiết kế website chuyên nghiệp giúp bạn hiện diện mạnh mẽ trên Internet.
                    </p>
                </div>
            </section>

            <!-- QR Code Types -->
            <section id="qr-code-types" class="bg-gray-50 py-16 px-4">
                <div class="container mx-auto">
                    <h2 class="text-3xl font-bold text-center mb-10">Các Loại QR Code Cho Marketing</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div v-for="(item, index) in qrTypes" :key="index" class="bg-white p-6 shadow rounded text-center">
                            <h3 class="font-semibold text-xl mb-2">{{ item.title }}</h3>
                            <p class="text-gray-600 text-sm">{{ item.description }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Services -->
            <section id="services" class="py-16 px-4 bg-white">
                <div class="container mx-auto">
                    <h2 class="text-3xl font-bold text-center mb-10">Dịch Vụ Khác Của Chúng Tôi</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div v-for="(item, index) in services" :key="index" class="bg-white p-6 shadow rounded text-center">
                            <h3 class="font-semibold text-xl mb-2">{{ item.title }}</h3>
                            <p class="text-gray-600 text-sm">{{ item.description }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Call to Action -->
            <section class="contact-section bg-blue-50 py-16 text-center px-4">
                <h2 class="text-3xl font-bold mb-4">Liên hệ ngay để nhận tư vấn miễn phí!</h2>
                <p class="text-gray-600 mb-6">Chúng tôi luôn sẵn sàng hỗ trợ bạn triển khai giải pháp QR Code và Website chuyên nghiệp.</p>
                <NuxtLink to="/contact" class="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
                    Liên hệ ngay
                </NuxtLink>
            </section>
        </main>

        <!-- Footer -->
        <footer id="colophon" class="bg-gray-900 text-gray-300">
            <div class="footer-widgets py-12 px-4">
                <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Giới thiệu -->
                    <div>
                        <h3 class="text-white text-xl font-bold mb-4">QR Code Marketing</h3>
                        <p>Cung cấp giải pháp QR Code thông minh giúp doanh nghiệp dễ dàng kết nối khách hàng, tăng trưởng doanh thu và xây dựng thương hiệu.</p>
                    </div>

                    <!-- Dịch vụ -->
                    <div>
                        <h3 class="text-white text-xl font-bold mb-4">Dịch vụ của chúng tôi</h3>
                        <ul class="space-y-2">
                            <li><NuxtLink to="#" class="hover:text-blue-400">Tạo QR Code Marketing</NuxtLink></li>
                            <li><NuxtLink to="#" class="hover:text-blue-400">Thiết kế Website chuẩn SEO</NuxtLink></li>
                            <li><NuxtLink to="#" class="hover:text-blue-400">Email Marketing tự động</NuxtLink></li>
                        </ul>
                    </div>

                    <!-- Liên hệ -->
                    <div>
                        <h3 class="text-white text-xl font-bold mb-4">Liên hệ</h3>
                        <p>Hotline: <a href="tel:0123456789" class="hover:text-blue-400">0123 456 789</a></p>
                        <p>Email: <a href="mailto:info@qrcodemarketing.com" class="hover:text-blue-400">info@qrcodemarketing.com</a></p>
                        <p>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
                    </div>
                </div>
            </div>

            <div class="site-info text-center text-gray-500 text-sm border-t border-gray-700 py-4">
                &copy; {{ new Date().getFullYear() }} QR Code Marketing. All rights reserved.
            </div>
        </footer>
    </div>
</template>

<script setup>

definePageMeta({
    layout: 'empty'
})

import { ref } from 'vue'

const isMenuOpen = ref(false)
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const qrTypes = [
    { title: 'QR Code Sản Phẩm', description: 'Giới thiệu chi tiết sản phẩm, thông số, giá cả khi khách quét QR.' },
    { title: 'QR Link Website', description: 'Chuyển hướng khách hàng đến website hoặc landing page bất kỳ.' },
    { title: 'QR Thanh Toán VNPAY', description: 'Giúp khách hàng thanh toán nhanh chóng qua QR Code VNPAY.' },
    { title: 'QR Khảo Sát Khách Hàng', description: 'Tạo khảo sát ý kiến nhanh, giúp cải thiện sản phẩm và dịch vụ.' },
    { title: 'QR PDF / Hình Ảnh / Video', description: 'Chia sẻ nội dung tài liệu, video hoặc hình ảnh qua quét QR tiện lợi.' },
    { title: 'QR Checkin / Loyalty / App', description: 'Ứng dụng trong event check-in, thẻ thành viên và liên kết tải app.' }
]

const services = [
    { title: 'Thiết Kế Website', description: 'Website chuẩn SEO, giao diện UX/UI hiện đại, tối ưu trải nghiệm người dùng.' },
    { title: 'SEO & Marketing', description: 'Dịch vụ SEO, quảng cáo Google Ads, Facebook Ads giúp bạn tăng trưởng doanh thu.' },
    { title: 'Hosting & Domain', description: 'Đăng ký domain và hosting chất lượng, đảm bảo tốc độ và bảo mật.' }
]
</script>

<style scoped>
/* Tùy chỉnh nhỏ */
.container {
    max-width: 1200px;
}

.menu-toggle {
    font-size: 18px;
}

ul.open {
    display: flex;
}
ul {
    margin-bottom: 0;
    padding-bottom: 0;
}
ul li a {
    transition: 0.3s;
}
</style>
