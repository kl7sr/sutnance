import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '', // مطلوب في الـ Validator الخاص بك
        role: 'user',
        profile_photo: null
    });

    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // استخدام FormData لدعم رفع الصور
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            // Laravel يحتاج CSRF token للطلبات الآمنة
            const response = await axios.post('/users', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });

            if (response.data.success) {
                setMessage({ type: 'success', text: response.data.message });
                // تفريغ الفورم
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "حدث خطأ أثناء الإرسال";
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4 text-center">
                إضافة مستخدم جديد (Admin Panel)
            </h2>

            {message.text && (
                <div className={`p-4 mb-6 rounded-lg text-center font-bold ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
                {/* الاسم */}
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">الاسم الكامل</label>
                    <input type="text" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                        onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>

                {/* البريد */}
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">البريد الإلكتروني</label>
                    <input type="email" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                        onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>

                {/* كلمة المرور */}
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">كلمة المرور</label>
                    <input type="password" name="password" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                        onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>

                {/* تأكيد كلمة المرور */}
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">تأكيد كلمة المرور</label>
                    <input type="password" name="password_confirmation" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                        onChange={e => setFormData({...formData, password_confirmation: e.target.value})} required />
                </div>

                {/* الدور (Role) */}
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">الصلاحية</label>
                    <select className="p-3 border rounded-lg bg-white" 
                        onChange={e => setFormData({...formData, role: e.target.value})}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* الصورة الشخصية */}
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold">الصورة الشخصية</label>
                    <input type="file" className="p-2" 
                        onChange={e => setFormData({...formData, profile_photo: e.target.files[0]})} />
                </div>

                <div className="md:col-span-2 mt-4">
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95">
                        إنشاء الحساب الآن
                    </button>
                </div>
            </form>
        </div>
    );
}