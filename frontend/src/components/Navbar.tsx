import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Kullanıcının giriş durumu
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        checkLoginStatus(); // İlk kontrol
        window.addEventListener('storage', checkLoginStatus); // localStorage değişimlerini dinle

        return () => {
            window.removeEventListener('storage', checkLoginStatus); // Temizlik
        };
    }, []);

    const handleLogout = () => {
        const confirmLogout = window.confirm('Çıkış yapmak istediğinize emin misiniz?');
        if (confirmLogout) {
            localStorage.removeItem('token'); // Token'ı kaldır
            setIsLoggedIn(false); // Durumu güncelle
            navigate('/login'); // Giriş sayfasına yönlendir
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container-fluid">
                <Link
                    className="navbar-brand fw-bold text-primary"
                    style={{ fontSize: '1.5rem', textDecoration: 'none' }}
                    to="/"
                >
                    Ana Sayfa
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link text-dark fw-semibold" to="/articles">
                                Makale Listesi
                            </Link>
                        </li>
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark fw-semibold" to="/add-article">
                                        Makale Ekle
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark fw-semibold" to="/add-category">
                                        Kategori Yönetimi
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark fw-semibold" to="/profile">
                                        Profil
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-link nav-link text-danger fw-semibold"
                                        style={{
                                            padding: 0,
                                            lineHeight: '1.5',
                                        }}
                                    >
                                        Çıkış Yap
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark fw-semibold" to="/login">
                                        Giriş Yap
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-dark fw-semibold" to="/register">
                                        Kayıt Ol
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
