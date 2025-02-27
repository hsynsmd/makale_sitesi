import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Backend bağlantısı için API

function RegisterPage() {
    const [username, setUsername] = useState<string>(''); // Kullanıcı adı
    const [email, setEmail] = useState<string>(''); // Email
    const [password, setPassword] = useState<string>(''); // Şifre
    const [error, setError] = useState<string | null>(null); // Hata mesajı
    const [success, setSuccess] = useState<boolean>(false); // Başarı durumu
    const navigate = useNavigate();

    // Form submit işlemi
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Formun varsayılan davranışını engelle
        setError(null); // Hata mesajını sıfırla

        try {
            const response = await api.post('/register', {
                username,
                email,
                password,
            });

            if (response.status === 201) {
                setSuccess(true); // Başarılı kayıt mesajını göster
                setTimeout(() => navigate('/login'), 2000); // 2 saniye sonra giriş sayfasına yönlendir
            }
        } catch (err: any) {
            console.error('Kayıt işlemi başarısız:', err);
            setError('Kayıt işlemi başarısız! Lütfen bilgilerinizi kontrol edin.');
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f8f9fa',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h1
                    style={{
                        textAlign: 'center',
                        color: '#333',
                        marginBottom: '20px',
                    }}
                >
                    Kayıt Ol
                </h1>
                <form
                    onSubmit={handleRegister}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                    }}
                >
                    <input
                        type="text"
                        placeholder="Kullanıcı Adı"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '16px',
                        }}
                    />
                    <input
                        type="email"
                        placeholder="E-posta"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '16px',
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Şifre"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '16px',
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '10px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
                    >
                        Kayıt Ol
                    </button>
                </form>
                {error && (
                    <p
                        style={{
                            color: 'red',
                            marginTop: '10px',
                            textAlign: 'center',
                        }}
                    >
                        {error}
                    </p>
                )}
                {success && (
                    <p
                        style={{
                            color: 'green',
                            marginTop: '10px',
                            textAlign: 'center',
                        }}
                    >
                        Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...
                    </p>
                )}
            </div>
        </div>
    );
}

export default RegisterPage;
