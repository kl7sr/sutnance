export const storageUrl = (path) => {
    // بفضل البروكسي الذي أضفته، سيتم تحويل أي طلب يبدأ بـ /storage إلى لارافيل تلقائياً
    return `/storage/${path}`;
};