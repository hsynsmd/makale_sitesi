import
{ useEffect, useState } from 'react';
import api from '../api';

// Kategori türü
type Category = {
    id: number;
    name: string;
};

function AddCategoryPage() {
    const [name, setName] = useState<string>(''); // Kategori adı
    const [categories, setCategories] = useState<Category[]>([]); // Kategori listesi
    const [success, setSuccess] = useState<string | null>(null); // Başarı mesajı
    const [error, setError] = useState<string | null>(null); // Hata mesajı
    const [loading, setLoading] = useState<boolean>(true); // Yükleme durumu

    // Kategorileri getirme
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get<{ categories: Category[] }>('/categories');
                setCategories(response.data.categories || []);
                setError(null);
            } catch (err) {
                console.error('Kategoriler alınamadı:', err);
                setError('Kategoriler alınırken bir hata oluştu!');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Kategori ekleme
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post<Category>('/categories', { name });
            if (response.status === 201) {
                setSuccess('Kategori başarıyla eklendi!');
                setName(''); // Formu temizle
                setCategories((prev) => [...prev, response.data]); // Yeni kategori ekle
                setError(null);
            }
        } catch (err) {
            console.error('Kategori ekleme hatası:', err);
            setError('Bir hata oluştu!');
        }
    };

    // Kategori silme
    const handleDelete = async (id: number) => {
        try {
            const response = await api.delete(`/categories/${id}`);
            if (response.status === 200) {
                setCategories((prev) => prev.filter((category) => category.id !== id));
                setSuccess('Kategori başarıyla silindi!');
            }
        } catch (err) {
            console.error('Kategori silme hatası:', err);
            setError('Kategori silinirken bir hata oluştu!');
        }
    };

    return (
        <div className="container mt-5">
            <div
                className="card mx-auto p-4 shadow-sm"
                style={{
                    maxWidth: '600px',
                    borderRadius: '15px',
                    backgroundColor: '#fefae0',
                    border: '1px solid #ddd',
                }}
            >
                <h1 className="text-center mb-4" style={{ color: '#2a9d8f' }}>
                    Kategori Yönetimi
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label
                            htmlFor="name"
                            className="form-label fw-bold"
                            style={{ color: '#6c757d' }}
                        >
                            Kategori Adı
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                            placeholder="Kategori adı girin"
                            style={{
                                borderRadius: '10px',
                                padding: '10px',
                                border: '1px solid #ced4da',
                                backgroundColor: '#fffdf0',
                            }}
                            required
                        />
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="btn"
                            style={{
                                backgroundColor: '#f4a261',
                                borderColor: '#f4a261',
                                color: '#fff',
                                borderRadius: '8px',
                                padding: '10px 20px',
                                fontSize: '1rem',
                            }}
                        >
                            Kategori Ekle
                        </button>
                    </div>
                </form>
                <hr />
                <h2 className="text-center mt-4" style={{ color: '#6c757d' }}>
                    Kategoriler
                </h2>
                {loading ? (
                    <p className="text-center text-muted">Kategoriler yükleniyor...</p>
                ) : (
                    <ul className="list-group mt-3">
                        {categories.map((category) => (
                            <li
                                key={category.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                                style={{
                                    borderRadius: '10px',
                                    marginBottom: '10px',
                                    backgroundColor: '#f0f8ff',
                                }}
                            >
                                {category.name}
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="btn btn-danger btn-sm"
                                    style={{
                                        borderRadius: '5px',
                                        padding: '5px 10px',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    Sil
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                {success && (
                    <p className="text-center mt-3 fw-bold" style={{ color: '#2a9d8f' }}>
                        {success}
                    </p>
                )}
                {error && (
                    <p className="text-center mt-3 fw-bold" style={{ color: '#e63946' }}>
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}

export default AddCategoryPage;
