import { ProductItem, OrderRecord, ProductCategory } from '@/lib/types';

export const INITIAL_CATEGORIES: ProductCategory[] = [
  { id: 'all', name: 'All Categories', slug: 'all', productCount: 8 },
  { id: 'cat_phones', name: 'Phones & Tablets', slug: 'phones-tablets', productCount: 2 },
  { id: 'cat_electronics', name: 'Electronics & TV', slug: 'electronics-tv', productCount: 2 },
  { id: 'cat_appliances', name: 'Home & Kitchen', slug: 'home-kitchen', productCount: 2 },
  { id: 'cat_fashion', name: 'Fashion & Sneakers', slug: 'fashion-sneakers', productCount: 1 },
  { id: 'cat_computing', name: 'Computing & Office', slug: 'computing-office', productCount: 1 },
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod_phone_1',
    title: 'Samsung Galaxy S24 Ultra 5G - 512GB (Titanium Gray) + Free Galaxy Buds',
    slug: 'samsung-galaxy-s24-ultra-5g',
    description: 'Flagship AI smartphone with 200MP Quad Camera System, Snapdragon 8 Gen 3, S-Pen included, titanium aerospace frame, and 7 years of Android OS updates. Official Samsung Uganda Authorized Store with 24-month local warranty.',
    price: 4200000,
    compareAtPrice: 4950000,
    costPerItem: 3400000,
    sku: 'FOX-UG-S24U-512',
    barcode: '8806095318491',
    inventoryCount: 38,
    trackQuantity: true,
    isPublished: true,
    images: [
      '/src/assets/images/product_phone_1790375946472.jpg',
      '/src/assets/images/s24_angle_view_1790376918974.jpg',
      '/src/assets/images/s24_spen_view_1790376931685.jpg',
      '/src/assets/images/s24_buds_bonus_1790376943039.jpg'
    ],
    tags: ['Official Store', 'Flash Sale', 'Express Free Shipping', 'Phones & Tablets'],
    rating: 4.9,
    reviewCount: 312,
    categoryId: 'cat_phones',
    categoryName: 'Phones & Tablets',
    variants: [
      {
        id: 'v_phone_1',
        productId: 'prod_phone_1',
        title: 'Titanium Blue / 512GB',
        sku: 'FOX-UG-S24U-BLU-512',
        price: 4200000,
        compareAtPrice: 4950000,
        inventoryCount: 24,
        attributes: { color: 'Titanium Blue', storage: '512GB' }
      },
      {
        id: 'v_phone_2',
        productId: 'prod_phone_1',
        title: 'Titanium Black / 256GB',
        sku: 'FOX-UG-S24U-BLK-256',
        price: 3750000,
        compareAtPrice: 4400000,
        inventoryCount: 14,
        attributes: { color: 'Titanium Black', storage: '256GB' }
      }
    ],
    reviews: [
      {
        id: 'rev_phone_1',
        productId: 'prod_phone_1',
        userId: 'u_101',
        userName: 'Brian Kato',
        rating: 5,
        title: 'Delivered in under 4 hours in Kololo, Kampala!',
        comment: 'Authentic sealed box with genuine manufacturer warranty. Paid with MTN MoMo with zero hassle. Galaxy AI live translation is mindblowing.',
        verifiedPurchase: true,
        createdAt: '2026-09-21T10:14:00Z'
      },
      {
        id: 'rev_phone_2',
        productId: 'prod_phone_1',
        userId: 'u_102',
        userName: 'Grace Namubiru',
        rating: 5,
        title: 'Best price in Uganda across all tech shops',
        comment: 'Saved nearly UGX 750,000 compared to walk-in shops on Kampala Road. Free Galaxy Buds bonus was in the box!',
        verifiedPurchase: true,
        createdAt: '2026-09-18T14:32:00Z'
      }
    ],
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-24T12:00:00Z'
  },
  {
    id: 'prod_tv_1',
    title: 'LG 55-Inch 4K OLED Smart TV Cinema Screen with Dolby Vision & Atmos (2026 Edition)',
    slug: 'lg-55-inch-4k-oled-smart-tv',
    description: 'Self-lit OLED pixels for infinite contrast, 120Hz refresh rate with NVIDIA G-Sync, WebOS smart hub with Netflix, Showmax, DSTV Stream, YouTube, and Apple AirPlay 2.',
    price: 3450000,
    compareAtPrice: 4200000,
    costPerItem: 2600000,
    sku: 'FOX-UG-LG-55OLED',
    barcode: '8806091882194',
    inventoryCount: 19,
    trackQuantity: true,
    isPublished: true,
    images: [
      '/src/assets/images/product_smart_tv_1790375957990.jpg',
      '/src/assets/images/tv_side_mount_1790376992870.jpg',
      '/src/assets/images/hero_workspace_1790375105346.jpg',
      '/src/assets/images/foxprice_deals_hero_1790375933912.jpg'
    ],
    tags: ['Flash Sale', 'Top Brand', 'Home Entertainment', 'Electronics & TV'],
    rating: 4.92,
    reviewCount: 184,
    categoryId: 'cat_electronics',
    categoryName: 'Electronics & TV',
    variants: [
      {
        id: 'v_tv_1',
        productId: 'prod_tv_1',
        title: '55-Inch OLED Ultra Slim',
        sku: 'LG-OLED-55',
        price: 3450000,
        compareAtPrice: 4200000,
        inventoryCount: 12,
        attributes: { size: '55 Inch', panel: 'OLED' }
      },
      {
        id: 'v_tv_2',
        productId: 'prod_tv_1',
        title: '65-Inch OLED Ultra Slim',
        sku: 'LG-OLED-65',
        price: 4950000,
        compareAtPrice: 5800000,
        inventoryCount: 7,
        attributes: { size: '65 Inch', panel: 'OLED' }
      }
    ],
    reviews: [
      {
        id: 'rev_tv_1',
        productId: 'prod_tv_1',
        userId: 'u_103',
        userName: 'David Mukasa',
        rating: 5,
        title: 'Stunning display for Premier League & Movies',
        comment: 'Colors pop effortlessly in my living room in Entebbe. The FoxPrice delivery team brought it safely and helped mount it.',
        verifiedPurchase: true,
        createdAt: '2026-09-15T09:20:00Z'
      }
    ],
    createdAt: '2026-09-02T11:00:00Z',
    updatedAt: '2026-09-23T16:00:00Z'
  },
  {
    id: 'prod_air_fryer_1',
    title: 'Digital Dual-Zone Touchscreen Air Fryer 6.5L with Rapid 360° Crisping Tech',
    slug: 'digital-dual-zone-touchscreen-air-fryer',
    description: 'Cook two dishes simultaneously with synchronized finish. 8 one-touch cooking presets (air fry, roast, bake, dehydrate, reheat). Uses 85% less oil for crispy, healthy family meals in minutes.',
    price: 480000,
    compareAtPrice: 650000,
    costPerItem: 320000,
    sku: 'FOX-UG-AF-65L',
    barcode: '6941059632145',
    inventoryCount: 52,
    trackQuantity: true,
    isPublished: true,
    images: [
      '/src/assets/images/product_air_fryer_1790375970129.jpg',
      '/src/assets/images/air_fryer_basket_1790377004549.jpg',
      '/src/assets/images/product_carafe_1790375136673.jpg',
      '/src/assets/images/foxprice_deals_hero_1790375933912.jpg'
    ],
    tags: ['Best Seller', 'Kitchen Must-Have', 'Home & Kitchen'],
    rating: 4.88,
    reviewCount: 421,
    categoryId: 'cat_appliances',
    categoryName: 'Home & Kitchen',
    variants: [
      {
        id: 'v_af_1',
        productId: 'prod_air_fryer_1',
        title: '6.5L Matte Obsidian Black',
        sku: 'AF-65L-BLK',
        price: 480000,
        compareAtPrice: 650000,
        inventoryCount: 35,
        attributes: { color: 'Obsidian Black', capacity: '6.5L' }
      },
      {
        id: 'v_af_2',
        productId: 'prod_air_fryer_1',
        title: '8.0L Family XL Touch Edition',
        sku: 'AF-80L-BLK',
        price: 590000,
        compareAtPrice: 780000,
        inventoryCount: 17,
        attributes: { color: 'Obsidian Black', capacity: '8.0L XL' }
      }
    ],
    reviews: [
      {
        id: 'rev_af_1',
        productId: 'prod_air_fryer_1',
        userId: 'u_104',
        userName: 'Sarah Kembabazi',
        rating: 5,
        title: 'Total gamechanger for Ugandan snacks!',
        comment: 'Makes gonja, chicken wings, and samosas crisp without deep frying in excessive oil. Cleaning takes less than 2 minutes.',
        verifiedPurchase: true,
        createdAt: '2026-09-19T18:45:00Z'
      }
    ],
    createdAt: '2026-09-04T08:00:00Z',
    updatedAt: '2026-09-24T10:00:00Z'
  },
  {
    id: 'prod_sneakers_1',
    title: 'Nike Air Zoom Pro Athletic Breathable Cushioned Running Sneakers',
    slug: 'nike-air-zoom-pro-running-sneakers',
    description: 'Engineered mesh upper for maximum airflow in tropical heat, responsive Zoom Air unit in forefoot, and high-abrasion rubber waffle outsole for unmatched grip on all terrains.',
    price: 240000,
    compareAtPrice: 340000,
    costPerItem: 140000,
    sku: 'FOX-UG-NIKE-ZM',
    barcode: '0196154823901',
    inventoryCount: 64,
    trackQuantity: true,
    isPublished: true,
    images: [
      '/src/assets/images/product_sneakers_1790375981664.jpg',
      '/src/assets/images/sneakers_sole_1790377015481.jpg',
      '/src/assets/images/product_smartwatch_1790375991844.jpg',
      '/src/assets/images/hero_workspace_1790375105346.jpg'
    ],
    tags: ['Trending Deal', 'Fashion', 'Athletic Wear', 'Fashion & Sneakers'],
    rating: 4.79,
    reviewCount: 215,
    categoryId: 'cat_fashion',
    categoryName: 'Fashion & Sneakers',
    variants: [
      {
        id: 'v_snk_1',
        productId: 'prod_sneakers_1',
        title: 'Size 42 (EU) / Flame Orange',
        sku: 'NIKE-ZM-42-ORG',
        price: 240000,
        compareAtPrice: 340000,
        inventoryCount: 22,
        attributes: { size: '42 EU', color: 'Flame Orange' }
      },
      {
        id: 'v_snk_2',
        productId: 'prod_sneakers_1',
        title: 'Size 43 (EU) / Flame Orange',
        sku: 'NIKE-ZM-43-ORG',
        price: 240000,
        compareAtPrice: 340000,
        inventoryCount: 28,
        attributes: { size: '43 EU', color: 'Flame Orange' }
      },
      {
        id: 'v_snk_3',
        productId: 'prod_sneakers_1',
        title: 'Size 44 (EU) / Flame Orange',
        sku: 'NIKE-ZM-44-ORG',
        price: 240000,
        compareAtPrice: 340000,
        inventoryCount: 14,
        attributes: { size: '44 EU', color: 'Flame Orange' }
      }
    ],
    reviews: [
      {
        id: 'rev_snk_1',
        productId: 'prod_sneakers_1',
        userId: 'u_105',
        userName: 'Patrick Ochola',
        rating: 5,
        title: 'Super comfortable for morning runs around Lugogo',
        comment: 'Authentic quality, featherlight, and the cushioning is top notch. Delivery to Jinja took just one day.',
        verifiedPurchase: true,
        createdAt: '2026-09-20T12:00:00Z'
      }
    ],
    createdAt: '2026-09-05T09:00:00Z',
    updatedAt: '2026-09-22T14:00:00Z'
  },
  {
    id: 'prod_watch_1',
    title: 'Rugged Ultra GPS Adventure Smartwatch with AMOLED Display & 14-Day Battery',
    slug: 'rugged-ultra-gps-adventure-smartwatch',
    description: 'Titanium bezel, 100m water resistance, continuous SpO2 heart health tracking, offline topo maps, Bluetooth calls and emergency siren. Built for fitness and adventure.',
    price: 290000,
    compareAtPrice: 395000,
    costPerItem: 180000,
    sku: 'FOX-UG-RUG-WATCH',
    barcode: '6942084729112',
    inventoryCount: 45,
    trackQuantity: true,
    isPublished: true,
    images: [
      '/src/assets/images/product_smartwatch_1790375991844.jpg',
      '/src/assets/images/product_sneakers_1790375981664.jpg',
      '/src/assets/images/product_phone_1790375946472.jpg',
      '/src/assets/images/foxprice_deals_hero_1790375933912.jpg'
    ],
    tags: ['Flash Sale', 'Wearables', 'Electronics & TV'],
    rating: 4.86,
    reviewCount: 178,
    categoryId: 'cat_electronics',
    categoryName: 'Electronics & TV',
    variants: [
      {
        id: 'v_w_1',
        productId: 'prod_watch_1',
        title: 'Sport Orange Fluoroelastomer Band',
        sku: 'WATCH-RUG-ORG',
        price: 290000,
        compareAtPrice: 395000,
        inventoryCount: 30,
        attributes: { strap: 'Orange Sport', size: '49mm' }
      },
      {
        id: 'v_w_2',
        productId: 'prod_watch_1',
        title: 'Midnight Black Titanium Edition',
        sku: 'WATCH-RUG-BLK',
        price: 320000,
        compareAtPrice: 420000,
        inventoryCount: 15,
        attributes: { strap: 'Black Titanium Trail', size: '49mm' }
      }
    ],
    reviews: [
      {
        id: 'rev_w_1',
        productId: 'prod_watch_1',
        userId: 'u_106',
        userName: 'Arthur Mwesigwa',
        rating: 5,
        title: 'Incredible battery life and bright screen',
        comment: 'Lasts more than 12 days on a single charge. Syncs easily with both iPhone and Android phones.',
        verifiedPurchase: true,
        createdAt: '2026-09-17T11:15:00Z'
      }
    ],
    createdAt: '2026-09-06T14:00:00Z',
    updatedAt: '2026-09-24T09:00:00Z'
  },
  {
    id: 'prod_headphones_1',
    title: 'Sony Premium Wireless Active Noise Cancelling Studio Over-Ear Headphones',
    slug: 'sony-premium-wireless-anc-headphones',
    description: 'Industry-leading HD Noise Cancelling processor, high-resolution LDAC audio, 30-hour battery life with quick charging, multipoint Bluetooth connection, and ultra-plush pressure-relieving earpads.',
    price: 850000,
    compareAtPrice: 1150000,
    costPerItem: 580000,
    sku: 'FOX-UG-SONY-NC',
    barcode: '4548736112248',
    inventoryCount: 27,
    trackQuantity: true,
    isPublished: true,
    images: [
      '/src/assets/images/product_headphones_1790375126300.jpg',
      '/src/assets/images/hero_workspace_1790375105346.jpg',
      '/src/assets/images/product_keyboard_1790375116724.jpg',
      '/src/assets/images/foxprice_deals_hero_1790375933912.jpg'
    ],
    tags: ['Audio Master', 'Work from Home', 'Electronics & TV'],
    rating: 4.93,
    reviewCount: 389,
    categoryId: 'cat_electronics',
    categoryName: 'Electronics & TV',
    variants: [
      {
        id: 'v_hp_1',
        productId: 'prod_headphones_1',
        title: 'Matte Silver & Platinum',
        sku: 'HP-ANC-SLV',
        price: 850000,
        compareAtPrice: 1150000,
        inventoryCount: 16,
        attributes: { color: 'Silver' }
      },
      {
        id: 'v_hp_2',
        productId: 'prod_headphones_1',
        title: 'Midnight Stealth Black',
        sku: 'HP-ANC-BLK',
        price: 850000,
        compareAtPrice: 1150000,
        inventoryCount: 11,
        attributes: { color: 'Midnight Black' }
      }
    ],
    reviews: [
      {
        id: 'rev_hp_1',
        productId: 'prod_headphones_1',
        userId: 'u_107',
        userName: 'Joan Birungi',
        rating: 5,
        title: 'Blocks out noisy Kampala traffic completely',
        comment: 'Essential for my remote meetings. Sound clarity is crisp and bass is punchy without distorting.',
        verifiedPurchase: true,
        createdAt: '2026-09-14T15:20:00Z'
      }
    ],
    createdAt: '2026-09-07T10:00:00Z',
    updatedAt: '2026-09-23T11:00:00Z'
  },
  {
    id: 'prod_keyboard_1',
    title: 'Custom Pro Wireless Mechanical Gaming Keyboard with Hot-Swap Linear Switches',
    slug: 'custom-pro-wireless-mechanical-keyboard',
    description: 'CNC machined anodized aluminum body, gasket mounted sound dampening structure, RGB per-key backlighting, Bluetooth 5.2 / 2.4Ghz dongle, and 4000mAh rechargeable battery.',
    price: 320000,
    compareAtPrice: 450000,
    costPerItem: 190000,
    sku: 'FOX-UG-MECH-KB',
    barcode: '7193850183201',
    inventoryCount: 31,
    trackQuantity: true,
    isPublished: true,
    images: [
      '/src/assets/images/product_keyboard_1790375116724.jpg',
      '/src/assets/images/hero_workspace_1790375105346.jpg',
      '/src/assets/images/product_headphones_1790375126300.jpg',
      '/src/assets/images/foxprice_deals_hero_1790375933912.jpg'
    ],
    tags: ['Computing', 'Office & Gaming', 'Computing & Office'],
    rating: 4.87,
    reviewCount: 142,
    categoryId: 'cat_computing',
    categoryName: 'Computing & Office',
    variants: [
      {
        id: 'v_kb_1',
        productId: 'prod_keyboard_1',
        title: 'Linear Red Switches (Silent & Smooth)',
        sku: 'KB-SW-RED',
        price: 320000,
        compareAtPrice: 450000,
        inventoryCount: 20,
        attributes: { switches: 'Linear Red' }
      },
      {
        id: 'v_kb_2',
        productId: 'prod_keyboard_1',
        title: 'Tactile Brown Switches (Gentle Feedback)',
        sku: 'KB-SW-BRN',
        price: 320000,
        compareAtPrice: 450000,
        inventoryCount: 11,
        attributes: { switches: 'Tactile Brown' }
      }
    ],
    reviews: [
      {
        id: 'rev_kb_1',
        productId: 'prod_keyboard_1',
        userId: 'u_108',
        userName: 'Edward Ssenyonjo',
        rating: 5,
        title: 'Creamy typing sound, premium heavy feel',
        comment: 'Works flawlessly with my MacBook and Windows PC. Connecting via Bluetooth is seamless.',
        verifiedPurchase: true,
        createdAt: '2026-09-12T13:40:00Z'
      }
    ],
    createdAt: '2026-09-08T12:00:00Z',
    updatedAt: '2026-09-22T08:00:00Z'
  },
  {
    id: 'prod_carafe_1',
    title: 'Double-Wall Vacuum Insulated Thermal Coffee & Tea Carafe 2.0L (24h Heat Lock)',
    slug: 'thermal-vacuum-insulated-coffee-carafe',
    description: 'Surgical grade 18/8 stainless steel, push-button ergonomic pouring spout, spill-proof silicone seal, keeps drinks piping hot for 24 hours or ice cold for 36 hours.',
    price: 95000,
    compareAtPrice: 140000,
    costPerItem: 55000,
    sku: 'FOX-UG-CARAFE-2L',
    barcode: '5018392019482',
    inventoryCount: 78,
    trackQuantity: true,
    isPublished: true,
    images: [
      '/src/assets/images/product_carafe_1790375136673.jpg',
      '/src/assets/images/air_fryer_basket_1790377004549.jpg',
      '/src/assets/images/hero_workspace_1790375105346.jpg',
      '/src/assets/images/foxprice_deals_hero_1790375933912.jpg'
    ],
    tags: ['Kitchen Essential', 'Beverages', 'Home & Kitchen'],
    rating: 4.81,
    reviewCount: 164,
    categoryId: 'cat_appliances',
    categoryName: 'Home & Kitchen',
    variants: [
      {
        id: 'v_crf_1',
        productId: 'prod_carafe_1',
        title: '2.0L Brushed Stainless Steel',
        sku: 'CARAFE-SS-2L',
        price: 95000,
        compareAtPrice: 140000,
        inventoryCount: 48,
        attributes: { color: 'Brushed Silver', capacity: '2.0L' }
      },
      {
        id: 'v_crf_2',
        productId: 'prod_carafe_1',
        title: '2.0L Matte Kitchen Black',
        sku: 'CARAFE-BLK-2L',
        price: 95000,
        compareAtPrice: 140000,
        inventoryCount: 30,
        attributes: { color: 'Matte Black', capacity: '2.0L' }
      }
    ],
    reviews: [
      {
        id: 'rev_crf_1',
        productId: 'prod_carafe_1',
        userId: 'u_109',
        userName: 'Brenda Atuhaire',
        rating: 5,
        title: 'Keeps tea steaming hot until the next morning',
        comment: 'Essential for my family in Mbarara. High quality finish that does not leak at all.',
        verifiedPurchase: true,
        createdAt: '2026-09-10T16:10:00Z'
      }
    ],
    createdAt: '2026-09-09T15:00:00Z',
    updatedAt: '2026-09-21T18:00:00Z'
  }
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord_101',
    orderNumber: 'FOX-UG-9821',
    customerName: 'Brian Kato',
    customerEmail: 'brian.kato@gmail.com',
    shippingAddress: {
      fullName: 'Brian Kato',
      email: 'brian.kato@gmail.com',
      phone: '+256 772 458 912',
      street: 'Plot 14, Prince Charles Drive, Kololo',
      city: 'Kampala',
      state: 'Central Region',
      postalCode: '25601',
      country: 'Uganda',
    },
    subtotal: 4200000,
    discountAmount: 420000,
    shippingAmount: 0,
    taxAmount: 0,
    totalAmount: 3780000,
    status: 'SHIPPED',
    paymentStatus: 'PAID',
    paymentMethod: 'MTN_MOMO',
    mobileMoneyNumber: '0772458912',
    mobileMoneyTxId: 'MOMO-UG-982143',
    carrier: 'FoxPrice Express Kampala',
    trackingNumber: 'FX-KLA-847291',
    estimatedDelivery: '2026-09-26T17:00:00Z',
    items: [
      {
        id: 'item_101',
        productId: 'prod_phone_1',
        productTitle: 'Samsung Galaxy S24 Ultra 5G - 512GB (Titanium Gray) + Free Galaxy Buds',
        productImage: '/src/assets/images/product_phone_1790375946472.jpg',
        variantId: 'v_phone_1',
        variantTitle: 'Titanium Blue / 512GB',
        quantity: 1,
        unitPrice: 4200000,
        subtotal: 4200000,
      }
    ],
    createdAt: '2026-09-24T14:30:00Z',
    updatedAt: '2026-09-24T16:00:00Z',
  },
  {
    id: 'ord_102',
    orderNumber: 'FOX-UG-9822',
    customerName: 'Sarah Kembabazi',
    customerEmail: 'sarah.k@yahoo.com',
    shippingAddress: {
      fullName: 'Sarah Kembabazi',
      email: 'sarah.k@yahoo.com',
      phone: '+256 701 884 219',
      street: 'Kira Road, Plot 5B, Ntinda Complex',
      city: 'Kampala',
      state: 'Central Region',
      postalCode: '25601',
      country: 'Uganda',
    },
    subtotal: 720000,
    discountAmount: 72000,
    shippingAmount: 0,
    taxAmount: 0,
    totalAmount: 648000,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    paymentMethod: 'AIRTEL_MONEY',
    mobileMoneyNumber: '0701884219',
    mobileMoneyTxId: 'AIRTEL-UG-391024',
    carrier: 'FoxPrice Express Kampala',
    trackingNumber: 'FX-KLA-847292',
    estimatedDelivery: '2026-09-27T12:00:00Z',
    items: [
      {
        id: 'item_102',
        productId: 'prod_air_fryer_1',
        productTitle: 'Digital Dual-Zone Touchscreen Air Fryer 6.5L with Rapid 360° Crisping Tech',
        productImage: '/src/assets/images/product_air_fryer_1790375970129.jpg',
        variantId: 'v_af_1',
        variantTitle: '6.5L Matte Obsidian Black',
        quantity: 1,
        unitPrice: 480000,
        subtotal: 480000,
      },
      {
        id: 'item_103',
        productId: 'prod_sneakers_1',
        productTitle: 'Nike Air Zoom Pro Athletic Breathable Cushioned Running Sneakers',
        productImage: '/src/assets/images/product_sneakers_1790375981664.jpg',
        variantId: 'v_snk_1',
        variantTitle: 'Size 42 (EU) / Flame Orange',
        quantity: 1,
        unitPrice: 240000,
        subtotal: 240000,
      }
    ],
    createdAt: '2026-09-25T08:15:00Z',
    updatedAt: '2026-09-25T09:00:00Z',
  }
];
