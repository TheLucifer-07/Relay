import { TRADE_OUTCOME } from "./tradeStatusConfig";
import { getInitials } from "../utils/initials";

export const INDIAN_NAMES = [
  "Priya Sharma", "Vikram Singh", "Nisha Patel", "Rahul Das", "Meera Sen",
  "Aditya Rao", "Kiran Kumar", "Suresh Nair", "Ananya Reddy", "Amit Verma",
  "Deepak Gupta", "Sunita Rao", "Rajesh Pillai", "Kavita Nair", "Sanjay Dutt",
  "Ravi Teja", "Lakshmi Prasad", "Harish Babu", "Sravani Reddy", "Chandan Mohan"
];

export const AVATAR_COLORS = [
  "bg-[rgba(255,159,113,0.16)] text-[#ff9f71]",
  "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
  "bg-[rgba(255,199,91,0.16)] text-[#ffc75b]",
  "bg-[rgba(136,196,255,0.16)] text-[#88c4ff]",
  "bg-[rgba(187,147,255,0.18)] text-[#bb93ff]"
];

// Visakhapatnam neighborhoods — Relay launches in Vizag
const VIZAG_LOCATIONS = [
  { name: "MVP Colony", lat: 17.7231, lng: 83.3012 },
  { name: "Rushikonda", lat: 17.7726, lng: 83.3734 },
  { name: "RK Beach", lat: 17.7029, lng: 83.3173 },
  { name: "Madhurawada", lat: 17.7831, lng: 83.3601 },
  { name: "Beach Road", lat: 17.7109, lng: 83.3205 },
  { name: "Siripuram", lat: 17.7241, lng: 83.3142 },
  { name: "Lawson's Bay Colony", lat: 17.7421, lng: 83.3298 },
  { name: "PM Palem", lat: 17.7612, lng: 83.3441 },
  { name: "Gajuwaka", lat: 17.6831, lng: 83.2129 },
  { name: "Bheemili", lat: 17.8932, lng: 83.4571 },
  { name: "Dwaraka Nagar", lat: 17.7189, lng: 83.3089 },
  { name: "Steel Plant Area", lat: 17.6701, lng: 83.2287 },
];

// Real product images from Unsplash — grouped by category
const CATEGORY_IMAGES = {
  Books: [
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=70",
  ],
  Coupons: [
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop&q=70",
  ],
  "Gift Cards": [
    "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=70",
  ],
  Tools: [
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1534398079543-7ae6d016b86a?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&auto=format&fit=crop&q=70",
  ],
  Electronics: [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1608354580875-30bd4168b351?w=600&auto=format&fit=crop&q=70",
  ],
  Furniture: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=70",
  ],
  "Educational Kits": [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1581093448798-77c5e7a5bcb4?w=600&auto=format&fit=crop&q=70",
  ],
  Collectibles: [
    "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&auto=format&fit=crop&q=70",
  ],
  "Reusable Resources": [
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=70",
  ],
  Stationery: [
    "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600&auto=format&fit=crop&q=70",
  ],
  "Home Appliances": [
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1507614455635-c8b4c1f0c8ef?w=600&auto=format&fit=crop&q=70",
  ],
  Sports: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=70",
  ],
  "Musical Instruments": [
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&auto=format&fit=crop&q=70",
  ],
  Vehicles: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&auto=format&fit=crop&q=70",
  ],
  Accessories: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=70",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=70",
  ],
  More: [
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=70",
  ],
};

function getImageForCategory(category, idx) {
  const imgs = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.More;
  return imgs[idx % imgs.length];
}

const LISTING_TEMPLATES = [
  // ─── Books (15) ────────────────────────────────────────────────────────────
  { title: "Atomic Habits by James Clear", category: "Books", condition: "Like New", value: "₹500", lookingFor: "Clean Code Book", description: "Bestseller on habit building. Pristine condition, read once. Key insights highlighted." },
  { title: "Clean Code by Robert C. Martin", category: "Books", condition: "Excellent", value: "₹700", lookingFor: "Introduction to Algorithms", description: "Handbook of agile software craftsmanship. Minimal highlights, intact binding." },
  { title: "Rich Dad Poor Dad by Robert Kiyosaki", category: "Books", condition: "Good", value: "₹350", lookingFor: "The Intelligent Investor", description: "Classic finance book. Soft cover, normal shelf wear. First edition." },
  { title: "Sapiens: A Brief History of Humankind", category: "Books", condition: "Like New", value: "₹450", lookingFor: "Homo Deus", description: "Yuval Noah Harari's acclaimed history of humans. Excellent condition, no dog-ears." },
  { title: "JavaScript: The Definitive Guide (7th Ed)", category: "Books", condition: "Excellent", value: "₹950", lookingFor: "Pragmatic Programmer", description: "The definitive guide to JavaScript. Hardcover, zero damage." },
  { title: "Introduction to Algorithms (CLRS)", category: "Books", condition: "Good", value: "₹800", lookingFor: "Design Patterns (GoF)", description: "Standard textbook on computer algorithms. Sturdy binding, some marginalia." },
  { title: "Indian Polity by M. Laxmikanth", category: "Books", condition: "Excellent", value: "₹650", lookingFor: "Modern History Spectrum", description: "Essential for UPSC preparation. No marked pages, clean copy." },
  { title: "Wings of Fire by APJ Abdul Kalam", category: "Books", condition: "Like New", value: "₹250", lookingFor: "Ignited Minds", description: "Inspirational autobiography of Dr. Kalam. Paperback, perfect condition." },
  { title: "Design Patterns by Gang of Four", category: "Books", condition: "Excellent", value: "₹900", lookingFor: "Clean Architecture", description: "Classic software engineering patterns. Hardcover, immaculate." },
  { title: "To Kill a Mockingbird", category: "Books", condition: "Fair", value: "₹200", lookingFor: "1984 George Orwell", description: "Pulitzer prize-winning novel. Yellowed pages but fully readable." },
  { title: "Think and Grow Rich", category: "Books", condition: "Good", value: "₹300", lookingFor: "Zero to One", description: "Napoleon Hill's classic. Soft cover, notes on select pages." },
  { title: "Man's Search for Meaning", category: "Books", condition: "Like New", value: "₹280", lookingFor: "The Alchemist", description: "Viktor Frankl's masterpiece. Bought never re-read, perfect for first timer." },
  { title: "Zero to One by Peter Thiel", category: "Books", condition: "Excellent", value: "₹380", lookingFor: "Hooked by Nir Eyal", description: "Notes on startups. Superb reading. Hardcover, spine unbent." },
  { title: "The Intelligent Investor", category: "Books", condition: "Good", value: "₹500", lookingFor: "Rich Dad Poor Dad", description: "Definitive book on value investing. Benjamin Graham edition with commentary." },
  { title: "Clean Architecture by Uncle Bob", category: "Books", condition: "Excellent", value: "₹750", lookingFor: "Clean Code", description: "Craftsman's guide to software structure and design." },

  // ─── Coupons & Gift Cards (12) ─────────────────────────────────────────────
  { title: "Swiggy ₹200 Off Food Coupon", category: "Coupons", condition: "Unused", value: "₹200", lookingFor: "Zomato voucher", description: "Valid on orders above ₹499 at Swiggy. Expires in 7 days. Screenshot verified." },
  { title: "Amazon ₹500 Gift Voucher", category: "Gift Cards", condition: "Unused", value: "₹500", lookingFor: "Flipkart Voucher", description: "Verified Amazon gift card balance. Safe digital barter, pin intact." },
  { title: "Myntra 15% Off Discount Coupon", category: "Coupons", condition: "Unused", value: "₹150", lookingFor: "Ajio Coupon", description: "Get 15% off on clothing orders. Valid on sale items too." },
  { title: "BookMyShow ₹300 Movie Voucher", category: "Gift Cards", condition: "Unused", value: "₹300", lookingFor: "Swiggy Voucher", description: "Valid for booking movie or event tickets. No restrictions on format." },
  { title: "Flipkart ₹1000 E-Gift Card", category: "Gift Cards", condition: "Unused", value: "₹1,000", lookingFor: "Amazon Gift Card", description: "Unused gift card pin. Digitally verified, ready for instant transfer." },
  { title: "Ajio ₹500 Discount Coupon", category: "Coupons", condition: "Unused", value: "₹500", lookingFor: "Myntra Voucher", description: "Promo code for Ajio fashion store. Valid on selected premium collections." },
  { title: "Uber ₹150 Ride Discount Voucher", category: "Coupons", condition: "Unused", value: "₹150", lookingFor: "Ola Voucher", description: "Flat discount on next premier trip. No minimum fare restriction." },
  { title: "Zomato Gold 3-Month Membership", category: "Coupons", condition: "Unused", value: "₹450", lookingFor: "Amazon Prime voucher", description: "Activation link for Zomato Gold. Includes free delivery + 1+1 offers." },
  { title: "Nykaa ₹500 Shopping Voucher", category: "Gift Cards", condition: "Unused", value: "₹500", lookingFor: "Myntra Card", description: "Gift voucher valid for cosmetics on Nykaa. No expiry concern." },
  { title: "MakeMyTrip ₹1500 Hotel Voucher", category: "Gift Cards", condition: "Unused", value: "₹1,500", lookingFor: "Amazon Gift Card", description: "Valid on hotel bookings. No minimum transaction. Domestic travel included." },
  { title: "Tata CLIQ ₹300 Off Coupon", category: "Coupons", condition: "Unused", value: "₹300", lookingFor: "Any food coupon", description: "Valid on electronics purchases on Tata CLIQ. Min bill ₹2999." },
  { title: "Dominos ₹250 Pizza Voucher", category: "Gift Cards", condition: "Unused", value: "₹250", lookingFor: "Uber voucher", description: "Verified Domino's e-gift voucher. Instant digital exchange, all outlets valid." },

  // ─── Tools (10) ────────────────────────────────────────────────────────────
  { title: "Bosch GSB 500W Drill Machine", category: "Tools", condition: "Excellent", value: "₹1,800", lookingFor: "Arduino Kit or Router", description: "High power hammer drill kit. Barely used, complete bit set included." },
  { title: "Screwdriver 32-in-1 Precision Set", category: "Tools", condition: "Good", value: "₹400", lookingFor: "Laptop stand", description: "Perfect for phone and laptop repairs. Magnetic tips, hard carry case." },
  { title: "Digital Multimeter (True RMS)", category: "Tools", condition: "Excellent", value: "₹850", lookingFor: "Soldering Station", description: "Measures voltage, current, resistance. Backlight display, dual fused." },
  { title: "Soldering Iron 25W with Stand", category: "Tools", condition: "Good", value: "₹350", lookingFor: "Desoldering Pump", description: "Electronics projects tool. Includes flux and wire spool, heat resistant." },
  { title: "Stanley Socket Wrench Set 40pc", category: "Tools", condition: "Excellent", value: "₹1,200", lookingFor: "Angle Grinder", description: "Sturdy ratchet socket driver set. Heavy duty build, lifetime guarantee." },
  { title: "Hot Glue Gun 60W Pro Series", category: "Tools", condition: "Like New", value: "₹300", lookingFor: "Craft Knife Set", description: "Rapid heating glue gun. Includes 25 adhesive sticks, anti-drip nozzle." },
  { title: "Measuring Tape 7.5M Steel Blade", category: "Tools", condition: "Good", value: "₹180", lookingFor: "Hand Tools", description: "Steel measuring tape with framing studs. Auto-lock and belt clip." },
  { title: "Taparia Adjustable Spanner Wrench", category: "Tools", condition: "Excellent", value: "₹280", lookingFor: "Pliers set", description: "Chrome plated 12-inch adjustable wrench. Drop-forged steel." },
  { title: "Portable Electric Air Pump", category: "Tools", condition: "Like New", value: "₹1,100", lookingFor: "Mini Toolkit", description: "Electric inflator with digital pressure gauge. Fits cars, bikes, balls." },
  { title: "Wire Stripper & Cutter 5-in-1", category: "Tools", condition: "Good", value: "₹220", lookingFor: "Electrical tape pack", description: "Clean stripping tool for multi-gauge copper wires. Ergonomic grip." },

  // ─── Electronics (12) ──────────────────────────────────────────────────────
  { title: "Sennheiser HD 250BT Headphones", category: "Electronics", condition: "Excellent", value: "₹2,500", lookingFor: "Mechanical Keyboard", description: "Wireless bluetooth headphones. Superb bass, 25hr battery life." },
  { title: "Aluminum Adjustable Laptop Stand", category: "Electronics", condition: "Like New", value: "₹600", lookingFor: "HDMI Hub", description: "Ergonomic foldable stand. Fits 13–15.6 inch laptops, cools efficiently." },
  { title: "Wacom One Graphic Drawing Tablet", category: "Electronics", condition: "Excellent", value: "₹3,500", lookingFor: "Kindle e-Reader", description: "Digital painting and sketching. Battery-free pen, USB-C. Barely used." },
  { title: "Dell 24-inch 1080p IPS Monitor", category: "Electronics", condition: "Good", value: "₹5,000", lookingFor: "iPad or Tablet", description: "FHD IPS monitor. HDMI/VGA ports. Zero screen burn, vibrant colors." },
  { title: "Xiaomi 20000mAh Power Bank 3i", category: "Electronics", condition: "Good", value: "₹900", lookingFor: "Laptop Sleeve", description: "Dual USB output with 18W fast charge support. Sturdy aluminum case." },
  { title: "JBL Go 3 Portable Bluetooth Speaker", category: "Electronics", condition: "Excellent", value: "₹1,500", lookingFor: "Earphones", description: "Pocket-size waterproof speaker. IPX67 rating, 5h playtime. Great clarity." },
  { title: "Anker USB-C Hub 7-in-1 Adaptor", category: "Electronics", condition: "Like New", value: "₹1,200", lookingFor: "Wireless Mouse", description: "USB-C to HDMI, Ethernet, SD, and USB ports. Aluminium casing, plug & play." },
  { title: "Logitech G304 Wireless Gaming Mouse", category: "Electronics", condition: "Excellent", value: "₹1,600", lookingFor: "Gaming Mousepad", description: "HERO sensor wireless mouse. Ultra-light 99g, fast response time." },
  { title: "Redgear Shadow Blade Mech Keyboard", category: "Electronics", condition: "Good", value: "₹1,100", lookingFor: "Bluetooth Earbuds", description: "Mechanical keyboard with blue switches and RGB. N-Key rollover." },
  { title: "Sony WH-CH510 Wireless Headphones", category: "Electronics", condition: "Fair", value: "₹1,400", lookingFor: "Powerbank", description: "Lightweight bluetooth headphones. USB-C charging, 35hr battery." },
  { title: "TP-Link AC750 WiFi Range Extender", category: "Electronics", condition: "Excellent", value: "₹1,000", lookingFor: "Gigabit Switch", description: "Boosts wifi range by 3x in dead zones. Simple button setup." },
  { title: "HDMI Switcher 3-in-1 Output Port", category: "Electronics", condition: "Unused", value: "₹400", lookingFor: "DisplayPort cable", description: "Share one monitor between three computers. Plug-and-play, no driver needed." },

  // ─── Furniture (8) ─────────────────────────────────────────────────────────
  { title: "Ergonomic Office Chair Mesh Back", category: "Furniture", condition: "Excellent", value: "₹3,500", lookingFor: "Study Table", description: "Padded seat with adjustable armrests, height lock, and lumbar support." },
  { title: "Solid Wood Study Desk", category: "Furniture", condition: "Good", value: "₹2,000", lookingFor: "Bookshelf cabinet", description: "Sturdy wooden table. Compact footprint, cable management slot." },
  { title: "Aluminium Dual Monitor Arm Stand", category: "Furniture", condition: "Excellent", value: "₹1,800", lookingFor: "Office Desk Lamp", description: "Full articulation gas-spring mount for double screens. C-clamp." },
  { title: "Floating Wall Shelf Set of 3", category: "Furniture", condition: "Like New", value: "₹500", lookingFor: "Desk organizer", description: "Wooden display shelves. Matte black paint, 15kg load rating each." },
  { title: "Lounge Bean Bag Chair XL", category: "Furniture", condition: "Good", value: "₹650", lookingFor: "Yoga mat", description: "Extremely comfortable lounge chair. EPS bead filling. Navy blue." },
  { title: "Foldable Bedside Laptop Table", category: "Furniture", condition: "Like New", value: "₹350", lookingFor: "Laptop stand", description: "Work or read in bed. Built-in tablet slot and cup holder." },
  { title: "Metal Desk Organizer 5-tier", category: "Furniture", condition: "Good", value: "₹450", lookingFor: "Desk accessories", description: "Multi-tier sliding shelf file sorter. Black powder-coat finish." },
  { title: "Solid Teak Coffee Table", category: "Furniture", condition: "Excellent", value: "₹1,600", lookingFor: "Floor Rug", description: "Compact teakwood center table. Dovetail joints, natural oil finish." },

  // ─── Educational Kits (6) ──────────────────────────────────────────────────
  { title: "Arduino UNO Starter Learning Kit", category: "Educational Kits", condition: "Like New", value: "₹1,100", lookingFor: "Raspberry Pi or Tools", description: "Complete kit: breadboard, sensors, LEDs, jumper wires, resistors, LCD." },
  { title: "Raspberry Pi Pico Board Bundle", category: "Educational Kits", condition: "Unused", value: "₹800", lookingFor: "Multimeter tool", description: "Includes header pins, GPIO cables, and micro-Python starter booklet." },
  { title: "LEGO Technic Race Car Set 620pc", category: "Educational Kits", condition: "Excellent", value: "₹1,500", lookingFor: "Board Games", description: "Full brick assembly set with motorized functions. Booklet included." },
  { title: "Chemistry Science Lab Kit for Class 10", category: "Educational Kits", condition: "Good", value: "₹700", lookingFor: "Physics Prism Set", description: "Test tubes, beakers, safety goggles, burette. Perfect for CBSE practicals." },
  { title: "Solar Power Miniature Car STEM Kit", category: "Educational Kits", condition: "Like New", value: "₹400", lookingFor: "Arduino parts", description: "Educational kit showing solar PV energy conversion. Simple assembly." },
  { title: "DIY Hydraulic Robotic Arm Kit", category: "Educational Kits", condition: "Excellent", value: "₹950", lookingFor: "Science kits", description: "Wooden hydraulic arm model. Teaches Boyle's law. Six-axis motion." },

  // ─── Collectibles (5) ──────────────────────────────────────────────────────
  { title: "Vintage Indian 1-Rupee Coin (1947)", category: "Collectibles", condition: "Excellent", value: "₹1,500", lookingFor: "Rare Stamps", description: "Pure silver Indian rupee minted in 1947. Independence year piece." },
  { title: "Spider-Man #100 Vintage Comic Book", category: "Collectibles", condition: "Good", value: "₹2,500", lookingFor: "Action Figures", description: "Vintage Marvel comic. Minor spine creases, inside pages clean." },
  { title: "Rare Indian Postage Stamp Set (1970)", category: "Collectibles", condition: "Excellent", value: "₹1,200", lookingFor: "Old Banknotes", description: "Historical collection of 10 stamps. Sealed in protective clear sheets." },
  { title: "Batman Funko Pop Limited Edition #52", category: "Collectibles", condition: "Like New", value: "₹800", lookingFor: "Iron Man Funko", description: "Mint condition vinyl figure in original box. Zero scratches or fading." },
  { title: "Pink Floyd Dark Side of Moon Vinyl", category: "Collectibles", condition: "Excellent", value: "₹3,000", lookingFor: "Beatles Vinyl", description: "Original gatefold press. Tested, plays cleanly with zero skips." },

  // ─── Reusable Resources (5) ────────────────────────────────────────────────
  { title: "Stainless Steel Gym Water Bottle 1L", category: "Reusable Resources", condition: "Excellent", value: "₹400", lookingFor: "Storage Organizers", description: "Double-walled insulated flask. Keeps cold 24hr. No leaks, BPA free." },
  { title: "Fabric Storage Organizer Box Set of 3", category: "Reusable Resources", condition: "Like New", value: "₹600", lookingFor: "Wall Hooks", description: "Stackable clothes drawers. Collapsible when empty. Charcoal gray." },
  { title: "Anti-slip Yoga Mat 6mm Premium", category: "Reusable Resources", condition: "Good", value: "₹500", lookingFor: "Foam Roller", description: "Tear-resistant eco-friendly mat. Comes with carrying strap. 183x61cm." },
  { title: "Hex Dumbbells Set 5kg x 2", category: "Reusable Resources", condition: "Excellent", value: "₹1,200", lookingFor: "Kettlebell 8kg", description: "Rubber encased hexagonal dumbbells. Floor protection grip, non-roll." },
  { title: "Resistance Bands Set of 5", category: "Reusable Resources", condition: "Like New", value: "₹300", lookingFor: "Skipping rope", description: "Multi-tension fitness bands. Includes door anchor and foam handles." },

  // ─── Stationery (5) ────────────────────────────────────────────────────────
  { title: "Calligraphy Feather Pen & Ink Set", category: "Stationery", condition: "Unused", value: "₹600", lookingFor: "Sketchbook", description: "Ornate quill pen, 5 replacement nibs, and gold dust ink jar. Art quality." },
  { title: "Genuine Leather Daily Journal", category: "Stationery", condition: "Excellent", value: "₹800", lookingFor: "Fountain Pen", description: "Bound notebook with unruled vintage parchment pages. Handcrafted." },
  { title: "A4 Canvas Artist Sketchbook 120 Sheets", category: "Stationery", condition: "Like New", value: "₹350", lookingFor: "Charcoal Pencils", description: "120 sheets textured high-weight drawing paper. Cold press finish." },
  { title: "Acrylic Paint Set 24 Vibrant Colors", category: "Stationery", condition: "Unused", value: "₹750", lookingFor: "Paintbrushes set", description: "Non-toxic vibrant paint tubes. Excellent coverage, stays flexible when dry." },
  { title: "Professional Drafting Compass Kit", category: "Stationery", condition: "Good", value: "₹500", lookingFor: "T-Square Ruler", description: "Precision geometry set with 12 instruments. Comes in hard carry case." },

  // ─── Home Appliances (5) ───────────────────────────────────────────────────
  { title: "Prestige 800W Sandwich & Grill Maker", category: "Home Appliances", condition: "Good", value: "₹1,000", lookingFor: "Electric Kettle", description: "Non-stick floating grill plates. Quick 2-min heating. Cord storage." },
  { title: "Kent Stainless Steel Electric Kettle 1.8L", category: "Home Appliances", condition: "Excellent", value: "₹1,200", lookingFor: "Toaster", description: "Auto-shut off, boils in under 3 minutes. 360° cordless rotation base." },
  { title: "Mini Portable Car Refrigerator 4L", category: "Home Appliances", condition: "Excellent", value: "₹2,500", lookingFor: "Air Humidifier", description: "Thermoelectric cooler and warmer. Fits 6 cans. 12V / 240V dual power." },
  { title: "Philips Hand Blender HR1363 250W", category: "Home Appliances", condition: "Good", value: "₹1,400", lookingFor: "Chopper", description: "Stainless steel blade, one-touch operation. Great for soups & smoothies." },
  { title: "Car Air Purifier with HEPA Filter", category: "Home Appliances", condition: "Like New", value: "₹1,800", lookingFor: "Vacuum Cleaner", description: "Active carbon + HEPA filter. Removes smoke, allergens, PM2.5." },

  // ─── Sports (5) ────────────────────────────────────────────────────────────
  { title: "Yonex Carbonex 8000 Badminton Racket", category: "Sports", condition: "Excellent", value: "₹1,500", lookingFor: "Shuttlecocks tube", description: "Lightweight carbon shaft racket. Balanced tension netting, bag included." },
  { title: "Nivia Storm Football Size 5 Match", category: "Sports", condition: "Good", value: "₹600", lookingFor: "Pump", description: "Tough TPU casing. Retains air pressure for 4+ weeks. FIFA approved." },
  { title: "SG Scorer Kashmir Willow Cricket Bat", category: "Sports", condition: "Excellent", value: "₹2,200", lookingFor: "Batting Gloves", description: "Short handle cricket bat. Dynamic protective cover and extra grip." },
  { title: "Cosco Tennis Racket with 3 Balls", category: "Sports", condition: "Good", value: "₹1,300", lookingFor: "Squash Racket", description: "Durable aluminum frame. Ideal for beginners or recreational play." },
  { title: "Tournament Chess Board Set with Bag", category: "Sports", condition: "Like New", value: "₹500", lookingFor: "Monopoly Game", description: "FIDE approved weighted pieces. Rollable vinyl mat, clock not included." },

  // ─── Musical Instruments (5) ───────────────────────────────────────────────
  { title: "Yamaha F280 Acoustic Guitar Natural", category: "Musical Instruments", condition: "Excellent", value: "₹6,500", lookingFor: "Ukulele or Keyboard", description: "Rich tone and playability. Spruce top, rosewood fingerboard. Strap included." },
  { title: "Casio SA-47 44-Key Portable Keyboard", category: "Musical Instruments", condition: "Good", value: "₹3,200", lookingFor: "Electric Guitar", description: "44 mini keys, 100 tones, 50 rhythms. Battery powered, beginner friendly." },
  { title: "Mahalo Soprano Ukulele Starter Pack", category: "Musical Instruments", condition: "Like New", value: "₹1,800", lookingFor: "Guitar Stand", description: "Vibrant sound, Aquila strings. Gig bag and clip-on tuner included." },
  { title: "Punjs Concert Bamboo Bansuri Flute C#", category: "Musical Instruments", condition: "Excellent", value: "₹400", lookingFor: "Harmonica", description: "Natural C-sharp scale flute. Tuned professionally, clean bore." },
  { title: "Kadence Violin 4/4 Concert Series", category: "Musical Instruments", condition: "Excellent", value: "₹4,500", lookingFor: "Acoustic Guitar", description: "Spruce wood violin with bow, rosin and protective case. Tuned." },

  // ─── Vehicles & Accessories (7) ────────────────────────────────────────────
  { title: "Hercules Roadeo A50 21-Speed Cycle", category: "Vehicles", condition: "Good", value: "₹8,000", lookingFor: "Electric Scooter", description: "Dual disc brakes, front suspension. Alloy frame, serviced last month." },
  { title: "Electric Kick Scooter Foldable 250W", category: "Vehicles", condition: "Excellent", value: "₹12,000", lookingFor: "iPad or Laptop", description: "250W hub motor, 20km range. Compact fold, regenerative braking." },
  { title: "Oxelo Mid-500 Adult Skateboard", category: "Vehicles", condition: "Excellent", value: "₹2,800", lookingFor: "Inline Skates", description: "Maple wood deck, aluminium trucks. Smooth ABEC-7 bearings, custom griptape." },
  { title: "Wildhorn Genuine Leather Wallet Men", category: "Accessories", condition: "Unused", value: "₹600", lookingFor: "Leather Belt", description: "Hunter leather. 8 card slots, coin pocket, RFID blocking layer." },
  { title: "Ray-Ban Aviator Protective Case", category: "Accessories", condition: "Good", value: "₹400", lookingFor: "Lens Cleaning Kit", description: "Leather-lined protective case for aviator style. Spring hinge closure." },
  { title: "American Tourister 30L Laptop Backpack", category: "Accessories", condition: "Excellent", value: "₹1,500", lookingFor: "Messenger Bag", description: "3 compartments, padded laptop sleeve. Water resistant, USB charging port." },
  { title: "Compact Leather Key Organizer 8-key", category: "Accessories", condition: "Like New", value: "₹300", lookingFor: "Keyring", description: "Stores 8 keys silently in compact leather fold. Stainless steel hardware." },

  // ─── Additional listings to reach 100+ ─────────────────────────────────────
  { title: "Kindle Paperwhite 11th Gen (8GB)", category: "Electronics", condition: "Excellent", value: "₹6,500", lookingFor: "iPad Mini", description: "300ppi glare-free display. Waterproof IPX8. 6 weeks battery. Like new." },
  { title: "GoPro Hero 9 Action Camera Black", category: "Electronics", condition: "Good", value: "₹18,000", lookingFor: "DSLR Camera", description: "5K video, 20MP photo. HyperSmooth 3.0. Includes cage and extra battery." },
  { title: "BoAt Airdopes 141 Earbuds", category: "Electronics", condition: "Like New", value: "₹800", lookingFor: "JBL Earphones", description: "42hr total playback, IPX4 water resistant. ENx noise rejection." },
  { title: "Redmi Note 12 Pro Mobile Phone", category: "Electronics", condition: "Good", value: "₹14,000", lookingFor: "iPhone SE", description: "6.67\" AMOLED 120Hz. 50MP cam, 5000mAh. Original box with accessories." },
  { title: "Coding Bootcamp Course Voucher (3 months)", category: "Coupons", condition: "Unused", value: "₹3,000", lookingFor: "LinkedIn Premium", description: "Full stack web development bootcamp. Lifetime access post course completion." },
  { title: "iQOO Z7 Pro Gaming Phone", category: "Electronics", condition: "Excellent", value: "₹16,000", lookingFor: "Sony Earphones", description: "Snapdragon 782G, 120Hz AMOLED, 4400mAh. Gaming optimized. 6 months old." },
  { title: "Fossil Gen 6 Smartwatch 44mm", category: "Electronics", condition: "Good", value: "₹8,000", lookingFor: "Fitness Band", description: "Wear OS with Google Assistant. Wireless charging, always-on display." },
  { title: "Canon PIXMA MG3670 All-in-One Printer", category: "Electronics", condition: "Good", value: "₹3,500", lookingFor: "External HDD", description: "Print, scan, copy. WiFi direct, borderless 4x6 photo print." },
  { title: "JBL Flip 5 Portable Speaker", category: "Electronics", condition: "Like New", value: "₹3,200", lookingFor: "Mini Projector", description: "Waterproof IPX7. 12hr playtime, PartyBoost link. Ocean blue color." },
  { title: "Seagate 1TB Portable External HDD", category: "Electronics", condition: "Excellent", value: "₹2,800", lookingFor: "USB Flash Drives", description: "SuperSpeed USB 3.0. Plug and play, auto-backup software included." },
  { title: "Navneet A4 Drawing Book 40 Sheets", category: "Stationery", condition: "Unused", value: "₹120", lookingFor: "Watercolors", description: "180gsm thick drawing paper. Acid free, smudge resistant. Pack of 5." },
  { title: "Premium Fountain Pen Set (3 nibs)", category: "Stationery", condition: "Like New", value: "₹900", lookingFor: "Ink Cartridges", description: "Brass body with gold plate nib. Includes converter and two ink bottles." },
];

// Generate offset coordinates within a Vizag neighborhood
function getOffsetCoords(location, idx) {
  const r = 0.008 * Math.sqrt((idx % 8) + 1);
  const theta = (idx * 31) * Math.PI / 180;
  return {
    lat: Number((location.lat + r * Math.sin(theta)).toFixed(5)),
    lng: Number((location.lng + r * Math.cos(theta)).toFixed(5))
  };
}

// Generate 107 high-quality seed listings — all Vizag-based
export const demoMarketplaceListingsSeed = LISTING_TEMPLATES.map((tmpl, idx) => {
  const locationObj = VIZAG_LOCATIONS[idx % VIZAG_LOCATIONS.length];
  const coords = getOffsetCoords(locationObj, idx);
  const ownerName = INDIAN_NAMES[idx % INDIAN_NAMES.length];
  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  const rating = Number((4.4 + ((idx * 7) % 6) * 0.1).toFixed(1));
  const distanceKm = Number((0.3 + ((idx * 11) % 28) * 0.1).toFixed(1));

  const isScooterListing = tmpl.title.includes("Electric Kick Scooter");
  const resolvedOwnerName = isScooterListing ? "Meera Sen" : ownerName;
  const resolvedOwnerIndex = isScooterListing ? 4 : idx % INDIAN_NAMES.length;

  return {
    id: `demo-listing-${idx + 1}`,
    category: tmpl.category,
    title: tmpl.title,
    desc: `${tmpl.condition} · AI Verified`,
    owner: resolvedOwnerName,
    ownerId: `demo-user-${resolvedOwnerIndex}`,
    distance: `${distanceKm} km`,
    rating,
    verified: true,
    availability: idx % 7 === 0 ? "Expires soon" : "Available now",
    status: idx % 9 === 2 ? "Urgent Trade" : idx % 9 === 5 ? "Instant Trade" : "Ready to Negotiate",
    value: tmpl.value,
    badge: idx % 5 === 0 ? "Hot Trade" : idx % 7 === 1 ? "AI Verified" : null,
    detailLabel: ["Coupons", "Gift Cards"].includes(tmpl.category) ? "Expiry" : "Condition",
    detailValue: tmpl.condition,
    offering: tmpl.title,
    lookingFor: tmpl.lookingFor,
    condition: tmpl.condition,
    description: tmpl.description,
    image: getImageForCategory(tmpl.category, idx),
    ownerNotes: "Ready for safe local swap in Vizag. Flexible timing.",
    ownerProfile: {
      initials: getInitials(resolvedOwnerName),
      avatarColor: isScooterListing ? AVATAR_COLORS[4] : color,
      joinedSince: `${2022 + (idx % 3)}`,
      completedTrades: (idx * 4) % 32 + 3,
      responseTime: `${(idx * 3) % 18 + 3} min`,
      tradeHistory: `${(idx * 4) % 32 + 3} successful relays`
    },
    latitude: coords.lat,
    longitude: coords.lng,
    city: locationObj.name,
    lookingForDetails: {
      preferredCategories: [tmpl.category],
      estimatedValue: tmpl.value,
      conditionPreference: "Fair or better",
      openToNegotiation: true,
      openToMultipleItems: idx % 4 === 0,
      nearbyOnly: true,
    },
  };
});

// ─── 25 Live Auctions ─────────────────────────────────────────────────────────

const AUCTION_IMAGES = [
  "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1608354580875-30bd4168b351?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=70",
  "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=600&auto=format&fit=crop&q=70",
];

// Pick 25 listings spread across categories for auctions
const _auctionPool = [
  ...demoMarketplaceListingsSeed.filter((_, i) => i % 4 === 0),
].slice(0, 25);

export const demoAuctionsSeed = _auctionPool.map((listing, idx) => {
  const startVal = parseFloat(listing.value.replace(/[^0-9]/g, "")) || 400;
  const startBid = Math.floor(startVal * 0.55);
  const highestBid = startBid + (idx * 180) + 120;
  const endDays = (idx % 4) + 1;
  const endHours = (idx * 7) % 24;
  const endsAt = new Date();
  endsAt.setDate(endsAt.getDate() + endDays);

  return {
    id: `demo-auc-${idx + 1}`,
    title: listing.title,
    description: listing.description,
    category: listing.category,
    condition: listing.condition,
    startBid,
    highestBid,
    suggestedBid: highestBid + Math.round(highestBid * 0.08),
    bidders: (idx * 3) % 20 + 5,
    timeRemaining: endDays === 1 ? `${endHours}h left` : `${endDays}d ${endHours}h left`,
    endDate: endsAt.toISOString(),
    image: AUCTION_IMAGES[idx % AUCTION_IMAGES.length],
    bidHistory: [
      { name: INDIAN_NAMES[(idx + 1) % INDIAN_NAMES.length], amount: startBid + 60 },
      { name: INDIAN_NAMES[(idx + 4) % INDIAN_NAMES.length], amount: highestBid - 180 },
      { name: INDIAN_NAMES[(idx + 7) % INDIAN_NAMES.length], amount: highestBid - 90 },
      { name: INDIAN_NAMES[(idx + 10) % INDIAN_NAMES.length], amount: highestBid, isCurrent: true },
    ],
    ownerName: listing.owner,
    ownerId: listing.ownerId || listing.userId || null,
    ownerInitials: listing.ownerProfile.initials,
    ownerColor: listing.ownerProfile.avatarColor,
    distance: listing.distance,
    city: listing.city,
    latitude: listing.latitude,
    longitude: listing.longitude,
    verified: true,
    aiVerified: true,
    status: "active",
  };
});

// ─── 20 Incoming Requests ──────────────────────────────────────────────────────
export const demoIncomingRequestsSeed = demoMarketplaceListingsSeed.slice(8, 28).map((listing, idx) => ({
  id: `demo-req-inc-${idx + 1}`,
  name: listing.owner,
  initials: listing.ownerProfile.initials,
  otherUserId: listing.ownerId,
  color: listing.ownerProfile.avatarColor,
  offering: listing.lookingFor,
  lookingFor: listing.title,
  distance: listing.distance,
  time: idx === 0 ? "2 min ago" : idx < 4 ? `${idx * 15} min ago` : `${idx} hours ago`,
  match: 88 + (idx % 12),
  message: `Hi! I'm interested in swapping for your ${listing.title}. I have ${listing.lookingFor} to offer. Let's negotiate!`,
  city: listing.city,
}));

// ─── 10 Outgoing Requests ──────────────────────────────────────────────────────
export const demoOutgoingRequestsSeed = demoMarketplaceListingsSeed.slice(45, 55).map((listing, idx) => ({
  id: `demo-req-out-${idx + 1}`,
  tradeId: listing.id,
  name: listing.owner,
  initials: listing.ownerProfile.initials,
  otherUserId: listing.ownerId,
  color: listing.ownerProfile.avatarColor,
  offering: ["Clean Code Book", "AJIO Coupon ₹500", "Arduino Kit", "Yoga Mat", "Bosch Drill"][idx % 5],
  lookingFor: listing.title,
  distance: listing.distance,
  time: `${idx + 1} hours ago`,
  status: idx % 3 === 0 ? "accepted" : "pending",
  match: 83 + (idx % 14),
  city: listing.city,
}));

// ─── 10 Active Trade Conversations ────────────────────────────────────────────
export const demoConversationsSeed = demoMarketplaceListingsSeed.slice(0, 10).map((listing, idx) => {
  const otherName = listing.owner;
  const initials = getInitials(otherName);

  return {
    id: `demo-session-${idx + 1}`,
    tradeId: listing.id,
    listingId: listing.id,
    sourceId: listing.id,
    sourceType: "listing",
    targetUserId: listing.ownerId,
    name: otherName,
    initials,
    otherUserId: listing.ownerId,
    receiverId: listing.ownerId,
    color: listing.ownerProfile.avatarColor,
    time: idx === 0 ? "3 min ago" : idx === 1 ? "28 min ago" : `${idx} hours ago`,
    outcome: TRADE_OUTCOME.NEGOTIATION_ACTIVE,
    unread: idx < 2 ? 1 : 0,
    offering: listing.lookingFor,
    lookingFor: listing.title,
    lastMessage: idx === 0
      ? "Can we meet at Madhurawada Crossroads tomorrow?"
      : idx === 1
        ? "That works! I'll bring the keyboard too."
        : "Let me confirm and get back to you.",
    status: idx % 4 === 0 ? "Online" : "Away",
    location: listing.distance,
    city: listing.city,
    messages: [
      { from: "them", text: `Hi! I saw your ${listing.title} listing. I have a ${listing.lookingFor} to offer.`, time: "Yesterday", type: "text" },
      { from: "me", text: "Sounds good! What's the condition of yours?", time: "Yesterday", type: "text" },
      { from: "them", text: "Like New. Barely used it 3 times.", time: "Yesterday", type: "text" },
      { from: "me", text: "Perfect. Mine is Excellent condition, no scratches.", time: "2h ago", type: "text" },
      {
        from: "them",
        text: idx === 0 ? "Can we meet at Madhurawada Crossroads tomorrow?" : idx === 1 ? "That works! I'll bring the keyboard too." : "Let me confirm and get back to you.",
        time: "Now",
        type: "text"
      },
    ],
    meetingLocation: [`MVP Colony Junction`, `Rushikonda Beach Road`, `Madhurawada Crossroads`, `RK Beach Parking`, `Siripuram Signal`][idx % 5],
    meetingTime: new Date(Date.now() + (idx + 1) * 24 * 60 * 60 * 1000).toISOString(),
  };
});

// ─── 15 Completed Trades ────────────────────────────────────────────────────────
export const demoCompletedTradesSeed = demoMarketplaceListingsSeed.slice(30, 45).map((listing, idx) => ({
  id: `demo-comp-${idx + 1}`,
  name: listing.owner,
  initials: listing.ownerProfile.initials,
  otherUserId: listing.ownerId,
  color: listing.ownerProfile.avatarColor,
  offering: listing.lookingFor,
  lookingFor: listing.title,
  completed: new Date(Date.now() - (idx + 1) * 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
  rating: "★★★★★",
  feedback: idx % 4 === 0
    ? "Super smooth swap at Madhurawada! Code verified instantly."
    : idx % 4 === 1
      ? "Very professional. Item exactly as described. Highly recommend!"
      : idx % 4 === 2
        ? "Quick response and honest trader. Will relay again!"
        : "Clean item and punctual meetup. Great Relay experience.",
  city: listing.city,
}));

// ─── 25 Notifications ──────────────────────────────────────────────────────────
export const demoNotificationsSeed = Array.from({ length: 25 }).map((_, idx) => {
  const names = INDIAN_NAMES;
  const name = names[idx % names.length];
  const items = [
    "Atomic Habits Book", "Bosch Power Drill", "Keychron Keyboard",
    "Leather Journal", "Electric Kettle", "JBL Speaker", "Arduino Kit",
    "Yoga Mat", "Fossil Watch", "Canon Printer"
  ];
  const item = items[idx % items.length];
  const locations = ["MVP Colony", "Rushikonda", "Madhurawada", "RK Beach", "Siripuram"];
  const loc = locations[idx % locations.length];

  const types = [
    { title: "New Trade Request", detail: `${name} offered a swap for your ${item} near ${loc}.` },
    { title: "Relay Match Found", detail: `Your ${item} perfectly matches ${name}'s wishlist!` },
    { title: "Bid Outbid Alert", detail: `You were outbid on ${item}. Current highest: ₹${1200 + idx * 100}.` },
    { title: "Trade Accepted", detail: `${name} accepted your trade request for ${item}.` },
    { title: "AI Trust Score Update", detail: `Your trust score increased to ${92 + (idx % 7)}% after verified ${item} swap.` },
  ];
  const t = types[idx % types.length];

  return {
    id: `demo-notif-${idx + 1}`,
    title: t.title,
    detail: t.detail,
    time: idx === 0 ? "Just now" : idx < 3 ? `${idx * 8} min ago` : `${Math.floor(idx * 1.5)} min ago`,
    unread: idx < 8,
  };
});

// ─── Demo user's own resource inventory ────────────────────────────────────────
export const demoCurrentUserResourcesSeed = [
  { id: "res-1", title: "Clean Code by Robert C. Martin", category: "Books", condition: "Like New", value: "₹700" },
  { id: "res-2", title: "AJIO ₹500 Discount Coupon", category: "Coupons", condition: "Unused", value: "₹500" },
  { id: "res-3", title: "Arduino UNO Starter Kit", category: "Educational Kits", condition: "Like New", value: "₹1,100" },
  { id: "res-4", title: "Anti-slip Yoga Mat 6mm Premium", category: "Reusable Resources", condition: "Good", value: "₹500" },
  { id: "res-5", title: "Bosch Screwdriver 32-in-1 Set", category: "Tools", condition: "Good", value: "₹400" },
  { id: "res-6", title: "JBL Go 3 Portable Speaker", category: "Electronics", condition: "Excellent", value: "₹1,500" },
];

// ─── Demo Nearby Requests — stable deterministic IDs for Dashboard cards ──────
// Each request maps exactly to a seeded user via demo-user-<idx> pattern.
// These IDs are used by Dashboard, Requests page, and startOrOpenConversation.
export const demoRequestsSeed = [
  {
    id: "demo-request-aditya",
    requesterId: "demo-user-5",        // Aditya Rao (index 5 in INDIAN_NAMES)
    name: "Aditya Rao",
    displayName: "Aditya R.",
    initials: "AR",
    avatarColor: "bg-[rgba(141,205,228,0.18)] text-[#8dcde4]",
    title: "Looking for a book on UX design",
    lookingFor: "Looking for a book on UX design",
    sourceType: "request",
    location: "MVP Colony, Vizag",
    distance: "0.5 km",
  },
  {
    id: "demo-request-nisha",
    requesterId: "demo-user-2",        // Nisha Patel (index 2 in INDIAN_NAMES)
    name: "Nisha Patel",
    displayName: "Nisha P.",
    initials: "NP",
    avatarColor: "bg-[rgba(255,199,91,0.16)] text-[#ffc75b]",
    title: "Needs a 15% or more discount coupon",
    lookingFor: "Needs a 15% or more discount coupon",
    sourceType: "request",
    location: "Siripuram, Vizag",
    distance: "0.9 km",
  },
  {
    id: "demo-request-vikram",
    requesterId: "demo-user-1",        // Vikram Singh (index 1 in INDIAN_NAMES)
    name: "Vikram Singh",
    displayName: "Vikram S.",
    initials: "VS",
    avatarColor: "bg-[rgba(136,196,255,0.16)] text-[#88c4ff]",
    title: "Looking to borrow a hand drill",
    lookingFor: "Looking to borrow a hand drill",
    sourceType: "request",
    location: "Rushikonda, Vizag",
    distance: "1.2 km",
  },
  {
    id: "demo-request-divya",
    requesterId: "demo-user-8",        // Ananya Reddy (index 8), used as "Divya M."
    name: "Ananya Reddy",
    displayName: "Divya M.",
    initials: "DM",
    avatarColor: "bg-[rgba(255,159,113,0.16)] text-[#ff9f71]",
    title: "Wants a gift card for stationery",
    lookingFor: "Wants a gift card for stationery",
    sourceType: "request",
    location: "Madhurawada, Vizag",
    distance: "1.8 km",
  },
];

