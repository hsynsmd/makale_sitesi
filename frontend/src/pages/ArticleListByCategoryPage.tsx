import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function ArticleListByCategoryPage() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [articles, setArticles] = useState<
        { id: number; title: string; content: string; author: string }[]
    >([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticlesByCategory = async () => {
            try {
                const categoryResponse = await api.get(`/categories/${categoryId}`);
                setCategoryName(categoryResponse.data.name);

                const response = await api.get(`/categories/${categoryId}/articles`);
                setArticles(response.data.articles || []);
            } catch (err) {
                console.error('Makaleler alınamadı:', err);
                setError('Makaleler alınırken bir hata oluştu.');
            }
        };

        fetchArticlesByCategory();
    }, [categoryId]);

    if (error) {
        return (
            <div className="text-center mt-5">
                <p className="text-danger" style={{ fontSize: '1.2rem' }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h1
                className="text-center"
                style={{ color: '#007bff', fontWeight: 'bold', marginBottom: '30px' }}
            >
                {categoryName} Kategorisindeki Makaleler
            </h1>
            {articles.length > 0 ? (
                <ul className="list-group">
                    {articles.map((article) => (
                        <li
                            key={article.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                            style={{
                                marginBottom: '10px',
                                borderRadius: '10px',
                                padding: '15px',
                                backgroundColor: '#f8f9fa',
                            }}
                        >
                            <div>
                                <h5>{article.title}</h5>
                                <p
                                    style={{
                                        fontSize: '0.9rem',
                                        color: '#6c757d',
                                    }}
                                >
                                    Yazar: {article.author}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate(`/articles/${article.id}`)}
                                className="btn btn-primary"
                                style={{ borderRadius: '5px' }}
                            >
                                Detay
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-muted">Bu kategoride henüz makale yok.</p>
            )}
        </div>
    );
}

export default ArticleListByCategoryPage;
