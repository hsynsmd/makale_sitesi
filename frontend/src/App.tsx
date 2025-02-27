import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Ana sayfa
import ArticleListPage from './pages/ArticleListPage'; // Makale listesi
import ProfilePage from './pages/ProfilePage'; // Profil sayfası
import LoginPage from './pages/LoginPage'; // Giriş sayfası
import RegisterPage from './pages/RegisterPage'; // Yeni eklenen sayfa
import AddArticlePage from './pages/AddArticlePage'; // Makale ekleme sayfası
import ArticleDetailPage from './pages/ArticleDetailPage'; // Yeni sayfayı import et
import UpdateArticlePage from './pages/UpdateArticlePage'; // Güncelleme sayfasını içe aktar
import AddCategoryPage from './pages/AddCategoryPage';
import ArticleListByCategoryPage from './pages/ArticleListByCategoryPage';
import EditArticlePage from './pages/AddCategoryToArticlePage.tsx'; // Makaleye kategori ekleme sayfasını ekledik
import Navbar from './components/Navbar'; // Navbar
import './App.css'; // App.css dosyasını bağla
import './index.css'; // Global stilleri bağla
/*sayfaları uygulamaya burda dahil ediyoruz */

function App() {
    return (
        <Router>
            <Navbar /> {/* Navbar'ı burada çağırıyoruz */}
            <Routes>
                <Route path="/" element={<HomePage />} /> {/* Ana sayfa,Uygulamanın ana sayfasını gösterir. */}
                <Route path="/articles" element={<ArticleListPage />} /> {/* Makale listesi */}
                <Route path="/profile" element={<ProfilePage />} /> {/* Profil */}
                <Route path="/login" element={<LoginPage />} /> {/* Giriş sayfası */}
                <Route path="/register" element={<RegisterPage />} /> {/* Yeni rota */}
                <Route path="/add-article" element={<AddArticlePage />} /> {/* Yeni Makale Ekle route'u */}
                <Route path="/articles/:id" element={<ArticleDetailPage />} /> {/* Yeni route */}
                <Route path="/articles/edit/:id" element={<UpdateArticlePage />} />
                <Route path="/add-category" element={<AddCategoryPage />} />
                <Route path="/articles/category/:categoryId" element={<ArticleListByCategoryPage />} />
                <Route path="/articles/:id/add-categories" element={<EditArticlePage />} /> {/* Makaleye kategori ekleme */}
            </Routes>
        </Router>
    );
}

export default App;
