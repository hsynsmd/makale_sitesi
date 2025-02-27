import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Backend bağlantısı için API

function AddArticlePage() {
    const [title, setTitle] = useState<string>(''); // Makale başlığı için state
    const [content, setContent] = useState<string>(''); // Makale içeriği için state
    const [error, setError] = useState<string | null>(null); // Hata mesajını saklamak için state
    const [success, setSuccess] = useState<string | null>(null); // Başarı mesajını saklamak için state
    const navigate = useNavigate(); // Başka bir sayfaya yönlendirme için

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Sayfa yenilemeyi engelle
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token'); // Token'ı localStorage'dan al
            if (!token) {
                setError('Lütfen giriş yapın!');
                return;
            }

            await api.post(
                '/articles',
                { title, content }, // Backend'e gönderilecek veriler
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // JWT token'ı header'a ekle
                    },
                }
            );

            setSuccess('Makale başarıyla eklendi!');
            setTitle(''); // Formu temizle
            setContent('');
            setTimeout(() => navigate('/articles'), 2000); // 2 saniye sonra Makale Listesi sayfasına yönlendir
        } catch (err: any) {
            if (err.response && err.response.status === 400) {
                setError('Başlık ve içerik zorunludur!');
            } else if (err.response && err.response.status === 401) {
                setError('Oturumunuz sona erdi, lütfen tekrar giriş yapın.');
            } else {
                setError('Makale eklenirken bir hata oluştu.');
            }
        }
    };

    return (
        <div className="container mt-5">
            <div
                className="card shadow p-4 mx-auto"
                style={{
                    maxWidth: '600px',
                    borderRadius: '15px',
                    border: '1px solid #dee2e6',
                }}
            >
                <h1 className="text-center mb-4" style={{ color: '#343a40' }}>Yeni Makale Ekle</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold" style={{ color: '#495057' }}>
                            Başlık:
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-control"
                            placeholder="Makale başlığını girin"
                            required
                            style={{ borderColor: '#ced4da' }}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold" style={{ color: '#495057' }}>
                            İçerik:
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="form-control"
                            placeholder="Makale içeriğini girin"
                            rows={5}
                            required
                            style={{ borderColor: '#ced4da' }}
                        ></textarea>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <button
                        type="submit"
                        className="btn w-100"
                        style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                        }}
                    >
                        Makale Ekle
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddArticlePage;
