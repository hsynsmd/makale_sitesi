import axios from 'axios';//axios: HTTP isteklerini kolayca gerçekleştirmek için kullanılan bir kütüphane.
    //Bu kod, backend API'ye istek yapmak için axios'u kullanır.

// Flask backend URL
const api = axios.create({
    baseURL: 'http://127.0.0.1:5000',
});

// Kategori silme
export const deleteCategory = async (id: number) => {
    const token = localStorage.getItem('token'); // Kullanıcı token'ını al
    if (!token) throw new Error('Yetkilendirme hatası'); // Token yoksa hata döndür

    return api.delete(`/categories/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`, // Token ile doğrulama
        },
    });
};

// Yorum ekleme
export const addComment = async (articleId: number, content: string) => {
    const token = localStorage.getItem('token'); // Kullanıcı token'ını al
    if (!token) throw new Error('Yetkilendirme hatası'); // Token yoksa hata döndür

    return api.post(
        `/articles/${articleId}/comments`,
        { content }, // Yorum içeriği
        {
            headers: {
                Authorization: `Bearer ${token}`, // Token ile doğrulama
                'Content-Type': 'application/json',
            },
        }
    );
};

// Yorumları listeleme
export const getComments = async (articleId: number) => {
    return api.get(`/articles/${articleId}/comments`);
};

// Yorum silme
export const deleteComment = async (commentId: number) => {
    const token = localStorage.getItem('token'); // Kullanıcı token'ını al
    if (!token) throw new Error('Yetkilendirme hatası'); // Token yoksa hata döndür

    return api.delete(`/comments/${commentId}`, {
        headers: {
            Authorization: `Bearer ${token}`, // Token ile doğrulama
        },
    });
};

export default api;
