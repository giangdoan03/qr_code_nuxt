export function validateCampaignInput({ name, type, content }) {
    if (!name || !type || !content) {
        return 'Thiếu thông tin name, type hoặc content!'
    }

    const validTypes = ['product', 'vcard', 'business']
    if (!validTypes.includes(type)) {
        return 'Loại type không hợp lệ!'
    }

    if (typeof content !== 'object') {
        return 'Content phải là object!'
    }

    switch (type) {
        case 'product':
            if (!content.productName || typeof content.price !== 'number') {
                return 'Thiếu thông tin sản phẩm hoặc price không đúng định dạng!'
            }
            break
        case 'vcard':
            if (!content.fullName || !content.phone) {
                return 'Thiếu thông tin vCard!'
            }
            break
        case 'business':
            if (!content.companyName || !content.address) {
                return 'Thiếu thông tin business!'
            }
            break
    }

    return null
}
