import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function HomePage() {
    const [message, setMessage] = useState<string>(''); // Backend'den gelen mesajı saklayacak state
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Kullanıcı giriş durumu
    const navigate = useNavigate(); // Sayfa yönlendirme için hook

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Token varsa giriş yapıldığını belirt

        // Backend'den mesaj al
        api.get('/')
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                console.error('Backend bağlantısı başarısız:', error);
                setMessage('Backend bağlantısında sorun oluştu!');
            });
    }, []);

    return (
        <div className="home-container">
            <h1 className="home-title">Hoş Geldiniz!</h1>
            <p className="home-subtitle">
                {message || 'Blog sitenize hoş geldiniz!'}
            </p>
            {!isLoggedIn ? (
                <button
                    onClick={() => navigate('/login')}
                    className="home-login-button"
                >
                    Giriş Yap
                </button>
            ) : (
                <div className="home-buttons">
                    <button
                        onClick={() => navigate('/articles')}
                        className="btn-blue"
                    >
                        Makale Listesi
                    </button>
                    <button
                        onClick={() => navigate('/add-article')}
                        className="btn-green"
                    >
                        Makale Ekle
                    </button>
                    <button
                        onClick={() => navigate('/add-category')}
                        className="btn-yellow"
                    >
                        Kategori Yönetimi
                    </button>
                </div>
            )}
        </div>
    );
}

export default HomePage;
