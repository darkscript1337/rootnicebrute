# SSH, FTP ve MySQL Brute Force Deneme Uygulaması

## Uygulama Nedir?

Bu Node.js uygulaması, kullanıcı tarafından verilen IP adreslerine SSH, FTP ve MySQL servislerinin açık olup olmadığını kontrol eder ve bu servislerde brute-force saldırıları gerçekleştirir. Başarılı giriş denemeleri `basarili_girisler.txt` dosyasına kaydedilir.

## Özellikler

- SSH, FTP ve MySQL servislerinin açık olup olmadığını kontrol eder.
- Açık servislerde brute-force denemesi yapar.
- Başarılı girişleri bir dosyaya kaydeder.
- Terminalde renkli ve simgeli çıktı sağlar.

## Nasıl Çalışır?

1. **IP Adresleri Dosyası (`ip.txt`)**: Uygulama, IP adreslerinin bulunduğu bir .txt dosyasından bu adresleri okur.
2. **Kullanıcı Adları ve Şifre Dosyaları**: Kullanıcı adı ve şifre kombinasyonları, brute-force saldırılarında kullanılır.
3. **Port Kontrolü**: SSH (22), FTP (21) ve MySQL (3306) portlarının açık olup olmadığı kontrol edilir.
4. **Brute Force**: Servisler açıksa brute-force saldırısı gerçekleştirilir. Başarılı girişler `basarili_girisler.txt` dosyasına kaydedilir.

## Kullanılan Kütüphaneler

Bu proje için gerekli olan kütüphaneler aşağıdadır:

- **ssh2**: SSH bağlantısı kurmak için kullanılır.
- **ftp**: FTP bağlantısı kurmak için kullanılır.
- **mysql**: MySQL bağlantısı kurmak için kullanılır.
- **net**: TCP bağlantılarını kontrol etmek için kullanılır.
- **chalk**: Terminal çıktısında renkli mesajlar göstermek için kullanılır.
- **ora**: Terminalde dönen simgeler ekleyerek kullanıcıya işlemler hakkında bilgi vermek için kullanılır.

## Kurulum

Uygulamayı çalıştırabilmek için aşağıdaki adımları takip edin:

### 1. Node.js ve npm Kurulumu

Öncelikle Node.js ve npm'in bilgisayarınızda kurulu olduğundan emin olun. Eğer kurulu değilse [Node.js'in resmi sitesinden](https://nodejs.org) yükleyebilirsiniz.

### 2. Proje Dosyalarını Klonlayın

Projeyi bilgisayarınıza klonlayın veya ZIP olarak indirip açın:

# Gerekli Kütüphaneleri Yükleyin
npm install ssh2 ftp mysql net chalk ora

# Uygulamanın Çalıştırılması
node rootnicebrute.js
