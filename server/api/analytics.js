export default defineEventHandler((event) => {
    // Lấy query params (tuỳ chọn)
    const query = getQuery(event)
    const { startDate, endDate } = query

    console.log('📅 Lọc từ ngày:', startDate, 'đến ngày:', endDate)

    // Giả lập dữ liệu tổng quan
    const summary = {
        totalScans: 5320,
        todayScans: 230,
        activeCampaigns: 8,
        newUsers: 15
    }

    // Giả lập thống kê lượt quét hàng ngày
    const dailyStats = [
        { date: '2025-03-18', scans: 150 },
        { date: '2025-03-19', scans: 200 },
        { date: '2025-03-20', scans: 180 },
        { date: '2025-03-21', scans: 230 },
        { date: '2025-03-22', scans: 220 },
        { date: '2025-03-23', scans: 300 },
        { date: '2025-03-24', scans: 280 }
    ]

    // Có thể filter thêm theo startDate, endDate ở đây nếu cần
    const filteredStats = dailyStats.filter(item => {
        if (startDate && item.date < startDate) return false
        if (endDate && item.date > endDate) return false
        return true
    })

    // Trả kết quả về client
    return {
        summary,
        dailyStats: filteredStats
    }
})
