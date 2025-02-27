import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function ProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Token bulunamadı. Lütfen giriş yapın.');
                    setLoading(false);
                    navigate('/login');
                    return;
                }

                const response = await api.get('/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProfile(response.data);
            } catch (err: any) {
                if (err.response && err.response.status === 401) {
                    setError('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError('Profil bilgileri yüklenirken bir hata oluştu.');
                }
                console.error('Profil yüklenirken hata:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        const confirmLogout = window.confirm('Çıkış yapmak istediğinize emin misiniz?');
        if (confirmLogout) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div className="spinner"></div>
                <p>Profil bilgileri yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
    }

    if (!profile) {
        return <p>Profil bilgileri alınamadı!</p>;
    }

    return (
        <div className="container mt-5">
            <div
                className="card mx-auto shadow-lg"
                style={{
                    maxWidth: '500px',
                    padding: '20px',
                    borderRadius: '15px',
                    backgroundColor: '#f8f9fa',
                }}
            >
                <h1 className="text-center text-primary mb-3">Profil</h1>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <p>
                        <strong>Kullanıcı Adı:</strong> {profile.username}
                    </p>
                    <p>
                        <strong>E-posta:</strong> {profile.email}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn btn-danger d-block mx-auto"
                    style={{
                        padding: '10px 20px',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                    }}
                >
                    Çıkış Yap
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;
