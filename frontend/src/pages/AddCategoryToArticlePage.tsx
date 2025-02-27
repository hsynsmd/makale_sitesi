import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function AddCategoryToArticlePage() {
    const { id } = useParams<{ id: string }>();
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Lütfen giriş yapın!');
                    setLoading(false);
                    return;
                }

                const response = await api.get('/categories', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setCategories(Array.isArray(response.data.categories) ? response.data.categories : []);
                setError(null);
            } catch (err: any) {
                console.error('Kategoriler alınamadı:', err);
                setError('Kategoriler alınırken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const categoryId = parseInt(e.target.value, 10);
        setSelectedCategories((prev) =>
            e.target.checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Lütfen giriş yapın!');
                return;
            }

            const response = await api.post(
                `/articles/${id}/categories`,
                { categories: selectedCategories },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                setSuccess('Kategoriler başarıyla makaleye eklendi!');
                setSelectedCategories([]);
            } else {
                setError('Kategoriler eklenirken bir hata oluştu.');
            }
        } catch (err: any) {
            console.error('Kategori ekleme hatası:', err);
            setError(err.response?.data?.message || 'Kategoriler eklenirken bir hata oluştu.');
        }
    };

    return (
        <div
            className="container"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f0f4f8',
                padding: '20px',
            }}
        >
            <div
                className="card shadow-lg"
                style={{
                    width: '100%',
                    maxWidth: '700px',
                    padding: '20px',
                    borderRadius: '15px',
                    backgroundColor: '#fff3e0',
                }}
            >
                <h1 className="text-center" style={{ color: '#ff6f61', marginBottom: '20px' }}>
                    Makaleye Kategori Ekle
                </h1>
                {loading ? (
                    <p className="text-center text-secondary">Kategoriler yükleniyor...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <div
                                className="d-flex flex-wrap"
                                style={{
                                    gap: '15px',
                                    justifyContent: 'center',
                                }}
                            >
                                {categories.length > 0 ? (
                                    categories.map((category, index) => (
                                        <div
                                            key={category.id}
                                            className="card"
                                            style={{
                                                width: '150px',
                                                padding: '10px',
                                                borderRadius: '10px',
                                                textAlign: 'center',
                                                backgroundColor: selectedCategories.includes(category.id)
                                                    ? '#c8e6c9'
                                                    : index % 2 === 0
                                                        ? '#ffe0b2'
                                                        : '#ffccbc',
                                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                value={category.id}
                                                checked={selectedCategories.includes(category.id)}
                                                onChange={handleCategoryChange}
                                                id={`category-${category.id}`}
                                                style={{ marginBottom: '5px' }}
                                            />
                                            <label
                                                htmlFor={`category-${category.id}`}
                                                className="form-check-label"
                                                style={{
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    color: '#333',
                                                }}
                                            >
                                                {category.name}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted">Kategori bulunamadı. Lütfen kategori ekleyin.</p>
                                )}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn"
                            style={{
                                backgroundColor: '#ff6f61',
                                color: 'white',
                                padding: '10px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                width: '100%',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#d84315')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ff6f61')}
                        >
                            Kategorileri Ekle
                        </button>
                    </form>
                )}
                {success && (
                    <p className="text-center mt-3" style={{ color: '#388e3c', fontWeight: 'bold' }}>
                        {success}
                    </p>
                )}
                {error && (
                    <p className="text-center mt-3" style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}

export default AddCategoryToArticlePage;
