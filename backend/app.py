from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Article, Category, Comment
from sqlalchemy.exc import SQLAlchemyError
#Flask ve Ek Kütüphaneler:
#Flask: Uygulamanın temel framework'ü.
#Flask-SQLAlchemy: Veritabanı işlemleri için kullanılıyor.
#Flask-RESTful: API yapılandırması için.
#Flask-JWT-Extended: Kimlik doğrulama ve JWT işlemleri.
#Flask-CORS: API'ye farklı domain'lerden gelen istekleri kabul edebilmek için.
#Authentication, kimlik doğrulamadır. Authorization ise sisteme giriş için yetki kontrolüdür.""""


app = Flask(__name__)  # Flask uygulamasını başlat
CORS(app)  # CORS'u etkinleştir

# Veritabanı yapılandırması
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Güvenli bir anahtar belirleyin

# Veritabanını Flask uygulamasına bağlama
db.init_app(app)


# REST API entegrasyonu
api = Api(app)

# JWT yapılandırması
jwt = JWTManager(app)

# Veritabanı tablolarını oluşturma
@app.before_request
def create_tables():
    db.create_all()

# Ana rota
@app.route('/')
def home():
    return {'message': 'İşlemlerinizi yapabilirsiniz :)'}

# Kullanıcı Kayıt Endpoint'i
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()# Gelen JSON verisini al

    # Eksik bilgi kontrolü
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Eksik bilgi gönderildi!'}), 400

    # Kullanıcı adı veya e-posta zaten kayıtlı mı?
    if User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Kullanıcı adı veya e-posta zaten kullanılıyor!'}), 400

    # Yeni kullanıcı oluştur
    new_user = User(username=data['username'], email=data['email'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()#Oturumda yapılan tüm değişiklikler kalıcı olarak veritabanına kaydedilir.


    return jsonify({'message': 'Kullanıcı başarıyla kaydedildi!'}), 201

# Kullanıcı Giriş Endpoint'i
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Eksik bilgi kontrolü
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Eksik bilgi gönderildi!'}), 400

    user = User.query.filter_by(email=data['email']).first()

    # Kullanıcı bulunamadıysa veya şifre yanlışsa hata dön
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Geçersiz e-posta veya şifre!'}), 401

    # JWT token oluştur ve döndür
    access_token = create_access_token(identity=str(user.id))  # ID'yi string'e dönüştürüyoruz
    return jsonify({'token': access_token}), 200

# Kullanıcı Profilini Görüntüleme (JWT korumalı)
@app.route('/profile', methods=['GET'])
@jwt_required()#Bu dekoratör, bu endpoint'e erişebilmek için bir JWT token gerektiğini belirtir.
def profile():
    current_user_id = int(get_jwt_identity())  # Token'dan kullanıcı ID'sini al ve integer'a çevir
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({'message': 'Kullanıcı bulunamadı!'}), 404
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    }), 200

# Makale Ekleme Endpoint'i (JWT korumalı)
@app.route('/articles', methods=['POST'])
@jwt_required()
def add_article():
    data = request.get_json()  # İstekten gelen JSON verisini al
    current_user = get_jwt_identity()  # JWT token'dan kullanıcı bilgilerini al

    # Kullanıcıyı veritabanından al
    user = db.session.get(User, current_user)  # Eğer current_user sadece bir id ise

    if not user:
        return jsonify({'message': 'Kullanıcı bulunamadı!'}), 404

    # Eksik bilgi kontrolü
    if not data or not data.get('title') or not data.get('content'):
        return jsonify({'message': 'Eksik bilgi gönderildi!'}), 400

    # Yeni makale oluştur
    new_article = Article(
        title=data.get('title'),  # Makale başlığı
        content=data.get('content'),  # Makale içeriği
        user_id=user.id  # Kullanıcı ID'si
    )
    db.session.add(new_article)  # Yeni makaleyi veritabanına ekliyoruz
    db.session.commit()  # Veritabanı değişikliklerini kaydediyoruz

    return jsonify({'message': 'Makale başarıyla oluşturuldu!'}), 201

# Tüm Makaleleri Listeleme ve Sayfalama
@app.route('/articles', methods=['GET'])
def list_articles():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 6, type=int)

    articles = Article.query.paginate(page=page, per_page=per_page, error_out=False)
    result = []
    for article in articles.items:
        result.append({
            'id': article.id,
            'title': article.title,
            'content': article.content,
            'author': article.author.username  # "user" yerine "author" kullanıldı
        })

    return jsonify({
        'articles': result,
        'total': articles.total,
        'page': articles.page,
        'pages': articles.pages
    }), 200

#GET http://127.0.0.1:5000/articles?page=1&per_page=5 sayfalama için kullanıyoruz




# Belirli Makale Detayı
@app.route('/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    article = Article.query.get(article_id)
    if not article:
        return jsonify({'message': 'Makale bulunamadı!'}), 404

    result = {
        'id': article.id,
        'title': article.title,
        'content': article.content,
        'author': article.author.username,  # Makale yazarı
        'categories': [{'id': c.id, 'name': c.name} for c in article.categories]  # Kategoriler

    }
    return jsonify(result), 200


# Makale Güncelleme Endpoint'i
@app.route('/articles/<int:article_id>', methods=['PUT'])
@jwt_required()
def update_article(article_id):
    data = request.get_json()
    article = Article.query.get(article_id)

    if not article:
        return jsonify({'message': 'Makale bulunamadı!'}), 404

    if 'title' in data:
        article.title = data['title']
    if 'content' in data:
        article.content = data['content']

    db.session.commit()
    return jsonify({'message': 'Makale başarıyla güncellendi!'}), 200



# Makale Silme Endpoint'i (JWT korumalı)
@app.route('/articles/<int:article_id>', methods=['DELETE'])
@jwt_required()
def delete_article(article_id):
    current_user = get_jwt_identity()  # JWT token'dan kullanıcı bilgilerini al

    # Kullanıcıyı veritabanından al
    user = db.session.get(User, current_user)
    if not user:
        return jsonify({'message': 'Kullanıcı bulunamadı!'}), 404

    # Silinmek istenen makaleyi sorgula (performans optimizasyonu)
    article = db.session.query(Article).filter_by(id=article_id).first()#Makale sorgulanır.
    if not article:
        return jsonify({'message': 'Makale bulunamadı!'}), 404

    # Makalenin sahibinin kontrolünü yap
    if article.user_id != user.id and not getattr(user, 'is_admin', False):
        return jsonify({'message': 'Bu makaleyi silme yetkiniz yok!'}), 403

    try:
        # Makaleyi sil
        db.session.delete(article)
        db.session.commit()
        return jsonify({'message': 'Makale başarıyla silindi!', 'deleted_article_id': article.id}), 200
    except SQLAlchemyError as e:
        db.session.rollback()  # Bir hata olursa işlemi geri al
        return jsonify({'message': 'Makale silinirken bir hata oluştu.', 'error': str(e)}), 500


# Backend'de Arama Endpoint'i Oluşturma
@app.route('/articles/search', methods=['GET'])
def search_articles():
    query = request.args.get('q', '', type=str)  # Arama yapılacak kelimeyi al
    page = request.args.get('page', 1, type=int)  # Sayfa numarasını al
    per_page = request.args.get('per_page', 5, type=int)  # Sayfa başına makale sayısını al

    # Başlık veya içerik içinde arama yap
    articles = Article.query.filter(
        Article.title.contains(query) | Article.content.contains(query)
    ).paginate(page=page, per_page=per_page, error_out=False)

    # Sonuçları JSON formatına dönüştür
    result = []
    for article in articles.items:
        result.append({
            'id': article.id,
            'title': article.title,
            'content': article.content,
            'author': article.author.username  # `author` ilişkisinden kullanıcı adı alınır
        })

    return jsonify({
        'articles': result,
        'total': articles.total,
        'page': articles.page,
        'pages': articles.pages
    }), 200

#GET http://127.0.0.1:5000/articles/search?q=kelime&page=1&per_page=5



#Endpoint ile Kategori Ekleme
@app.route('/categories', methods=['POST'])
def add_category():
    data = request.get_json()

    if not data or not data.get('name'):
        return jsonify({'message': 'Kategori adı gerekli!'}), 400

    # Aynı isimde bir kategori zaten var mı?
    if Category.query.filter_by(name=data['name']).first():
        return jsonify({'message': 'Bu isimde bir kategori zaten var!'}), 400

    new_category = Category(name=data['name'])
    db.session.add(new_category)
    db.session.commit()

    return jsonify({'message': 'Kategori başarıyla eklendi!'}), 201


#Kategorileri listeleme
@app.route('/categories', methods=['GET'])
def list_categories():
    categories = Category.query.all()
    result = [{'id': category.id, 'name': category.name} for category in categories]
    return jsonify({'categories': result}), 200




#Makaleye Kategori Ekleme Endpoint'i
@app.route('/articles/<int:article_id>/categories', methods=['POST'])
@jwt_required()
def add_category_to_article(article_id):
    try:
        data = request.get_json()
        category_ids = data.get('categories', None)

        # Gelen veriyi kontrol et
        if not category_ids or not isinstance(category_ids, list):
            return jsonify({'message': 'Kategoriler listesi geçerli değil!'}), 400

        # Makale kontrolü
        article = Article.query.get(article_id)
        if not article:
            return jsonify({'message': 'Makale bulunamadı!'}), 404

        # Kategorileri ilişkilendir
        for category_id in category_ids:
            category = Category.query.get(category_id)
            if not category:
                return jsonify({'message': f'Kategori ID {category_id} bulunamadı!'}), 404
            if category not in article.categories:  # Aynı kategori tekrar eklenmesin
                article.categories.append(category)

        db.session.commit()
        return jsonify({'message': 'Kategoriler başarıyla makaleye eklendi!'}), 200
    except Exception as e:
        return jsonify({'message': f'Bir hata oluştu: {str(e)}'}), 500




# Kategori silme endpointi
@app.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    try:
        # Kategoriyi veritabanından bul
        category = Category.query.get(category_id)
        if not category:
            return jsonify({'message': 'Kategori bulunamadı!'}), 404

        # Kategoriyi sil
        db.session.delete(category)
        db.session.commit()

        return jsonify({'message': 'Kategori başarıyla silindi!'}), 200
    except Exception as e:
        return jsonify({'message': f'Hata: {str(e)}'}), 500

@app.route('/articles/<int:article_id>/categories', methods=['GET'])
def get_categories_for_article(article_id):
    # Makale kontrolü
    article = Article.query.get(article_id)
    if not article:
        return jsonify({'message': 'Makale bulunamadı!'}), 404

    # Makaleye atanmış kategorileri al
    categories = article.categories
    result = [{'id': category.id, 'name': category.name} for category in categories]

    return jsonify({'categories': result}), 200





#Makaleleri Belirli Bir Kategoriye Göre Filtreleme
@app.route('/articles/category/<int:category_id>', methods=['GET'])
def get_articles_by_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({'message': 'Kategori bulunamadı!'}), 404

    articles = category.articles
    result = []
    for article in articles:
        result.append({
            'id': article.id,
            'title': article.title,
            'content': article.content,
            'author': article.author.username
        })

    return jsonify({'articles': result}), 200
#GET http://127.0.0.1:5000/articles/category/1



#Kullanıcının Yazdığı Makaleleri Listeleme
@app.route('/user/<int:user_id>/articles', methods=['GET'])
def get_user_articles(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'Kullanıcı bulunamadı!'}), 404

    articles = user.articles
    result = []
    for article in articles:
        result.append({
            'id': article.id,
            'title': article.title,
            'content': article.content,
        })

    return jsonify({'articles': result}), 200


# Makaleye Yorum Ekleme
@app.route('/articles/<int:article_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(article_id):
    print(f"Request received for article_id: {article_id}")  # Gelen isteği kontrol et
    data = request.get_json()
    print(f"Request Data: {data}")  # İstek verisini logla

    current_user_id = int(get_jwt_identity())
    print(f"Current User ID: {current_user_id}")  # JWT'den alınan kullanıcı ID'si

    user = User.query.get(current_user_id)
    if not user:
        print("User not found.")  # Kullanıcı bulunamazsa logla
        return jsonify({'message': 'Kullanıcı bulunamadı!'}), 404

    article = Article.query.get(article_id)
    if not article:
        print("Article not found.")  # Makale bulunamazsa logla
        return jsonify({'message': 'Makale bulunamadı!'}), 404

    if not data or not data.get('content'):
        print("Comment content missing.")  # Yorum içeriği eksikse logla
        return jsonify({'message': 'Yorum içeriği eksik!'}), 400

    new_comment = Comment(content=data.get('content'), user_id=user.id, article_id=article.id)
    db.session.add(new_comment)
    db.session.commit()
    print(f"Comment added successfully: {new_comment.id}")  # Yorum başarıyla eklenirse logla

    return jsonify({
        'message': 'Yorum başarıyla eklendi!',
        'comment': {
            'id': new_comment.id,
            'content': new_comment.content,
            'user_id': new_comment.user_id,
            'article_id': new_comment.article_id
        }
    }), 201



    # Başarılı mesaj ve yorum detayları
    return jsonify({
        'message': 'Yorum başarıyla eklendi!',
        'comment': {
            'id': new_comment.id,
            'content': new_comment.content,
            'user_id': new_comment.user_id,
            'article_id': new_comment.article_id
        }
    }), 201



#Bir Makalenin Yorumlarını Listeleme
@app.route('/articles/<int:article_id>/comments', methods=['GET'])
def get_article_comments(article_id):
    article = Article.query.get(article_id)
    if not article:
        return jsonify({'message': 'Makale bulunamadı!'}), 404

    comments = article.comments
    result = []
    for comment in comments:
        result.append({
            'id': comment.id,
            'content': comment.content,
            'user': comment.user.username
        })

    return jsonify({'comments': result}), 200


#Yorum silme
@app.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if not comment:
        return {"message": "Yorum bulunamadı!"}, 404

    db.session.delete(comment)
    db.session.commit()
    return {"message": "Yorum başarıyla silindi!"}, 200



# Flask uygulamasını çalıştırma
if __name__ == '__main__':
    app.run(debug=True)

#.\venv\Scripts\activate  çalıştırmak için gerekli, sakın silme