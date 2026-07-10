import { User } from "../models/User.js";
import { Profile } from "../models/Profile.js";
import { Listing } from "../models/Listing.js";
import { Auction } from "../models/Auction.js";
import { ExchangeSession } from "../models/ExchangeSession.js";
import { Notification } from "../models/Notification.js";
import { Message } from "../models/Message.js";

// Relay launches in Visakhapatnam — all seeder locations use Vizag neighborhoods
const DEFAULT_CENTER = { lat: 17.7031, lng: 83.3185 }; // RK Beach, Visakhapatnam

const VIZAG_NEIGHBORHOODS = [
  { name: "MVP Colony",         lat: 17.7231, lng: 83.3012 },
  { name: "Rushikonda",         lat: 17.7726, lng: 83.3734 },
  { name: "RK Beach",           lat: 17.7029, lng: 83.3173 },
  { name: "Madhurawada",        lat: 17.7831, lng: 83.3601 },
  { name: "Beach Road",         lat: 17.7109, lng: 83.3205 },
  { name: "Siripuram",          lat: 17.7241, lng: 83.3142 },
  { name: "Lawson's Bay Colony",lat: 17.7421, lng: 83.3298 },
  { name: "PM Palem",           lat: 17.7612, lng: 83.3441 },
  { name: "Gajuwaka",           lat: 17.6831, lng: 83.2129 },
  { name: "Bheemili",           lat: 17.8932, lng: 83.4571 },
  { name: "Dwaraka Nagar",      lat: 17.7189, lng: 83.3089 },
  { name: "Steel Plant Area",   lat: 17.6701, lng: 83.2287 },
];

// Keep CITIES as alias for backward-compatibility within seeder code
const CITIES = VIZAG_NEIGHBORHOODS;

function getInitials(name) {
  if (!name || typeof name !== "string") return "RU";
  const cleaned = name.trim();
  if (!cleaned) return "RU";
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getOffsetCoords(city, idx) {
  const r = 0.015 * Math.sqrt((idx % 10) + 1);
  const theta = (idx * 27) * Math.PI / 180;
  return {
    lat: Number((city.lat + r * Math.sin(theta)).toFixed(5)),
    lng: Number((city.lng + r * Math.cos(theta)).toFixed(5))
  };
}

const LISTING_TEMPLATES = [
  // Books (15 items)
  { title: "Atomic Habits by James Clear", category: "Books", condition: "Like New", value: "₹500", lookingFor: "Clean Code Book", description: "Bestseller book on habit building. Pristine condition, read once." },
  { title: "Clean Code by Robert C. Martin", category: "Books", condition: "Excellent", value: "₹700", lookingFor: "Introduction to Algorithms", description: "A handbook of agile software craftsmanship. Minimal highlights." },
  { title: "Rich Dad Poor Dad by Robert Kiyosaki", category: "Books", condition: "Good", value: "₹350", lookingFor: "The Intelligent Investor", description: "Classic finance book. Soft cover, normal shelf wear." },
  { title: "Sapiens: A Brief History of Humankind", category: "Books", condition: "Like New", value: "₹450", lookingFor: "Homo Deus", description: "Yuval Noah Harari's acclaimed history of humans. Excellent condition." },
  { title: "JavaScript: The Definitive Guide (7th Ed)", category: "Books", condition: "Excellent", value: "₹950", lookingFor: "Pragmatic Programmer", description: "The definitive guide to JavaScript programming. Hardcover." },
  { title: "Introduction to Algorithms (CLRS)", category: "Books", condition: "Good", value: "₹800", lookingFor: "Design Patterns (GoF)", description: "Standard textbook on computer algorithms. Sturdy binding." },
  { title: "Indian Polity by M. Laxmikanth", category: "Books", condition: "Excellent", value: "₹650", lookingFor: "Modern History Spectrum", description: "Essential book for civil service preparation. No marked pages." },
  { title: "Wings of Fire by APJ Abdul Kalam", category: "Books", condition: "Like New", value: "₹250", lookingFor: "Ignited Minds", description: "Inspirational autobiography of Dr. Kalam. Paperback." },
  { title: "Design Patterns by Gang of Four", category: "Books", condition: "Excellent", value: "₹900", lookingFor: "Clean Architecture", description: "Classic software engineering patterns handbook." },
  { title: "To Kill a Mockingbird", category: "Books", condition: "Fair", value: "₹200", lookingFor: "1984 George Orwell", description: "Pulitzer prize-winning novel. Yellowed pages but readable copy." },
  { title: "Think and Grow Rich", category: "Books", condition: "Good", value: "₹300", lookingFor: "Zero to One", description: "Famous self-help book. Paperback." },
  { title: "Man's Search for Meaning", category: "Books", condition: "Like New", value: "₹280", lookingFor: "Alchemist", description: "Viktor Frankl's classic memoir. Perfect condition." },
  { title: "Zero to One by Peter Thiel", category: "Books", condition: "Excellent", value: "₹380", lookingFor: "Hooked book", description: "Notes on startups, or how to build the future." },
  { title: "The Intelligent Investor", category: "Books", condition: "Good", value: "₹500", lookingFor: "Rich Dad Poor Dad", description: "The definitive book on value investing." },
  { title: "Clean Architecture by Uncle Bob", category: "Books", condition: "Excellent", value: "₹750", lookingFor: "Clean Code", description: "A craftsman's guide to software structure." },

  // Coupons & Gift Cards (12 items)
  { title: "Swiggy ₹200 Off Food Coupon", category: "Coupons", condition: "Unused", value: "₹200", lookingFor: "Zomato voucher", description: "Valid on orders above ₹499. Expires soon." },
  { title: "Amazon ₹500 Gift Voucher", category: "Gift Cards", condition: "Unused", value: "₹500", lookingFor: "Flipkart ₹500 Voucher", description: "Verified Amazon gift card balance. Safe digital barter." },
  { title: "Myntra 15% Off Discount Coupon", category: "Coupons", condition: "Unused", value: "₹150", lookingFor: "Ajio Coupon", description: "Get additional 15% off on clothing orders. Valid on sale items." },
  { title: "BookMyShow ₹300 Movie Voucher", category: "Gift Cards", condition: "Unused", value: "₹300", lookingFor: "Swiggy Voucher", description: "Valid for booking movie or event tickets on BMS website." },
  { title: "Flipkart ₹1000 E-Gift Card", category: "Gift Cards", condition: "Unused", value: "₹1,000", lookingFor: "Amazon Gift Card", description: "Unused gift card pin. Digitally verified." },
  { title: "Ajio ₹500 Discount Coupon", category: "Coupons", condition: "Unused", value: "₹500", lookingFor: "Myntra Voucher", description: "Promo code for Ajio fashion store. Valid on selected collections." },
  { title: "Uber Ride discount ₹150 Voucher", category: "Coupons", condition: "Unused", value: "₹150", lookingFor: "Ola Voucher", description: "Ride pass offering flat discount on next premier trip." },
  { title: "Zomato Gold 3-Month Membership", category: "Coupons", condition: "Unused", value: "₹450", lookingFor: "Amazon Prime voucher", description: "Activation link for Zomato Gold benefits." },
  { title: "Nykaa ₹500 Shopping Voucher", category: "Gift Cards", condition: "Unused", value: "₹500", lookingFor: "Myntra Card", description: "Gift voucher valid for cosmetic purchases on Nykaa app." },
  { title: "MakeMyTrip ₹1500 Hotel Voucher", category: "Gift Cards", condition: "Unused", value: "₹1,500", lookingFor: "Amazon Gift Card", description: "Valid on travel hotel bookings. No minimum transaction." },
  { title: "Tata CLIQ ₹300 Off Coupon", category: "Coupons", condition: "Unused", value: "₹300", lookingFor: "Any food coupon", description: "Valid on electronics purchases. Min bill ₹2999." },
  { title: "Dominos ₹250 Pizza Voucher", category: "Gift Cards", condition: "Unused", value: "₹250", lookingFor: "Uber voucher", description: "Verified domino e-gift voucher. Instant digital exchange." },

  // Tools (10 items)
  { title: "Bosch GSB 500W Drill Machine", category: "Tools", condition: "Excellent", value: "₹1,800", lookingFor: "Arduino Kit or Router", description: "High power hammer drill kit. Barely used, comes with complete bit set." },
  { title: "Screwdriver 32-in-1 Precision Set", category: "Tools", condition: "Good", value: "₹400", lookingFor: "Laptop stand", description: "Perfect for phone and laptop repairs. Magnetic tips." },
  { title: "Digital Multimeter (True RMS)", category: "Tools", condition: "Excellent", value: "₹850", lookingFor: "Soldering Station", description: "Measures voltage, current, resistance and continuity. Backlight display." },
  { title: "Soldering Iron 25W with Stand", category: "Tools", condition: "Good", value: "₹350", lookingFor: "Desoldering Pump", description: "Perfect for beginner electronics projects. Includes flux and wire spool." },
  { title: "Stanley Socket Wrench Set", category: "Tools", condition: "Excellent", value: "₹1,200", lookingFor: "Angle Grinder", description: "Sturdy ratchet socket driver wrench set. Heavy duty build." },
  { title: "Hot Glue Gun (60W)", category: "Tools", condition: "Like New", value: "₹300", lookingFor: "Craft Knife Set", description: "Rapid heating hot melt glue gun. Includes 10 adhesive sticks." },
  { title: "Measuring Tape 5 Meters", category: "Tools", condition: "Good", value: "₹150", lookingFor: "Hand Tools", description: "Steel measuring tape with locking feature and belt clip." },
  { title: "Taparia Adjustable Spanner Wrench", category: "Tools", condition: "Excellent", value: "₹280", lookingFor: "Pliers", description: "Chrome plated adjustable wrench tool." },
  { title: "Portable Air Pump for Car/Bike", category: "Tools", condition: "Like New", value: "₹1,100", lookingFor: "Mini Toolkit", description: "Electric air inflator with digital pressure gauge." },
  { title: "Wire Stripper & Cutter Tool", category: "Tools", condition: "Good", value: "₹220", lookingFor: "Electrical tape pack", description: "Clean stripping tool for multi-gauge copper wires." },

  // Electronics (12 items)
  { title: "Sennheiser HD 250BT Headphones", category: "Electronics", condition: "Excellent", value: "₹2,500", lookingFor: "Mechanical Keyboard", description: "Wireless bluetooth on-ear headphones. Superb bass quality and battery life." },
  { title: "Aluminum Adjustable Laptop Stand", category: "Electronics", condition: "Like New", value: "₹600", lookingFor: "HDMI Hub", description: "Ergonomic foldable stand. Fits up to 15.6 inch laptops." },
  { title: "Wacom One Graphic Drawing Tablet", category: "Electronics", condition: "Excellent", value: "₹3,500", lookingFor: "Kindle e-Reader", description: "Perfect for digital painting, sketches and online tutoring. Battery-free pen." },
  { title: "Dell 24-inch 1080p IPS Monitor", category: "Electronics", condition: "Good", value: "₹5,000", lookingFor: "iPad or Tablet", description: "FHD IPS monitor. HDMI/VGA ports. Vibrant colors, zero screen blemishes." },
  { title: "Xiaomi 20000mAh Power Bank 3i", category: "Electronics", condition: "Good", value: "₹900", lookingFor: "Laptop Sleeve", description: "Dual USB output with 18W fast charging support. Sturdy case." },
  { title: "JBL Go 3 Portable Speaker", category: "Electronics", condition: "Excellent", value: "₹1,500", lookingFor: "Earphones", description: "Pocket size waterproof bluetooth speaker. Great clarity." },
  { title: "Anker USB-C Hub 5-in-1 Adaptor", category: "Electronics", condition: "Like New", value: "₹1,200", lookingFor: "Wireless Mouse", description: "Converts USB-C to HDMI, Ethernet and USB ports. Aluminium casing." },
  { title: "Logitech G304 Wireless Gaming Mouse", category: "Electronics", condition: "Excellent", value: "₹1,600", lookingFor: "Gaming Mousepad", description: "HERO sensor wireless mouse. Light weight, fast response time." },
  { title: "Redgear Shadow Blade Keyboard", category: "Electronics", condition: "Good", value: "₹1,100", lookingFor: "Bluetooth Earbuds", description: "Mechanical keyboard with blue switches and LED lights." },
  { title: "Sony WH-CH510 Wireless Headphones", category: "Electronics", condition: "Fair", value: "₹1,400", lookingFor: "Powerbank", description: "Lightweight bluetooth headphones. Type-C charging. Good sound." },
  { title: "TP-Link AC750 WiFi Range Extender", category: "Electronics", condition: "Excellent", value: "₹1,000", lookingFor: "Gigabit Switch", description: "Boosts wifi signal range in dead zones." },
  { title: "HDMI Switcher 3-in-1 Out port", category: "Electronics", condition: "Unused", value: "₹400", lookingFor: "DisplayPort cable", description: "Allows sharing one screen between three computer sources." },

  // Furniture (8 items)
  { title: "Ergonomic Office Chair with Mesh Back", category: "Furniture", condition: "Excellent", value: "₹3,500", lookingFor: "Study Table", description: "Padded seats with adjustable armrests and height locking." },
  { title: "Wooden Study Desk / Laptop Table", category: "Furniture", condition: "Good", value: "₹2,000", lookingFor: "Bookshelf cabinet", description: "Sturdy wooden table. Compact footprint, perfect for small apartments." },
  { title: "Aluminium Dual Monitor Arm Stand", category: "Furniture", condition: "Excellent", value: "₹1,800", lookingFor: "Office Desk Lamp", description: "Fully articulatable desktop gas-spring mount for double screens." },
  { title: "Floating Wall Shelf Set of 3", category: "Furniture", condition: "Like New", value: "₹500", lookingFor: "Desk organizer", description: "Wooden wall mounted display shelves. Matte black paint." },
  { title: "Inflatable Lounge Bean Bag Sofa", category: "Furniture", condition: "Good", value: "₹650", lookingFor: "Yoga mat", description: "Extremely comfortable lounge bean bag. Fillings not included." },
  { title: "Foldable Bedside Laptop Table", category: "Furniture", condition: "Like New", value: "₹350", lookingFor: "Laptop stand", description: "Perfect for working or reading in bed. Built-in tablet slot." },
  { title: "Metal Desk Organizer Cabinet", category: "Furniture", condition: "Good", value: "₹450", lookingFor: "Desk accessories", description: "Multi-tier sliding shelf file sorter." },
  { title: "Solid Wood Coffee Table", category: "Furniture", condition: "Excellent", value: "₹1,600", lookingFor: "Floor Rug", description: "Teakwood center table." },

  // Educational Kits (6 items)
  { title: "Arduino UNO Starter Learning Kit", category: "Educational Kits", condition: "Like New", value: "₹1,100", lookingFor: "Raspberry Pi or Tools", description: "Complete package including breadboard, sensors, LEDs and jumper wires." },
  { title: "Raspberry Pi Pico Board Bundle", category: "Educational Kits", condition: "Unused", value: "₹800", lookingFor: "Multimeter tool", description: "Includes header pins, cables and starter booklet for microcontrollers." },
  { title: "LEGO Technic Race Car Construction Kit", category: "Educational Kits", condition: "Excellent", value: "₹1,500", lookingFor: "Board Games", description: "Full brick assembly set. Instruction booklet included." },
  { title: "Chemistry Science Lab Kit", category: "Educational Kits", condition: "Good", value: "₹700", lookingFor: "Physics Prism Set", description: "Includes test tubes, beakers and safety goggles. Perfect for school." },
  { title: "Solar Power Miniature Car Toy Set", category: "Educational Kits", condition: "Like New", value: "₹400", lookingFor: "Arduino parts", description: "Educational kit illustrating solar photovoltaic energy conversion." },
  { title: "DIY Hydraulic Robotic Arm Kit", category: "Educational Kits", condition: "Excellent", value: "₹950", lookingFor: "Science kits", description: "Wooden hydraulic arm model. Teaches pressure and physics." },

  // Collectibles (5 items)
  { title: "Vintage Indian 1-Rupee Coin (1947)", category: "Collectibles", condition: "Excellent", value: "₹1,500", lookingFor: "Rare Stamps", description: "Pure silver Indian rupee minted in 1947. Highly sought collectible." },
  { title: "Spider-Man #100 Vintage Comic Book", category: "Collectibles", condition: "Good", value: "₹2,500", lookingFor: "Action Figures", description: "Vintage Marvel comic. Minor spine creases, but inside pages clean." },
  { title: "Rare Indian Postage Stamp Set (1970)", category: "Collectibles", condition: "Excellent", value: "₹1,200", lookingFor: "Old Banknotes", description: "Historical collection of 10 stamps. Sealed in protection sheets." },
  { title: "Batman Funko Pop Limited Edition", category: "Collectibles", condition: "Like New", value: "₹800", lookingFor: "Iron Man Funko", description: "Mint condition vinyl figure in original box. No scratches." },
  { title: "Pink Floyd Dark Side Vinyl Record", category: "Collectibles", condition: "Excellent", value: "₹3,000", lookingFor: "Beatles Vinyl", description: "Original press. Tested, runs cleanly with zero skips." },

  // Reusable Resources (5 items)
  { title: "Stainless Steel Gym Water Bottle", category: "Reusable Resources", condition: "Excellent", value: "₹400", lookingFor: "Storage Organizers", description: "Double-walled insulated gym flask. Keeps water cold up to 24 hrs." },
  { title: "Fabric Storage Organizer Boxes Set", category: "Reusable Resources", condition: "Like New", value: "₹600", lookingFor: "Wall Hooks", description: "Set of 3 stackable clothes drawers. Collapsible when unused." },
  { title: "Anti-slip Yoga Mat 6mm thick", category: "Reusable Resources", condition: "Good", value: "₹500", lookingFor: "Foam Roller", description: "Tear-resistant eco-friendly mat. Comes with carrying strap." },
  { title: "Hex Dumbbells Set (5kg x 2)", category: "Reusable Resources", condition: "Excellent", value: "₹1,200", lookingFor: "Kettlebell 8kg", description: "Rubber encased hexagonal dumbbells. Floor protection grip." },
  { title: "Resistance Bands Set of 5", category: "Reusable Resources", condition: "Like New", value: "₹300", lookingFor: "Skipping rope", description: "Multi-tension fitness bands with door anchor and foam handles." },

  // Stationery (5 items)
  { title: "Calligraphy Feather Pen Ink Set", category: "Stationery", condition: "Unused", value: "₹600", lookingFor: "Sketchbook", description: "Ornate quill pen, 5 replacement nibs, and gold dust ink jar." },
  { title: "Genuine Leather Daily Journal", category: "Stationery", condition: "Excellent", value: "₹800", lookingFor: "Fountain Pen", description: "Bound writing notebook with unruled vintage parchment pages." },
  { title: "A4 Canvas Artist Sketchbook", category: "Stationery", condition: "Like New", value: "₹350", lookingFor: "Charcoal Pencils", description: "120 sheets of textured high-weight drawing paper." },
  { title: "Acrylic Paint Set 24 Colors", category: "Stationery", condition: "Unused", value: "₹750", lookingFor: "Paintbrushes set", description: "Non-toxic vibrant paint tubes. Excellent coverage." },
  { title: "Professional Drafting Compass Kit", category: "Stationery", condition: "Good", value: "₹500", lookingFor: "T-Square Ruler", description: "Precision geometry set. Comes in hard carry case." },

  // Home Appliances (5 items)
  { title: "Prestige 800W Sandwich Maker", category: "Home Appliances", condition: "Good", value: "₹1,000", lookingFor: "Electric Kettle", description: "Non-stick grill plates. Quick heating, indicator lights." },
  { title: "Kent Stainless Steel Electric Kettle", category: "Home Appliances", condition: "Excellent", value: "₹1,200", lookingFor: "Toaster", description: "1.8L capacity, auto-shut off logic. Boiling within 3 minutes." },
  { title: "Mini Portable Car Refrigerator", category: "Home Appliances", condition: "Excellent", value: "₹2,500", lookingFor: "Air Humidifier", description: "4L thermoelectric cooler and warmer. Fits 6 soda cans." },
  { title: "Philips Hand Blender 250W", category: "Home Appliances", condition: "Good", value: "₹1,400", lookingFor: "Chopper", description: "Stainless steel blade, single trigger operation. Great for soups." },
  { title: "Car Air Purifier with HEPA Filter", category: "Home Appliances", condition: "Like New", value: "₹1,800", lookingFor: "Vacuum Cleaner", description: "Active carbon filter, removes smoke and allergens inside vehicles." },

  // Sports (5 items)
  { title: "Yonex Carbonex Badminton Racket", category: "Sports", condition: "Excellent", value: "₹1,500", lookingFor: "Shuttlecocks tube", description: "Lightweight carbon shaft racket. Balanced tension netting." },
  { title: "Nivia Storm Football Size 5", category: "Sports", condition: "Good", value: "₹600", lookingFor: "Pump", description: "Tough TPU casing. Retains air pressure exceptionally well." },
  { title: "SG Scorer Kashmir Willow Cricket Bat", category: "Sports", condition: "Excellent", value: "₹2,200", lookingFor: "Batting Gloves", description: "Short handle cricket bat. Comes with dynamic protective cover." },
  { title: "Cosco Tennis Racket with Ball Set", category: "Sports", condition: "Good", value: "₹1,300", lookingFor: "Squash Racket", description: "Durable frame, ideal for beginner or recreational practice." },
  { title: "Complete Chess Board Tournament Set", category: "Sports", condition: "Like New", value: "₹500", lookingFor: "Monopoly Game", description: "Weighted tournament pieces with rollable vinyl mat." },

  // Musical Instruments (5 items)
  { title: "Yamaha F280 Acoustic Guitar", category: "Musical Instruments", condition: "Excellent", value: "₹6,500", lookingFor: "Ukulele or Keyboard", description: "Rich tone and playability. Ideal for practice. Comes with strap." },
  { title: "Casio SA-47 Portable Keyboard", category: "Musical Instruments", condition: "Good", value: "₹3,200", lookingFor: "Electric Guitar", description: "32 mini keys, 100 tones, 50 rhythms. Perfect for beginners." },
  { title: "Mahalo Soprano Ukulele Starter Pack", category: "Musical Instruments", condition: "Like New", value: "₹1,800", lookingFor: "Guitar Stand", description: "Vibrant sound, Aquila strings. Includes gig bag and tuner." },
  { title: "Punjs Music Concert Bamboo Flute", category: "Musical Instruments", condition: "Excellent", value: "₹400", lookingFor: "Harmonica", description: "Natural C-scale bansuri flute. Professionally tuned." },
  { title: "Kadence Violin Series Concert Size", category: "Musical Instruments", condition: "Excellent", value: "₹4,500", lookingFor: "Acoustic Guitar", description: "Spruce wood violin. Includes bow, rosin and protective case." },

  // Vehicles & Accessories (7 items)
  { title: "Hercules Roadeo Cycle 21-Speed", category: "Vehicles", condition: "Good", value: "₹8,000", lookingFor: "Electric Scooter", description: "Dual disc brakes, front suspension. Sturdy alloy frame." },
  { title: "Electric Kick Scooter Foldable", category: "Vehicles", condition: "Excellent", value: "₹12,000", lookingFor: "iPad or Laptop", description: "250W motor, 20km range on single charge. Compact folding." },
  { title: "Oxelo adult skateboard mid-500", category: "Vehicles", condition: "Excellent", value: "₹2,800", lookingFor: "Inline Skates", description: "Maple wood deck, aluminium trucks. ABEC-7 bearings." },
  { title: "Wildhorn Leather Wallet for Men", category: "Accessories", condition: "Unused", value: "₹600", lookingFor: "Leather Belt", description: "Genuine hunter leather wallet. Multiple card slots, coin pocket." },
  { title: "Ray-Ban Aviator Sunglasses Case", category: "Accessories", condition: "Good", value: "₹400", lookingFor: "Lens Cleaning Kit", description: "Protective leather case for aviator sunglasses." },
  { title: "American Tourister Laptop Backpack", category: "Accessories", condition: "Excellent", value: "₹1,500", lookingFor: "Messenger Bag", description: "3 main compartments, padded laptop sleeve. Water resistant fabric." },
  { title: "Leather Key Organizer Holder", category: "Accessories", condition: "Like New", value: "₹300", lookingFor: "Keyring", description: "Stores up to 8 keys in a compact silent leather fold." }
];

export async function seedDatabase() {
  try {
    const listingsCount = await Listing.countDocuments();
    if (listingsCount > 0) {
      console.log("✓  Database already populated, skipping main seeding.");
      return;
    }

    console.log(" Seeding default users and profiles...");
    const passwordHash = await User.hashPassword("Demo123!");
    const createdUsers = [];

    for (let userIdx = 0; userIdx < INDIAN_NAMES.length; userIdx++) {
      const s = INDIAN_NAMES[userIdx];
      const email = `${s.toLowerCase().replace(/\s+/g, ".")}@relay.demo`;
      const color = AVATAR_COLORS[userIdx % AVATAR_COLORS.length];
      const seedUserKey = `demo-user-${userIdx}`;

      let user = await User.findOne({ email });
      let profile;

      if (!user) {
        user = await User.create({
          email,
          passwordHash,
          provider: "email",
          role: "user",
          isEmailVerified: true,
          isSeedUser: true,
          seedUserKey,
          lastSeenAt: new Date()
        });

        const initials = getInitials(s);

        profile = await Profile.create({
          userId: user._id,
          displayName: s,
          avatarInitials: initials,
          avatarColor: color,
          city: CITIES[userIdx % CITIES.length].name,
          location: CITIES[userIdx % CITIES.length].name,
          latitude: DEFAULT_CENTER.lat,
          longitude: DEFAULT_CENTER.lng,
          trustScore: 90 + (userIdx % 11),
          successfulTrades: 10 + (userIdx * 3),
          successRate: "100%",
          responseTime: "5 min",
          memberSince: "Jan 2024"
        });
      } else {
        profile = await Profile.findOne({ userId: user._id });
        if (!user.seedUserKey) {
          user.seedUserKey = seedUserKey;
          await user.save();
        }
      }

      createdUsers.push({ 
        user, 
        profile: profile || { 
          displayName: s, 
          avatarInitials: getInitials(s), 
          avatarColor: color, 
          memberSince: "Jan 2024", 
          successfulTrades: 10, 
          responseTime: "5 min" 
        } 
      });
    }

    console.log(`✓  Seeded ${createdUsers.length} users & profiles.`);

    // Seed 90 Listings
    console.log(" Seeding 90 listings...");
    const createdListings = [];

    for (let i = 0; i < LISTING_TEMPLATES.length; i++) {
      const template = LISTING_TEMPLATES[i];
      const isScooterListing = template.title.includes("Electric Kick Scooter");
      const ownerIndex = isScooterListing ? 4 : (i % createdUsers.length);
      const owner = createdUsers[ownerIndex];
      const cityObj = CITIES[i % CITIES.length];
      const coords = getOffsetCoords(cityObj, i);

      let status = "Ready to Negotiate";
      if (i % 8 === 2) status = "Urgent Trade";
      if (i % 8 === 5) status = "Instant Trade";

      const rating = Number((4.5 + ((i * 7) % 5) * 0.1).toFixed(1));
      const distance = Number((0.2 + ((i * 11) % 25) * 0.1).toFixed(1));

      const listing = await Listing.create({
        userId: owner.user._id,
        title: template.title,
        description: template.description,
        category: template.category,
        condition: template.condition,
        value: template.value,
        lookingFor: template.lookingFor,
        ownerProfile: {
          initials: owner.profile.avatarInitials,
          avatarColor: owner.profile.avatarColor,
          joinedSince: owner.profile.memberSince,
          completedTrades: owner.profile.successfulTrades,
          responseTime: owner.profile.responseTime,
          tradeHistory: `${owner.profile.successfulTrades} successful relays`,
          name: owner.profile.displayName
        },
        ownerName: owner.profile.displayName,
        latitude: coords.lat,
        longitude: coords.lng,
        city: cityObj.name,
        distance: `${distance} km`,
        rating,
        verified: true,
        isTrending: i % 5 === 0,
        status,
        isAuctionEligible: i % 4.5 === 0,
        viewCount: Math.floor(Math.random() * 120) + 12
      });

      createdListings.push(listing);
    }
    console.log(`✓  Seeded ${createdListings.length} listings across Vizag neighborhoods (MVP Colony, Rushikonda, RK Beach, Madhurawada, and more).`);

    // Seed 20 active countdown auctions
    console.log(" Seeding 20 active auctions...");
    const auctionEligible = createdListings.filter((l) => l.isAuctionEligible).slice(0, 20);

    for (let j = 0; j < auctionEligible.length; j++) {
      const listing = auctionEligible[j];
      const startingBid = Math.floor(parseFloat(listing.value.replace(/[^0-9]/g, "")) * 0.6) || 200;
      const highestBid = startingBid + (j * 150) + 100;

      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + (j % 3) + 1);

      await Auction.create({
        listingId: listing._id,
        ownerId: listing.userId,
        ownerName: listing.ownerName,
        ownerInitials: listing.ownerProfile.initials || "RU",
        ownerColor: listing.ownerProfile.avatarColor,
        resourceName: listing.title,
        category: listing.category,
        condition: listing.condition,
        estimatedValue: listing.value,
        status: "active",
        startingBid,
        highestBid,
        suggestedBid: highestBid + 100,
        reservePrice: startingBid * 1.5,
        endsAt,
        distance: listing.distance,
        verified: true,
        aiVerified: true,
        daysListed: Math.floor(Math.random() * 4) + 1,
        popularity: j % 3 === 0 ? "High" : "Moderate"
      });
    }
    console.log("✓  Seeded 20 active countdown auctions.");

  } catch (error) {
    console.error("✗  Failed to seed database:", error);
  }
}

// Seeds 40 personalized requests and 25 notifications for a specific user ID
export async function seedUserDataForUser(userId) {
  try {
    const existingSessionsCount = await ExchangeSession.countDocuments({
      $or: [{ initiatorId: userId }, { receiverId: userId }]
    });

    if (existingSessionsCount > 0) return; 

    console.log(` Seeding SIH trade requests and notifications for user: ${userId}`);

    const seedUsers = await User.find({ email: { $in: INDIAN_NAMES.map((n) => `${n.toLowerCase().replace(/\s+/g, ".")}@relay.demo`) } });
    const seedProfiles = await Profile.find({ userId: { $in: seedUsers.map((u) => u._id) } });
    const seedListings = await Listing.find({ userId: { $in: seedUsers.map((u) => u._id) } });

    if (seedUsers.length === 0 || seedListings.length === 0) return;

    // A. Seed 10 Conversations (negotiation_active)
    for (let cIdx = 0; cIdx < 10; cIdx++) {
      const listing = seedListings[cIdx % seedListings.length];
      const otherUser = seedUsers.find((u) => u._id.toString() === listing.userId.toString());
      if (!otherUser) continue;

      const session = await ExchangeSession.create({
        listingId: listing._id,
        initiatorId: userId,
        receiverId: otherUser._id,
        status: "negotiation_active",
        offeredItems: [{
          listingId: "seed-offered-item-" + cIdx,
          title: listing.lookingFor || "Swap Item Offered",
          value: listing.value,
          condition: "Excellent"
        }],
        offeredValue: listing.value,
        requestedValue: listing.value,
        meetingLocation: "Madhurawada Crossroads, Visakhapatnam",
        meetingTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      // Add messages
      await Message.create([
        { sessionId: session._id, senderId: otherUser._id, text: `Hi! I saw your request for my "${listing.title}". I am ready to negotiate.` },
        { sessionId: session._id, senderId: userId, text: `Awesome! Where can we meet up?` },
        { sessionId: session._id, senderId: otherUser._id, text: `Central Plaza Tech Park Gate works for me.` }
      ]);
    }

    // B. Seed 15 Completed Trades
    for (let compIdx = 0; compIdx < 15; compIdx++) {
      const listing = seedListings[(compIdx + 10) % seedListings.length];
      const otherUser = seedUsers.find((u) => u._id.toString() === listing.userId.toString());
      if (!otherUser) continue;

      await ExchangeSession.create({
        listingId: listing._id,
        initiatorId: otherUser._id,
        receiverId: userId,
        status: "completed",
        offeredValue: listing.value,
        requestedValue: listing.value,
        completedAt: new Date(Date.now() - (compIdx + 1) * 24 * 60 * 60 * 1000)
      });
    }

    // C. Seed 10 Pending Requests (Incoming: 5, Outgoing: 5)
    for (let pendIdx = 0; pendIdx < 10; pendIdx++) {
      const listing = seedListings[(pendIdx + 25) % seedListings.length];
      const otherUser = seedUsers.find((u) => u._id.toString() === listing.userId.toString());
      if (!otherUser) continue;

      const isIncoming = pendIdx < 5;

      await ExchangeSession.create({
        listingId: listing._id,
        initiatorId: isIncoming ? otherUser._id : userId,
        receiverId: isIncoming ? userId : otherUser._id,
        status: "pending",
        offeredValue: listing.value,
        requestedValue: listing.value
      });
    }

    // D. Seed 5 Declined Requests
    for (let decIdx = 0; decIdx < 5; decIdx++) {
      const listing = seedListings[(decIdx + 35) % seedListings.length];
      const otherUser = seedUsers.find((u) => u._id.toString() === listing.userId.toString());
      if (!otherUser) continue;

      await ExchangeSession.create({
        listingId: listing._id,
        initiatorId: otherUser._id,
        receiverId: userId,
        status: "declined",
        offeredValue: listing.value,
        requestedValue: listing.value
      });
    }

    // E. Seed exactly 25 Notifications
    const notifTemplates = Array.from({ length: 25 }).map((_, idx) => {
      const sender = seedProfiles[idx % seedProfiles.length];
      const items = ["Atomic Habits", "Bosch Power Drill", "Keychron Keyboard", "Leather Journal", "Electric Kettle"];
      const item = items[idx % items.length];

      return {
        title: idx % 3 === 0 ? "New Trade Request" : idx % 3 === 1 ? "Relay Match Found" : "Bid Outbid Alert",
        message: idx % 3 === 0 
          ? `${sender?.displayName || "Someone"} offered a swap deal for your ${item}.` 
          : idx % 3 === 1 
            ? `Your ${item} matches ${sender?.displayName || "Someone"}'s request!` 
            : `Someone placed a higher bid on ${item} auction.`,
        type: idx % 3 === 0 ? "request" : idx % 3 === 1 ? "match" : "outbid",
        unread: idx < 6
      };
    });

    await Notification.create(notifTemplates.map((t) => ({
      userId,
      title: t.title,
      message: t.message,
      type: t.type,
      unread: t.unread
    })));

    console.log(`✓  Successfully populated 40 trade sessions and 25 notifications for user ${userId}.`);

  } catch (err) {
    console.error("✗  Failed to seed custom user sessions:", err);
  }
}
