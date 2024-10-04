const { createCanvas } = require('canvas');
const faker = require('@faker-js/faker').faker;
const fs = require('fs');
const path = require('path');

// Function to generate random store name
function generateStoreName() {
    const adjectives = ["Mega", "Sumber", "Bintang", "Berkah", "Dharma", "Taman", "Sejahtera", "Murah", "Bersama", "ASC", "Sultan", "Zamza", "Airdrop Sultan"];
    const nouns = ["Mart", "Toserba", "Supermarket", "Belanja", "Food", "Sumber", "Toko", "Sayur", "Susu"];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

// List of products with price ranges
const products = [
    { name: "Beras 5kg", priceRange: [70000, 80000] },
    { name: "Minyak Goreng 2L", priceRange: [25000, 30000] },
    { name: "Gula Pasir 1kg", priceRange: [12000, 15000] },
    { name: "Telur Ayam 1kg", priceRange: [25000, 30000] },
    { name: "Indomie Goreng", priceRange: [2000, 3000] },
    { name: "Tepung Terigu 1kg", priceRange: [10000, 15000] },
    { name: "Kopi Sachet", priceRange: [1000, 2000] },
    { name: "Teh Botol Sosro", priceRange: [4000, 6000] },
    { name: "Sabun Mandi 100gr", priceRange: [2500, 3500] },
    { name: "Susu UHT 1L", priceRange: [12000, 18000] },
    { name: "Pasta Gigi 150gr", priceRange: [15000, 20000] },
    { name: "Rokok Marlboro", priceRange: [25000, 35000] },
    { name: "Sampo Sachet", priceRange: [800, 1500] },
    { name: "Kecap Manis 500ml", priceRange: [15000, 20000] },
    { name: "Sarden Kaleng", priceRange: [12000, 18000] },
    { name: "Mie Sedap", priceRange: [2000, 3000] },
    { name: "Coca Cola 330ml", priceRange: [7000, 9000] },
    { name: "Obat Flu", priceRange: [10000, 20000] },
    { name: "Biskuit", priceRange: [5000, 10000] },
    { name: "Permen", priceRange: [2000, 5000] }
];

// Generate random price in the range
function getRandomPrice(range) {
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}

// Generate the receipt image
function generateReceiptImage(receiptNumber = 1, folderName = 'struk') {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }

    for (let n = 1; n <= receiptNumber; n++) {
        const canvas = createCanvas(300, 600);
        const ctx = canvas.getContext('2d');

        // Generate fake store details
        const storeName = generateStoreName();
        const storeAddress = faker.address.streetAddress();
        const storePhone = faker.phone.number();

        // Current date and time
        const dateTime = new Date().toLocaleString('id-ID');

        // Draw header
        ctx.fillStyle = '#000';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(storeName, 10, 30);

        ctx.font = '12px Arial';
        ctx.fillText(`Alamat: ${storeAddress}`, 10, 50);
        ctx.fillText(`Telp: ${storePhone}`, 10, 70);
        ctx.fillText(`Date/Time: ${dateTime}`, 10, 90);

        // Draw items
        let yPosition = 120;
        ctx.fillText('Item        Qty    Price', 10, yPosition);
        yPosition += 20;
        
        const cart = {};
        let subtotal = 0;

        // Randomly select items
        const itemCount = Math.floor(Math.random() * 10) + 5;
        for (let i = 0; i < itemCount; i++) {
            const randomItem = products[Math.floor(Math.random() * products.length)];
            const itemPrice = getRandomPrice(randomItem.priceRange);
            const quantity = Math.floor(Math.random() * 3) + 1;

            if (!cart[randomItem.name]) {
                cart[randomItem.name] = { price: itemPrice, quantity: 0 };
            }
            cart[randomItem.name].quantity += quantity;
            subtotal += itemPrice * quantity;
        }

        // Print items on the receipt
        Object.keys(cart).forEach(item => {
            const { price, quantity } = cart[item];
            ctx.fillText(`${item}   ${quantity}   Rp${price}`, 10, yPosition);
            yPosition += 20;
        });

        // Draw subtotal, discount, and total
        const discount = Math.random() < 0.5 ? 0 : 0.1 * subtotal; // Random 10% discount
        const total = subtotal - discount;

        ctx.fillText(`Subtotal: Rp${subtotal.toLocaleString()}`, 10, yPosition);
        yPosition += 20;
        if (discount > 0) {
            ctx.fillText(`Discount: Rp${discount.toLocaleString()}`, 10, yPosition);
            yPosition += 20;
        }
        ctx.fillText(`Total: Rp${total.toLocaleString()}`, 10, yPosition);

        // Save image
        const out = fs.createWriteStream(path.join(folderName, `receipt_${n}.png`));
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => console.log(`Receipt ${n} saved as receipt_${n}.png in ${folderName}`));
    }
}

// Function to run the script at random intervals
function runAtRandomIntervals() {
    const minInterval = 2000;  // 2 seconds
    const maxInterval = 10000; // 10 seconds

    const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
    console.log(`Next receipt will be generated in ${randomInterval / 1000} seconds...`);

    setTimeout(() => {
        generateReceiptImage(1);  // Generate 1 receipt
        runAtRandomIntervals();   // Call the function again to continue
    }, randomInterval);
}

// Start the random interval execution
runAtRandomIntervals();
