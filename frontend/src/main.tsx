import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18 için doğru import
import App from './App'; // Uygulamanızın ana bileşeni
import './index.css'; // Kendi CSS dosyanız
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import { AuthProvider } from './context/AuthContext'; // Yeni oluşturulan AuthContext'i ekleyin

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);

//Bu kod:

 //   React uygulamanızın DOM'a monte edilmesini sağlar.
//Global kimlik doğrulama bağlamı (AuthProvider) üzerinden kullanıcı bilgilerine erişimi etkinleştirir.
  //  CSS ve Bootstrap kütüphanesini yükleyerek tasarımı düzenler.
    //React 18'in özelliklerini kullanarak modern ve performanslı bir yapı sunar.