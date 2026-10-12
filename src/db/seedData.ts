// Automatically generated BlueCart Seed Data matching SRS v1.0 and Case Study Report
import { User, Vendor, Product, Coupon, Order, Payment, Review, AuditLog, Notification, ContactMessage } from '../types';

export const initialVendors: Vendor[] = [
  {
    "id": "vnd_techwest",
    "name": "TechWest Retail",
    "contactEmail": "vendor@techwest.example",
    "phone": "+91 98450 11223",
    "status": "Approved",
    "commissionRate": 10,
    "description": "Premier electronics and personal audio distributor in Western India.",
    "createdAt": "2025-01-15T08:00:00.000Z"
  },
  {
    "id": "vnd_digimart",
    "name": "DigiMart",
    "contactEmail": "sales@digimart.example",
    "phone": "+91 98200 44556",
    "status": "Approved",
    "commissionRate": 12,
    "description": "Certified national partner for personal computing and digital accessories.",
    "createdAt": "2025-02-01T10:30:00.000Z"
  },
  {
    "id": "vnd_urbanstride",
    "name": "UrbanStride",
    "contactEmail": "contact@urbanstride.example",
    "phone": "+91 97110 77889",
    "status": "Approved",
    "commissionRate": 15,
    "description": "Athletic footwear, lifestyle gear and ergonomic apparel supplier.",
    "createdAt": "2025-03-10T14:15:00.000Z"
  },
  {
    "id": "vnd_apex",
    "name": "Apex Electronics",
    "contactEmail": "onboarding@apex.example",
    "phone": "+91 99880 33445",
    "status": "Pending",
    "commissionRate": 10,
    "description": "Specialist distributor of professional optics, drones and cinema gear.",
    "createdAt": "2026-03-25T11:00:00.000Z"
  }
];

export const initialUsers: User[] = [
  {
    "id": "usr_ananya",
    "name": "Ananya Rao",
    "email": "ananya.rao@example.com",
    "mobile": "+91 98765 43210",
    "passwordHash": "$2a$10$.kERxIBR2HyCyGPDqKeDludbFRa6mC90ijSDLuq8/A1ZEy1KWvA0y",
    "role": "customer",
    "status": "Active",
    "failedAttempts": 0,
    "lockUntil": null,
    "createdAt": "2025-06-12T09:00:00.000Z",
    "avatar": "AR",
    "savedAddresses": [
      {
        "id": "addr_ananya_1",
        "name": "Ananya Rao",
        "phone": "+91 98765 43210",
        "street": "Plot 42, Road No. 7, Jubilee Hills",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500033",
        "isDefault": true
      },
      {
        "id": "addr_ananya_2",
        "name": "Ananya Rao (Office)",
        "phone": "+91 98765 43210",
        "street": "Cyber Gateway, 4th Floor, Hitec City",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500081",
        "isDefault": false
      }
    ],
    "preferences": {
      "orderNotifications": true,
      "shippingNotifications": true
    }
  },
  {
    "id": "usr_vendor_techwest",
    "name": "Vikram Malhotra",
    "email": "vendor@techwest.example",
    "mobile": "+91 98450 11223",
    "passwordHash": "$2a$10$BgJKOKs/QQDI5W2CO4OSdevY5m4c4Xfvv2CiOXW/rDXCSq5T4CjMq",
    "role": "vendor",
    "status": "Active",
    "failedAttempts": 0,
    "lockUntil": null,
    "vendorId": "vnd_techwest",
    "createdAt": "2025-01-15T08:30:00.000Z",
    "avatar": "VM"
  },
  {
    "id": "usr_admin",
    "name": "Rajesh Kumar",
    "email": "admin@shop.example",
    "mobile": "+91 98111 22334",
    "passwordHash": "$2a$10$327SAI.vpj9f.tRWevZHzuHJdSCq3/UCteHSDOHGlPsLAbmCedDba",
    "role": "admin",
    "status": "Active",
    "failedAttempts": 0,
    "lockUntil": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "avatar": "RK"
  },
  {
    "id": "usr_sana",
    "name": "Sana Khan",
    "email": "sana.khan@example.com",
    "mobile": "+91 98990 12345",
    "passwordHash": "$2a$10$.kERxIBR2HyCyGPDqKeDludbFRa6mC90ijSDLuq8/A1ZEy1KWvA0y",
    "role": "customer",
    "status": "Locked",
    "failedAttempts": 5,
    "lockUntil": 1791825333504,
    "createdAt": "2025-08-20T11:00:00.000Z",
    "avatar": "SK"
  },
  {
    "id": "usr_dev",
    "name": "Dev Patel",
    "email": "dev.patel@example.com",
    "mobile": "+91 98700 98765",
    "passwordHash": "$2a$10$.kERxIBR2HyCyGPDqKeDludbFRa6mC90ijSDLuq8/A1ZEy1KWvA0y",
    "role": "customer",
    "status": "Suspended",
    "failedAttempts": 0,
    "lockUntil": null,
    "createdAt": "2025-07-14T16:20:00.000Z",
    "avatar": "DP"
  },
  {
    "id": "usr_rahul",
    "name": "Rahul Verma",
    "email": "rahul.verma@example.com",
    "mobile": "+91 98234 56789",
    "passwordHash": "$2a$10$.kERxIBR2HyCyGPDqKeDludbFRa6mC90ijSDLuq8/A1ZEy1KWvA0y",
    "role": "customer",
    "status": "Active",
    "failedAttempts": 0,
    "lockUntil": null,
    "createdAt": "2025-09-05T12:00:00.000Z",
    "avatar": "RV",
    "savedAddresses": [
      {
        "id": "addr_rahul_1",
        "name": "Rahul Verma",
        "phone": "+91 98234 56789",
        "street": "Flat 302, Palm Heights, Indiranagar",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560038",
        "isDefault": true
      }
    ]
  },
  {
    "id": "usr_meera",
    "name": "Meera Iyer",
    "email": "meera.iyer@example.com",
    "mobile": "+91 98333 44556",
    "passwordHash": "$2a$10$.kERxIBR2HyCyGPDqKeDludbFRa6mC90ijSDLuq8/A1ZEy1KWvA0y",
    "role": "customer",
    "status": "Active",
    "failedAttempts": 0,
    "lockUntil": null,
    "createdAt": "2025-10-10T10:00:00.000Z",
    "avatar": "MI",
    "savedAddresses": [
      {
        "id": "addr_meera_1",
        "name": "Meera Iyer",
        "phone": "+91 98333 44556",
        "street": "12 Alwarpet Main Road",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "pincode": "600018",
        "isDefault": true
      }
    ]
  },
  {
    "id": "usr_karthik",
    "name": "Karthik S.",
    "email": "karthik.s@example.com",
    "mobile": "+91 98401 23456",
    "passwordHash": "$2a$10$.kERxIBR2HyCyGPDqKeDludbFRa6mC90ijSDLuq8/A1ZEy1KWvA0y",
    "role": "customer",
    "status": "Active",
    "failedAttempts": 0,
    "lockUntil": null,
    "createdAt": "2025-11-01T15:00:00.000Z",
    "avatar": "KS"
  },
  {
    "id": "usr_vikram",
    "name": "Vikram Singh",
    "email": "vikram.singh@example.com",
    "mobile": "+91 98102 34567",
    "passwordHash": "$2a$10$.kERxIBR2HyCyGPDqKeDludbFRa6mC90ijSDLuq8/A1ZEy1KWvA0y",
    "role": "customer",
    "status": "Active",
    "failedAttempts": 0,
    "lockUntil": null,
    "createdAt": "2025-11-20T17:00:00.000Z",
    "avatar": "VS"
  },
  {
    "id": "usr_priya",
    "name": "Priya Sharma",
    "email": "priya.sharma@example.com",
    "mobile": "+91 98670 12345",
    "passwordHash": "$2a$10$.kERxIBR2HyCyGPDqKeDludbFRa6mC90ijSDLuq8/A1ZEy1KWvA0y",
    "role": "customer",
    "status": "Active",
    "failedAttempts": 0,
    "lockUntil": null,
    "createdAt": "2025-12-05T09:30:00.000Z",
    "avatar": "PS"
  },
  {
    "id": "usr_amit",
    "name": "Amit Shah",
    "email": "amit.shah@example.com",
    "mobile": "+91 98250 67890",
    "passwordHash": "$2a$10$.kERxIBR2HyCyGPDqKeDludbFRa6mC90ijSDLuq8/A1ZEy1KWvA0y",
    "role": "customer",
    "status": "Active",
    "failedAttempts": 0,
    "lockUntil": null,
    "createdAt": "2026-01-10T14:40:00.000Z",
    "avatar": "AS"
  },
  {
    "id": "usr_neha",
    "name": "Neha Gupta",
    "email": "neha.gupta@example.com",
    "mobile": "+91 98115 54321",
    "passwordHash": "$2a$10$.kERxIBR2HyCyGPDqKeDludbFRa6mC90ijSDLuq8/A1ZEy1KWvA0y",
    "role": "customer",
    "status": "Active",
    "failedAttempts": 0,
    "lockUntil": null,
    "createdAt": "2026-01-22T11:15:00.000Z",
    "avatar": "NG"
  },
  {
    "id": "usr_rohan",
    "name": "Rohan Mehta",
    "email": "rohan.mehta@example.com",
    "mobile": "+91 98205 99887",
    "passwordHash": "$2a$10$.kERxIBR2HyCyGPDqKeDludbFRa6mC90ijSDLuq8/A1ZEy1KWvA0y",
    "role": "customer",
    "status": "Active",
    "failedAttempts": 0,
    "lockUntil": null,
    "createdAt": "2026-02-14T13:00:00.000Z",
    "avatar": "RM"
  },
  {
    "id": "usr_pooja",
    "name": "Pooja Nair",
    "email": "pooja.nair@example.com",
    "mobile": "+91 98471 22334",
    "passwordHash": "$2a$10$.kERxIBR2HyCyGPDqKeDludbFRa6mC90ijSDLuq8/A1ZEy1KWvA0y",
    "role": "customer",
    "status": "Active",
    "failedAttempts": 0,
    "lockUntil": null,
    "createdAt": "2026-03-01T16:00:00.000Z",
    "avatar": "PN"
  }
];

export const initialProducts: Product[] = [
  {
    "id": "prd_aurora",
    "sku": "AUD-0001",
    "vendorId": "vnd_techwest",
    "vendorName": "TechWest Retail",
    "name": "Aurora Wireless Headphones",
    "description": "High-fidelity active noise-cancelling wireless headphones with 40mm titanium drivers and 40-hour battery life.",
    "category": "Audio",
    "brand": "Aura",
    "price": 3499,
    "mrp": 4999,
    "discountPercent": 30,
    "stockQty": 64,
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.5,
    "reviewCount": 1284,
    "specifications": {
      "Driver Size": "40mm Titanium",
      "Battery Life": "40 Hours ANC Off, 30 Hours ANC On",
      "Connectivity": "Bluetooth 5.3, 3.5mm Aux",
      "Charging": "USB-C Fast Charging (10m = 5h)",
      "Weight": "250g"
    },
    "features": [
      "Hybrid Active Noise Cancellation with Transparency mode",
      "Multipoint pairing for switching between laptop and phone",
      "Plush memory foam ear cushions for all-day comfort",
      "Low-latency game mode for video and gaming"
    ]
  },
  {
    "id": "prd_sonic_pulse",
    "sku": "AUD-0002",
    "vendorId": "vnd_techwest",
    "vendorName": "TechWest Retail",
    "name": "SonicPulse TWS Earbuds",
    "description": "True wireless stereo earbuds with spatial audio and IPX5 sweat resistance for active workouts.",
    "category": "Audio",
    "brand": "SonicWave",
    "price": 1999,
    "mrp": 2999,
    "discountPercent": 33,
    "stockQty": 85,
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.2,
    "reviewCount": 420
  },
  {
    "id": "prd_boombox_mini",
    "sku": "AUD-0003",
    "vendorId": "vnd_techwest",
    "vendorName": "TechWest Retail",
    "name": "BoomBox Mini Portable Speaker",
    "description": "Rugged waterproof Bluetooth 5.3 speaker with 360-degree surround bass and 16 hours of continuous play.",
    "category": "Audio",
    "brand": "SonicWave",
    "price": 2499,
    "mrp": 3499,
    "discountPercent": 28,
    "stockQty": 18,
    "images": [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.4,
    "reviewCount": 156
  },
  {
    "id": "prd_studio_pro",
    "sku": "AUD-0004",
    "vendorId": "vnd_techwest",
    "vendorName": "TechWest Retail",
    "name": "StudioPro Wired Monitoring Headphones",
    "description": "Reference studio monitor headphones tuned for audio engineers and music producers.",
    "category": "Audio",
    "brand": "Zenith",
    "price": 4999,
    "mrp": 6999,
    "discountPercent": 28,
    "stockQty": 5,
    "images": [
      "https://images.unsplash.com/photo-1599669454699-248893623440?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.7,
    "reviewCount": 92
  },
  {
    "id": "prd_soundbar_300",
    "sku": "AUD-0005",
    "vendorId": "vnd_digimart",
    "vendorName": "DigiMart",
    "name": "CinemaSound 2.1 Soundbar with Subwoofer",
    "description": "120W Dolby Atmos soundbar delivering room-filling cinematic acoustics for your living room.",
    "category": "Audio",
    "brand": "SonicWave",
    "price": 7999,
    "mrp": 11999,
    "discountPercent": 33,
    "stockQty": 12,
    "images": [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.3,
    "reviewCount": 114
  },
  {
    "id": "prd_vocal_mic",
    "sku": "AUD-0006",
    "vendorId": "vnd_digimart",
    "vendorName": "DigiMart",
    "name": "StreamCast USB Condenser Microphone",
    "description": "Cardioid studio recording microphone with pop filter and zero-latency headphone monitoring.",
    "category": "Audio",
    "brand": "Zenith",
    "price": 3299,
    "mrp": 4500,
    "discountPercent": 26,
    "stockQty": 0,
    "images": [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520523839898-507127a97262?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590602846989-e99446d3e918?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.6,
    "reviewCount": 88
  },
  {
    "id": "prd_pulsefit",
    "sku": "WRB-0014",
    "vendorId": "vnd_techwest",
    "vendorName": "TechWest Retail",
    "name": "PulseFit Smart Watch",
    "description": "Advanced fitness smartwatch with 1.43-inch AMOLED display, SpO2 sensor, continuous heart rate and GPS.",
    "category": "Wearables",
    "brand": "Pulse",
    "price": 5999,
    "mrp": 8999,
    "discountPercent": 33,
    "stockQty": 38,
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.3,
    "reviewCount": 512,
    "specifications": {
      "Display": "1.43-inch AMOLED 466x466 Always-On",
      "Battery": "Up to 14 Days Typical Usage",
      "Sensors": "Optical Heart Rate, SpO2, Accelerometer, Barometer",
      "Water Resistance": "5 ATM (50m Swimproof)",
      "Connectivity": "Bluetooth 5.2, GPS / GLONASS"
    }
  },
  {
    "id": "prd_pulseband_hr",
    "sku": "WRB-0015",
    "vendorId": "vnd_techwest",
    "vendorName": "TechWest Retail",
    "name": "PulseFit Band 7 Activity Tracker",
    "description": "Slim lightweight fitness band with sleep stages tracking, 110+ sports modes and magnetic charging.",
    "category": "Wearables",
    "brand": "Pulse",
    "price": 2199,
    "mrp": 3499,
    "discountPercent": 37,
    "stockQty": 110,
    "images": [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.1,
    "reviewCount": 340
  },
  {
    "id": "prd_smartring_aura",
    "sku": "WRB-0016",
    "vendorId": "vnd_techwest",
    "vendorName": "TechWest Retail",
    "name": "Aura Smart Health Ring Gen 2",
    "description": "Titanium bio-sensing smart ring tracking recovery scores, skin temperature and nocturnal vitals.",
    "category": "Wearables",
    "brand": "Aura",
    "price": 12999,
    "mrp": 16999,
    "discountPercent": 23,
    "stockQty": 15,
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.5,
    "reviewCount": 78
  },
  {
    "id": "prd_chronos_classic",
    "sku": "WRB-0017",
    "vendorId": "vnd_urbanstride",
    "vendorName": "UrbanStride",
    "name": "Chronos Hybrid Luxury Watch",
    "description": "Classic analogue dial with hidden OLED notifications and sapphire crystal glass.",
    "category": "Wearables",
    "brand": "Zenith",
    "price": 8499,
    "mrp": 12000,
    "discountPercent": 29,
    "stockQty": 24,
    "images": [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.4,
    "reviewCount": 62
  },
  {
    "id": "prd_kids_gps_watch",
    "sku": "WRB-0018",
    "vendorId": "vnd_digimart",
    "vendorName": "DigiMart",
    "name": "SafeTrack Kids GPS Smartwatch",
    "description": "Cellular 4G calling, SOS emergency button and live geofencing alerts for child safety.",
    "category": "Wearables",
    "brand": "Pulse",
    "price": 3499,
    "mrp": 4999,
    "discountPercent": 30,
    "stockQty": 42,
    "images": [
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4,
    "reviewCount": 89
  },
  {
    "id": "prd_stridex",
    "sku": "FTW-0107",
    "vendorId": "vnd_urbanstride",
    "vendorName": "UrbanStride",
    "name": "StrideX Running Shoes",
    "description": "Ergonomic engineered-mesh performance road running shoes with carbon-infused midsole cushioning.",
    "category": "Footwear",
    "brand": "Stride",
    "price": 2799,
    "mrp": 4499,
    "discountPercent": 37,
    "stockQty": 120,
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.4,
    "reviewCount": 310,
    "specifications": {
      "Upper Material": "Breathable Engineered Knit",
      "Midsole": "CloudCush Carbon-Infused EVA",
      "Outsole": "High-Traction Rubber",
      "Closure": "Lace-Up",
      "Weight": "235g (Size 9)"
    }
  },
  {
    "id": "prd_urban_sneakers",
    "sku": "FTW-0108",
    "vendorId": "vnd_urbanstride",
    "vendorName": "UrbanStride",
    "name": "UrbanStride Casual Court Sneakers",
    "description": "Minimalist premium vegan leather street sneakers with memory foam insoles for everyday wear.",
    "category": "Footwear",
    "brand": "Stride",
    "price": 1899,
    "mrp": 2999,
    "discountPercent": 36,
    "stockQty": 65,
    "images": [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.2,
    "reviewCount": 195
  },
  {
    "id": "prd_trail_blazer_boots",
    "sku": "FTW-0109",
    "vendorId": "vnd_urbanstride",
    "vendorName": "UrbanStride",
    "name": "TrailBlazer Waterproof Hiking Boots",
    "description": "All-weather mid-cut trekking boots with reinforced toe bumper and Vibram lug outsole.",
    "category": "Footwear",
    "brand": "Trekker",
    "price": 3999,
    "mrp": 5999,
    "discountPercent": 33,
    "stockQty": 32,
    "images": [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.6,
    "reviewCount": 142
  },
  {
    "id": "prd_aero_slides",
    "sku": "FTW-0110",
    "vendorId": "vnd_urbanstride",
    "vendorName": "UrbanStride",
    "name": "AeroSlide Recovery Foam Sandals",
    "description": "Thick recovery slides designed for post-marathon foot fatigue and arch support.",
    "category": "Footwear",
    "brand": "Stride",
    "price": 899,
    "mrp": 1499,
    "discountPercent": 40,
    "stockQty": 85,
    "images": [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603808033176-9d13450b5518?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.1,
    "reviewCount": 220
  },
  {
    "id": "prd_stride_training",
    "sku": "FTW-0111",
    "vendorId": "vnd_urbanstride",
    "vendorName": "UrbanStride",
    "name": "Apex Trainer Cross-Training Shoes",
    "description": "Flat wide base gym shoes for heavy deadlifts, HIIT workouts and agility sprints.",
    "category": "Footwear",
    "brand": "Stride",
    "price": 3299,
    "mrp": 4799,
    "discountPercent": 31,
    "stockQty": 0,
    "images": [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.5,
    "reviewCount": 75
  },
  {
    "id": "prd_nova_5g",
    "sku": "MOB-0032",
    "vendorId": "vnd_digimart",
    "vendorName": "DigiMart",
    "name": "Nova 5G Smartphone 128GB",
    "description": "Flagship killer with Dimensity 8200 chipset, 6.7-inch 120Hz Super AMOLED, and 67W Turbo FlashCharge.",
    "category": "Mobiles",
    "brand": "Nexa",
    "price": 17999,
    "mrp": 22999,
    "discountPercent": 21,
    "stockQty": 22,
    "images": [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.4,
    "reviewCount": 680,
    "specifications": {
      "Processor": "MediaTek Dimensity 8200 4nm",
      "RAM / Storage": "8GB LPDDR5 / 128GB UFS 3.1",
      "Display": "6.7\" FHD+ 120Hz AMOLED HDR10+",
      "Rear Camera": "64MP OIS + 8MP Ultra-Wide + 2MP Macro",
      "Battery": "5000mAh with 67W Fast Charger in box"
    }
  },
  {
    "id": "prd_nova_pro_256",
    "sku": "MOB-0033",
    "vendorId": "vnd_digimart",
    "vendorName": "DigiMart",
    "name": "Nova Pro Max 5G 256GB",
    "description": "Pro grade smartphone with 108MP Periscope optical zoom camera and Snapdragon 8 Gen 2 powerhouse.",
    "category": "Mobiles",
    "brand": "Nexa",
    "price": 29999,
    "mrp": 36999,
    "discountPercent": 18,
    "stockQty": 14,
    "images": [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.7,
    "reviewCount": 315
  },
  {
    "id": "prd_volt_flip",
    "sku": "MOB-0034",
    "vendorId": "vnd_digimart",
    "vendorName": "DigiMart",
    "name": "UrbanVolt Flip Foldable Smartphone",
    "description": "Next-gen compact clamshell foldable with zero-gap titanium hinge and dual OLED displays.",
    "category": "Mobiles",
    "brand": "UrbanVolt",
    "price": 49999,
    "mrp": 64999,
    "discountPercent": 23,
    "stockQty": 9,
    "images": [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.5,
    "reviewCount": 84
  },
  {
    "id": "prd_lite_budget_phone",
    "sku": "MOB-0035",
    "vendorId": "vnd_digimart",
    "vendorName": "DigiMart",
    "name": "Nexa Lite 4G Smartphone 64GB",
    "description": "Affordable daily driver smartphone with massive 6000mAh battery and stereo speakers.",
    "category": "Mobiles",
    "brand": "Nexa",
    "price": 7499,
    "mrp": 9999,
    "discountPercent": 25,
    "stockQty": 140,
    "images": [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4,
    "reviewCount": 410
  },
  {
    "id": "prd_fast_charger_65w",
    "sku": "MOB-0036",
    "vendorId": "vnd_techwest",
    "vendorName": "TechWest Retail",
    "name": "VoltSpeed GaN 65W Fast Charger",
    "description": "Ultra-compact Gallium Nitride triple-port wall charger supporting USB-PD 3.0 and PPS.",
    "category": "Mobiles",
    "brand": "UrbanVolt",
    "price": 1499,
    "mrp": 2299,
    "discountPercent": 34,
    "stockQty": 95,
    "images": [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622445262464-84b1a0731f82?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622445262464-84b1a0731f82?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.6,
    "reviewCount": 320
  },
  {
    "id": "prd_wireless_dock",
    "sku": "MOB-0037",
    "vendorId": "vnd_techwest",
    "vendorName": "TechWest Retail",
    "name": "MagStand 3-in-1 Wireless Charging Station",
    "description": "Magnetic desktop stand that fast-charges iPhone/Android phone, watch and wireless earbuds together.",
    "category": "Mobiles",
    "brand": "UrbanVolt",
    "price": 2699,
    "mrp": 3999,
    "discountPercent": 32,
    "stockQty": 54,
    "images": [
      "https://images.unsplash.com/photo-1622445262464-84b1a0731f82?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622445262464-84b1a0731f82?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.3,
    "reviewCount": 160
  },
  {
    "id": "prd_aerobook_14",
    "sku": "CMP-0008",
    "vendorId": "vnd_digimart",
    "vendorName": "DigiMart",
    "name": "AeroBook 14 Laptop",
    "description": "Ultra-thin aluminum 1.2kg ultrabook with Intel Core i7 13th Gen, 16GB LPDDR5, 512GB NVMe SSD and 100% sRGB display.",
    "category": "Computers",
    "brand": "AeroTech",
    "price": 52990,
    "mrp": 67990,
    "discountPercent": 22,
    "stockQty": 8,
    "images": [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.6,
    "reviewCount": 194,
    "specifications": {
      "CPU": "Intel Core i7-1360P (12 Cores, up to 5.0GHz)",
      "Memory": "16GB LPDDR5 5200MHz",
      "Storage": "512GB PCIe 4.0 NVMe M.2 SSD",
      "Screen": "14.0\" 2.8K OLED (2880 x 1800), 90Hz",
      "Battery": "70Wh Li-Ion, 65W USB-C PD Charging"
    }
  },
  {
    "id": "prd_aerobook_pro_16",
    "sku": "CMP-0009",
    "vendorId": "vnd_digimart",
    "vendorName": "DigiMart",
    "name": "AeroBook Pro 16 Studio Laptop",
    "description": "Workstation laptop powered by Ryzen 9 7940HS and NVIDIA RTX 4060 graphics with 32GB RAM.",
    "category": "Computers",
    "brand": "AeroTech",
    "price": 94990,
    "mrp": 119900,
    "discountPercent": 20,
    "stockQty": 4,
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.8,
    "reviewCount": 68
  },
  {
    "id": "prd_mech_keyboard",
    "sku": "CMP-0010",
    "vendorId": "vnd_techwest",
    "vendorName": "TechWest Retail",
    "name": "KeyCraft 75% Mechanical Keyboard",
    "description": "Hot-swappable tactile RGB wireless mechanical keyboard with aluminum frame and PBT keycaps.",
    "category": "Computers",
    "brand": "Zenith",
    "price": 4499,
    "mrp": 6200,
    "discountPercent": 27,
    "stockQty": 35,
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.5,
    "reviewCount": 280
  },
  {
    "id": "prd_precision_mouse",
    "sku": "CMP-0011",
    "vendorId": "vnd_techwest",
    "vendorName": "TechWest Retail",
    "name": "GlidePro Ergonomic Wireless Mouse",
    "description": "Sculpted thumb rest, dual scroll wheels, 8000 DPI sensor and Bluetooth/2.4GHz multi-device toggle.",
    "category": "Computers",
    "brand": "Zenith",
    "price": 2199,
    "mrp": 3200,
    "discountPercent": 31,
    "stockQty": 75,
    "images": [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.4,
    "reviewCount": 310
  },
  {
    "id": "prd_curved_monitor_27",
    "sku": "CMP-0012",
    "vendorId": "vnd_digimart",
    "vendorName": "DigiMart",
    "name": "ViewMax 27-inch 165Hz Curved Gaming Monitor",
    "description": "1500R curvature QHD 1440p gaming monitor with AMD FreeSync Premium and 1ms MPRT.",
    "category": "Computers",
    "brand": "AeroTech",
    "price": 18499,
    "mrp": 24999,
    "discountPercent": 26,
    "stockQty": 16,
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.5,
    "reviewCount": 145
  },
  {
    "id": "prd_usb_hub_8in1",
    "sku": "CMP-0013",
    "vendorId": "vnd_techwest",
    "vendorName": "TechWest Retail",
    "name": "PortHub 8-in-1 USB-C Docking Adapter",
    "description": "Dual 4K HDMI, Gigabit Ethernet, 100W Power Delivery and high-speed SD/TF card reader.",
    "category": "Computers",
    "brand": "Zenith",
    "price": 1899,
    "mrp": 2899,
    "discountPercent": 34,
    "stockQty": 110,
    "images": [
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.3,
    "reviewCount": 215
  },
  {
    "id": "prd_snappro_camera",
    "sku": "CAM-0003",
    "vendorId": "vnd_digimart",
    "vendorName": "DigiMart",
    "name": "SnapPro Mirrorless Camera",
    "description": "24.2MP full-frame mirrorless digital camera body with 5-axis sensor stabilization and 4K 60fps video capture.",
    "category": "Cameras",
    "brand": "SnapPro",
    "price": 38500,
    "mrp": 46000,
    "discountPercent": 16,
    "stockQty": 6,
    "images": [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": false,
    "deletedAt": "2026-03-20T10:00:00.000Z",
    "avgRating": 4.8,
    "reviewCount": 86,
    "specifications": {
      "Sensor": "24.2MP Full-Frame Exmor CMOS",
      "Video": "4K HDR 60fps 10-bit 4:2:2",
      "Stabilization": "5-Axis In-Body Sensor Shift",
      "Autofocus": "693 Phase-Detection AF Points with Eye AF",
      "Mount": "Universal E-Mount"
    }
  },
  {
    "id": "prd_vlog_cam_4k",
    "sku": "CAM-0004",
    "vendorId": "vnd_digimart",
    "vendorName": "DigiMart",
    "name": "VlogMaster Pocket 4K Action Camera",
    "description": "Rugged waterproof compact creator camera with front flip screen, gimbal stabilization and wind filter.",
    "category": "Cameras",
    "brand": "SnapPro",
    "price": 15999,
    "mrp": 21999,
    "discountPercent": 27,
    "stockQty": 25,
    "images": [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.3,
    "reviewCount": 110
  },
  {
    "id": "prd_cam_prime_lens",
    "sku": "CAM-0005",
    "vendorId": "vnd_digimart",
    "vendorName": "DigiMart",
    "name": "AeroOptics 50mm f/1.8 Prime Lens",
    "description": "Super-sharp portrait prime lens offering creamy bokeh and silent stepper autofocus motor.",
    "category": "Cameras",
    "brand": "SnapPro",
    "price": 12499,
    "mrp": 16500,
    "discountPercent": 24,
    "stockQty": 18,
    "images": [
      "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.7,
    "reviewCount": 94
  },
  {
    "id": "prd_carbon_tripod",
    "sku": "CAM-0006",
    "vendorId": "vnd_techwest",
    "vendorName": "TechWest Retail",
    "name": "Trekker Carbon Fiber Travel Tripod",
    "description": "Lightweight 1.3kg tripod with 360-degree fluid ball head, monopod conversion and arca-swiss plate.",
    "category": "Cameras",
    "brand": "Trekker",
    "price": 4999,
    "mrp": 7500,
    "discountPercent": 33,
    "stockQty": 40,
    "images": [
      "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.6,
    "reviewCount": 78
  },
  {
    "id": "prd_gimbal_3axis",
    "sku": "CAM-0007",
    "vendorId": "vnd_digimart",
    "vendorName": "DigiMart",
    "name": "SmoothMotion 3-Axis Smartphone Gimbal",
    "description": "Handheld motorized stabilizer with smart gesture tracking, extension rod and magnetic quick mount.",
    "category": "Cameras",
    "brand": "Zenith",
    "price": 6499,
    "mrp": 8999,
    "discountPercent": 27,
    "stockQty": 28,
    "images": [
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.4,
    "reviewCount": 135
  },
  {
    "id": "prd_trekker_30l",
    "sku": "BAG-0221",
    "vendorId": "vnd_urbanstride",
    "vendorName": "UrbanStride",
    "name": "Trekker 30L Waterproof Backpack",
    "description": "Weatherproof ripstop adventure backpack with padded 15.6-inch laptop compartment and ergonomic air-mesh harness.",
    "category": "Bags",
    "brand": "Trekker",
    "price": 1499,
    "mrp": 2499,
    "discountPercent": 40,
    "stockQty": 210,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.5,
    "reviewCount": 430,
    "specifications": {
      "Capacity": "30 Litres",
      "Material": "Water-Repellent 600D Polyester Ripstop",
      "Laptop Sleeve": "Fits up to 15.6-inch Laptops",
      "Dimensions": "48 x 32 x 20 cm",
      "Warranty": "2 Years Manufacturer Warranty"
    }
  },
  {
    "id": "prd_polar_sunglasses",
    "sku": "BAG-0099",
    "vendorId": "vnd_urbanstride",
    "vendorName": "UrbanStride",
    "name": "Polar Aviator Polarized Sunglasses",
    "description": "Classic UV400 polarized teardrop aviator shades with ultra-light stainless steel frames.",
    "category": "Bags",
    "brand": "Polar",
    "price": 999,
    "mrp": 1899,
    "discountPercent": 47,
    "stockQty": 45,
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.2,
    "reviewCount": 278
  },
  {
    "id": "prd_leather_messenger",
    "sku": "BAG-0222",
    "vendorId": "vnd_urbanstride",
    "vendorName": "UrbanStride",
    "name": "Heritage Leather Messenger Briefcase",
    "description": "Handcrafted full-grain saddle leather shoulder briefcase with brass hardware.",
    "category": "Bags",
    "brand": "UrbanStride",
    "price": 3499,
    "mrp": 5499,
    "discountPercent": 36,
    "stockQty": 25,
    "images": [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.7,
    "reviewCount": 88
  },
  {
    "id": "prd_gym_duffel",
    "sku": "BAG-0223",
    "vendorId": "vnd_urbanstride",
    "vendorName": "UrbanStride",
    "name": "FitPro All-Weather Gym Duffel Bag",
    "description": "Spacious sports duffel bag featuring dedicated ventilated shoe tunnel and waterproof wet pocket.",
    "category": "Bags",
    "brand": "Stride",
    "price": 1199,
    "mrp": 1999,
    "discountPercent": 40,
    "stockQty": 60,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.3,
    "reviewCount": 164
  },
  {
    "id": "prd_rfid_wallet",
    "sku": "BAG-0224",
    "vendorId": "vnd_urbanstride",
    "vendorName": "UrbanStride",
    "name": "VaultSlim RFID Blocking Minimalist Wallet",
    "description": "Aerospace aluminum pop-up cardholder with leather cash pocket and RFID skimming protection.",
    "category": "Bags",
    "brand": "Polar",
    "price": 799,
    "mrp": 1299,
    "discountPercent": 38,
    "stockQty": 180,
    "images": [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.4,
    "reviewCount": 390
  },
  {
    "id": "prd_hard_luggage_24",
    "sku": "BAG-0225",
    "vendorId": "vnd_urbanstride",
    "vendorName": "UrbanStride",
    "name": "AeroTravel 24-inch Polycarbonate Trolley",
    "description": "Unbreakable German polycarbonate spinner suitcase with recessed TSA lock and 360-degree dual wheels.",
    "category": "Bags",
    "brand": "Trekker",
    "price": 4299,
    "mrp": 6999,
    "discountPercent": 38,
    "stockQty": 18,
    "images": [
      "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=800&auto=format&fit=crop&q=80"
    ],
    "isActive": true,
    "avgRating": 4.6,
    "reviewCount": 120
  }
];

export const initialCoupons: Coupon[] = [
  {
    "id": "cpn_save10",
    "code": "SAVE10",
    "type": "percent",
    "value": 10,
    "validFrom": "2025-01-01T00:00:00.000Z",
    "validTo": "2027-12-31T23:59:59.000Z",
    "usageLimit": 1000,
    "usedCount": 245,
    "isActive": true,
    "minOrderValue": 500
  },
  {
    "id": "cpn_festive200",
    "code": "FESTIVE200",
    "type": "flat",
    "value": 200,
    "validFrom": "2025-01-01T00:00:00.000Z",
    "validTo": "2027-12-31T23:59:59.000Z",
    "usageLimit": 500,
    "usedCount": 180,
    "isActive": true,
    "minOrderValue": 2000
  },
  {
    "id": "cpn_welcome5",
    "code": "WELCOME5",
    "type": "percent",
    "value": 5,
    "validFrom": "2025-01-01T00:00:00.000Z",
    "validTo": "2027-12-31T23:59:59.000Z",
    "usageLimit": 5000,
    "usedCount": 1200,
    "isActive": true,
    "minOrderValue": 0
  },
  {
    "id": "cpn_monsoon15",
    "code": "MONSOON15",
    "type": "percent",
    "value": 15,
    "validFrom": "2025-06-01T00:00:00.000Z",
    "validTo": "2025-08-31T23:59:59.000Z",
    "usageLimit": 200,
    "usedCount": 200,
    "isActive": false,
    "minOrderValue": 1000
  }
];

export const initialOrders: Order[] = [
  {
    "id": "ord_rec_0042",
    "orderId": "ORD-2026-0042",
    "userId": "usr_ananya",
    "customerName": "Ananya Rao",
    "customerEmail": "ananya.rao@example.com",
    "customerPhone": "+91 98765 43210",
    "items": [
      {
        "productId": "prd_aurora",
        "sku": "AUD-0001",
        "name": "Aurora Wireless Headphones",
        "qty": 1,
        "unitPrice": 3499,
        "vendorId": "vnd_techwest",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
      },
      {
        "productId": "prd_pulsefit",
        "sku": "WRB-0014",
        "name": "PulseFit Smart Watch",
        "qty": 1,
        "unitPrice": 5999,
        "vendorId": "vnd_techwest",
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_ananya_1",
      "name": "Ananya Rao",
      "phone": "+91 98765 43210",
      "street": "Plot 42, Road No. 7, Jubilee Hills",
      "city": "Hyderabad",
      "state": "Telangana",
      "pincode": "500033"
    },
    "billingAddress": {
      "id": "addr_ananya_1",
      "name": "Ananya Rao",
      "phone": "+91 98765 43210",
      "street": "Plot 42, Road No. 7, Jubilee Hills",
      "city": "Hyderabad",
      "state": "Telangana",
      "pincode": "500033"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 9498,
    "couponDiscount": 0,
    "taxAmount": 1710,
    "totalAmount": 11208,
    "status": "Confirmed",
    "placedAt": "2026-03-28T14:32:00.000Z",
    "updatedAt": "2026-03-28T14:32:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-03-28T14:32:00.000Z",
        "note": "Payment successful. Order confirmed.",
        "changedBy": "System"
      }
    ]
  },
  {
    "id": "ord_rec_0031",
    "orderId": "ORD-2026-0031",
    "userId": "usr_ananya",
    "customerName": "Ananya Rao",
    "customerEmail": "ananya.rao@example.com",
    "customerPhone": "+91 98765 43210",
    "items": [
      {
        "productId": "prd_aerobook_14",
        "sku": "CMP-0008",
        "name": "AeroBook 14 Laptop",
        "qty": 1,
        "unitPrice": 52990,
        "vendorId": "vnd_digimart",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_ananya_1",
      "name": "Ananya Rao",
      "phone": "+91 98765 43210",
      "street": "Plot 42, Road No. 7, Jubilee Hills",
      "city": "Hyderabad",
      "state": "Telangana",
      "pincode": "500033"
    },
    "billingAddress": {
      "id": "addr_ananya_1",
      "name": "Ananya Rao",
      "phone": "+91 98765 43210",
      "street": "Plot 42, Road No. 7, Jubilee Hills",
      "city": "Hyderabad",
      "state": "Telangana",
      "pincode": "500033"
    },
    "shippingMethod": "express",
    "shippingCost": 149,
    "subtotal": 52990,
    "couponDiscount": 5299,
    "couponCode": "SAVE10",
    "taxAmount": 8584,
    "totalAmount": 56424,
    "status": "Shipped",
    "placedAt": "2026-03-22T09:15:00.000Z",
    "updatedAt": "2026-03-23T11:00:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-03-22T09:15:00.000Z",
        "note": "Order placed by customer.",
        "changedBy": "System"
      },
      {
        "status": "Processing",
        "timestamp": "2026-03-22T14:00:00.000Z",
        "note": "Vendor DigiMart prepared package.",
        "changedBy": "Vendor"
      },
      {
        "status": "Shipped",
        "timestamp": "2026-03-23T11:00:00.000Z",
        "note": "Handed over to delivery dispatch.",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0019",
    "orderId": "ORD-2026-0019",
    "userId": "usr_ananya",
    "customerName": "Ananya Rao",
    "customerEmail": "ananya.rao@example.com",
    "customerPhone": "+91 98765 43210",
    "items": [
      {
        "productId": "prd_stridex",
        "sku": "FTW-0107",
        "name": "StrideX Running Shoes",
        "qty": 1,
        "unitPrice": 2799,
        "vendorId": "vnd_urbanstride",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_ananya_1",
      "name": "Ananya Rao",
      "phone": "+91 98765 43210",
      "street": "Plot 42, Road No. 7, Jubilee Hills",
      "city": "Hyderabad",
      "state": "Telangana",
      "pincode": "500033"
    },
    "billingAddress": {
      "id": "addr_ananya_1",
      "name": "Ananya Rao",
      "phone": "+91 98765 43210",
      "street": "Plot 42, Road No. 7, Jubilee Hills",
      "city": "Hyderabad",
      "state": "Telangana",
      "pincode": "500033"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 2799,
    "couponDiscount": 0,
    "taxAmount": 504,
    "totalAmount": 3352,
    "status": "Delivered",
    "placedAt": "2026-04-05T10:00:00.000Z",
    "updatedAt": "2026-04-08T15:30:00.000Z",
    "deliveredAt": "2026-04-08T15:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-04-05T10:00:00.000Z",
        "note": "Order Confirmed",
        "changedBy": "System"
      },
      {
        "status": "Processing",
        "timestamp": "2026-04-06T11:00:00.000Z",
        "note": "Processing by UrbanStride",
        "changedBy": "Vendor"
      },
      {
        "status": "Shipped",
        "timestamp": "2026-04-07T09:00:00.000Z",
        "note": "Dispatched for delivery",
        "changedBy": "Vendor"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-04-08T15:30:00.000Z",
        "note": "Delivered to recipient",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0007",
    "orderId": "ORD-2026-0007",
    "userId": "usr_rahul",
    "customerName": "Rahul Verma",
    "customerEmail": "rahul.verma@example.com",
    "customerPhone": "+91 98234 56789",
    "items": [
      {
        "productId": "prd_polar_sunglasses",
        "sku": "BAG-0099",
        "name": "Polar Aviator Polarized Sunglasses",
        "qty": 1,
        "unitPrice": 999,
        "vendorId": "vnd_urbanstride",
        "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_rahul_1",
      "name": "Rahul Verma",
      "phone": "+91 98234 56789",
      "street": "Flat 302, Palm Heights, Indiranagar",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560038"
    },
    "billingAddress": {
      "id": "addr_rahul_1",
      "name": "Rahul Verma",
      "phone": "+91 98234 56789",
      "street": "Flat 302, Palm Heights, Indiranagar",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560038"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 999,
    "couponDiscount": 0,
    "taxAmount": 180,
    "totalAmount": 1228,
    "status": "Cancelled",
    "cancelReason": "Customer changed mind before dispatch.",
    "placedAt": "2026-01-14T09:00:00.000Z",
    "updatedAt": "2026-01-14T11:00:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-14T09:00:00.000Z",
        "note": "Order Confirmed",
        "changedBy": "System"
      },
      {
        "status": "Cancelled",
        "timestamp": "2026-01-14T11:00:00.000Z",
        "note": "Cancelled by customer before dispatch. Stock restored.",
        "changedBy": "Customer"
      }
    ]
  },
  {
    "id": "ord_rec_0001",
    "orderId": "ORD-2026-0001",
    "userId": "usr_sana",
    "customerName": "Sana Khan",
    "customerEmail": "sana.khan@example.com",
    "customerPhone": "+91 98990 12345",
    "items": [
      {
        "productId": "prd_sonic_pulse",
        "sku": "AUD-0002",
        "name": "SonicPulse TWS Earbuds",
        "qty": 1,
        "unitPrice": 1999,
        "vendorId": "vnd_techwest",
        "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_1",
      "name": "Sana Khan",
      "phone": "+91 98990 12345",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_1",
      "name": "Sana Khan",
      "phone": "+91 98990 12345",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 1999,
    "couponDiscount": 0,
    "taxAmount": 360,
    "totalAmount": 2408,
    "status": "Delivered",
    "placedAt": "2026-01-05T18:30:00.000Z",
    "updatedAt": "2026-01-07T18:30:00.000Z",
    "deliveredAt": "2026-01-10T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-05T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-01-07T18:30:00.000Z",
        "note": "Status updated to Delivered",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0002",
    "orderId": "ORD-2026-0002",
    "userId": "usr_dev",
    "customerName": "Dev Patel",
    "customerEmail": "dev.patel@example.com",
    "customerPhone": "+91 98700 98765",
    "items": [
      {
        "productId": "prd_boombox_mini",
        "sku": "AUD-0003",
        "name": "BoomBox Mini Portable Speaker",
        "qty": 1,
        "unitPrice": 2499,
        "vendorId": "vnd_techwest",
        "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_2",
      "name": "Dev Patel",
      "phone": "+91 98700 98765",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_2",
      "name": "Dev Patel",
      "phone": "+91 98700 98765",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 2499,
    "couponDiscount": 0,
    "taxAmount": 450,
    "totalAmount": 2998,
    "status": "Shipped",
    "placedAt": "2026-01-06T18:30:00.000Z",
    "updatedAt": "2026-01-08T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-06T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Shipped",
        "timestamp": "2026-01-08T18:30:00.000Z",
        "note": "Status updated to Shipped",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0003",
    "orderId": "ORD-2026-0003",
    "userId": "usr_rahul",
    "customerName": "Rahul Verma",
    "customerEmail": "rahul.verma@example.com",
    "customerPhone": "+91 98234 56789",
    "items": [
      {
        "productId": "prd_studio_pro",
        "sku": "AUD-0004",
        "name": "StudioPro Wired Monitoring Headphones",
        "qty": 1,
        "unitPrice": 4999,
        "vendorId": "vnd_techwest",
        "image": "https://images.unsplash.com/photo-1599669454699-248893623440?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_3",
      "name": "Rahul Verma",
      "phone": "+91 98234 56789",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_3",
      "name": "Rahul Verma",
      "phone": "+91 98234 56789",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 4999,
    "couponDiscount": 0,
    "taxAmount": 900,
    "totalAmount": 5948,
    "status": "Processing",
    "placedAt": "2026-01-07T18:30:00.000Z",
    "updatedAt": "2026-01-09T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-07T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Processing",
        "timestamp": "2026-01-09T18:30:00.000Z",
        "note": "Status updated to Processing",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0004",
    "orderId": "ORD-2026-0004",
    "userId": "usr_meera",
    "customerName": "Meera Iyer",
    "customerEmail": "meera.iyer@example.com",
    "customerPhone": "+91 98333 44556",
    "items": [
      {
        "productId": "prd_soundbar_300",
        "sku": "AUD-0005",
        "name": "CinemaSound 2.1 Soundbar with Subwoofer",
        "qty": 1,
        "unitPrice": 7999,
        "vendorId": "vnd_digimart",
        "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_4",
      "name": "Meera Iyer",
      "phone": "+91 98333 44556",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_4",
      "name": "Meera Iyer",
      "phone": "+91 98333 44556",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 7999,
    "couponDiscount": 0,
    "taxAmount": 1440,
    "totalAmount": 9439,
    "status": "Confirmed",
    "placedAt": "2026-01-08T18:30:00.000Z",
    "updatedAt": "2026-01-10T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-08T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      }
    ]
  },
  {
    "id": "ord_rec_0005",
    "orderId": "ORD-2026-0005",
    "userId": "usr_karthik",
    "customerName": "Karthik S.",
    "customerEmail": "karthik.s@example.com",
    "customerPhone": "+91 98401 23456",
    "items": [
      {
        "productId": "prd_vocal_mic",
        "sku": "AUD-0006",
        "name": "StreamCast USB Condenser Microphone",
        "qty": 1,
        "unitPrice": 3299,
        "vendorId": "vnd_digimart",
        "image": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_5",
      "name": "Karthik S.",
      "phone": "+91 98401 23456",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_5",
      "name": "Karthik S.",
      "phone": "+91 98401 23456",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 3299,
    "couponDiscount": 0,
    "taxAmount": 594,
    "totalAmount": 3942,
    "status": "Delivered",
    "placedAt": "2026-01-09T18:30:00.000Z",
    "updatedAt": "2026-01-11T18:30:00.000Z",
    "deliveredAt": "2026-01-14T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-09T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-01-11T18:30:00.000Z",
        "note": "Status updated to Delivered",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0006",
    "orderId": "ORD-2026-0006",
    "userId": "usr_vikram",
    "customerName": "Vikram Singh",
    "customerEmail": "vikram.singh@example.com",
    "customerPhone": "+91 98102 34567",
    "items": [
      {
        "productId": "prd_pulsefit",
        "sku": "WRB-0014",
        "name": "PulseFit Smart Watch",
        "qty": 1,
        "unitPrice": 5999,
        "vendorId": "vnd_techwest",
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_6",
      "name": "Vikram Singh",
      "phone": "+91 98102 34567",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_6",
      "name": "Vikram Singh",
      "phone": "+91 98102 34567",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 5999,
    "couponDiscount": 0,
    "taxAmount": 1080,
    "totalAmount": 7079,
    "status": "Cancelled",
    "placedAt": "2026-01-10T18:30:00.000Z",
    "updatedAt": "2026-01-12T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-10T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Cancelled",
        "timestamp": "2026-01-12T18:30:00.000Z",
        "note": "Status updated to Cancelled",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0008",
    "orderId": "ORD-2026-0008",
    "userId": "usr_amit",
    "customerName": "Amit Shah",
    "customerEmail": "amit.shah@example.com",
    "customerPhone": "+91 98250 67890",
    "items": [
      {
        "productId": "prd_smartring_aura",
        "sku": "WRB-0016",
        "name": "Aura Smart Health Ring Gen 2",
        "qty": 1,
        "unitPrice": 12999,
        "vendorId": "vnd_techwest",
        "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_8",
      "name": "Amit Shah",
      "phone": "+91 98250 67890",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_8",
      "name": "Amit Shah",
      "phone": "+91 98250 67890",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 12999,
    "couponDiscount": 0,
    "taxAmount": 2340,
    "totalAmount": 15339,
    "status": "Delivered",
    "placedAt": "2026-01-12T18:30:00.000Z",
    "updatedAt": "2026-01-14T18:30:00.000Z",
    "deliveredAt": "2026-01-17T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-12T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-01-14T18:30:00.000Z",
        "note": "Status updated to Delivered",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0009",
    "orderId": "ORD-2026-0009",
    "userId": "usr_neha",
    "customerName": "Neha Gupta",
    "customerEmail": "neha.gupta@example.com",
    "customerPhone": "+91 98115 54321",
    "items": [
      {
        "productId": "prd_chronos_classic",
        "sku": "WRB-0017",
        "name": "Chronos Hybrid Luxury Watch",
        "qty": 1,
        "unitPrice": 8499,
        "vendorId": "vnd_urbanstride",
        "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_9",
      "name": "Neha Gupta",
      "phone": "+91 98115 54321",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_9",
      "name": "Neha Gupta",
      "phone": "+91 98115 54321",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 8499,
    "couponDiscount": 0,
    "taxAmount": 1530,
    "totalAmount": 10029,
    "status": "Delivered",
    "placedAt": "2026-01-13T18:30:00.000Z",
    "updatedAt": "2026-01-15T18:30:00.000Z",
    "deliveredAt": "2026-01-18T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-13T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-01-15T18:30:00.000Z",
        "note": "Status updated to Delivered",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0010",
    "orderId": "ORD-2026-0010",
    "userId": "usr_rohan",
    "customerName": "Rohan Mehta",
    "customerEmail": "rohan.mehta@example.com",
    "customerPhone": "+91 98205 99887",
    "items": [
      {
        "productId": "prd_kids_gps_watch",
        "sku": "WRB-0018",
        "name": "SafeTrack Kids GPS Smartwatch",
        "qty": 1,
        "unitPrice": 3499,
        "vendorId": "vnd_digimart",
        "image": "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_10",
      "name": "Rohan Mehta",
      "phone": "+91 98205 99887",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_10",
      "name": "Rohan Mehta",
      "phone": "+91 98205 99887",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 3499,
    "couponDiscount": 0,
    "taxAmount": 630,
    "totalAmount": 4178,
    "status": "Shipped",
    "placedAt": "2026-01-14T18:30:00.000Z",
    "updatedAt": "2026-01-16T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-14T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Shipped",
        "timestamp": "2026-01-16T18:30:00.000Z",
        "note": "Status updated to Shipped",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0011",
    "orderId": "ORD-2026-0011",
    "userId": "usr_pooja",
    "customerName": "Pooja Nair",
    "customerEmail": "pooja.nair@example.com",
    "customerPhone": "+91 98471 22334",
    "items": [
      {
        "productId": "prd_stridex",
        "sku": "FTW-0107",
        "name": "StrideX Running Shoes",
        "qty": 1,
        "unitPrice": 2799,
        "vendorId": "vnd_urbanstride",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_11",
      "name": "Pooja Nair",
      "phone": "+91 98471 22334",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_11",
      "name": "Pooja Nair",
      "phone": "+91 98471 22334",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 2799,
    "couponDiscount": 0,
    "taxAmount": 504,
    "totalAmount": 3352,
    "status": "Processing",
    "placedAt": "2026-01-15T18:30:00.000Z",
    "updatedAt": "2026-01-17T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-15T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Processing",
        "timestamp": "2026-01-17T18:30:00.000Z",
        "note": "Status updated to Processing",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0012",
    "orderId": "ORD-2026-0012",
    "userId": "usr_ananya",
    "customerName": "Ananya Rao",
    "customerEmail": "ananya.rao@example.com",
    "customerPhone": "+91 98765 43210",
    "items": [
      {
        "productId": "prd_urban_sneakers",
        "sku": "FTW-0108",
        "name": "UrbanStride Casual Court Sneakers",
        "qty": 1,
        "unitPrice": 1899,
        "vendorId": "vnd_urbanstride",
        "image": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_12",
      "name": "Ananya Rao",
      "phone": "+91 98765 43210",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_12",
      "name": "Ananya Rao",
      "phone": "+91 98765 43210",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 1899,
    "couponDiscount": 0,
    "taxAmount": 342,
    "totalAmount": 2290,
    "status": "Confirmed",
    "placedAt": "2026-01-16T18:30:00.000Z",
    "updatedAt": "2026-01-18T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-16T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      }
    ]
  },
  {
    "id": "ord_rec_0013",
    "orderId": "ORD-2026-0013",
    "userId": "usr_sana",
    "customerName": "Sana Khan",
    "customerEmail": "sana.khan@example.com",
    "customerPhone": "+91 98990 12345",
    "items": [
      {
        "productId": "prd_trail_blazer_boots",
        "sku": "FTW-0109",
        "name": "TrailBlazer Waterproof Hiking Boots",
        "qty": 1,
        "unitPrice": 3999,
        "vendorId": "vnd_urbanstride",
        "image": "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_13",
      "name": "Sana Khan",
      "phone": "+91 98990 12345",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_13",
      "name": "Sana Khan",
      "phone": "+91 98990 12345",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 3999,
    "couponDiscount": 0,
    "taxAmount": 720,
    "totalAmount": 4768,
    "status": "Delivered",
    "placedAt": "2026-01-17T18:30:00.000Z",
    "updatedAt": "2026-01-19T18:30:00.000Z",
    "deliveredAt": "2026-01-22T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-17T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-01-19T18:30:00.000Z",
        "note": "Status updated to Delivered",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0014",
    "orderId": "ORD-2026-0014",
    "userId": "usr_dev",
    "customerName": "Dev Patel",
    "customerEmail": "dev.patel@example.com",
    "customerPhone": "+91 98700 98765",
    "items": [
      {
        "productId": "prd_aero_slides",
        "sku": "FTW-0110",
        "name": "AeroSlide Recovery Foam Sandals",
        "qty": 1,
        "unitPrice": 899,
        "vendorId": "vnd_urbanstride",
        "image": "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_14",
      "name": "Dev Patel",
      "phone": "+91 98700 98765",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_14",
      "name": "Dev Patel",
      "phone": "+91 98700 98765",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 899,
    "couponDiscount": 0,
    "taxAmount": 162,
    "totalAmount": 1110,
    "status": "Cancelled",
    "placedAt": "2026-01-18T18:30:00.000Z",
    "updatedAt": "2026-01-20T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-18T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Cancelled",
        "timestamp": "2026-01-20T18:30:00.000Z",
        "note": "Status updated to Cancelled",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0015",
    "orderId": "ORD-2026-0015",
    "userId": "usr_rahul",
    "customerName": "Rahul Verma",
    "customerEmail": "rahul.verma@example.com",
    "customerPhone": "+91 98234 56789",
    "items": [
      {
        "productId": "prd_stride_training",
        "sku": "FTW-0111",
        "name": "Apex Trainer Cross-Training Shoes",
        "qty": 1,
        "unitPrice": 3299,
        "vendorId": "vnd_urbanstride",
        "image": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_15",
      "name": "Rahul Verma",
      "phone": "+91 98234 56789",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_15",
      "name": "Rahul Verma",
      "phone": "+91 98234 56789",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 3299,
    "couponDiscount": 0,
    "taxAmount": 594,
    "totalAmount": 3942,
    "status": "Returned",
    "placedAt": "2026-01-19T18:30:00.000Z",
    "updatedAt": "2026-01-21T18:30:00.000Z",
    "deliveredAt": "2026-01-24T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-19T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Returned",
        "timestamp": "2026-01-21T18:30:00.000Z",
        "note": "Status updated to Returned",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0016",
    "orderId": "ORD-2026-0016",
    "userId": "usr_meera",
    "customerName": "Meera Iyer",
    "customerEmail": "meera.iyer@example.com",
    "customerPhone": "+91 98333 44556",
    "items": [
      {
        "productId": "prd_nova_5g",
        "sku": "MOB-0032",
        "name": "Nova 5G Smartphone 128GB",
        "qty": 1,
        "unitPrice": 17999,
        "vendorId": "vnd_digimart",
        "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_16",
      "name": "Meera Iyer",
      "phone": "+91 98333 44556",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_16",
      "name": "Meera Iyer",
      "phone": "+91 98333 44556",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 17999,
    "couponDiscount": 0,
    "taxAmount": 3240,
    "totalAmount": 21239,
    "status": "Delivered",
    "placedAt": "2026-01-20T18:30:00.000Z",
    "updatedAt": "2026-01-22T18:30:00.000Z",
    "deliveredAt": "2026-01-25T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-20T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-01-22T18:30:00.000Z",
        "note": "Status updated to Delivered",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0017",
    "orderId": "ORD-2026-0017",
    "userId": "usr_karthik",
    "customerName": "Karthik S.",
    "customerEmail": "karthik.s@example.com",
    "customerPhone": "+91 98401 23456",
    "items": [
      {
        "productId": "prd_nova_pro_256",
        "sku": "MOB-0033",
        "name": "Nova Pro Max 5G 256GB",
        "qty": 1,
        "unitPrice": 29999,
        "vendorId": "vnd_digimart",
        "image": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_17",
      "name": "Karthik S.",
      "phone": "+91 98401 23456",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_17",
      "name": "Karthik S.",
      "phone": "+91 98401 23456",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 29999,
    "couponDiscount": 0,
    "taxAmount": 5400,
    "totalAmount": 35399,
    "status": "Delivered",
    "placedAt": "2026-01-21T18:30:00.000Z",
    "updatedAt": "2026-01-23T18:30:00.000Z",
    "deliveredAt": "2026-01-26T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-21T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-01-23T18:30:00.000Z",
        "note": "Status updated to Delivered",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0018",
    "orderId": "ORD-2026-0018",
    "userId": "usr_vikram",
    "customerName": "Vikram Singh",
    "customerEmail": "vikram.singh@example.com",
    "customerPhone": "+91 98102 34567",
    "items": [
      {
        "productId": "prd_volt_flip",
        "sku": "MOB-0034",
        "name": "UrbanVolt Flip Foldable Smartphone",
        "qty": 1,
        "unitPrice": 49999,
        "vendorId": "vnd_digimart",
        "image": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_18",
      "name": "Vikram Singh",
      "phone": "+91 98102 34567",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_18",
      "name": "Vikram Singh",
      "phone": "+91 98102 34567",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 49999,
    "couponDiscount": 0,
    "taxAmount": 9000,
    "totalAmount": 58999,
    "status": "Shipped",
    "placedAt": "2026-01-22T18:30:00.000Z",
    "updatedAt": "2026-01-24T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-22T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Shipped",
        "timestamp": "2026-01-24T18:30:00.000Z",
        "note": "Status updated to Shipped",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0020",
    "orderId": "ORD-2026-0020",
    "userId": "usr_amit",
    "customerName": "Amit Shah",
    "customerEmail": "amit.shah@example.com",
    "customerPhone": "+91 98250 67890",
    "items": [
      {
        "productId": "prd_fast_charger_65w",
        "sku": "MOB-0036",
        "name": "VoltSpeed GaN 65W Fast Charger",
        "qty": 1,
        "unitPrice": 1499,
        "vendorId": "vnd_techwest",
        "image": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_20",
      "name": "Amit Shah",
      "phone": "+91 98250 67890",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_20",
      "name": "Amit Shah",
      "phone": "+91 98250 67890",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 1499,
    "couponDiscount": 0,
    "taxAmount": 270,
    "totalAmount": 1818,
    "status": "Confirmed",
    "placedAt": "2026-01-24T18:30:00.000Z",
    "updatedAt": "2026-01-26T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-24T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      }
    ]
  },
  {
    "id": "ord_rec_0021",
    "orderId": "ORD-2026-0021",
    "userId": "usr_neha",
    "customerName": "Neha Gupta",
    "customerEmail": "neha.gupta@example.com",
    "customerPhone": "+91 98115 54321",
    "items": [
      {
        "productId": "prd_wireless_dock",
        "sku": "MOB-0037",
        "name": "MagStand 3-in-1 Wireless Charging Station",
        "qty": 1,
        "unitPrice": 2699,
        "vendorId": "vnd_techwest",
        "image": "https://images.unsplash.com/photo-1622445262464-84b1a0731f82?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_21",
      "name": "Neha Gupta",
      "phone": "+91 98115 54321",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_21",
      "name": "Neha Gupta",
      "phone": "+91 98115 54321",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 2699,
    "couponDiscount": 0,
    "taxAmount": 486,
    "totalAmount": 3234,
    "status": "Delivered",
    "placedAt": "2026-01-25T18:30:00.000Z",
    "updatedAt": "2026-01-27T18:30:00.000Z",
    "deliveredAt": "2026-01-30T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-25T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-01-27T18:30:00.000Z",
        "note": "Status updated to Delivered",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0022",
    "orderId": "ORD-2026-0022",
    "userId": "usr_rohan",
    "customerName": "Rohan Mehta",
    "customerEmail": "rohan.mehta@example.com",
    "customerPhone": "+91 98205 99887",
    "items": [
      {
        "productId": "prd_aerobook_14",
        "sku": "CMP-0008",
        "name": "AeroBook 14 Laptop",
        "qty": 1,
        "unitPrice": 52990,
        "vendorId": "vnd_digimart",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_22",
      "name": "Rohan Mehta",
      "phone": "+91 98205 99887",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_22",
      "name": "Rohan Mehta",
      "phone": "+91 98205 99887",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 52990,
    "couponDiscount": 0,
    "taxAmount": 9538,
    "totalAmount": 62528,
    "status": "Cancelled",
    "placedAt": "2026-01-26T18:30:00.000Z",
    "updatedAt": "2026-01-28T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-26T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Cancelled",
        "timestamp": "2026-01-28T18:30:00.000Z",
        "note": "Status updated to Cancelled",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0023",
    "orderId": "ORD-2026-0023",
    "userId": "usr_pooja",
    "customerName": "Pooja Nair",
    "customerEmail": "pooja.nair@example.com",
    "customerPhone": "+91 98471 22334",
    "items": [
      {
        "productId": "prd_aerobook_pro_16",
        "sku": "CMP-0009",
        "name": "AeroBook Pro 16 Studio Laptop",
        "qty": 1,
        "unitPrice": 94990,
        "vendorId": "vnd_digimart",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_23",
      "name": "Pooja Nair",
      "phone": "+91 98471 22334",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_23",
      "name": "Pooja Nair",
      "phone": "+91 98471 22334",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 94990,
    "couponDiscount": 0,
    "taxAmount": 17098,
    "totalAmount": 112088,
    "status": "Returned",
    "placedAt": "2026-01-27T18:30:00.000Z",
    "updatedAt": "2026-01-29T18:30:00.000Z",
    "deliveredAt": "2026-02-01T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-27T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Returned",
        "timestamp": "2026-01-29T18:30:00.000Z",
        "note": "Status updated to Returned",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0024",
    "orderId": "ORD-2026-0024",
    "userId": "usr_ananya",
    "customerName": "Ananya Rao",
    "customerEmail": "ananya.rao@example.com",
    "customerPhone": "+91 98765 43210",
    "items": [
      {
        "productId": "prd_mech_keyboard",
        "sku": "CMP-0010",
        "name": "KeyCraft 75% Mechanical Keyboard",
        "qty": 1,
        "unitPrice": 4499,
        "vendorId": "vnd_techwest",
        "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_24",
      "name": "Ananya Rao",
      "phone": "+91 98765 43210",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_24",
      "name": "Ananya Rao",
      "phone": "+91 98765 43210",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 4499,
    "couponDiscount": 0,
    "taxAmount": 810,
    "totalAmount": 5358,
    "status": "Delivered",
    "placedAt": "2026-01-28T18:30:00.000Z",
    "updatedAt": "2026-01-30T18:30:00.000Z",
    "deliveredAt": "2026-02-02T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-28T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-01-30T18:30:00.000Z",
        "note": "Status updated to Delivered",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0025",
    "orderId": "ORD-2026-0025",
    "userId": "usr_sana",
    "customerName": "Sana Khan",
    "customerEmail": "sana.khan@example.com",
    "customerPhone": "+91 98990 12345",
    "items": [
      {
        "productId": "prd_precision_mouse",
        "sku": "CMP-0011",
        "name": "GlidePro Ergonomic Wireless Mouse",
        "qty": 1,
        "unitPrice": 2199,
        "vendorId": "vnd_techwest",
        "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_25",
      "name": "Sana Khan",
      "phone": "+91 98990 12345",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_25",
      "name": "Sana Khan",
      "phone": "+91 98990 12345",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 2199,
    "couponDiscount": 0,
    "taxAmount": 396,
    "totalAmount": 2644,
    "status": "Delivered",
    "placedAt": "2026-01-29T18:30:00.000Z",
    "updatedAt": "2026-01-31T18:30:00.000Z",
    "deliveredAt": "2026-02-03T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-29T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-01-31T18:30:00.000Z",
        "note": "Status updated to Delivered",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0026",
    "orderId": "ORD-2026-0026",
    "userId": "usr_dev",
    "customerName": "Dev Patel",
    "customerEmail": "dev.patel@example.com",
    "customerPhone": "+91 98700 98765",
    "items": [
      {
        "productId": "prd_curved_monitor_27",
        "sku": "CMP-0012",
        "name": "ViewMax 27-inch 165Hz Curved Gaming Monitor",
        "qty": 1,
        "unitPrice": 18499,
        "vendorId": "vnd_digimart",
        "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_26",
      "name": "Dev Patel",
      "phone": "+91 98700 98765",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_26",
      "name": "Dev Patel",
      "phone": "+91 98700 98765",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 18499,
    "couponDiscount": 0,
    "taxAmount": 3330,
    "totalAmount": 21829,
    "status": "Shipped",
    "placedAt": "2026-01-30T18:30:00.000Z",
    "updatedAt": "2026-02-01T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-30T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Shipped",
        "timestamp": "2026-02-01T18:30:00.000Z",
        "note": "Status updated to Shipped",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0027",
    "orderId": "ORD-2026-0027",
    "userId": "usr_rahul",
    "customerName": "Rahul Verma",
    "customerEmail": "rahul.verma@example.com",
    "customerPhone": "+91 98234 56789",
    "items": [
      {
        "productId": "prd_usb_hub_8in1",
        "sku": "CMP-0013",
        "name": "PortHub 8-in-1 USB-C Docking Adapter",
        "qty": 1,
        "unitPrice": 1899,
        "vendorId": "vnd_techwest",
        "image": "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_27",
      "name": "Rahul Verma",
      "phone": "+91 98234 56789",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_27",
      "name": "Rahul Verma",
      "phone": "+91 98234 56789",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 1899,
    "couponDiscount": 0,
    "taxAmount": 342,
    "totalAmount": 2290,
    "status": "Processing",
    "placedAt": "2026-01-31T18:30:00.000Z",
    "updatedAt": "2026-02-02T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-01-31T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Processing",
        "timestamp": "2026-02-02T18:30:00.000Z",
        "note": "Status updated to Processing",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0028",
    "orderId": "ORD-2026-0028",
    "userId": "usr_meera",
    "customerName": "Meera Iyer",
    "customerEmail": "meera.iyer@example.com",
    "customerPhone": "+91 98333 44556",
    "items": [
      {
        "productId": "prd_snappro_camera",
        "sku": "CAM-0003",
        "name": "SnapPro Mirrorless Camera",
        "qty": 1,
        "unitPrice": 38500,
        "vendorId": "vnd_digimart",
        "image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_28",
      "name": "Meera Iyer",
      "phone": "+91 98333 44556",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_28",
      "name": "Meera Iyer",
      "phone": "+91 98333 44556",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 38500,
    "couponDiscount": 0,
    "taxAmount": 6930,
    "totalAmount": 45430,
    "status": "Confirmed",
    "placedAt": "2026-02-01T18:30:00.000Z",
    "updatedAt": "2026-02-03T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-02-01T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      }
    ]
  },
  {
    "id": "ord_rec_0029",
    "orderId": "ORD-2026-0029",
    "userId": "usr_karthik",
    "customerName": "Karthik S.",
    "customerEmail": "karthik.s@example.com",
    "customerPhone": "+91 98401 23456",
    "items": [
      {
        "productId": "prd_vlog_cam_4k",
        "sku": "CAM-0004",
        "name": "VlogMaster Pocket 4K Action Camera",
        "qty": 1,
        "unitPrice": 15999,
        "vendorId": "vnd_digimart",
        "image": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_29",
      "name": "Karthik S.",
      "phone": "+91 98401 23456",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_29",
      "name": "Karthik S.",
      "phone": "+91 98401 23456",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 15999,
    "couponDiscount": 0,
    "taxAmount": 2880,
    "totalAmount": 18879,
    "status": "Delivered",
    "placedAt": "2026-02-02T18:30:00.000Z",
    "updatedAt": "2026-02-04T18:30:00.000Z",
    "deliveredAt": "2026-02-07T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-02-02T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-02-04T18:30:00.000Z",
        "note": "Status updated to Delivered",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0030",
    "orderId": "ORD-2026-0030",
    "userId": "usr_vikram",
    "customerName": "Vikram Singh",
    "customerEmail": "vikram.singh@example.com",
    "customerPhone": "+91 98102 34567",
    "items": [
      {
        "productId": "prd_cam_prime_lens",
        "sku": "CAM-0005",
        "name": "AeroOptics 50mm f/1.8 Prime Lens",
        "qty": 1,
        "unitPrice": 12499,
        "vendorId": "vnd_digimart",
        "image": "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_30",
      "name": "Vikram Singh",
      "phone": "+91 98102 34567",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_30",
      "name": "Vikram Singh",
      "phone": "+91 98102 34567",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 12499,
    "couponDiscount": 0,
    "taxAmount": 2250,
    "totalAmount": 14749,
    "status": "Cancelled",
    "placedAt": "2026-02-03T18:30:00.000Z",
    "updatedAt": "2026-02-05T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-02-03T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Cancelled",
        "timestamp": "2026-02-05T18:30:00.000Z",
        "note": "Status updated to Cancelled",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0032",
    "orderId": "ORD-2026-0032",
    "userId": "usr_amit",
    "customerName": "Amit Shah",
    "customerEmail": "amit.shah@example.com",
    "customerPhone": "+91 98250 67890",
    "items": [
      {
        "productId": "prd_gimbal_3axis",
        "sku": "CAM-0007",
        "name": "SmoothMotion 3-Axis Smartphone Gimbal",
        "qty": 1,
        "unitPrice": 6499,
        "vendorId": "vnd_digimart",
        "image": "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_32",
      "name": "Amit Shah",
      "phone": "+91 98250 67890",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_32",
      "name": "Amit Shah",
      "phone": "+91 98250 67890",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "subtotal": 6499,
    "couponDiscount": 0,
    "taxAmount": 1170,
    "totalAmount": 7669,
    "status": "Delivered",
    "placedAt": "2026-02-05T18:30:00.000Z",
    "updatedAt": "2026-02-07T18:30:00.000Z",
    "deliveredAt": "2026-02-10T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-02-05T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-02-07T18:30:00.000Z",
        "note": "Status updated to Delivered",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0033",
    "orderId": "ORD-2026-0033",
    "userId": "usr_neha",
    "customerName": "Neha Gupta",
    "customerEmail": "neha.gupta@example.com",
    "customerPhone": "+91 98115 54321",
    "items": [
      {
        "productId": "prd_trekker_30l",
        "sku": "BAG-0221",
        "name": "Trekker 30L Waterproof Backpack",
        "qty": 1,
        "unitPrice": 1499,
        "vendorId": "vnd_urbanstride",
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_33",
      "name": "Neha Gupta",
      "phone": "+91 98115 54321",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_33",
      "name": "Neha Gupta",
      "phone": "+91 98115 54321",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 1499,
    "couponDiscount": 0,
    "taxAmount": 270,
    "totalAmount": 1818,
    "status": "Delivered",
    "placedAt": "2026-02-06T18:30:00.000Z",
    "updatedAt": "2026-02-08T18:30:00.000Z",
    "deliveredAt": "2026-02-11T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-02-06T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-02-08T18:30:00.000Z",
        "note": "Status updated to Delivered",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0034",
    "orderId": "ORD-2026-0034",
    "userId": "usr_rohan",
    "customerName": "Rohan Mehta",
    "customerEmail": "rohan.mehta@example.com",
    "customerPhone": "+91 98205 99887",
    "items": [
      {
        "productId": "prd_polar_sunglasses",
        "sku": "BAG-0099",
        "name": "Polar Aviator Polarized Sunglasses",
        "qty": 1,
        "unitPrice": 999,
        "vendorId": "vnd_urbanstride",
        "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_34",
      "name": "Rohan Mehta",
      "phone": "+91 98205 99887",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_34",
      "name": "Rohan Mehta",
      "phone": "+91 98205 99887",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 999,
    "couponDiscount": 0,
    "taxAmount": 180,
    "totalAmount": 1228,
    "status": "Shipped",
    "placedAt": "2026-02-07T18:30:00.000Z",
    "updatedAt": "2026-02-09T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-02-07T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Shipped",
        "timestamp": "2026-02-09T18:30:00.000Z",
        "note": "Status updated to Shipped",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0035",
    "orderId": "ORD-2026-0035",
    "userId": "usr_pooja",
    "customerName": "Pooja Nair",
    "customerEmail": "pooja.nair@example.com",
    "customerPhone": "+91 98471 22334",
    "items": [
      {
        "productId": "prd_leather_messenger",
        "sku": "BAG-0222",
        "name": "Heritage Leather Messenger Briefcase",
        "qty": 1,
        "unitPrice": 3499,
        "vendorId": "vnd_urbanstride",
        "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_35",
      "name": "Pooja Nair",
      "phone": "+91 98471 22334",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_35",
      "name": "Pooja Nair",
      "phone": "+91 98471 22334",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 3499,
    "couponDiscount": 0,
    "taxAmount": 630,
    "totalAmount": 4178,
    "status": "Processing",
    "placedAt": "2026-02-08T18:30:00.000Z",
    "updatedAt": "2026-02-10T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-02-08T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Processing",
        "timestamp": "2026-02-10T18:30:00.000Z",
        "note": "Status updated to Processing",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0036",
    "orderId": "ORD-2026-0036",
    "userId": "usr_ananya",
    "customerName": "Ananya Rao",
    "customerEmail": "ananya.rao@example.com",
    "customerPhone": "+91 98765 43210",
    "items": [
      {
        "productId": "prd_gym_duffel",
        "sku": "BAG-0223",
        "name": "FitPro All-Weather Gym Duffel Bag",
        "qty": 1,
        "unitPrice": 1199,
        "vendorId": "vnd_urbanstride",
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_36",
      "name": "Ananya Rao",
      "phone": "+91 98765 43210",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_36",
      "name": "Ananya Rao",
      "phone": "+91 98765 43210",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 1199,
    "couponDiscount": 0,
    "taxAmount": 216,
    "totalAmount": 1464,
    "status": "Confirmed",
    "placedAt": "2026-02-09T18:30:00.000Z",
    "updatedAt": "2026-02-11T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-02-09T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      }
    ]
  },
  {
    "id": "ord_rec_0037",
    "orderId": "ORD-2026-0037",
    "userId": "usr_sana",
    "customerName": "Sana Khan",
    "customerEmail": "sana.khan@example.com",
    "customerPhone": "+91 98990 12345",
    "items": [
      {
        "productId": "prd_rfid_wallet",
        "sku": "BAG-0224",
        "name": "VaultSlim RFID Blocking Minimalist Wallet",
        "qty": 1,
        "unitPrice": 799,
        "vendorId": "vnd_urbanstride",
        "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_37",
      "name": "Sana Khan",
      "phone": "+91 98990 12345",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_37",
      "name": "Sana Khan",
      "phone": "+91 98990 12345",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 799,
    "couponDiscount": 0,
    "taxAmount": 144,
    "totalAmount": 992,
    "status": "Delivered",
    "placedAt": "2026-02-10T18:30:00.000Z",
    "updatedAt": "2026-02-12T18:30:00.000Z",
    "deliveredAt": "2026-02-15T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-02-10T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Delivered",
        "timestamp": "2026-02-12T18:30:00.000Z",
        "note": "Status updated to Delivered",
        "changedBy": "Vendor"
      }
    ]
  },
  {
    "id": "ord_rec_0038",
    "orderId": "ORD-2026-0038",
    "userId": "usr_dev",
    "customerName": "Dev Patel",
    "customerEmail": "dev.patel@example.com",
    "customerPhone": "+91 98700 98765",
    "items": [
      {
        "productId": "prd_hard_luggage_24",
        "sku": "BAG-0225",
        "name": "AeroTravel 24-inch Polycarbonate Trolley",
        "qty": 1,
        "unitPrice": 4299,
        "vendorId": "vnd_urbanstride",
        "image": "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80"
      }
    ],
    "shippingAddress": {
      "id": "addr_gen_38",
      "name": "Dev Patel",
      "phone": "+91 98700 98765",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "billingAddress": {
      "id": "addr_gen_38",
      "name": "Dev Patel",
      "phone": "+91 98700 98765",
      "street": "123 Residency Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560025"
    },
    "shippingMethod": "standard",
    "shippingCost": 49,
    "subtotal": 4299,
    "couponDiscount": 0,
    "taxAmount": 774,
    "totalAmount": 5122,
    "status": "Cancelled",
    "placedAt": "2026-02-11T18:30:00.000Z",
    "updatedAt": "2026-02-13T18:30:00.000Z",
    "statusTimeline": [
      {
        "status": "Confirmed",
        "timestamp": "2026-02-11T18:30:00.000Z",
        "note": "Order placed",
        "changedBy": "System"
      },
      {
        "status": "Cancelled",
        "timestamp": "2026-02-13T18:30:00.000Z",
        "note": "Status updated to Cancelled",
        "changedBy": "Vendor"
      }
    ]
  }
];

export const initialPayments: Payment[] = [
  {
    "id": "pay_ord_rec_0042",
    "orderId": "ORD-2026-0042",
    "gatewayRef": "PG_REF_100000",
    "method": "card",
    "amount": 11208,
    "status": "Paid",
    "paidAt": "2026-03-28T14:32:00.000Z",
    "cardLast4": "4242"
  },
  {
    "id": "pay_ord_rec_0031",
    "orderId": "ORD-2026-0031",
    "gatewayRef": "PG_REF_100001",
    "method": "upi",
    "amount": 56424,
    "status": "Paid",
    "paidAt": "2026-03-22T09:15:00.000Z",
    "upiId": "ananya.rao@okhdfcbank"
  },
  {
    "id": "pay_ord_rec_0019",
    "orderId": "ORD-2026-0019",
    "gatewayRef": "PG_REF_100002",
    "method": "netbanking",
    "amount": 3352,
    "status": "Paid",
    "paidAt": "2026-04-05T10:00:00.000Z",
    "bankName": "HDFC Bank"
  },
  {
    "id": "pay_ord_rec_0007",
    "orderId": "ORD-2026-0007",
    "gatewayRef": "PG_REF_100003",
    "method": "cod",
    "amount": 1228,
    "status": "Refunded",
    "paidAt": "2026-01-14T09:00:00.000Z"
  },
  {
    "id": "pay_ord_rec_0001",
    "orderId": "ORD-2026-0001",
    "gatewayRef": "PG_REF_100004",
    "method": "card",
    "amount": 2408,
    "status": "Paid",
    "paidAt": "2026-01-05T18:30:00.000Z",
    "cardLast4": "4242"
  },
  {
    "id": "pay_ord_rec_0002",
    "orderId": "ORD-2026-0002",
    "gatewayRef": "PG_REF_100005",
    "method": "upi",
    "amount": 2998,
    "status": "Paid",
    "paidAt": "2026-01-06T18:30:00.000Z",
    "upiId": "dev.patel@okhdfcbank"
  },
  {
    "id": "pay_ord_rec_0003",
    "orderId": "ORD-2026-0003",
    "gatewayRef": "PG_REF_100006",
    "method": "netbanking",
    "amount": 5948,
    "status": "Paid",
    "paidAt": "2026-01-07T18:30:00.000Z",
    "bankName": "HDFC Bank"
  },
  {
    "id": "pay_ord_rec_0004",
    "orderId": "ORD-2026-0004",
    "gatewayRef": "PG_REF_100007",
    "method": "cod",
    "amount": 9439,
    "status": "Paid",
    "paidAt": "2026-01-08T18:30:00.000Z"
  },
  {
    "id": "pay_ord_rec_0005",
    "orderId": "ORD-2026-0005",
    "gatewayRef": "PG_REF_100008",
    "method": "card",
    "amount": 3942,
    "status": "Paid",
    "paidAt": "2026-01-09T18:30:00.000Z",
    "cardLast4": "4242"
  },
  {
    "id": "pay_ord_rec_0006",
    "orderId": "ORD-2026-0006",
    "gatewayRef": "PG_REF_100009",
    "method": "upi",
    "amount": 7079,
    "status": "Refunded",
    "paidAt": "2026-01-10T18:30:00.000Z",
    "upiId": "vikram.singh@okhdfcbank"
  },
  {
    "id": "pay_ord_rec_0008",
    "orderId": "ORD-2026-0008",
    "gatewayRef": "PG_REF_100010",
    "method": "netbanking",
    "amount": 15339,
    "status": "Paid",
    "paidAt": "2026-01-12T18:30:00.000Z",
    "bankName": "HDFC Bank"
  },
  {
    "id": "pay_ord_rec_0009",
    "orderId": "ORD-2026-0009",
    "gatewayRef": "PG_REF_100011",
    "method": "cod",
    "amount": 10029,
    "status": "Paid",
    "paidAt": "2026-01-13T18:30:00.000Z"
  },
  {
    "id": "pay_ord_rec_0010",
    "orderId": "ORD-2026-0010",
    "gatewayRef": "PG_REF_100012",
    "method": "card",
    "amount": 4178,
    "status": "Paid",
    "paidAt": "2026-01-14T18:30:00.000Z",
    "cardLast4": "4242"
  },
  {
    "id": "pay_ord_rec_0011",
    "orderId": "ORD-2026-0011",
    "gatewayRef": "PG_REF_100013",
    "method": "upi",
    "amount": 3352,
    "status": "Paid",
    "paidAt": "2026-01-15T18:30:00.000Z",
    "upiId": "pooja.nair@okhdfcbank"
  },
  {
    "id": "pay_ord_rec_0012",
    "orderId": "ORD-2026-0012",
    "gatewayRef": "PG_REF_100014",
    "method": "netbanking",
    "amount": 2290,
    "status": "Paid",
    "paidAt": "2026-01-16T18:30:00.000Z",
    "bankName": "HDFC Bank"
  },
  {
    "id": "pay_ord_rec_0013",
    "orderId": "ORD-2026-0013",
    "gatewayRef": "PG_REF_100015",
    "method": "cod",
    "amount": 4768,
    "status": "Paid",
    "paidAt": "2026-01-17T18:30:00.000Z"
  },
  {
    "id": "pay_ord_rec_0014",
    "orderId": "ORD-2026-0014",
    "gatewayRef": "PG_REF_100016",
    "method": "card",
    "amount": 1110,
    "status": "Refunded",
    "paidAt": "2026-01-18T18:30:00.000Z",
    "cardLast4": "4242"
  },
  {
    "id": "pay_ord_rec_0015",
    "orderId": "ORD-2026-0015",
    "gatewayRef": "PG_REF_100017",
    "method": "upi",
    "amount": 3942,
    "status": "Refunded",
    "paidAt": "2026-01-19T18:30:00.000Z",
    "upiId": "rahul.verma@okhdfcbank"
  },
  {
    "id": "pay_ord_rec_0016",
    "orderId": "ORD-2026-0016",
    "gatewayRef": "PG_REF_100018",
    "method": "netbanking",
    "amount": 21239,
    "status": "Paid",
    "paidAt": "2026-01-20T18:30:00.000Z",
    "bankName": "HDFC Bank"
  },
  {
    "id": "pay_ord_rec_0017",
    "orderId": "ORD-2026-0017",
    "gatewayRef": "PG_REF_100019",
    "method": "cod",
    "amount": 35399,
    "status": "Paid",
    "paidAt": "2026-01-21T18:30:00.000Z"
  },
  {
    "id": "pay_ord_rec_0018",
    "orderId": "ORD-2026-0018",
    "gatewayRef": "PG_REF_100020",
    "method": "card",
    "amount": 58999,
    "status": "Paid",
    "paidAt": "2026-01-22T18:30:00.000Z",
    "cardLast4": "4242"
  },
  {
    "id": "pay_ord_rec_0020",
    "orderId": "ORD-2026-0020",
    "gatewayRef": "PG_REF_100021",
    "method": "upi",
    "amount": 1818,
    "status": "Paid",
    "paidAt": "2026-01-24T18:30:00.000Z",
    "upiId": "amit.shah@okhdfcbank"
  },
  {
    "id": "pay_ord_rec_0021",
    "orderId": "ORD-2026-0021",
    "gatewayRef": "PG_REF_100022",
    "method": "netbanking",
    "amount": 3234,
    "status": "Paid",
    "paidAt": "2026-01-25T18:30:00.000Z",
    "bankName": "HDFC Bank"
  },
  {
    "id": "pay_ord_rec_0022",
    "orderId": "ORD-2026-0022",
    "gatewayRef": "PG_REF_100023",
    "method": "cod",
    "amount": 62528,
    "status": "Refunded",
    "paidAt": "2026-01-26T18:30:00.000Z"
  },
  {
    "id": "pay_ord_rec_0023",
    "orderId": "ORD-2026-0023",
    "gatewayRef": "PG_REF_100024",
    "method": "card",
    "amount": 112088,
    "status": "Refunded",
    "paidAt": "2026-01-27T18:30:00.000Z",
    "cardLast4": "4242"
  },
  {
    "id": "pay_ord_rec_0024",
    "orderId": "ORD-2026-0024",
    "gatewayRef": "PG_REF_100025",
    "method": "upi",
    "amount": 5358,
    "status": "Paid",
    "paidAt": "2026-01-28T18:30:00.000Z",
    "upiId": "ananya.rao@okhdfcbank"
  },
  {
    "id": "pay_ord_rec_0025",
    "orderId": "ORD-2026-0025",
    "gatewayRef": "PG_REF_100026",
    "method": "netbanking",
    "amount": 2644,
    "status": "Paid",
    "paidAt": "2026-01-29T18:30:00.000Z",
    "bankName": "HDFC Bank"
  },
  {
    "id": "pay_ord_rec_0026",
    "orderId": "ORD-2026-0026",
    "gatewayRef": "PG_REF_100027",
    "method": "cod",
    "amount": 21829,
    "status": "Paid",
    "paidAt": "2026-01-30T18:30:00.000Z"
  },
  {
    "id": "pay_ord_rec_0027",
    "orderId": "ORD-2026-0027",
    "gatewayRef": "PG_REF_100028",
    "method": "card",
    "amount": 2290,
    "status": "Paid",
    "paidAt": "2026-01-31T18:30:00.000Z",
    "cardLast4": "4242"
  },
  {
    "id": "pay_ord_rec_0028",
    "orderId": "ORD-2026-0028",
    "gatewayRef": "PG_REF_100029",
    "method": "upi",
    "amount": 45430,
    "status": "Paid",
    "paidAt": "2026-02-01T18:30:00.000Z",
    "upiId": "meera.iyer@okhdfcbank"
  },
  {
    "id": "pay_ord_rec_0029",
    "orderId": "ORD-2026-0029",
    "gatewayRef": "PG_REF_100030",
    "method": "netbanking",
    "amount": 18879,
    "status": "Paid",
    "paidAt": "2026-02-02T18:30:00.000Z",
    "bankName": "HDFC Bank"
  },
  {
    "id": "pay_ord_rec_0030",
    "orderId": "ORD-2026-0030",
    "gatewayRef": "PG_REF_100031",
    "method": "cod",
    "amount": 14749,
    "status": "Refunded",
    "paidAt": "2026-02-03T18:30:00.000Z"
  },
  {
    "id": "pay_ord_rec_0032",
    "orderId": "ORD-2026-0032",
    "gatewayRef": "PG_REF_100032",
    "method": "card",
    "amount": 7669,
    "status": "Paid",
    "paidAt": "2026-02-05T18:30:00.000Z",
    "cardLast4": "4242"
  },
  {
    "id": "pay_ord_rec_0033",
    "orderId": "ORD-2026-0033",
    "gatewayRef": "PG_REF_100033",
    "method": "upi",
    "amount": 1818,
    "status": "Paid",
    "paidAt": "2026-02-06T18:30:00.000Z",
    "upiId": "neha.gupta@okhdfcbank"
  },
  {
    "id": "pay_ord_rec_0034",
    "orderId": "ORD-2026-0034",
    "gatewayRef": "PG_REF_100034",
    "method": "netbanking",
    "amount": 1228,
    "status": "Paid",
    "paidAt": "2026-02-07T18:30:00.000Z",
    "bankName": "HDFC Bank"
  },
  {
    "id": "pay_ord_rec_0035",
    "orderId": "ORD-2026-0035",
    "gatewayRef": "PG_REF_100035",
    "method": "cod",
    "amount": 4178,
    "status": "Paid",
    "paidAt": "2026-02-08T18:30:00.000Z"
  },
  {
    "id": "pay_ord_rec_0036",
    "orderId": "ORD-2026-0036",
    "gatewayRef": "PG_REF_100036",
    "method": "card",
    "amount": 1464,
    "status": "Paid",
    "paidAt": "2026-02-09T18:30:00.000Z",
    "cardLast4": "4242"
  },
  {
    "id": "pay_ord_rec_0037",
    "orderId": "ORD-2026-0037",
    "gatewayRef": "PG_REF_100037",
    "method": "upi",
    "amount": 992,
    "status": "Paid",
    "paidAt": "2026-02-10T18:30:00.000Z",
    "upiId": "sana.khan@okhdfcbank"
  },
  {
    "id": "pay_ord_rec_0038",
    "orderId": "ORD-2026-0038",
    "gatewayRef": "PG_REF_100038",
    "method": "netbanking",
    "amount": 5122,
    "status": "Refunded",
    "paidAt": "2026-02-11T18:30:00.000Z",
    "bankName": "HDFC Bank"
  }
];

export const initialReviews: Review[] = [
  {
    "id": "rev_aurora_1",
    "userId": "usr_rahul",
    "userName": "Rahul Verma",
    "sku": "AUD-0001",
    "productId": "prd_aurora",
    "rating": 5,
    "title": "Outstanding noise cancellation!",
    "comment": "The sound stage is wide and punchy. ANC easily cuts out flight and train hums. Battery life is easily 35+ hours.",
    "createdAt": "2026-02-10T10:15:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_aurora_2",
    "userId": "usr_meera",
    "userName": "Meera Iyer",
    "sku": "AUD-0001",
    "productId": "prd_aurora",
    "rating": 4,
    "title": "Great comfort for long office calls",
    "comment": "The earcups are soft and breathable. The mic clarity in noisy rooms is top notch.",
    "createdAt": "2026-02-18T14:20:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_stridex_1",
    "userId": "usr_ananya",
    "userName": "Ananya Rao",
    "sku": "FTW-0107",
    "productId": "prd_stridex",
    "rating": 5,
    "title": "Best marathon shoes in this price range",
    "comment": "The carbon foam bounce is unbelievable! Completed a 10k run with zero heel discomfort. True to size.",
    "createdAt": "2026-04-09T08:00:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_aerobook_1",
    "userId": "usr_vikram",
    "userName": "Vikram Singh",
    "sku": "CMP-0008",
    "productId": "prd_aerobook_14",
    "rating": 5,
    "title": "Flawless OLED display and build quality",
    "comment": "The screen is gorgeous for coding and media. Aluminum unibody is as premium as premium laptops get.",
    "createdAt": "2026-02-28T16:00:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_pulsefit_1",
    "userId": "usr_priya",
    "userName": "Priya Sharma",
    "sku": "WRB-0014",
    "productId": "prd_pulsefit",
    "rating": 4,
    "title": "Accurate heart rate & great battery",
    "comment": "Lasts more than 10 days on a single charge. Sleep tracking insights are very detailed.",
    "createdAt": "2026-03-01T11:45:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_1",
    "userId": "usr_sana",
    "userName": "Sana Khan",
    "sku": "AUD-0002",
    "productId": "prd_sonic_pulse",
    "rating": 4,
    "title": "Very good purchase",
    "comment": "Good performance and stylish looks. Delivery was swift.",
    "createdAt": "2026-02-01T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_2",
    "userId": "usr_dev",
    "userName": "Dev Patel",
    "sku": "AUD-0003",
    "productId": "prd_boombox_mini",
    "rating": 5,
    "title": "Highly recommended",
    "comment": "Worth every rupee. Using daily without any issues.",
    "createdAt": "2026-02-02T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_3",
    "userId": "usr_rahul",
    "userName": "Rahul Verma",
    "sku": "AUD-0004",
    "productId": "prd_studio_pro",
    "rating": 4,
    "title": "Solid everyday item",
    "comment": "Functions as described in specifications. Recommended.",
    "createdAt": "2026-02-03T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_4",
    "userId": "usr_meera",
    "userName": "Meera Iyer",
    "sku": "AUD-0005",
    "productId": "prd_soundbar_300",
    "rating": 3,
    "title": "Decent for the price",
    "comment": "Works fine, packaging could have been sturdier.",
    "createdAt": "2026-02-04T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_5",
    "userId": "usr_karthik",
    "userName": "Karthik S.",
    "sku": "AUD-0006",
    "productId": "prd_vocal_mic",
    "rating": 5,
    "title": "Exceeded expectations!",
    "comment": "Phenomenal build quality, works right out of the box.",
    "createdAt": "2026-02-05T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_6",
    "userId": "usr_vikram",
    "userName": "Vikram Singh",
    "sku": "WRB-0014",
    "productId": "prd_pulsefit",
    "rating": 4,
    "title": "Very good purchase",
    "comment": "Good performance and stylish looks. Delivery was swift.",
    "createdAt": "2026-02-06T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_7",
    "userId": "usr_priya",
    "userName": "Priya Sharma",
    "sku": "WRB-0015",
    "productId": "prd_pulseband_hr",
    "rating": 5,
    "title": "Highly recommended",
    "comment": "Worth every rupee. Using daily without any issues.",
    "createdAt": "2026-02-07T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_8",
    "userId": "usr_amit",
    "userName": "Amit Shah",
    "sku": "WRB-0016",
    "productId": "prd_smartring_aura",
    "rating": 4,
    "title": "Solid everyday item",
    "comment": "Functions as described in specifications. Recommended.",
    "createdAt": "2026-02-08T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_9",
    "userId": "usr_neha",
    "userName": "Neha Gupta",
    "sku": "WRB-0017",
    "productId": "prd_chronos_classic",
    "rating": 3,
    "title": "Decent for the price",
    "comment": "Works fine, packaging could have been sturdier.",
    "createdAt": "2026-02-09T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_10",
    "userId": "usr_rohan",
    "userName": "Rohan Mehta",
    "sku": "WRB-0018",
    "productId": "prd_kids_gps_watch",
    "rating": 5,
    "title": "Exceeded expectations!",
    "comment": "Phenomenal build quality, works right out of the box.",
    "createdAt": "2026-02-10T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_11",
    "userId": "usr_pooja",
    "userName": "Pooja Nair",
    "sku": "FTW-0107",
    "productId": "prd_stridex",
    "rating": 4,
    "title": "Very good purchase",
    "comment": "Good performance and stylish looks. Delivery was swift.",
    "createdAt": "2026-02-11T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_12",
    "userId": "usr_ananya",
    "userName": "Ananya Rao",
    "sku": "FTW-0108",
    "productId": "prd_urban_sneakers",
    "rating": 5,
    "title": "Highly recommended",
    "comment": "Worth every rupee. Using daily without any issues.",
    "createdAt": "2026-02-12T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_13",
    "userId": "usr_sana",
    "userName": "Sana Khan",
    "sku": "FTW-0109",
    "productId": "prd_trail_blazer_boots",
    "rating": 4,
    "title": "Solid everyday item",
    "comment": "Functions as described in specifications. Recommended.",
    "createdAt": "2026-02-13T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_14",
    "userId": "usr_dev",
    "userName": "Dev Patel",
    "sku": "FTW-0110",
    "productId": "prd_aero_slides",
    "rating": 3,
    "title": "Decent for the price",
    "comment": "Works fine, packaging could have been sturdier.",
    "createdAt": "2026-02-14T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_15",
    "userId": "usr_rahul",
    "userName": "Rahul Verma",
    "sku": "FTW-0111",
    "productId": "prd_stride_training",
    "rating": 5,
    "title": "Exceeded expectations!",
    "comment": "Phenomenal build quality, works right out of the box.",
    "createdAt": "2026-02-15T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_16",
    "userId": "usr_meera",
    "userName": "Meera Iyer",
    "sku": "MOB-0032",
    "productId": "prd_nova_5g",
    "rating": 4,
    "title": "Very good purchase",
    "comment": "Good performance and stylish looks. Delivery was swift.",
    "createdAt": "2026-02-16T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_17",
    "userId": "usr_karthik",
    "userName": "Karthik S.",
    "sku": "MOB-0033",
    "productId": "prd_nova_pro_256",
    "rating": 5,
    "title": "Highly recommended",
    "comment": "Worth every rupee. Using daily without any issues.",
    "createdAt": "2026-02-17T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_18",
    "userId": "usr_vikram",
    "userName": "Vikram Singh",
    "sku": "MOB-0034",
    "productId": "prd_volt_flip",
    "rating": 4,
    "title": "Solid everyday item",
    "comment": "Functions as described in specifications. Recommended.",
    "createdAt": "2026-02-18T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_19",
    "userId": "usr_priya",
    "userName": "Priya Sharma",
    "sku": "MOB-0035",
    "productId": "prd_lite_budget_phone",
    "rating": 3,
    "title": "Decent for the price",
    "comment": "Works fine, packaging could have been sturdier.",
    "createdAt": "2026-02-19T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_20",
    "userId": "usr_amit",
    "userName": "Amit Shah",
    "sku": "MOB-0036",
    "productId": "prd_fast_charger_65w",
    "rating": 5,
    "title": "Exceeded expectations!",
    "comment": "Phenomenal build quality, works right out of the box.",
    "createdAt": "2026-02-20T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_21",
    "userId": "usr_neha",
    "userName": "Neha Gupta",
    "sku": "MOB-0037",
    "productId": "prd_wireless_dock",
    "rating": 4,
    "title": "Very good purchase",
    "comment": "Good performance and stylish looks. Delivery was swift.",
    "createdAt": "2026-02-21T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_22",
    "userId": "usr_rohan",
    "userName": "Rohan Mehta",
    "sku": "CMP-0008",
    "productId": "prd_aerobook_14",
    "rating": 5,
    "title": "Highly recommended",
    "comment": "Worth every rupee. Using daily without any issues.",
    "createdAt": "2026-02-22T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_23",
    "userId": "usr_pooja",
    "userName": "Pooja Nair",
    "sku": "CMP-0009",
    "productId": "prd_aerobook_pro_16",
    "rating": 4,
    "title": "Solid everyday item",
    "comment": "Functions as described in specifications. Recommended.",
    "createdAt": "2026-02-23T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_24",
    "userId": "usr_ananya",
    "userName": "Ananya Rao",
    "sku": "CMP-0010",
    "productId": "prd_mech_keyboard",
    "rating": 3,
    "title": "Decent for the price",
    "comment": "Works fine, packaging could have been sturdier.",
    "createdAt": "2026-02-24T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_25",
    "userId": "usr_sana",
    "userName": "Sana Khan",
    "sku": "CMP-0011",
    "productId": "prd_precision_mouse",
    "rating": 5,
    "title": "Exceeded expectations!",
    "comment": "Phenomenal build quality, works right out of the box.",
    "createdAt": "2026-01-31T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_26",
    "userId": "usr_dev",
    "userName": "Dev Patel",
    "sku": "CMP-0012",
    "productId": "prd_curved_monitor_27",
    "rating": 4,
    "title": "Very good purchase",
    "comment": "Good performance and stylish looks. Delivery was swift.",
    "createdAt": "2026-02-01T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_27",
    "userId": "usr_rahul",
    "userName": "Rahul Verma",
    "sku": "CMP-0013",
    "productId": "prd_usb_hub_8in1",
    "rating": 5,
    "title": "Highly recommended",
    "comment": "Worth every rupee. Using daily without any issues.",
    "createdAt": "2026-02-02T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_28",
    "userId": "usr_meera",
    "userName": "Meera Iyer",
    "sku": "CAM-0003",
    "productId": "prd_snappro_camera",
    "rating": 4,
    "title": "Solid everyday item",
    "comment": "Functions as described in specifications. Recommended.",
    "createdAt": "2026-02-03T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_29",
    "userId": "usr_karthik",
    "userName": "Karthik S.",
    "sku": "CAM-0004",
    "productId": "prd_vlog_cam_4k",
    "rating": 3,
    "title": "Decent for the price",
    "comment": "Works fine, packaging could have been sturdier.",
    "createdAt": "2026-02-04T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_30",
    "userId": "usr_vikram",
    "userName": "Vikram Singh",
    "sku": "CAM-0005",
    "productId": "prd_cam_prime_lens",
    "rating": 5,
    "title": "Exceeded expectations!",
    "comment": "Phenomenal build quality, works right out of the box.",
    "createdAt": "2026-02-05T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_31",
    "userId": "usr_priya",
    "userName": "Priya Sharma",
    "sku": "CAM-0006",
    "productId": "prd_carbon_tripod",
    "rating": 4,
    "title": "Very good purchase",
    "comment": "Good performance and stylish looks. Delivery was swift.",
    "createdAt": "2026-02-06T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_32",
    "userId": "usr_amit",
    "userName": "Amit Shah",
    "sku": "CAM-0007",
    "productId": "prd_gimbal_3axis",
    "rating": 5,
    "title": "Highly recommended",
    "comment": "Worth every rupee. Using daily without any issues.",
    "createdAt": "2026-02-07T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_33",
    "userId": "usr_neha",
    "userName": "Neha Gupta",
    "sku": "BAG-0221",
    "productId": "prd_trekker_30l",
    "rating": 4,
    "title": "Solid everyday item",
    "comment": "Functions as described in specifications. Recommended.",
    "createdAt": "2026-02-08T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_34",
    "userId": "usr_rohan",
    "userName": "Rohan Mehta",
    "sku": "BAG-0099",
    "productId": "prd_polar_sunglasses",
    "rating": 3,
    "title": "Decent for the price",
    "comment": "Works fine, packaging could have been sturdier.",
    "createdAt": "2026-02-09T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_35",
    "userId": "usr_pooja",
    "userName": "Pooja Nair",
    "sku": "BAG-0222",
    "productId": "prd_leather_messenger",
    "rating": 5,
    "title": "Exceeded expectations!",
    "comment": "Phenomenal build quality, works right out of the box.",
    "createdAt": "2026-02-10T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_36",
    "userId": "usr_ananya",
    "userName": "Ananya Rao",
    "sku": "BAG-0223",
    "productId": "prd_gym_duffel",
    "rating": 4,
    "title": "Very good purchase",
    "comment": "Good performance and stylish looks. Delivery was swift.",
    "createdAt": "2026-02-11T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_37",
    "userId": "usr_sana",
    "userName": "Sana Khan",
    "sku": "BAG-0224",
    "productId": "prd_rfid_wallet",
    "rating": 5,
    "title": "Highly recommended",
    "comment": "Worth every rupee. Using daily without any issues.",
    "createdAt": "2026-02-12T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_38",
    "userId": "usr_dev",
    "userName": "Dev Patel",
    "sku": "BAG-0225",
    "productId": "prd_hard_luggage_24",
    "rating": 4,
    "title": "Solid everyday item",
    "comment": "Functions as described in specifications. Recommended.",
    "createdAt": "2026-02-13T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_39",
    "userId": "usr_rahul",
    "userName": "Rahul Verma",
    "sku": "AUD-0001",
    "productId": "prd_aurora",
    "rating": 3,
    "title": "Decent for the price",
    "comment": "Works fine, packaging could have been sturdier.",
    "createdAt": "2026-02-14T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_40",
    "userId": "usr_meera",
    "userName": "Meera Iyer",
    "sku": "AUD-0002",
    "productId": "prd_sonic_pulse",
    "rating": 5,
    "title": "Exceeded expectations!",
    "comment": "Phenomenal build quality, works right out of the box.",
    "createdAt": "2026-02-15T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_41",
    "userId": "usr_karthik",
    "userName": "Karthik S.",
    "sku": "AUD-0003",
    "productId": "prd_boombox_mini",
    "rating": 4,
    "title": "Very good purchase",
    "comment": "Good performance and stylish looks. Delivery was swift.",
    "createdAt": "2026-02-16T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_42",
    "userId": "usr_vikram",
    "userName": "Vikram Singh",
    "sku": "AUD-0004",
    "productId": "prd_studio_pro",
    "rating": 5,
    "title": "Highly recommended",
    "comment": "Worth every rupee. Using daily without any issues.",
    "createdAt": "2026-02-17T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_43",
    "userId": "usr_priya",
    "userName": "Priya Sharma",
    "sku": "AUD-0005",
    "productId": "prd_soundbar_300",
    "rating": 4,
    "title": "Solid everyday item",
    "comment": "Functions as described in specifications. Recommended.",
    "createdAt": "2026-02-18T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_44",
    "userId": "usr_amit",
    "userName": "Amit Shah",
    "sku": "AUD-0006",
    "productId": "prd_vocal_mic",
    "rating": 3,
    "title": "Decent for the price",
    "comment": "Works fine, packaging could have been sturdier.",
    "createdAt": "2026-02-19T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_45",
    "userId": "usr_neha",
    "userName": "Neha Gupta",
    "sku": "WRB-0014",
    "productId": "prd_pulsefit",
    "rating": 5,
    "title": "Exceeded expectations!",
    "comment": "Phenomenal build quality, works right out of the box.",
    "createdAt": "2026-02-20T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_46",
    "userId": "usr_rohan",
    "userName": "Rohan Mehta",
    "sku": "WRB-0015",
    "productId": "prd_pulseband_hr",
    "rating": 4,
    "title": "Very good purchase",
    "comment": "Good performance and stylish looks. Delivery was swift.",
    "createdAt": "2026-02-21T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_47",
    "userId": "usr_pooja",
    "userName": "Pooja Nair",
    "sku": "WRB-0016",
    "productId": "prd_smartring_aura",
    "rating": 5,
    "title": "Highly recommended",
    "comment": "Worth every rupee. Using daily without any issues.",
    "createdAt": "2026-02-22T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_48",
    "userId": "usr_ananya",
    "userName": "Ananya Rao",
    "sku": "WRB-0017",
    "productId": "prd_chronos_classic",
    "rating": 4,
    "title": "Solid everyday item",
    "comment": "Functions as described in specifications. Recommended.",
    "createdAt": "2026-02-23T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_49",
    "userId": "usr_sana",
    "userName": "Sana Khan",
    "sku": "WRB-0018",
    "productId": "prd_kids_gps_watch",
    "rating": 3,
    "title": "Decent for the price",
    "comment": "Works fine, packaging could have been sturdier.",
    "createdAt": "2026-02-24T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_50",
    "userId": "usr_dev",
    "userName": "Dev Patel",
    "sku": "FTW-0107",
    "productId": "prd_stridex",
    "rating": 5,
    "title": "Exceeded expectations!",
    "comment": "Phenomenal build quality, works right out of the box.",
    "createdAt": "2026-01-31T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_51",
    "userId": "usr_rahul",
    "userName": "Rahul Verma",
    "sku": "FTW-0108",
    "productId": "prd_urban_sneakers",
    "rating": 4,
    "title": "Very good purchase",
    "comment": "Good performance and stylish looks. Delivery was swift.",
    "createdAt": "2026-02-01T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_52",
    "userId": "usr_meera",
    "userName": "Meera Iyer",
    "sku": "FTW-0109",
    "productId": "prd_trail_blazer_boots",
    "rating": 5,
    "title": "Highly recommended",
    "comment": "Worth every rupee. Using daily without any issues.",
    "createdAt": "2026-02-02T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_53",
    "userId": "usr_karthik",
    "userName": "Karthik S.",
    "sku": "FTW-0110",
    "productId": "prd_aero_slides",
    "rating": 4,
    "title": "Solid everyday item",
    "comment": "Functions as described in specifications. Recommended.",
    "createdAt": "2026-02-03T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_54",
    "userId": "usr_vikram",
    "userName": "Vikram Singh",
    "sku": "FTW-0111",
    "productId": "prd_stride_training",
    "rating": 3,
    "title": "Decent for the price",
    "comment": "Works fine, packaging could have been sturdier.",
    "createdAt": "2026-02-04T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  },
  {
    "id": "rev_gen_55",
    "userId": "usr_priya",
    "userName": "Priya Sharma",
    "sku": "MOB-0032",
    "productId": "prd_nova_5g",
    "rating": 5,
    "title": "Exceeded expectations!",
    "comment": "Phenomenal build quality, works right out of the box.",
    "createdAt": "2026-02-05T18:30:00.000Z",
    "isActive": true,
    "verifiedPurchase": true
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    "id": "aud_001",
    "actorId": "usr_admin",
    "actorName": "Rajesh Kumar",
    "actorRole": "admin",
    "action": "PRODUCT_DEACTIVATE",
    "entity": "product",
    "entityId": "prd_snappro_camera",
    "before": {
      "isActive": true
    },
    "after": {
      "isActive": false,
      "reason": "Pending lens bundle refresh"
    },
    "timestamp": "2026-03-20T10:00:00.000Z"
  },
  {
    "id": "aud_002",
    "actorId": "usr_vendor_techwest",
    "actorName": "Vikram Malhotra",
    "actorRole": "vendor",
    "action": "STOCK_UPDATE",
    "entity": "inventory",
    "entityId": "prd_aurora",
    "before": {
      "stockQty": 50
    },
    "after": {
      "stockQty": 64,
      "delta": 14
    },
    "timestamp": "2026-03-21T09:30:00.000Z"
  },
  {
    "id": "aud_003",
    "actorId": "usr_admin",
    "actorName": "Rajesh Kumar",
    "actorRole": "admin",
    "action": "COUPON_CREATE",
    "entity": "coupon",
    "entityId": "cpn_save10",
    "before": null,
    "after": {
      "code": "SAVE10",
      "discount": "10%"
    },
    "timestamp": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": "aud_004",
    "actorId": "usr_admin",
    "actorName": "Rajesh Kumar",
    "actorRole": "admin",
    "action": "CUSTOMER_LOCK_OVERRIDE",
    "entity": "user",
    "entityId": "usr_dev",
    "before": {
      "status": "Active"
    },
    "after": {
      "status": "Suspended",
      "reason": "Repeated disputed chargebacks"
    },
    "timestamp": "2025-07-14T16:20:00.000Z"
  }
];

export const initialNotifications: Notification[] = [
  {
    "id": "notif_001",
    "userId": "usr_ananya",
    "title": "Order Confirmed: ORD-2026-0042",
    "message": "Your order for Aurora Wireless Headphones and PulseFit Smart Watch has been confirmed.",
    "type": "order",
    "read": false,
    "createdAt": "2026-03-28T14:32:00.000Z",
    "link": "/orders/ORD-2026-0042"
  },
  {
    "id": "notif_002",
    "userId": "usr_ananya",
    "title": "Package Shipped: ORD-2026-0031",
    "message": "Your AeroBook 14 Laptop has been dispatched and is on its way.",
    "type": "status",
    "read": true,
    "createdAt": "2026-03-23T11:00:00.000Z",
    "link": "/orders/ORD-2026-0031"
  },
  {
    "id": "notif_003",
    "userId": "usr_admin",
    "title": "Low Stock Alert",
    "message": "AeroBook 14 Laptop (CMP-0008) is low on stock (8 units remaining).",
    "type": "alert",
    "read": false,
    "createdAt": "2026-03-25T08:00:00.000Z",
    "link": "/admin/inventory"
  },
  {
    "id": "notif_004",
    "userId": "usr_admin",
    "title": "New Vendor Pending Approval",
    "message": "Apex Electronics has submitted a distributor onboarding request.",
    "type": "system",
    "read": false,
    "createdAt": "2026-03-25T11:00:00.000Z",
    "link": "/admin/vendors"
  }
];

export const initialContactMessages: ContactMessage[] = [
  {
    "id": "msg_001",
    "name": "Suresh Raina",
    "email": "suresh.r@example.com",
    "phone": "+91 98300 11223",
    "subject": "Corporate Bulk Purchase Inquiry",
    "message": "We are looking to purchase 50 units of AeroBook 14 for our developer team. Do you provide GST invoice and bulk commercial pricing?",
    "status": "Unread",
    "createdAt": "2026-03-26T15:00:00.000Z"
  },
  {
    "id": "msg_002",
    "name": "Deepa Varma",
    "email": "deepa.v@example.com",
    "phone": "+91 98450 99887",
    "subject": "Vendor Partnership Question",
    "message": "We manufacture organic cotton backpacks and would love to register as an approved vendor on BlueCart.",
    "status": "Read",
    "createdAt": "2026-03-22T10:30:00.000Z"
  }
];

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
