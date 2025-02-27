import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function LoginPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/login', { email, password });
            const token = response.data.token;

            // Token'ı localStorage'a kaydet
            localStorage.setItem('token', token);

            // localStorage değişikliklerini tetiklemek için özel bir key yaz
            window.dispatchEvent(new Event('storage'));

            alert('Giriş başarılı!');
            navigate('/');
        } catch (err: any) {
            console.error('Giriş hatası:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Giriş başarısız! Lütfen bilgilerinizi kontrol edin.');
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: '100vh',
                backgroundColor: '#f8f9fa',
                padding: '20px',
            }}
        >
            <div
                className="card shadow-lg"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '30px',
                    borderRadius: '15px',
                    backgroundColor: 'white',
                }}
            >
                <h2 className="text-center text-primary mb-4">Giriş Yap</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            required
                            placeholder="E-postanızı girin"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Şifre:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            required
                            placeholder="Şifrenizi girin"
                        />
                    </div>
                    {error && (
                        <p className="text-danger text-center mb-3">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        style={{
                            backgroundColor: '#0d6efd',
                            border: 'none',
                            borderRadius: '5px',
                        }}
                    >
                        Giriş Yap
                    </button>
                </form>
                <p className="text-center mt-3">
                    Henüz bir hesabınız yok mu?{' '}
                    <a href="/register" className="text-primary">
                        Kayıt Ol
                    </a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
