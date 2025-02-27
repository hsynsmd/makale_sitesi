import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function UpdateArticlePage() {
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await api.get(`/articles/${id}`);
                setTitle(response.data.title);
                setContent(response.data.content);
            } catch (err) {
                setError('Makale bilgileri yüklenirken bir hata oluştu!');
                console.error(err);
            }
        };

        fetchArticle();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Lütfen giriş yapın!');
                return;
            }

            await api.put(
                `/articles/${id}`,
                { title, content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess('Makale başarıyla güncellendi!');
            setTimeout(() => navigate('/articles'), 2000);
        } catch (err: any) {
            if (err.response && err.response.status === 403) {
                setError('Bu makaleyi güncelleme yetkiniz yok!');
            } else {
                setError('Makale güncellenirken bir hata oluştu!');
            }
            console.error(err);
        }
    };

    return (
        <div
            className="container"
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f9fbe7',
            }}
        >
            <div
                className="card shadow-lg"
                style={{
                    maxWidth: '600px',
                    width: '100%',
                    padding: '20px',
                    borderRadius: '15px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h1 className="text-center" style={{ color: '#4caf50', marginBottom: '20px' }}>
                    Makale Güncelle
                </h1>
                {error && (
                    <p
                        className="text-center"
                        style={{ color: '#d32f2f', fontWeight: 'bold', marginBottom: '15px' }}
                    >
                        {error}
                    </p>
                )}
                {success && (
                    <p
                        className="text-center"
                        style={{ color: '#388e3c', fontWeight: 'bold', marginBottom: '15px' }}
                    >
                        {success}
                    </p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label
                            htmlFor="title"
                            className="form-label"
                            style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}
                        >
                            Başlık:
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-control"
                            required
                            style={{
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px',
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="content"
                            className="form-label"
                            style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}
                        >
                            İçerik:
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="form-control"
                            required
                            rows={5}
                            style={{
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px',
                            }}
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="btn"
                        style={{
                            backgroundColor: '#4caf50',
                            color: 'white',
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#388e3c')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4caf50')}
                    >
                        Güncelle
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdateArticlePage;
