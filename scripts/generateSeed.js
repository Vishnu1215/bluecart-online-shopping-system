import fs from 'fs';
import path from 'path';

// Hashes for: Customer@123, Vendor@123, Admin@123
const customerHash = '$2a$10$.kERxIBR2HyCyGPDqKeDludbFRa6mC90ijSDLuq8/A1ZEy1KWvA0y';
const vendorHash = '$2a$10$BgJKOKs/QQDI5W2CO4OSdevY5m4c4Xfvv2CiOXW/rDXCSq5T4CjMq';
const adminHash = '$2a$10$327SAI.vpj9f.tRWevZHzuHJdSCq3/UCteHSDOHGlPsLAbmCedDba';

const vendors = [
  {
    id: 'vnd_techwest',
    name: 'TechWest Retail',
    contactEmail: 'vendor@techwest.example',
    phone: '+91 98450 11223',
    status: 'Approved',
    commissionRate: 10,
    description: 'Premier electronics and personal audio distributor in Western India.',
    createdAt: '2025-01-15T08:00:00.000Z'
  },
  {
    id: 'vnd_digimart',
    name: 'DigiMart',
    contactEmail: 'sales@digimart.example',
    phone: '+91 98200 44556',
    status: 'Approved',
    commissionRate: 12,
    description: 'Certified national partner for personal computing and digital accessories.',
    createdAt: '2025-02-01T10:30:00.000Z'
  },
  {
    id: 'vnd_urbanstride',
    name: 'UrbanStride',
    contactEmail: 'contact@urbanstride.example',
    phone: '+91 97110 77889',
    status: 'Approved',
    commissionRate: 15,
    description: 'Athletic footwear, lifestyle gear and ergonomic apparel supplier.',
    createdAt: '2025-03-10T14:15:00.000Z'
  },
  {
    id: 'vnd_apex',
    name: 'Apex Electronics',
    contactEmail: 'onboarding@apex.example',
    phone: '+91 99880 33445',
    status: 'Pending',
    commissionRate: 10,
    description: 'Specialist distributor of professional optics, drones and cinema gear.',
    createdAt: '2026-03-25T11:00:00.000Z'
  }
];

const users = [
  {
    id: 'usr_ananya',
    name: 'Ananya Rao',
    email: 'ananya.rao@example.com',
    mobile: '+91 98765 43210',
    passwordHash: customerHash,
    role: 'customer',
    status: 'Active',
    failedAttempts: 0,
    lockUntil: null,
    createdAt: '2025-06-12T09:00:00.000Z',
    avatar: 'AR',
    savedAddresses: [
      {
        id: 'addr_ananya_1',
        name: 'Ananya Rao',
        phone: '+91 98765 43210',
        street: 'Plot 42, Road No. 7, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        isDefault: true
      },
      {
        id: 'addr_ananya_2',
        name: 'Ananya Rao (Office)',
        phone: '+91 98765 43210',
        street: 'Cyber Gateway, 4th Floor, Hitec City',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500081',
        isDefault: false
      }
    ],
    preferences: {
      orderNotifications: true,
      shippingNotifications: true
    }
  },
  {
    id: 'usr_vendor_techwest',
    name: 'Vikram Malhotra',
    email: 'vendor@techwest.example',
    mobile: '+91 98450 11223',
    passwordHash: vendorHash,
    role: 'vendor',
    status: 'Active',
    failedAttempts: 0,
    lockUntil: null,
    vendorId: 'vnd_techwest',
    createdAt: '2025-01-15T08:30:00.000Z',
    avatar: 'VM'
  },
  {
    id: 'usr_admin',
    name: 'Rajesh Kumar',
    email: 'admin@shop.example',
    mobile: '+91 98111 22334',
    passwordHash: adminHash,
    role: 'admin',
    status: 'Active',
    failedAttempts: 0,
    lockUntil: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    avatar: 'RK'
  },
  {
    id: 'usr_sana',
    name: 'Sana Khan',
    email: 'sana.khan@example.com',
    mobile: '+91 98990 12345',
    passwordHash: customerHash,
    role: 'customer',
    status: 'Locked',
    failedAttempts: 5,
    lockUntil: Date.now() + 14 * 60 * 1000,
    createdAt: '2025-08-20T11:00:00.000Z',
    avatar: 'SK'
  },
  {
    id: 'usr_dev',
    name: 'Dev Patel',
    email: 'dev.patel@example.com',
    mobile: '+91 98700 98765',
    passwordHash: customerHash,
    role: 'customer',
    status: 'Suspended',
    failedAttempts: 0,
    lockUntil: null,
    createdAt: '2025-07-14T16:20:00.000Z',
    avatar: 'DP'
  },
  {
    id: 'usr_rahul',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    mobile: '+91 98234 56789',
    passwordHash: customerHash,
    role: 'customer',
    status: 'Active',
    failedAttempts: 0,
    lockUntil: null,
    createdAt: '2025-09-05T12:00:00.000Z',
    avatar: 'RV',
    savedAddresses: [
      {
        id: 'addr_rahul_1',
        name: 'Rahul Verma',
        phone: '+91 98234 56789',
        street: 'Flat 302, Palm Heights, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        isDefault: true
      }
    ]
  },
  {
    id: 'usr_meera',
    name: 'Meera Iyer',
    email: 'meera.iyer@example.com',
    mobile: '+91 98333 44556',
    passwordHash: customerHash,
    role: 'customer',
    status: 'Active',
    failedAttempts: 0,
    lockUntil: null,
    createdAt: '2025-10-10T10:00:00.000Z',
    avatar: 'MI',
    savedAddresses: [
      {
        id: 'addr_meera_1',
        name: 'Meera Iyer',
        phone: '+91 98333 44556',
        street: '12 Alwarpet Main Road',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600018',
        isDefault: true
      }
    ]
  },
  {
    id: 'usr_karthik',
    name: 'Karthik S.',
    email: 'karthik.s@example.com',
    mobile: '+91 98401 23456',
    passwordHash: customerHash,
    role: 'customer',
    status: 'Active',
    failedAttempts: 0,
    lockUntil: null,
    createdAt: '2025-11-01T15:00:00.000Z',
    avatar: 'KS'
  },
  {
    id: 'usr_vikram',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    mobile: '+91 98102 34567',
    passwordHash: customerHash,
    role: 'customer',
    status: 'Active',
    failedAttempts: 0,
    lockUntil: null,
    createdAt: '2025-11-20T17:00:00.000Z',
    avatar: 'VS'
  },
  {
    id: 'usr_priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    mobile: '+91 98670 12345',
    passwordHash: customerHash,
    role: 'customer',
    status: 'Active',
    failedAttempts: 0,
    lockUntil: null,
    createdAt: '2025-12-05T09:30:00.000Z',
    avatar: 'PS'
  },
  {
    id: 'usr_amit',
    name: 'Amit Shah',
    email: 'amit.shah@example.com',
    mobile: '+91 98250 67890',
    passwordHash: customerHash,
    role: 'customer',
    status: 'Active',
    failedAttempts: 0,
    lockUntil: null,
    createdAt: '2026-01-10T14:40:00.000Z',
    avatar: 'AS'
  },
  {
    id: 'usr_neha',
    name: 'Neha Gupta',
    email: 'neha.gupta@example.com',
    mobile: '+91 98115 54321',
    passwordHash: customerHash,
    role: 'customer',
    status: 'Active',
    failedAttempts: 0,
    lockUntil: null,
    createdAt: '2026-01-22T11:15:00.000Z',
    avatar: 'NG'
  },
  {
    id: 'usr_rohan',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    mobile: '+91 98205 99887',
    passwordHash: customerHash,
    role: 'customer',
    status: 'Active',
    failedAttempts: 0,
    lockUntil: null,
    createdAt: '2026-02-14T13:00:00.000Z',
    avatar: 'RM'
  },
  {
    id: 'usr_pooja',
    name: 'Pooja Nair',
    email: 'pooja.nair@example.com',
    mobile: '+91 98471 22334',
    passwordHash: customerHash,
    role: 'customer',
    status: 'Active',
    failedAttempts: 0,
    lockUntil: null,
    createdAt: '2026-03-01T16:00:00.000Z',
    avatar: 'PN'
  }
];

const products = [
  // 1. Audio
  {
    id: 'prd_aurora',
    sku: 'AUD-0001',
    vendorId: 'vnd_techwest',
    vendorName: 'TechWest Retail',
    name: 'Aurora Wireless Headphones',
    description: 'High-fidelity active noise-cancelling wireless headphones with 40mm titanium drivers and 40-hour battery life.',
    category: 'Audio',
    brand: 'Aura',
    price: 3499,
    mrp: 4999,
    discountPercent: 30,
    stockQty: 64,
    images: ['headphones-1', 'headphones-2', 'headphones-3', 'headphones-4'],
    isActive: true,
    avgRating: 4.5,
    reviewCount: 1284,
    specifications: {
      'Driver Size': '40mm Titanium',
      'Battery Life': '40 Hours ANC Off, 30 Hours ANC On',
      'Connectivity': 'Bluetooth 5.3, 3.5mm Aux',
      'Charging': 'USB-C Fast Charging (10m = 5h)',
      'Weight': '250g'
    },
    features: [
      'Hybrid Active Noise Cancellation with Transparency mode',
      'Multipoint pairing for switching between laptop and phone',
      'Plush memory foam ear cushions for all-day comfort',
      'Low-latency game mode for video and gaming'
    ]
  },
  {
    id: 'prd_sonic_pulse',
    sku: 'AUD-0002',
    vendorId: 'vnd_techwest',
    vendorName: 'TechWest Retail',
    name: 'SonicPulse TWS Earbuds',
    description: 'True wireless stereo earbuds with spatial audio and IPX5 sweat resistance for active workouts.',
    category: 'Audio',
    brand: 'SonicWave',
    price: 1999,
    mrp: 2999,
    discountPercent: 33,
    stockQty: 85,
    images: ['earbuds-1', 'earbuds-2', 'earbuds-3', 'earbuds-4'],
    isActive: true,
    avgRating: 4.2,
    reviewCount: 420
  },
  {
    id: 'prd_boombox_mini',
    sku: 'AUD-0003',
    vendorId: 'vnd_techwest',
    vendorName: 'TechWest Retail',
    name: 'BoomBox Mini Portable Speaker',
    description: 'Rugged waterproof Bluetooth 5.3 speaker with 360-degree surround bass and 16 hours of continuous play.',
    category: 'Audio',
    brand: 'SonicWave',
    price: 2499,
    mrp: 3499,
    discountPercent: 28,
    stockQty: 18, // low stock
    images: ['speaker-1', 'speaker-2', 'speaker-3', 'speaker-4'],
    isActive: true,
    avgRating: 4.4,
    reviewCount: 156
  },
  {
    id: 'prd_studio_pro',
    sku: 'AUD-0004',
    vendorId: 'vnd_techwest',
    vendorName: 'TechWest Retail',
    name: 'StudioPro Wired Monitoring Headphones',
    description: 'Reference studio monitor headphones tuned for audio engineers and music producers.',
    category: 'Audio',
    brand: 'Zenith',
    price: 4999,
    mrp: 6999,
    discountPercent: 28,
    stockQty: 5, // low stock
    images: ['studio-1', 'studio-2', 'studio-3', 'studio-4'],
    isActive: true,
    avgRating: 4.7,
    reviewCount: 92
  },
  {
    id: 'prd_soundbar_300',
    sku: 'AUD-0005',
    vendorId: 'vnd_digimart',
    vendorName: 'DigiMart',
    name: 'CinemaSound 2.1 Soundbar with Subwoofer',
    description: '120W Dolby Atmos soundbar delivering room-filling cinematic acoustics for your living room.',
    category: 'Audio',
    brand: 'SonicWave',
    price: 7999,
    mrp: 11999,
    discountPercent: 33,
    stockQty: 12, // low stock
    images: ['soundbar-1', 'soundbar-2', 'soundbar-3', 'soundbar-4'],
    isActive: true,
    avgRating: 4.3,
    reviewCount: 114
  },
  {
    id: 'prd_vocal_mic',
    sku: 'AUD-0006',
    vendorId: 'vnd_digimart',
    vendorName: 'DigiMart',
    name: 'StreamCast USB Condenser Microphone',
    description: 'Cardioid studio recording microphone with pop filter and zero-latency headphone monitoring.',
    category: 'Audio',
    brand: 'Zenith',
    price: 3299,
    mrp: 4500,
    discountPercent: 26,
    stockQty: 0, // out of stock
    images: ['mic-1', 'mic-2', 'mic-3', 'mic-4'],
    isActive: true,
    avgRating: 4.6,
    reviewCount: 88
  },

  // 2. Wearables
  {
    id: 'prd_pulsefit',
    sku: 'WRB-0014',
    vendorId: 'vnd_techwest',
    vendorName: 'TechWest Retail',
    name: 'PulseFit Smart Watch',
    description: 'Advanced fitness smartwatch with 1.43-inch AMOLED display, SpO2 sensor, continuous heart rate and GPS.',
    category: 'Wearables',
    brand: 'Pulse',
    price: 5999,
    mrp: 8999,
    discountPercent: 33,
    stockQty: 38, // below threshold
    images: ['smartwatch-1', 'smartwatch-2', 'smartwatch-3', 'smartwatch-4'],
    isActive: true,
    avgRating: 4.3,
    reviewCount: 512,
    specifications: {
      'Display': '1.43-inch AMOLED 466x466 Always-On',
      'Battery': 'Up to 14 Days Typical Usage',
      'Sensors': 'Optical Heart Rate, SpO2, Accelerometer, Barometer',
      'Water Resistance': '5 ATM (50m Swimproof)',
      'Connectivity': 'Bluetooth 5.2, GPS / GLONASS'
    }
  },
  {
    id: 'prd_pulseband_hr',
    sku: 'WRB-0015',
    vendorId: 'vnd_techwest',
    vendorName: 'TechWest Retail',
    name: 'PulseFit Band 7 Activity Tracker',
    description: 'Slim lightweight fitness band with sleep stages tracking, 110+ sports modes and magnetic charging.',
    category: 'Wearables',
    brand: 'Pulse',
    price: 2199,
    mrp: 3499,
    discountPercent: 37,
    stockQty: 110,
    images: ['fitband-1', 'fitband-2', 'fitband-3', 'fitband-4'],
    isActive: true,
    avgRating: 4.1,
    reviewCount: 340
  },
  {
    id: 'prd_smartring_aura',
    sku: 'WRB-0016',
    vendorId: 'vnd_techwest',
    vendorName: 'TechWest Retail',
    name: 'Aura Smart Health Ring Gen 2',
    description: 'Titanium bio-sensing smart ring tracking recovery scores, skin temperature and nocturnal vitals.',
    category: 'Wearables',
    brand: 'Aura',
    price: 12999,
    mrp: 16999,
    discountPercent: 23,
    stockQty: 15, // low stock
    images: ['ring-1', 'ring-2', 'ring-3', 'ring-4'],
    isActive: true,
    avgRating: 4.5,
    reviewCount: 78
  },
  {
    id: 'prd_chronos_classic',
    sku: 'WRB-0017',
    vendorId: 'vnd_urbanstride',
    vendorName: 'UrbanStride',
    name: 'Chronos Hybrid Luxury Watch',
    description: 'Classic analogue dial with hidden OLED notifications and sapphire crystal glass.',
    category: 'Wearables',
    brand: 'Zenith',
    price: 8499,
    mrp: 12000,
    discountPercent: 29,
    stockQty: 24, // low stock
    images: ['hybrid-1', 'hybrid-2', 'hybrid-3', 'hybrid-4'],
    isActive: true,
    avgRating: 4.4,
    reviewCount: 62
  },
  {
    id: 'prd_kids_gps_watch',
    sku: 'WRB-0018',
    vendorId: 'vnd_digimart',
    vendorName: 'DigiMart',
    name: 'SafeTrack Kids GPS Smartwatch',
    description: 'Cellular 4G calling, SOS emergency button and live geofencing alerts for child safety.',
    category: 'Wearables',
    brand: 'Pulse',
    price: 3499,
    mrp: 4999,
    discountPercent: 30,
    stockQty: 42,
    images: ['kidwatch-1', 'kidwatch-2', 'kidwatch-3', 'kidwatch-4'],
    isActive: true,
    avgRating: 4.0,
    reviewCount: 89
  },

  // 3. Footwear
  {
    id: 'prd_stridex',
    sku: 'FTW-0107',
    vendorId: 'vnd_urbanstride',
    vendorName: 'UrbanStride',
    name: 'StrideX Running Shoes',
    description: 'Ergonomic engineered-mesh performance road running shoes with carbon-infused midsole cushioning.',
    category: 'Footwear',
    brand: 'Stride',
    price: 2799,
    mrp: 4499,
    discountPercent: 37,
    stockQty: 120,
    images: ['runshoes-1', 'runshoes-2', 'runshoes-3', 'runshoes-4'],
    isActive: true,
    avgRating: 4.4,
    reviewCount: 310,
    specifications: {
      'Upper Material': 'Breathable Engineered Knit',
      'Midsole': 'CloudCush Carbon-Infused EVA',
      'Outsole': 'High-Traction Rubber',
      'Closure': 'Lace-Up',
      'Weight': '235g (Size 9)'
    }
  },
  {
    id: 'prd_urban_sneakers',
    sku: 'FTW-0108',
    vendorId: 'vnd_urbanstride',
    vendorName: 'UrbanStride',
    name: 'UrbanStride Casual Court Sneakers',
    description: 'Minimalist premium vegan leather street sneakers with memory foam insoles for everyday wear.',
    category: 'Footwear',
    brand: 'Stride',
    price: 1899,
    mrp: 2999,
    discountPercent: 36,
    stockQty: 65,
    images: ['sneakers-1', 'sneakers-2', 'sneakers-3', 'sneakers-4'],
    isActive: true,
    avgRating: 4.2,
    reviewCount: 195
  },
  {
    id: 'prd_trail_blazer_boots',
    sku: 'FTW-0109',
    vendorId: 'vnd_urbanstride',
    vendorName: 'UrbanStride',
    name: 'TrailBlazer Waterproof Hiking Boots',
    description: 'All-weather mid-cut trekking boots with reinforced toe bumper and Vibram lug outsole.',
    category: 'Footwear',
    brand: 'Trekker',
    price: 3999,
    mrp: 5999,
    discountPercent: 33,
    stockQty: 32, // below threshold
    images: ['boots-1', 'boots-2', 'boots-3', 'boots-4'],
    isActive: true,
    avgRating: 4.6,
    reviewCount: 142
  },
  {
    id: 'prd_aero_slides',
    sku: 'FTW-0110',
    vendorId: 'vnd_urbanstride',
    vendorName: 'UrbanStride',
    name: 'AeroSlide Recovery Foam Sandals',
    description: 'Thick recovery slides designed for post-marathon foot fatigue and arch support.',
    category: 'Footwear',
    brand: 'Stride',
    price: 899,
    mrp: 1499,
    discountPercent: 40,
    stockQty: 85,
    images: ['slides-1', 'slides-2', 'slides-3', 'slides-4'],
    isActive: true,
    avgRating: 4.1,
    reviewCount: 220
  },
  {
    id: 'prd_stride_training',
    sku: 'FTW-0111',
    vendorId: 'vnd_urbanstride',
    vendorName: 'UrbanStride',
    name: 'Apex Trainer Cross-Training Shoes',
    description: 'Flat wide base gym shoes for heavy deadlifts, HIIT workouts and agility sprints.',
    category: 'Footwear',
    brand: 'Stride',
    price: 3299,
    mrp: 4799,
    discountPercent: 31,
    stockQty: 0, // out of stock
    images: ['gymshoes-1', 'gymshoes-2', 'gymshoes-3', 'gymshoes-4'],
    isActive: true,
    avgRating: 4.5,
    reviewCount: 75
  },

  // 4. Mobiles
  {
    id: 'prd_nova_5g',
    sku: 'MOB-0032',
    vendorId: 'vnd_digimart',
    vendorName: 'DigiMart',
    name: 'Nova 5G Smartphone 128GB',
    description: 'Flagship killer with Dimensity 8200 chipset, 6.7-inch 120Hz Super AMOLED, and 67W Turbo FlashCharge.',
    category: 'Mobiles',
    brand: 'Nexa',
    price: 17999,
    mrp: 22999,
    discountPercent: 21,
    stockQty: 22, // below threshold
    images: ['phone-1', 'phone-2', 'phone-3', 'phone-4'],
    isActive: true,
    avgRating: 4.4,
    reviewCount: 680,
    specifications: {
      'Processor': 'MediaTek Dimensity 8200 4nm',
      'RAM / Storage': '8GB LPDDR5 / 128GB UFS 3.1',
      'Display': '6.7\" FHD+ 120Hz AMOLED HDR10+',
      'Rear Camera': '64MP OIS + 8MP Ultra-Wide + 2MP Macro',
      'Battery': '5000mAh with 67W Fast Charger in box'
    }
  },
  {
    id: 'prd_nova_pro_256',
    sku: 'MOB-0033',
    vendorId: 'vnd_digimart',
    vendorName: 'DigiMart',
    name: 'Nova Pro Max 5G 256GB',
    description: 'Pro grade smartphone with 108MP Periscope optical zoom camera and Snapdragon 8 Gen 2 powerhouse.',
    category: 'Mobiles',
    brand: 'Nexa',
    price: 29999,
    mrp: 36999,
    discountPercent: 18,
    stockQty: 14, // low stock
    images: ['phonepro-1', 'phonepro-2', 'phonepro-3', 'phonepro-4'],
    isActive: true,
    avgRating: 4.7,
    reviewCount: 315
  },
  {
    id: 'prd_volt_flip',
    sku: 'MOB-0034',
    vendorId: 'vnd_digimart',
    vendorName: 'DigiMart',
    name: 'UrbanVolt Flip Foldable Smartphone',
    description: 'Next-gen compact clamshell foldable with zero-gap titanium hinge and dual OLED displays.',
    category: 'Mobiles',
    brand: 'UrbanVolt',
    price: 49999,
    mrp: 64999,
    discountPercent: 23,
    stockQty: 9, // low stock
    images: ['flip-1', 'flip-2', 'flip-3', 'flip-4'],
    isActive: true,
    avgRating: 4.5,
    reviewCount: 84
  },
  {
    id: 'prd_lite_budget_phone',
    sku: 'MOB-0035',
    vendorId: 'vnd_digimart',
    vendorName: 'DigiMart',
    name: 'Nexa Lite 4G Smartphone 64GB',
    description: 'Affordable daily driver smartphone with massive 6000mAh battery and stereo speakers.',
    category: 'Mobiles',
    brand: 'Nexa',
    price: 7499,
    mrp: 9999,
    discountPercent: 25,
    stockQty: 140,
    images: ['phonelite-1', 'phonelite-2', 'phonelite-3', 'phonelite-4'],
    isActive: true,
    avgRating: 4.0,
    reviewCount: 410
  },
  {
    id: 'prd_fast_charger_65w',
    sku: 'MOB-0036',
    vendorId: 'vnd_techwest',
    vendorName: 'TechWest Retail',
    name: 'VoltSpeed GaN 65W Fast Charger',
    description: 'Ultra-compact Gallium Nitride triple-port wall charger supporting USB-PD 3.0 and PPS.',
    category: 'Mobiles',
    brand: 'UrbanVolt',
    price: 1499,
    mrp: 2299,
    discountPercent: 34,
    stockQty: 95,
    images: ['charger-1', 'charger-2', 'charger-3', 'charger-4'],
    isActive: true,
    avgRating: 4.6,
    reviewCount: 320
  },
  {
    id: 'prd_wireless_dock',
    sku: 'MOB-0037',
    vendorId: 'vnd_techwest',
    vendorName: 'TechWest Retail',
    name: 'MagStand 3-in-1 Wireless Charging Station',
    description: 'Magnetic desktop stand that fast-charges iPhone/Android phone, watch and wireless earbuds together.',
    category: 'Mobiles',
    brand: 'UrbanVolt',
    price: 2699,
    mrp: 3999,
    discountPercent: 32,
    stockQty: 54,
    images: ['magdock-1', 'magdock-2', 'magdock-3', 'magdock-4'],
    isActive: true,
    avgRating: 4.3,
    reviewCount: 160
  },

  // 5. Computers
  {
    id: 'prd_aerobook_14',
    sku: 'CMP-0008',
    vendorId: 'vnd_digimart',
    vendorName: 'DigiMart',
    name: 'AeroBook 14 Laptop',
    description: 'Ultra-thin aluminum 1.2kg ultrabook with Intel Core i7 13th Gen, 16GB LPDDR5, 512GB NVMe SSD and 100% sRGB display.',
    category: 'Computers',
    brand: 'AeroTech',
    price: 52990,
    mrp: 67990,
    discountPercent: 22,
    stockQty: 8, // low stock
    images: ['laptop-1', 'laptop-2', 'laptop-3', 'laptop-4'],
    isActive: true,
    avgRating: 4.6,
    reviewCount: 194,
    specifications: {
      'CPU': 'Intel Core i7-1360P (12 Cores, up to 5.0GHz)',
      'Memory': '16GB LPDDR5 5200MHz',
      'Storage': '512GB PCIe 4.0 NVMe M.2 SSD',
      'Screen': '14.0\" 2.8K OLED (2880 x 1800), 90Hz',
      'Battery': '70Wh Li-Ion, 65W USB-C PD Charging'
    }
  },
  {
    id: 'prd_aerobook_pro_16',
    sku: 'CMP-0009',
    vendorId: 'vnd_digimart',
    vendorName: 'DigiMart',
    name: 'AeroBook Pro 16 Studio Laptop',
    description: 'Workstation laptop powered by Ryzen 9 7940HS and NVIDIA RTX 4060 graphics with 32GB RAM.',
    category: 'Computers',
    brand: 'AeroTech',
    price: 94990,
    mrp: 119900,
    discountPercent: 20,
    stockQty: 4, // low stock
    images: ['workstation-1', 'workstation-2', 'workstation-3', 'workstation-4'],
    isActive: true,
    avgRating: 4.8,
    reviewCount: 68
  },
  {
    id: 'prd_mech_keyboard',
    sku: 'CMP-0010',
    vendorId: 'vnd_techwest',
    vendorName: 'TechWest Retail',
    name: 'KeyCraft 75% Mechanical Keyboard',
    description: 'Hot-swappable tactile RGB wireless mechanical keyboard with aluminum frame and PBT keycaps.',
    category: 'Computers',
    brand: 'Zenith',
    price: 4499,
    mrp: 6200,
    discountPercent: 27,
    stockQty: 35, // below threshold
    images: ['keyboard-1', 'keyboard-2', 'keyboard-3', 'keyboard-4'],
    isActive: true,
    avgRating: 4.5,
    reviewCount: 280
  },
  {
    id: 'prd_precision_mouse',
    sku: 'CMP-0011',
    vendorId: 'vnd_techwest',
    vendorName: 'TechWest Retail',
    name: 'GlidePro Ergonomic Wireless Mouse',
    description: 'Sculpted thumb rest, dual scroll wheels, 8000 DPI sensor and Bluetooth/2.4GHz multi-device toggle.',
    category: 'Computers',
    brand: 'Zenith',
    price: 2199,
    mrp: 3200,
    discountPercent: 31,
    stockQty: 75,
    images: ['mouse-1', 'mouse-2', 'mouse-3', 'mouse-4'],
    isActive: true,
    avgRating: 4.4,
    reviewCount: 310
  },
  {
    id: 'prd_curved_monitor_27',
    sku: 'CMP-0012',
    vendorId: 'vnd_digimart',
    vendorName: 'DigiMart',
    name: 'ViewMax 27-inch 165Hz Curved Gaming Monitor',
    description: '1500R curvature QHD 1440p gaming monitor with AMD FreeSync Premium and 1ms MPRT.',
    category: 'Computers',
    brand: 'AeroTech',
    price: 18499,
    mrp: 24999,
    discountPercent: 26,
    stockQty: 16, // low stock
    images: ['monitor-1', 'monitor-2', 'monitor-3', 'monitor-4'],
    isActive: true,
    avgRating: 4.5,
    reviewCount: 145
  },
  {
    id: 'prd_usb_hub_8in1',
    sku: 'CMP-0013',
    vendorId: 'vnd_techwest',
    vendorName: 'TechWest Retail',
    name: 'PortHub 8-in-1 USB-C Docking Adapter',
    description: 'Dual 4K HDMI, Gigabit Ethernet, 100W Power Delivery and high-speed SD/TF card reader.',
    category: 'Computers',
    brand: 'Zenith',
    price: 1899,
    mrp: 2899,
    discountPercent: 34,
    stockQty: 110,
    images: ['hub-1', 'hub-2', 'hub-3', 'hub-4'],
    isActive: true,
    avgRating: 4.3,
    reviewCount: 215
  },

  // 6. Cameras
  {
    id: 'prd_snappro_camera',
    sku: 'CAM-0003',
    vendorId: 'vnd_digimart',
    vendorName: 'DigiMart',
    name: 'SnapPro Mirrorless Camera',
    description: '24.2MP full-frame mirrorless digital camera body with 5-axis sensor stabilization and 4K 60fps video capture.',
    category: 'Cameras',
    brand: 'SnapPro',
    price: 38500,
    mrp: 46000,
    discountPercent: 16,
    stockQty: 6, // low stock
    images: ['camera-1', 'camera-2', 'camera-3', 'camera-4'],
    isActive: false, // inactive in admin per prompt specifications
    deletedAt: '2026-03-20T10:00:00.000Z',
    avgRating: 4.8,
    reviewCount: 86,
    specifications: {
      'Sensor': '24.2MP Full-Frame Exmor CMOS',
      'Video': '4K HDR 60fps 10-bit 4:2:2',
      'Stabilization': '5-Axis In-Body Sensor Shift',
      'Autofocus': '693 Phase-Detection AF Points with Eye AF',
      'Mount': 'Universal E-Mount'
    }
  },
  {
    id: 'prd_vlog_cam_4k',
    sku: 'CAM-0004',
    vendorId: 'vnd_digimart',
    vendorName: 'DigiMart',
    name: 'VlogMaster Pocket 4K Action Camera',
    description: 'Rugged waterproof compact creator camera with front flip screen, gimbal stabilization and wind filter.',
    category: 'Cameras',
    brand: 'SnapPro',
    price: 15999,
    mrp: 21999,
    discountPercent: 27,
    stockQty: 25, // below threshold
    images: ['vlogcam-1', 'vlogcam-2', 'vlogcam-3', 'vlogcam-4'],
    isActive: true,
    avgRating: 4.3,
    reviewCount: 110
  },
  {
    id: 'prd_cam_prime_lens',
    sku: 'CAM-0005',
    vendorId: 'vnd_digimart',
    vendorName: 'DigiMart',
    name: 'AeroOptics 50mm f/1.8 Prime Lens',
    description: 'Super-sharp portrait prime lens offering creamy bokeh and silent stepper autofocus motor.',
    category: 'Cameras',
    brand: 'SnapPro',
    price: 12499,
    mrp: 16500,
    discountPercent: 24,
    stockQty: 18, // low stock
    images: ['lens-1', 'lens-2', 'lens-3', 'lens-4'],
    isActive: true,
    avgRating: 4.7,
    reviewCount: 94
  },
  {
    id: 'prd_carbon_tripod',
    sku: 'CAM-0006',
    vendorId: 'vnd_techwest',
    vendorName: 'TechWest Retail',
    name: 'Trekker Carbon Fiber Travel Tripod',
    description: 'Lightweight 1.3kg tripod with 360-degree fluid ball head, monopod conversion and arca-swiss plate.',
    category: 'Cameras',
    brand: 'Trekker',
    price: 4999,
    mrp: 7500,
    discountPercent: 33,
    stockQty: 40,
    images: ['tripod-1', 'tripod-2', 'tripod-3', 'tripod-4'],
    isActive: true,
    avgRating: 4.6,
    reviewCount: 78
  },
  {
    id: 'prd_gimbal_3axis',
    sku: 'CAM-0007',
    vendorId: 'vnd_digimart',
    vendorName: 'DigiMart',
    name: 'SmoothMotion 3-Axis Smartphone Gimbal',
    description: 'Handheld motorized stabilizer with smart gesture tracking, extension rod and magnetic quick mount.',
    category: 'Cameras',
    brand: 'Zenith',
    price: 6499,
    mrp: 8999,
    discountPercent: 27,
    stockQty: 28, // below threshold
    images: ['gimbal-1', 'gimbal-2', 'gimbal-3', 'gimbal-4'],
    isActive: true,
    avgRating: 4.4,
    reviewCount: 135
  },

  // 7. Bags (Fashion & Accessories)
  {
    id: 'prd_trekker_30l',
    sku: 'BAG-0221',
    vendorId: 'vnd_urbanstride',
    vendorName: 'UrbanStride',
    name: 'Trekker 30L Waterproof Backpack',
    description: 'Weatherproof ripstop adventure backpack with padded 15.6-inch laptop compartment and ergonomic air-mesh harness.',
    category: 'Bags',
    brand: 'Trekker',
    price: 1499,
    mrp: 2499,
    discountPercent: 40,
    stockQty: 210,
    images: ['backpack-1', 'backpack-2', 'backpack-3', 'backpack-4'],
    isActive: true,
    avgRating: 4.5,
    reviewCount: 430,
    specifications: {
      'Capacity': '30 Litres',
      'Material': 'Water-Repellent 600D Polyester Ripstop',
      'Laptop Sleeve': 'Fits up to 15.6-inch Laptops',
      'Dimensions': '48 x 32 x 20 cm',
      'Warranty': '2 Years Manufacturer Warranty'
    }
  },
  {
    id: 'prd_polar_sunglasses',
    sku: 'BAG-0099',
    vendorId: 'vnd_urbanstride',
    vendorName: 'UrbanStride',
    name: 'Polar Aviator Polarized Sunglasses',
    description: 'Classic UV400 polarized teardrop aviator shades with ultra-light stainless steel frames.',
    category: 'Bags',
    brand: 'Polar',
    price: 999,
    mrp: 1899,
    discountPercent: 47,
    stockQty: 45,
    images: ['glasses-1', 'glasses-2', 'glasses-3', 'glasses-4'],
    isActive: true,
    avgRating: 4.2,
    reviewCount: 278
  },
  {
    id: 'prd_leather_messenger',
    sku: 'BAG-0222',
    vendorId: 'vnd_urbanstride',
    vendorName: 'UrbanStride',
    name: 'Heritage Leather Messenger Briefcase',
    description: 'Handcrafted full-grain saddle leather shoulder briefcase with brass hardware.',
    category: 'Bags',
    brand: 'UrbanStride',
    price: 3499,
    mrp: 5499,
    discountPercent: 36,
    stockQty: 25, // below threshold
    images: ['messenger-1', 'messenger-2', 'messenger-3', 'messenger-4'],
    isActive: true,
    avgRating: 4.7,
    reviewCount: 88
  },
  {
    id: 'prd_gym_duffel',
    sku: 'BAG-0223',
    vendorId: 'vnd_urbanstride',
    vendorName: 'UrbanStride',
    name: 'FitPro All-Weather Gym Duffel Bag',
    description: 'Spacious sports duffel bag featuring dedicated ventilated shoe tunnel and waterproof wet pocket.',
    category: 'Bags',
    brand: 'Stride',
    price: 1199,
    mrp: 1999,
    discountPercent: 40,
    stockQty: 60,
    images: ['duffel-1', 'duffel-2', 'duffel-3', 'duffel-4'],
    isActive: true,
    avgRating: 4.3,
    reviewCount: 164
  },
  {
    id: 'prd_rfid_wallet',
    sku: 'BAG-0224',
    vendorId: 'vnd_urbanstride',
    vendorName: 'UrbanStride',
    name: 'VaultSlim RFID Blocking Minimalist Wallet',
    description: 'Aerospace aluminum pop-up cardholder with leather cash pocket and RFID skimming protection.',
    category: 'Bags',
    brand: 'Polar',
    price: 799,
    mrp: 1299,
    discountPercent: 38,
    stockQty: 180,
    images: ['wallet-1', 'wallet-2', 'wallet-3', 'wallet-4'],
    isActive: true,
    avgRating: 4.4,
    reviewCount: 390
  },
  {
    id: 'prd_hard_luggage_24',
    sku: 'BAG-0225',
    vendorId: 'vnd_urbanstride',
    vendorName: 'UrbanStride',
    name: 'AeroTravel 24-inch Polycarbonate Trolley',
    description: 'Unbreakable German polycarbonate spinner suitcase with recessed TSA lock and 360-degree dual wheels.',
    category: 'Bags',
    brand: 'Trekker',
    price: 4299,
    mrp: 6999,
    discountPercent: 38,
    stockQty: 18, // low stock
    images: ['luggage-1', 'luggage-2', 'luggage-3', 'luggage-4'],
    isActive: true,
    avgRating: 4.6,
    reviewCount: 120
  }
];

const coupons = [
  {
    id: 'cpn_save10',
    code: 'SAVE10',
    type: 'percent',
    value: 10,
    validFrom: '2025-01-01T00:00:00.000Z',
    validTo: '2027-12-31T23:59:59.000Z',
    usageLimit: 1000,
    usedCount: 245,
    isActive: true,
    minOrderValue: 500
  },
  {
    id: 'cpn_festive200',
    code: 'FESTIVE200',
    type: 'flat',
    value: 200,
    validFrom: '2025-01-01T00:00:00.000Z',
    validTo: '2027-12-31T23:59:59.000Z',
    usageLimit: 500,
    usedCount: 180,
    isActive: true,
    minOrderValue: 2000
  },
  {
    id: 'cpn_welcome5',
    code: 'WELCOME5',
    type: 'percent',
    value: 5,
    validFrom: '2025-01-01T00:00:00.000Z',
    validTo: '2027-12-31T23:59:59.000Z',
    usageLimit: 5000,
    usedCount: 1200,
    isActive: true,
    minOrderValue: 0
  },
  {
    id: 'cpn_monsoon15',
    code: 'MONSOON15',
    type: 'percent',
    value: 15,
    validFrom: '2025-06-01T00:00:00.000Z',
    validTo: '2025-08-31T23:59:59.000Z', // Expired!
    usageLimit: 200,
    usedCount: 200,
    isActive: false,
    minOrderValue: 1000
  }
];

// Helper to generate 42 realistic orders
const orderStatuses = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Returned'];

const orders = [
  // 1. Report exact order: ORD-2026-0042 (Confirmed, ₹11,295, Ananya Rao)
  {
    id: 'ord_rec_0042',
    orderId: 'ORD-2026-0042',
    userId: 'usr_ananya',
    customerName: 'Ananya Rao',
    customerEmail: 'ananya.rao@example.com',
    customerPhone: '+91 98765 43210',
    items: [
      {
        productId: 'prd_aurora',
        sku: 'AUD-0001',
        name: 'Aurora Wireless Headphones',
        qty: 1,
        unitPrice: 3499,
        vendorId: 'vnd_techwest',
        image: 'headphones-1'
      },
      {
        productId: 'prd_pulsefit',
        sku: 'WRB-0014',
        name: 'PulseFit Smart Watch',
        qty: 1,
        unitPrice: 5999,
        vendorId: 'vnd_techwest',
        image: 'smartwatch-1'
      }
    ],
    shippingAddress: {
      id: 'addr_ananya_1',
      name: 'Ananya Rao',
      phone: '+91 98765 43210',
      street: 'Plot 42, Road No. 7, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033'
    },
    billingAddress: {
      id: 'addr_ananya_1',
      name: 'Ananya Rao',
      phone: '+91 98765 43210',
      street: 'Plot 42, Road No. 7, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033'
    },
    shippingMethod: 'standard',
    shippingCost: 0,
    subtotal: 9498,
    couponDiscount: 0,
    taxAmount: 1710, // 18% of 9498
    totalAmount: 11208,
    status: 'Confirmed',
    placedAt: '2026-03-28T14:32:00.000Z',
    updatedAt: '2026-03-28T14:32:00.000Z',
    statusTimeline: [
      {
        status: 'Confirmed',
        timestamp: '2026-03-28T14:32:00.000Z',
        note: 'Payment successful. Order confirmed.',
        changedBy: 'System'
      }
    ]
  },
  // 2. Report exact order: ORD-2026-0031 (AeroBook, Shipped)
  {
    id: 'ord_rec_0031',
    orderId: 'ORD-2026-0031',
    userId: 'usr_ananya',
    customerName: 'Ananya Rao',
    customerEmail: 'ananya.rao@example.com',
    customerPhone: '+91 98765 43210',
    items: [
      {
        productId: 'prd_aerobook_14',
        sku: 'CMP-0008',
        name: 'AeroBook 14 Laptop',
        qty: 1,
        unitPrice: 52990,
        vendorId: 'vnd_digimart',
        image: 'laptop-1'
      }
    ],
    shippingAddress: {
      id: 'addr_ananya_1',
      name: 'Ananya Rao',
      phone: '+91 98765 43210',
      street: 'Plot 42, Road No. 7, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033'
    },
    billingAddress: {
      id: 'addr_ananya_1',
      name: 'Ananya Rao',
      phone: '+91 98765 43210',
      street: 'Plot 42, Road No. 7, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033'
    },
    shippingMethod: 'express',
    shippingCost: 149,
    subtotal: 52990,
    couponDiscount: 5299, // SAVE10 applied
    couponCode: 'SAVE10',
    taxAmount: 8584,
    totalAmount: 56424,
    status: 'Shipped',
    placedAt: '2026-03-22T09:15:00.000Z',
    updatedAt: '2026-03-23T11:00:00.000Z',
    statusTimeline: [
      {
        status: 'Confirmed',
        timestamp: '2026-03-22T09:15:00.000Z',
        note: 'Order placed by customer.',
        changedBy: 'System'
      },
      {
        status: 'Processing',
        timestamp: '2026-03-22T14:00:00.000Z',
        note: 'Vendor DigiMart prepared package.',
        changedBy: 'Vendor'
      },
      {
        status: 'Shipped',
        timestamp: '2026-03-23T11:00:00.000Z',
        note: 'Handed over to delivery dispatch.',
        changedBy: 'Vendor'
      }
    ]
  },
  // 3. Report exact order: ORD-2026-0019 (StrideX, Delivered - inside return window for demo!)
  {
    id: 'ord_rec_0019',
    orderId: 'ORD-2026-0019',
    userId: 'usr_ananya',
    customerName: 'Ananya Rao',
    customerEmail: 'ananya.rao@example.com',
    customerPhone: '+91 98765 43210',
    items: [
      {
        productId: 'prd_stridex',
        sku: 'FTW-0107',
        name: 'StrideX Running Shoes',
        qty: 1,
        unitPrice: 2799,
        vendorId: 'vnd_urbanstride',
        image: 'runshoes-1'
      }
    ],
    shippingAddress: {
      id: 'addr_ananya_1',
      name: 'Ananya Rao',
      phone: '+91 98765 43210',
      street: 'Plot 42, Road No. 7, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033'
    },
    billingAddress: {
      id: 'addr_ananya_1',
      name: 'Ananya Rao',
      phone: '+91 98765 43210',
      street: 'Plot 42, Road No. 7, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033'
    },
    shippingMethod: 'standard',
    shippingCost: 49,
    subtotal: 2799,
    couponDiscount: 0,
    taxAmount: 504,
    totalAmount: 3352,
    status: 'Delivered',
    placedAt: '2026-04-05T10:00:00.000Z',
    updatedAt: '2026-04-08T15:30:00.000Z',
    deliveredAt: '2026-04-08T15:30:00.000Z', // Delivered within 7 days
    statusTimeline: [
      { status: 'Confirmed', timestamp: '2026-04-05T10:00:00.000Z', note: 'Order Confirmed', changedBy: 'System' },
      { status: 'Processing', timestamp: '2026-04-06T11:00:00.000Z', note: 'Processing by UrbanStride', changedBy: 'Vendor' },
      { status: 'Shipped', timestamp: '2026-04-07T09:00:00.000Z', note: 'Dispatched for delivery', changedBy: 'Vendor' },
      { status: 'Delivered', timestamp: '2026-04-08T15:30:00.000Z', note: 'Delivered to recipient', changedBy: 'Vendor' }
    ]
  },
  // 4. Report exact order: ORD-2026-0007 (Polar, Cancelled)
  {
    id: 'ord_rec_0007',
    orderId: 'ORD-2026-0007',
    userId: 'usr_rahul',
    customerName: 'Rahul Verma',
    customerEmail: 'rahul.verma@example.com',
    customerPhone: '+91 98234 56789',
    items: [
      {
        productId: 'prd_polar_sunglasses',
        sku: 'BAG-0099',
        name: 'Polar Aviator Polarized Sunglasses',
        qty: 1,
        unitPrice: 999,
        vendorId: 'vnd_urbanstride',
        image: 'glasses-1'
      }
    ],
    shippingAddress: {
      id: 'addr_rahul_1',
      name: 'Rahul Verma',
      phone: '+91 98234 56789',
      street: 'Flat 302, Palm Heights, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    billingAddress: {
      id: 'addr_rahul_1',
      name: 'Rahul Verma',
      phone: '+91 98234 56789',
      street: 'Flat 302, Palm Heights, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    shippingMethod: 'standard',
    shippingCost: 49,
    subtotal: 999,
    couponDiscount: 0,
    taxAmount: 180,
    totalAmount: 1228,
    status: 'Cancelled',
    cancelReason: 'Customer changed mind before dispatch.',
    placedAt: '2026-01-14T09:00:00.000Z',
    updatedAt: '2026-01-14T11:00:00.000Z',
    statusTimeline: [
      { status: 'Confirmed', timestamp: '2026-01-14T09:00:00.000Z', note: 'Order Confirmed', changedBy: 'System' },
      { status: 'Cancelled', timestamp: '2026-01-14T11:00:00.000Z', note: 'Cancelled by customer before dispatch. Stock restored.', changedBy: 'Customer' }
    ]
  }
];

// Generate orders 0001 to 0041 (excluding 0007, 0019, 0031, 0042)
const otherCustomers = users.filter(u => u.role === 'customer');
let orderSeq = 1;
for (let i = 1; i <= 38; i++) {
  if (i === 7 || i === 19 || i === 31) continue;
  const numStr = String(i).padStart(4, '0');
  const cust = otherCustomers[i % otherCustomers.length];
  const prod = products[i % products.length];
  const status = ['Delivered', 'Delivered', 'Shipped', 'Processing', 'Confirmed', 'Delivered', 'Cancelled', 'Returned'][i % 8];
  const isDelivered = status === 'Delivered' || status === 'Returned';
  const deliveredDate = isDelivered ? new Date(2026, 0, 10 + i).toISOString() : undefined;
  const subtotal = prod.price;
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal >= 5000 ? 0 : 49;
  const total = subtotal + tax + shipping;

  orders.push({
    id: `ord_rec_${numStr}`,
    orderId: `ORD-2026-${numStr}`,
    userId: cust.id,
    customerName: cust.name,
    customerEmail: cust.email,
    customerPhone: cust.mobile,
    items: [
      {
        productId: prod.id,
        sku: prod.sku,
        name: prod.name,
        qty: 1,
        unitPrice: prod.price,
        vendorId: prod.vendorId,
        image: prod.images[0]
      }
    ],
    shippingAddress: {
      id: `addr_gen_${i}`,
      name: cust.name,
      phone: cust.mobile,
      street: '123 Residency Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560025'
    },
    billingAddress: {
      id: `addr_gen_${i}`,
      name: cust.name,
      phone: cust.mobile,
      street: '123 Residency Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560025'
    },
    shippingMethod: 'standard',
    shippingCost: shipping,
    subtotal: subtotal,
    couponDiscount: 0,
    taxAmount: tax,
    totalAmount: total,
    status: status,
    placedAt: new Date(2026, 0, 5 + i).toISOString(),
    updatedAt: new Date(2026, 0, 7 + i).toISOString(),
    deliveredAt: deliveredDate,
    statusTimeline: [
      { status: 'Confirmed', timestamp: new Date(2026, 0, 5 + i).toISOString(), note: 'Order placed', changedBy: 'System' },
      ...(status !== 'Confirmed' ? [{ status: status, timestamp: new Date(2026, 0, 7 + i).toISOString(), note: `Status updated to ${status}`, changedBy: 'Vendor' }] : [])
    ]
  });
}

// Generate payments matching every order
const payments = orders.map((o, idx) => {
  const methods = ['card', 'upi', 'netbanking', 'cod'];
  const method = methods[idx % methods.length];
  const isFailed = false;
  const isRefunded = o.status === 'Cancelled' || o.status === 'Returned';
  return {
    id: `pay_${o.id}`,
    orderId: o.orderId,
    gatewayRef: `PG_REF_${100000 + idx}`,
    method: method,
    amount: o.totalAmount,
    status: isRefunded ? 'Refunded' : (isFailed ? 'Failed' : 'Paid'),
    paidAt: o.placedAt,
    cardLast4: method === 'card' ? '4242' : undefined,
    upiId: method === 'upi' ? `${o.customerEmail.split('@')[0]}@okhdfcbank` : undefined,
    bankName: method === 'netbanking' ? 'HDFC Bank' : undefined
  };
});

// Reviews: 60+ reviews
const reviews = [
  {
    id: 'rev_aurora_1',
    userId: 'usr_rahul',
    userName: 'Rahul Verma',
    sku: 'AUD-0001',
    productId: 'prd_aurora',
    rating: 5,
    title: 'Outstanding noise cancellation!',
    comment: 'The sound stage is wide and punchy. ANC easily cuts out flight and train hums. Battery life is easily 35+ hours.',
    createdAt: '2026-02-10T10:15:00.000Z',
    isActive: true,
    verifiedPurchase: true
  },
  {
    id: 'rev_aurora_2',
    userId: 'usr_meera',
    userName: 'Meera Iyer',
    sku: 'AUD-0001',
    productId: 'prd_aurora',
    rating: 4,
    title: 'Great comfort for long office calls',
    comment: 'The earcups are soft and breathable. The mic clarity in noisy rooms is top notch.',
    createdAt: '2026-02-18T14:20:00.000Z',
    isActive: true,
    verifiedPurchase: true
  },
  {
    id: 'rev_stridex_1',
    userId: 'usr_ananya',
    userName: 'Ananya Rao',
    sku: 'FTW-0107',
    productId: 'prd_stridex',
    rating: 5,
    title: 'Best marathon shoes in this price range',
    comment: 'The carbon foam bounce is unbelievable! Completed a 10k run with zero heel discomfort. True to size.',
    createdAt: '2026-04-09T08:00:00.000Z',
    isActive: true,
    verifiedPurchase: true
  },
  {
    id: 'rev_aerobook_1',
    userId: 'usr_vikram',
    userName: 'Vikram Singh',
    sku: 'CMP-0008',
    productId: 'prd_aerobook_14',
    rating: 5,
    title: 'Flawless OLED display and build quality',
    comment: 'The screen is gorgeous for coding and media. Aluminum unibody is as premium as premium laptops get.',
    createdAt: '2026-02-28T16:00:00.000Z',
    isActive: true,
    verifiedPurchase: true
  },
  {
    id: 'rev_pulsefit_1',
    userId: 'usr_priya',
    userName: 'Priya Sharma',
    sku: 'WRB-0014',
    productId: 'prd_pulsefit',
    rating: 4,
    title: 'Accurate heart rate & great battery',
    comment: 'Lasts more than 10 days on a single charge. Sleep tracking insights are very detailed.',
    createdAt: '2026-03-01T11:45:00.000Z',
    isActive: true,
    verifiedPurchase: true
  }
];

// Add 55 more reviews across products to exceed 60+
const sampleComments = [
  { rating: 5, title: 'Exceeded expectations!', text: 'Phenomenal build quality, works right out of the box.' },
  { rating: 4, title: 'Very good purchase', text: 'Good performance and stylish looks. Delivery was swift.' },
  { rating: 5, title: 'Highly recommended', text: 'Worth every rupee. Using daily without any issues.' },
  { rating: 4, title: 'Solid everyday item', text: 'Functions as described in specifications. Recommended.' },
  { rating: 3, title: 'Decent for the price', text: 'Works fine, packaging could have been sturdier.' }
];

for (let r = 1; r <= 55; r++) {
  const prod = products[r % products.length];
  const user = otherCustomers[r % otherCustomers.length];
  const template = sampleComments[r % sampleComments.length];
  reviews.push({
    id: `rev_gen_${r}`,
    userId: user.id,
    userName: user.name,
    sku: prod.sku,
    productId: prod.id,
    rating: template.rating,
    title: template.title,
    comment: template.text,
    createdAt: new Date(2026, 1, (r % 25) + 1).toISOString(),
    isActive: true,
    verifiedPurchase: true
  });
}

const auditLogs = [
  {
    id: 'aud_001',
    actorId: 'usr_admin',
    actorName: 'Rajesh Kumar',
    actorRole: 'admin',
    action: 'PRODUCT_DEACTIVATE',
    entity: 'product',
    entityId: 'prd_snappro_camera',
    before: { isActive: true },
    after: { isActive: false, reason: 'Pending lens bundle refresh' },
    timestamp: '2026-03-20T10:00:00.000Z'
  },
  {
    id: 'aud_002',
    actorId: 'usr_vendor_techwest',
    actorName: 'Vikram Malhotra',
    actorRole: 'vendor',
    action: 'STOCK_UPDATE',
    entity: 'inventory',
    entityId: 'prd_aurora',
    before: { stockQty: 50 },
    after: { stockQty: 64, delta: +14 },
    timestamp: '2026-03-21T09:30:00.000Z'
  },
  {
    id: 'aud_003',
    actorId: 'usr_admin',
    actorName: 'Rajesh Kumar',
    actorRole: 'admin',
    action: 'COUPON_CREATE',
    entity: 'coupon',
    entityId: 'cpn_save10',
    before: null,
    after: { code: 'SAVE10', discount: '10%' },
    timestamp: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'aud_004',
    actorId: 'usr_admin',
    actorName: 'Rajesh Kumar',
    actorRole: 'admin',
    action: 'CUSTOMER_LOCK_OVERRIDE',
    entity: 'user',
    entityId: 'usr_dev',
    before: { status: 'Active' },
    after: { status: 'Suspended', reason: 'Repeated disputed chargebacks' },
    timestamp: '2025-07-14T16:20:00.000Z'
  }
];

const notifications = [
  {
    id: 'notif_001',
    userId: 'usr_ananya',
    title: 'Order Confirmed: ORD-2026-0042',
    message: 'Your order for Aurora Wireless Headphones and PulseFit Smart Watch has been confirmed.',
    type: 'order',
    read: false,
    createdAt: '2026-03-28T14:32:00.000Z',
    link: '/orders/ORD-2026-0042'
  },
  {
    id: 'notif_002',
    userId: 'usr_ananya',
    title: 'Package Shipped: ORD-2026-0031',
    message: 'Your AeroBook 14 Laptop has been dispatched and is on its way.',
    type: 'status',
    read: true,
    createdAt: '2026-03-23T11:00:00.000Z',
    link: '/orders/ORD-2026-0031'
  },
  {
    id: 'notif_003',
    userId: 'usr_admin',
    title: 'Low Stock Alert',
    message: 'AeroBook 14 Laptop (CMP-0008) is low on stock (8 units remaining).',
    type: 'alert',
    read: false,
    createdAt: '2026-03-25T08:00:00.000Z',
    link: '/admin/inventory'
  },
  {
    id: 'notif_004',
    userId: 'usr_admin',
    title: 'New Vendor Pending Approval',
    message: 'Apex Electronics has submitted a distributor onboarding request.',
    type: 'system',
    read: false,
    createdAt: '2026-03-25T11:00:00.000Z',
    link: '/admin/vendors'
  }
];

const contactMessages = [
  {
    id: 'msg_001',
    name: 'Suresh Raina',
    email: 'suresh.r@example.com',
    phone: '+91 98300 11223',
    subject: 'Corporate Bulk Purchase Inquiry',
    message: 'We are looking to purchase 50 units of AeroBook 14 for our developer team. Do you provide GST invoice and bulk commercial pricing?',
    status: 'Unread',
    createdAt: '2026-03-26T15:00:00.000Z'
  },
  {
    id: 'msg_002',
    name: 'Deepa Varma',
    email: 'deepa.v@example.com',
    phone: '+91 98450 99887',
    subject: 'Vendor Partnership Question',
    message: 'We manufacture organic cotton backpacks and would love to register as an approved vendor on BlueCart.',
    status: 'Read',
    createdAt: '2026-03-22T10:30:00.000Z'
  }
];


// Real Product Pictures Patch
const realImagesMap = {
  "prd_aurora": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_sonic_pulse": [
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_boombox_mini": [
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_studio_pro": [
    "https://images.unsplash.com/photo-1599669454699-248893623440?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_soundbar_300": [
    "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_vocal_mic": [
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520523839898-507127a97262?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590602846989-e99446d3e918?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_pulsefit": [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_pulseband_hr": [
    "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_smartring_aura": [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_chronos_classic": [
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_kids_gps_watch": [
    "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_stridex": [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_urban_sneakers": [
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_trail_blazer_boots": [
    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_aero_slides": [
    "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603808033176-9d13450b5518?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_stride_training": [
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_nova_5g": [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_nova_pro_256": [
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_volt_flip": [
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_lite_budget_phone": [
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_fast_charger_65w": [
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1622445262464-84b1a0731f82?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1622445262464-84b1a0731f82?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_wireless_dock": [
    "https://images.unsplash.com/photo-1622445262464-84b1a0731f82?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1622445262464-84b1a0731f82?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_aerobook_14": [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_aerobook_pro_16": [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_mech_keyboard": [
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_precision_mouse": [
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_curved_monitor_27": [
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_usb_hub_8in1": [
    "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_snappro_camera": [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_vlog_cam_4k": [
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_cam_prime_lens": [
    "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_carbon_tripod": [
    "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_gimbal_3axis": [
    "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_trekker_30l": [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_polar_sunglasses": [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_leather_messenger": [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_gym_duffel": [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_rfid_wallet": [
    "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80"
  ],
  "prd_hard_luggage_24": [
    "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=800&auto=format&fit=crop&q=80"
  ]
};
for (const p of products) {
  if (realImagesMap[p.id]) {
    p.images = realImagesMap[p.id];
  }
}
for (const o of orders) {
  for (const it of o.items) {
    if (realImagesMap[it.productId]) {
      it.image = realImagesMap[it.productId][0];
    }
  }
}

const seedFileContent = `// Automatically generated BlueCart Seed Data matching SRS v1.0 and Case Study Report
import { User, Vendor, Product, Coupon, Order, Payment, Review, AuditLog, Notification, ContactMessage } from '../types';

export const initialVendors: Vendor[] = ${JSON.stringify(vendors, null, 2)};

export const initialUsers: User[] = ${JSON.stringify(users, null, 2)};

export const initialProducts: Product[] = ${JSON.stringify(products, null, 2)};

export const initialCoupons: Coupon[] = ${JSON.stringify(coupons, null, 2)};

export const initialOrders: Order[] = ${JSON.stringify(orders, null, 2)};

export const initialPayments: Payment[] = ${JSON.stringify(payments, null, 2)};

export const initialReviews: Review[] = ${JSON.stringify(reviews, null, 2)};

export const initialAuditLogs: AuditLog[] = ${JSON.stringify(auditLogs, null, 2)};

export const initialNotifications: Notification[] = ${JSON.stringify(notifications, null, 2)};

export const initialContactMessages: ContactMessage[] = ${JSON.stringify(contactMessages, null, 2)};

// Aggregate display stats matching Report Chapter 8 figures
export const reportDisplayStats = {
  grossRevenue: 1842650,
  totalOrders: 1284,
  totalCustomers: 9730,
  totalProducts: 4215,
  vendorEarnings: 184300,
  salesGrowthPct: 18.4,
  returnRatePct: 2.1
};
`;

fs.writeFileSync(path.join(process.cwd(), 'src/db/seedData.ts'), seedFileContent, 'utf-8');
console.log('src/db/seedData.ts generated successfully!');
