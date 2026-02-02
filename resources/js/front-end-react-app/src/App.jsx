import React from 'react';
import { useForm, Head } from '@inertiajs/react';

export default function UserCreate() {
    // استخدام helper الـ Inertia الرسمي للتعامل مع البيانات والملفات
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
        profile_photo: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Inertia يتعامل تلقائياً مع FormData إذا وجد ملفاً (profile_photo)
        post('/users', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                // التوجيه يتم من الـ Controller في Laravel
            },
        });
    };

    // التنسيقات (نفس ذوقك الرفيع مع تحسينات طفيفة للهوية)
    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#F4F7F9',
            padding: '3rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, system-ui, sans-serif'
        },
        card: {
            width: '100%',
            maxWidth: '550px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 51, 102, 0.05)',
            padding: '2.5rem',
            border: '1px solid rgba(0, 0, 0, 0.05)'
        },
        header: { color: '#003366', fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' },
        label: { display: 'block', color: '#003366', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' },
        input: (hasError) => ({
            width: '100%',
            padding: '0.75rem 1rem',
            border: `2px solid ${hasError ? '#DC3545' : '#F1F3F5'}`,
            borderRadius: '10px',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            outline: 'none',
            boxSizing: 'border-box'
        }),
        button: {
            width: '100%',
            padding: '1rem',
            backgroundColor: '#8CC63F',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: processing ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            marginTop: '1rem'
        }
    };

    return (
        <div style={styles.container}>
            <Head title="Créer Utilisateur" />
            
            <div style={styles.card}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={styles.header}>Create User</h1>
                    <p style={{ color: '#6C757D' }}>Add a new member to the system</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={styles.label}>Full Name *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            style={styles.input(errors.name)}
                            placeholder="John Doe"
                        />
                        {errors.name && <small style={{ color: '#DC3545' }}>{errors.name}</small>}
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={styles.label}>Email Address *</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            style={styles.input(errors.email)}
                            placeholder="email@seaal.dz"
                        />
                        {errors.email && <small style={{ color: '#DC3545' }}>{errors.email}</small>}
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={styles.label}>Password *</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            style={styles.input(errors.password)}
                        />
                        {errors.password && <small style={{ color: '#DC3545' }}>{errors.password}</small>}
                    </div>

                    {/* Photo */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={styles.label}>Profile Photo</label>
                        <input
                            type="file"
                            onChange={e => setData('profile_photo', e.target.files[0])}
                            style={styles.input(errors.profile_photo)}
                        />
                        {errors.profile_photo && <small style={{ color: '#DC3545' }}>{errors.profile_photo}</small>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing} 
                        style={styles.button}
                        onMouseOver={e => !processing && (e.target.style.backgroundColor = '#7AB82E')}
                        onMouseOut={e => !processing && (e.target.style.backgroundColor = '#8CC63F')}
                    >
                        {processing ? 'Processing...' : 'Create User Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}