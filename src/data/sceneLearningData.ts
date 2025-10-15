export interface SceneWord {
  id: number;
  word: string;
  tags: string[];
  phonetic: string;
  translation: string;
  example: string;
  exampleCn: string;
}

export interface Scene {
  id: string;
  name: string;
  emoji: string;
  totalWords: number;
  imageUrl: string;
  description: string;
  descriptionCn: string;
  examples: { en: string; cn: string }[];
  wordLabels: { word: string; x: number; y: number }[];
  words: SceneWord[];
}

export const scenes: Scene[] = [
  {
    id: "supermarket-herbs",
    name: "超市香草区",
    emoji: "🌿",
    totalWords: 8,
    imageUrl: "/placeholder-herbs.jpg",
    description: "Welcome to the herb section of our supermarket. Here you can find fresh basil, rosemary, and thyme on the shelves. The aroma of mint fills the air, while bundles of parsley and cilantro are neatly arranged. Don't forget to check out the oregano and dill in the refrigerated section.",
    descriptionCn: "欢迎来到我们超市的香草区。在这里你可以在货架上找到新鲜的罗勒、迷迭香和百里香。薄荷的香气弥漫在空气中,而欧芹和香菜束整齐地排列着。别忘了看看冷藏区的牛至和莳萝。",
    examples: [
      { en: "Fresh basil adds a wonderful aroma to pasta dishes.", cn: "新鲜的罗勒为意大利面增添了美妙的香气。" },
      { en: "I always use rosemary when roasting chicken.", cn: "我烤鸡时总是使用迷迭香。" },
      { en: "The cilantro in this salad tastes incredibly fresh.", cn: "这道沙拉里的香菜尝起来非常新鲜。" }
    ],
    wordLabels: [
      { word: "Basil", x: 20, y: 30 },
      { word: "Rosemary", x: 50, y: 30 },
      { word: "Thyme", x: 80, y: 30 },
      { word: "Mint", x: 20, y: 70 },
      { word: "Parsley", x: 50, y: 70 },
      { word: "Cilantro", x: 80, y: 70 },
    ],
    words: [
      { id: 1001, word: "basil", tags: ["n."], phonetic: "/ˈbæzl/", translation: "罗勒", example: "Fresh basil is essential for Italian cooking.", exampleCn: "新鲜罗勒是意大利烹饪的必需品。" },
      { id: 1002, word: "rosemary", tags: ["n."], phonetic: "/ˈroʊzmeri/", translation: "迷迭香", example: "Rosemary has a strong aromatic flavor.", exampleCn: "迷迭香有浓郁的芳香味道。" },
      { id: 1003, word: "thyme", tags: ["n."], phonetic: "/taɪm/", translation: "百里香", example: "Add thyme to enhance the flavor.", exampleCn: "加入百里香来增强风味。" },
      { id: 1004, word: "mint", tags: ["n."], phonetic: "/mɪnt/", translation: "薄荷", example: "Mint leaves are perfect for tea.", exampleCn: "薄荷叶非常适合泡茶。" },
      { id: 1005, word: "parsley", tags: ["n."], phonetic: "/ˈpɑːrsli/", translation: "欧芹", example: "Garnish the dish with fresh parsley.", exampleCn: "用新鲜欧芹装饰菜肴。" },
      { id: 1006, word: "cilantro", tags: ["n."], phonetic: "/sɪˈlæntroʊ/", translation: "香菜", example: "Cilantro adds freshness to the salsa.", exampleCn: "香菜为莎莎酱增添了新鲜感。" },
      { id: 1007, word: "oregano", tags: ["n."], phonetic: "/əˈreɡənoʊ/", translation: "牛至", example: "Oregano is commonly used in pizza.", exampleCn: "牛至常用于披萨中。" },
      { id: 1008, word: "dill", tags: ["n."], phonetic: "/dɪl/", translation: "莳萝", example: "Dill pairs well with fish dishes.", exampleCn: "莳萝与鱼类菜肴很搭配。" },
    ],
  },
  {
    id: "coffee-shop",
    name: "咖啡店",
    emoji: "☕",
    totalWords: 6,
    imageUrl: "/placeholder-coffee.jpg",
    description: "Welcome to our cozy coffee shop! The rich aroma of espresso fills the air. Behind the counter, you'll see our barista preparing a perfect cappuccino with steamed milk. Fresh croissants and muffins are displayed in the glass case, while customers enjoy their latte at wooden tables.",
    descriptionCn: "欢迎来到我们温馨的咖啡店！浓郁的浓缩咖啡香气弥漫在空气中。在柜台后面,你会看到我们的咖啡师正在用蒸奶准备一杯完美的卡布奇诺。新鲜的羊角面包和松饼陈列在玻璃柜中,顾客们在木桌旁享受着拿铁咖啡。",
    examples: [
      { en: "The barista makes the best cappuccino in town.", cn: "这位咖啡师做的卡布奇诺是城里最好的。" },
      { en: "I love having a croissant with my morning espresso.", cn: "我喜欢早上喝浓缩咖啡时配一个羊角面包。" },
      { en: "The steamed milk creates a perfect foam layer.", cn: "蒸奶形成了完美的泡沫层。" }
    ],
    wordLabels: [
      { word: "Espresso", x: 30, y: 40 },
      { word: "Barista", x: 70, y: 40 },
      { word: "Cappuccino", x: 30, y: 70 },
      { word: "Latte", x: 70, y: 70 },
    ],
    words: [
      { id: 2001, word: "espresso", tags: ["n."], phonetic: "/eˈspreso/", translation: "浓缩咖啡", example: "A shot of espresso gives me energy.", exampleCn: "一杯浓缩咖啡给我能量。" },
      { id: 2002, word: "barista", tags: ["n."], phonetic: "/bəˈriːstə/", translation: "咖啡师", example: "The barista recommended their signature blend.", exampleCn: "咖啡师推荐了他们的招牌混合咖啡。" },
      { id: 2003, word: "cappuccino", tags: ["n."], phonetic: "/ˌkæpəˈtʃiːnoʊ/", translation: "卡布奇诺", example: "I ordered a cappuccino with extra foam.", exampleCn: "我点了一杯加多奶泡的卡布奇诺。" },
      { id: 2004, word: "latte", tags: ["n."], phonetic: "/ˈlɑːteɪ/", translation: "拿铁", example: "She prefers a vanilla latte in the morning.", exampleCn: "她早上更喜欢香草拿铁。" },
      { id: 2005, word: "croissant", tags: ["n."], phonetic: "/kwɑːˈsɑːnt/", translation: "羊角面包", example: "The croissant is freshly baked and buttery.", exampleCn: "羊角面包是新鲜出炉的,黄油味十足。" },
      { id: 2006, word: "muffin", tags: ["n."], phonetic: "/ˈmʌfɪn/", translation: "松饼", example: "The blueberry muffin is delicious.", exampleCn: "蓝莓松饼很美味。" },
    ],
  },
  {
    id: "gym",
    name: "健身房",
    emoji: "💪",
    totalWords: 6,
    imageUrl: "/placeholder-gym.jpg",
    description: "Step into our modern gym facility! The treadmill and elliptical machines are lined up near the windows. In the weight section, you'll find dumbbells of various sizes and a complete barbell set. Yoga mats are available in the studio, and don't forget to bring a towel for your workout.",
    descriptionCn: "走进我们现代化的健身房设施！跑步机和椭圆机在窗边排成一排。在力量训练区,你会发现各种尺寸的哑铃和一套完整的杠铃。瑜伽垫在工作室可用,别忘了为你的锻炼带一条毛巾。",
    examples: [
      { en: "I run on the treadmill for 30 minutes every day.", cn: "我每天在跑步机上跑30分钟。" },
      { en: "These dumbbells are perfect for arm exercises.", cn: "这些哑铃非常适合手臂锻炼。" },
      { en: "Don't forget to bring your towel to the gym.", cn: "别忘了带毛巾去健身房。" }
    ],
    wordLabels: [
      { word: "Treadmill", x: 25, y: 35 },
      { word: "Dumbbell", x: 75, y: 35 },
      { word: "Barbell", x: 50, y: 65 },
    ],
    words: [
      { id: 3001, word: "treadmill", tags: ["n."], phonetic: "/ˈtredmɪl/", translation: "跑步机", example: "She exercises on the treadmill daily.", exampleCn: "她每天在跑步机上锻炼。" },
      { id: 3002, word: "dumbbell", tags: ["n."], phonetic: "/ˈdʌmbel/", translation: "哑铃", example: "Grab a pair of dumbbells for this workout.", exampleCn: "拿一对哑铃来做这个锻炼。" },
      { id: 3003, word: "barbell", tags: ["n."], phonetic: "/ˈbɑːrbel/", translation: "杠铃", example: "He can lift a heavy barbell easily.", exampleCn: "他可以轻松举起重杠铃。" },
      { id: 3004, word: "elliptical", tags: ["n."], phonetic: "/ɪˈlɪptɪkl/", translation: "椭圆机", example: "The elliptical machine is great for cardio.", exampleCn: "椭圆机非常适合有氧运动。" },
      { id: 3005, word: "mat", tags: ["n."], phonetic: "/mæt/", translation: "垫子", example: "Place your mat on the floor for yoga.", exampleCn: "把垫子放在地板上做瑜伽。" },
      { id: 3006, word: "towel", tags: ["n."], phonetic: "/ˈtaʊəl/", translation: "毛巾", example: "Always bring a towel to wipe off sweat.", exampleCn: "总是带一条毛巾来擦汗。" },
    ],
  },
  {
    id: "airport",
    name: "机场候机厅",
    emoji: "✈️",
    totalWords: 6,
    imageUrl: "/placeholder-airport.jpg",
    description: "Welcome to the international airport! Please proceed to the check-in counter with your passport and boarding pass. After security screening, you can wait in the departure lounge. Your luggage will be handled by our baggage handlers and loaded onto the aircraft.",
    descriptionCn: "欢迎来到国际机场！请携带您的护照和登机牌前往办理登机手续的柜台。通过安检后,您可以在候机厅等候。您的行李将由我们的行李搬运工处理并装载到飞机上。",
    examples: [
      { en: "Please show your boarding pass at the gate.", cn: "请在登机口出示您的登机牌。" },
      { en: "All passengers must go through security screening.", cn: "所有乘客必须通过安检。" },
      { en: "The aircraft is ready for departure.", cn: "飞机已准备好起飞。" }
    ],
    wordLabels: [
      { word: "Passport", x: 20, y: 40 },
      { word: "Boarding Pass", x: 60, y: 40 },
      { word: "Gate", x: 80, y: 70 },
    ],
    words: [
      { id: 4001, word: "passport", tags: ["n."], phonetic: "/ˈpæspɔːrt/", translation: "护照", example: "Don't forget your passport when traveling.", exampleCn: "旅行时别忘了带护照。" },
      { id: 4002, word: "boarding pass", tags: ["n."], phonetic: "/ˈbɔːrdɪŋ pæs/", translation: "登机牌", example: "You can print your boarding pass online.", exampleCn: "你可以在线打印登机牌。" },
      { id: 4003, word: "luggage", tags: ["n."], phonetic: "/ˈlʌɡɪdʒ/", translation: "行李", example: "Please collect your luggage at baggage claim.", exampleCn: "请在行李提取处取行李。" },
      { id: 4004, word: "gate", tags: ["n."], phonetic: "/ɡeɪt/", translation: "登机口", example: "Our flight departs from gate 15.", exampleCn: "我们的航班从15号登机口出发。" },
      { id: 4005, word: "departure", tags: ["n."], phonetic: "/dɪˈpɑːrtʃər/", translation: "出发", example: "The departure time is 3:00 PM.", exampleCn: "出发时间是下午3点。" },
      { id: 4006, word: "arrival", tags: ["n."], phonetic: "/əˈraɪvl/", translation: "到达", example: "The arrival hall is on the first floor.", exampleCn: "到达大厅在一楼。" },
    ],
  },
  {
    id: "restaurant",
    name: "西餐厅",
    emoji: "🍽️",
    totalWords: 6,
    imageUrl: "/placeholder-restaurant.jpg",
    description: "Welcome to our fine dining restaurant! Our chef has prepared an exquisite menu featuring appetizers, main courses, and desserts. Your waiter will present the wine list and take your order. The cuisine is prepared with fresh ingredients, and each dish is carefully plated for presentation.",
    descriptionCn: "欢迎来到我们的高级餐厅！我们的厨师准备了精致的菜单,包括开胃菜、主菜和甜点。您的服务员会呈上酒单并接受您的点餐。菜肴用新鲜食材烹制,每道菜都经过精心摆盘。",
    examples: [
      { en: "The chef's special is highly recommended.", cn: "强烈推荐主厨特色菜。" },
      { en: "May I see the menu, please?", cn: "可以给我看一下菜单吗？" },
      { en: "The waiter served our appetizers promptly.", cn: "服务员及时送上了我们的开胃菜。" }
    ],
    wordLabels: [
      { word: "Menu", x: 30, y: 50 },
      { word: "Waiter", x: 70, y: 50 },
    ],
    words: [
      { id: 5001, word: "menu", tags: ["n."], phonetic: "/ˈmenjuː/", translation: "菜单", example: "Could you bring us the menu, please?", exampleCn: "请给我们拿菜单好吗？" },
      { id: 5002, word: "waiter", tags: ["n."], phonetic: "/ˈweɪtər/", translation: "服务员", example: "The waiter was very attentive.", exampleCn: "服务员非常周到。" },
      { id: 5003, word: "chef", tags: ["n."], phonetic: "/ʃef/", translation: "厨师", example: "The chef creates amazing dishes.", exampleCn: "厨师创作出令人惊叹的菜肴。" },
      { id: 5004, word: "appetizer", tags: ["n."], phonetic: "/ˈæpɪtaɪzər/", translation: "开胃菜", example: "We ordered soup as an appetizer.", exampleCn: "我们点了汤作为开胃菜。" },
      { id: 5005, word: "dessert", tags: ["n."], phonetic: "/dɪˈzɜːrt/", translation: "甜点", example: "The chocolate cake is my favorite dessert.", exampleCn: "巧克力蛋糕是我最喜欢的甜点。" },
      { id: 5006, word: "cuisine", tags: ["n."], phonetic: "/kwɪˈziːn/", translation: "菜肴", example: "This restaurant serves Italian cuisine.", exampleCn: "这家餐厅提供意大利菜肴。" },
    ],
  },
];
