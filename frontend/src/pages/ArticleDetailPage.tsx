import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import CommentsSection from './CommentsSection'; // Yorum bileşenini import et

function ArticleDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<{
        id: number;
        title: string;
        content: string;
        author: string;
        categories: { id: number; name: string }[];
        photo_url?: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await api.get(`/articles/${id}`);
                setArticle(response.data);
            } catch (err) {
                console.error('Makale alınamadı:', err);
                setError('Makale alınırken bir hata oluştu.');
            }
        };

        fetchArticle();
    }, [id]);

    if (error) {
        return (
            <div className="text-center mt-5">
                <p className="text-danger" style={{ fontSize: '1.2rem' }}>{error}</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="text-center mt-5">
                <p className="text-primary" style={{ fontSize: '1.5rem' }}>
                    Makale yükleniyor...
                </p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div
                className="card mx-auto shadow-lg"
                style={{
                    maxWidth: '700px',
                    borderRadius: '15px',
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                }}
            >
                {article.photo_url && (
                    <img
                        src={article.photo_url}
                        alt={article.title}
                        className="card-img-top mb-3"
                        style={{
                            maxHeight: '350px',
                            objectFit: 'cover',
                            borderRadius: '15px',
                        }}
                    />
                )}
                <div className="card-body">
                    <h1
                        className="text-center"
                        style={{
                            color: '#2a9d8f',
                            fontWeight: 'bold',
                            fontSize: '2rem',
                            marginBottom: '15px',
                        }}
                    >
                        {article.title}
                    </h1>
                    <p
                        className="text-center"
                        style={{
                            color: '#264653',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        }}
                    >
                        Yazar: {article.author}
                    </p>
                    <hr />
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#495057' }}>
                        {article.content}
                    </p>
                    <div className="mt-4">
                        <h5 className="text-primary" style={{ marginBottom: '10px' }}>Kategoriler:</h5>
                        {article.categories.length > 0 ? (
                            <ul className="list-group list-group-horizontal justify-content-center">
                                {article.categories.map((category) => (
                                    <li
                                        key={category.id}
                                        className="list-group-item text-white"
                                        style={{
                                            backgroundColor: '#e76f51',
                                            margin: '5px',
                                            borderRadius: '20px',
                                            padding: '10px 20px',
                                        }}
                                    >
                                        {category.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">Bu makaleye ait kategori yok.</p>
                        )}
                    </div>
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => navigate('/articles')}
                            className="btn"
                            style={{
                                backgroundColor: '#6c757d',
                                color: '#ffffff',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                marginRight: '10px',
                            }}
                        >
                            Makale Listesine Dön
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="btn"
                            style={{
                                backgroundColor: '#2a9d8f',
                                color: '#ffffff',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                            }}
                        >
                            Ana Sayfaya Dön
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <CommentsSection articleId={article.id} alignment="left" />
            </div>
        </div>
    );
}

export default ArticleDetailPage;
