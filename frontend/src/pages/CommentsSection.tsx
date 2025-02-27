import React, { useState, useEffect } from 'react';
import { addComment, deleteComment, getComments } from '../api';

type Comment = {
    id: number;
    content: string;
    user: string;
};

type CommentsSectionProps = {
    articleId: number;
    alignment?: 'left' | 'right' | 'center'; // Sadece geçerli değerler
};

const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId, alignment = 'left' }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await getComments(articleId);
                setComments(response.data.comments || []);
                setError(null);
            } catch (err: any) {
                console.error('Yorumlar alınamadı:', err);
                setError('Yorumlar alınırken bir hata oluştu.');
            }
        };

        fetchComments();
    }, [articleId]);

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess(null);
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) {
            setError('Yorum boş olamaz.');
            return;
        }

        try {
            const response = await addComment(articleId, newComment);
            setComments((prev) => [...prev, response.data.comment]);
            setNewComment('');
            setSuccess('Yorum başarıyla eklendi!');
        } catch (err: any) {
            console.error('Yorum ekleme hatası:', err);
            setError('Yorum eklenirken bir hata oluştu.');
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        const confirmDelete = window.confirm('Bu yorumu silmek istediğinize emin misiniz?');
        if (!confirmDelete) return;

        try {
            await deleteComment(commentId);
            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
            setSuccess('Yorum başarıyla silindi!');
        } catch (err: any) {
            console.error('Yorum silme hatası:', err);
            setError('Yorum silinirken bir hata oluştu.');
        }
    };

    return (
        <div className="comments-section" style={{ textAlign: alignment }}>
            <h2>Yorumlar</h2>
            {comments.length > 0 ? (
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id} style={{ marginBottom: '10px' }}>
                            <strong>{comment.user}:</strong> {comment.content}
                            <button
                                onClick={() => handleDeleteComment(comment.id)}
                                style={{
                                    marginLeft: '10px',
                                    color: 'red',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                Sil
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Bu makale için henüz yorum yapılmamış.</p>
            )}

            <form onSubmit={handleAddComment} style={{ marginTop: '20px' }}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Yorum yaz..."
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        marginBottom: '10px',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        borderRadius: '5px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Yorum Ekle
                </button>
            </form>

            {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
};

export default CommentsSection;
