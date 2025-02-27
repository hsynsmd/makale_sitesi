from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash


db = SQLAlchemy()
# .\venv\Scripts\activate çalıştırmak için gerekli, sakın silme

# Kullanıcı Tablosu
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    articles = db.relationship('Article', back_populates='author', lazy='dynamic')  # Kullanıcı ile makale ilişkisi
    comments = db.relationship('Comment', back_populates='user', lazy='dynamic')  # Kullanıcının yaptığı yorumlar

    def set_password(self, password):
        self.password = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f'<User {self.username}>'


# Makale Tablosu
class Article(db.Model):
    __tablename__ = 'articles'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Bir makale bir kullanıcıya ait
    author = db.relationship('User', back_populates='articles')  # Kullanıcı ile makale ilişkisi
    comments = db.relationship('Comment', back_populates='article', lazy='dynamic')  # Bir makaleye birden çok yorum yapılabilir
    categories = db.relationship('Category', secondary='article_categories', back_populates='articles')  # Many-to-Many İlişkisi



    def __repr__(self):
        return f'<Article {self.title}>'


# Yorum Tablosu
class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Yorumu yapan kullanıcı
    article_id = db.Column(db.Integer, db.ForeignKey('articles.id'), nullable=False)  # Yorum yapılan makale
    user = db.relationship('User', back_populates='comments')  # Kullanıcı ile ilişki
    article = db.relationship('Article', back_populates='comments')  # Makale ile ilişki

    def __repr__(self):
        return f'<Comment {self.content[:20]}>'  # İlk 20 karakteri göster


# Kategori Tablosu
class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    articles = db.relationship('Article', secondary='article_categories', back_populates='categories')  # Many-to-Many ilişki

    def __repr__(self):
        return f'<Category {self.name}>'


# Many-to-Many İlişki Tablosu (Makale ve Kategori Arasında)
article_categories = db.Table(
    'article_categories',
    db.Column('article_id', db.Integer, db.ForeignKey('articles.id'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id'), primary_key=True)
)
