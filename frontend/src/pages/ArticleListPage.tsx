import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Detay ve düzenleme sayfasına yönlendirme için
import api from '../api'; // Backend bağlantısı için API

function ArticleListPage() {
    const [articles, setArticles] = useState<{ id: number; title: string; content: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(''); // Arama için query
    const [error, setError] = useState<string | null>(null); // Hata durumunu saklamak için
    const [loading, setLoading] = useState<boolean>(true); // Yüklenme durumu
    const [page, setPage] = useState<number>(1); // Sayfa numarası
    const [totalPages, setTotalPages] = useState<number>(1); // Toplam sayfa sayısı
    const navigate = useNavigate();

    // Makale listesini veya arama sonuçlarını yükle
    const fetchArticles = async (query: string = '', page: number = 1) => {
        try {
            setLoading(true);
            const response = await api.get('/articles/search', {
                params: { q: query, page, per_page: 6 }, // Arama query'sini backend'e gönder
            });
            setArticles(response.data.articles); // Gelen makaleleri state'e kaydet
            setTotalPages(response.data.pages); // Toplam sayfa sayısını kaydet
            setError(null); // Hata yoksa sıfırla
        } catch (err: any) {
            console.error('Makale listesi alınamadı:', err);
            setError('Makale listesi yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // İlk yüklemede makaleleri getir
    useEffect(() => {
        fetchArticles(); // Boş query ile tüm makaleleri getir
    }, []);

    // Makale silme işlemi
    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('Bu makaleyi silmek istediğinize emin misiniz?');
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Token bulunamadı. Lütfen giriş yapın.');
                    return;
                }

                const response = await api.delete(`/articles/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // JWT token
                    },
                });

                if (response.status === 200) {
                    setArticles((prev) => prev.filter((article) => article.id !== id)); // Silinen makaleyi kaldır
                    alert('Makale başarıyla silindi!');
                } else {
                    alert(`Hata: ${response.status} - ${response.statusText}`);
                }
            } catch (err: any) {
                console.error('Makale silinemedi:', err.response?.data || err.message);
                alert(`Makale silinirken bir hata oluştu: ${err.response?.data?.message || err.message}`);
            }
        }
    };


    // Arama işlemi
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchArticles(searchQuery, 1); // Arama query'si ile makaleleri getir
    };

    // Sayfalama işlevleri
    const handleNextPage = () => {
        if (page < totalPages) {
            fetchArticles(searchQuery, page + 1);
            setPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            fetchArticles(searchQuery, page - 1);
            setPage((prev) => prev - 1);
        }
    };

    if (loading) {
        return <p className="text-center">Makale listesi yükleniyor...</p>; // Yüklenme durumu
    }

    if (error) {
        return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
    }

    return (
        <div className="container mt-5">
            <h1 className="page-title">Makale Listesi</h1>
            {/* Arama Barı */}
            <form onSubmit={handleSearch} className="search-bar">
                <input
                    type="text"
                    placeholder="Makale ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">Ara</button>
            </form>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                {articles.map((article) => (
                    <div className="col" key={article.id}>
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{article.title}</h5>
                                <p className="card-text">{article.content.substring(0, 100)}...</p>
                                <Link to={`/articles/${article.id}`} className="btn btn-primary btn-sm me-2">
                                    Devamını Oku
                                </Link>
                                <button
                                    onClick={() => navigate(`/articles/edit/${article.id}`)}
                                    className="btn btn-warning btn-sm me-2"
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => handleDelete(article.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Sil
                                </button>
                                {/* Yeni Kategori Ekleme Butonu */}
                                <Link to={`/articles/${article.id}/add-categories`} className="btn btn-info btn-sm">
                                    Kategori Ekle
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Sayfalama Butonları */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <button
                    className="btn btn-secondary"
                    onClick={handlePrevPage}
                    disabled={page === 1}
                >
                    Önceki
                </button>
                <span>
                    Sayfa {page} / {totalPages}
                </span>
                <button
                    className="btn btn-secondary"
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                >
                    Sonraki
                </button>
            </div>
        </div>
    );
}

export default ArticleListPage;
