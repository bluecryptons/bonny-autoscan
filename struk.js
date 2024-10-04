const fs = require('fs');
const { createCanvas } = require('canvas');
const { faker } = require('@faker-js/faker');

// Fungsi untuk menghasilkan nama toko acak
function generateStoreName() {
  const adjectives = ["Mega", "Sumber", "Bintang", "Berkah", "Dharma", "Taman", "Sejahtera", "Murah", "Bersama", "ASC", "Sultan", "Zamza", "Airdrop Sultan"];
  const nouns = ["Mart", "Toserba", "Supermarket", "Belanja", "Food", "Sumber", "Toko", "Sayur", "Susu"];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

// Fungsi untuk memilih harga acak berdasarkan rentang harga
function getRandomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Produk acak dengan harga
const products = [
  { name: "Beras 5kg", price: [70000, 80000] },
  { name: "Minyak Goreng 2L", price: [25000, 30000] },
  { name: "Gula Pasir 1kg", price: [12000, 15000] },
  { name: "Telur Ayam 1kg", price: [25000, 30000] },
  // Tambahkan lebih banyak produk sesuai kebutuhan
];

// Fungsi untuk generate struk belanja acak
function generateReceipt() {
  const canvas = createCanvas(300, 500);
  const ctx = canvas.getContext('2d');

  // Nama dan Alamat Toko
  const storeName = generateStoreName();
  const storeAddress = faker.address.streetAddress();
  const storePhone = faker.phone.number();

  // Tanggal
  const dateTime = new Date().toLocaleString();

  // Menambahkan teks ke struk
  ctx.font = '16px Arial';
  ctx.fillText(storeName, 10, 30);
  ctx.fillText(storeAddress, 10, 60);
  ctx.fillText(`Telp: ${storePhone}`, 10, 90);
  ctx.fillText(dateTime, 10, 120);

  // Pilih produk acak
  const item = products[Math.floor(Math.random() * products.length)];
  const itemName = item.name;
  const itemPrice = getRandomPrice(item.price[0], item.price[1]);

  // Menambahkan produk
  ctx.fillText(`${itemName} - Rp${itemPrice}`, 10, 150);

  // Simpan sebagai PNG
  const buffer = canvas.toBuffer('image/png');
  const fileName = `struk_${new Date().getTime()}.png`;  // Nama file berdasarkan timestamp
  fs.writeFileSync(fileName, buffer);
  console.log(`Struk belanja telah disimpan sebagai '${fileName}'.`);
}

// Fungsi utama dengan interval waktu 5 menit
function main() {
  console.log('Script berjalan, struk akan dibuat setiap 5 menit...');
  
  // Interval 5 menit (300000 milidetik)
  setInterval(() => {
    generateReceipt();
  }, 300000);
}

// Jalankan script
main();
