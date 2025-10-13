export interface SceneWord {
  id: number;
  word: string;
  phonetic: string;
  translation: string;
}

export interface Scene {
  id: string;
  name: string;
  emoji: string;
  totalWords: number;
  imageUrl: string;
  description: string;
  descriptionCn: string;
  words: SceneWord[];
  wordLabels: { word: string; x: number; y: number }[]; // Position of labels on image (percentage)
}

export const scenes: Scene[] = [
  {
    id: "supermarket-herbs",
    name: "超市香草区",
    emoji: "🌿",
    totalWords: 9,
    imageUrl: "/placeholder-herbs.jpg", // Placeholder - will use generated image
    description: "This is a fresh herbs section carefully curated in a bustling supermarket.",
    descriptionCn: "这是一家超市中精心摆放的新鲜香草和蔬菜区。",
    wordLabels: [
      { word: "Basil", x: 15, y: 75 },
      { word: "Parsley", x: 35, y: 75 },
      { word: "Dill", x: 20, y: 55 },
      { word: "Sage", x: 50, y: 45 },
      { word: "Celery", x: 75, y: 45 },
      { word: "Chives", x: 80, y: 55 },
      { word: "Cilantro", x: 15, y: 85 },
      { word: "Rosemary", x: 45, y: 85 },
      { word: "Thyme", x: 65, y: 75 },
    ],
    words: [
      { id: 1, word: "Basil", phonetic: "/ˈbæzəl/", translation: "罗勒" },
      { id: 2, word: "Parsley", phonetic: "/ˈpɑːrsli/", translation: "欧芹" },
      { id: 3, word: "Dill", phonetic: "/dɪl/", translation: "莳萝" },
      { id: 4, word: "Cilantro", phonetic: "/sɪˈlæntroʊ/", translation: "香菜" },
      { id: 5, word: "Rosemary", phonetic: "/ˈroʊzˌmeri/", translation: "迷迭香" },
      { id: 6, word: "Thyme", phonetic: "/taɪm/", translation: "百里香" },
      { id: 7, word: "Oregano", phonetic: "/əˈreɡənoʊ/", translation: "牛至" },
      { id: 8, word: "Chives", phonetic: "/tʃaɪvz/", translation: "韭菜" },
      { id: 9, word: "Sage", phonetic: "/seɪdʒ/", translation: "鼠尾草" },
    ],
  },
  {
    id: "coffee-shop",
    name: "咖啡店",
    emoji: "☕",
    totalWords: 8,
    imageUrl: "/placeholder-coffee.jpg",
    description: "A cozy coffee shop where the aroma of fresh coffee fills the air.",
    descriptionCn: "一家温馨的咖啡店，空气中弥漫着新鲜咖啡的香气。",
    wordLabels: [],
    words: [
      { id: 10, word: "Espresso", phonetic: "/eˈspreso/", translation: "浓缩咖啡" },
      { id: 11, word: "Latte", phonetic: "/ˈlɑːteɪ/", translation: "拿铁" },
      { id: 12, word: "Cappuccino", phonetic: "/ˌkæpuˈtʃiːnoʊ/", translation: "卡布奇诺" },
      { id: 13, word: "Barista", phonetic: "/bəˈriːstə/", translation: "咖啡师" },
      { id: 14, word: "Grinder", phonetic: "/ˈɡraɪndər/", translation: "研磨机" },
      { id: 15, word: "Saucer", phonetic: "/ˈsɔːsər/", translation: "茶托" },
      { id: 16, word: "Pastry", phonetic: "/ˈpeɪstri/", translation: "糕点" },
      { id: 17, word: "Muffin", phonetic: "/ˈmʌfɪn/", translation: "松饼" },
    ],
  },
  {
    id: "gym",
    name: "健身房",
    emoji: "💪",
    totalWords: 10,
    imageUrl: "/placeholder-gym.jpg",
    description: "A modern gym equipped with various fitness equipment.",
    descriptionCn: "一个配备了各种健身器材的现代化健身房。",
    wordLabels: [],
    words: [
      { id: 18, word: "Treadmill", phonetic: "/ˈtredmɪl/", translation: "跑步机" },
      { id: 19, word: "Dumbbell", phonetic: "/ˈdʌmbel/", translation: "哑铃" },
      { id: 20, word: "Barbell", phonetic: "/ˈbɑːrbel/", translation: "杠铃" },
      { id: 21, word: "Bench", phonetic: "/bentʃ/", translation: "卧推凳" },
      { id: 22, word: "Mat", phonetic: "/mæt/", translation: "瑜伽垫" },
      { id: 23, word: "Locker", phonetic: "/ˈlɑːkər/", translation: "储物柜" },
      { id: 24, word: "Towel", phonetic: "/ˈtaʊəl/", translation: "毛巾" },
      { id: 25, word: "Trainer", phonetic: "/ˈtreɪnər/", translation: "教练" },
      { id: 26, word: "Membership", phonetic: "/ˈmembərʃɪp/", translation: "会员资格" },
      { id: 27, word: "Squat", phonetic: "/skwɑːt/", translation: "深蹲" },
    ],
  },
  {
    id: "airport",
    name: "机场候机厅",
    emoji: "✈️",
    totalWords: 12,
    imageUrl: "/placeholder-airport.jpg",
    description: "A busy airport terminal with passengers preparing for their flights.",
    descriptionCn: "繁忙的机场候机厅，乘客们正在为他们的航班做准备。",
    wordLabels: [],
    words: [
      { id: 28, word: "Terminal", phonetic: "/ˈtɜːrmɪnl/", translation: "航站楼" },
      { id: 29, word: "Gate", phonetic: "/ɡeɪt/", translation: "登机口" },
      { id: 30, word: "Boarding", phonetic: "/ˈbɔːrdɪŋ/", translation: "登机" },
      { id: 31, word: "Luggage", phonetic: "/ˈlʌɡɪdʒ/", translation: "行李" },
      { id: 32, word: "Passport", phonetic: "/ˈpæspɔːrt/", translation: "护照" },
      { id: 33, word: "Security", phonetic: "/sɪˈkjʊrəti/", translation: "安检" },
      { id: 34, word: "Departure", phonetic: "/dɪˈpɑːrtʃər/", translation: "出发" },
      { id: 35, word: "Arrival", phonetic: "/əˈraɪvl/", translation: "到达" },
      { id: 36, word: "Customs", phonetic: "/ˈkʌstəmz/", translation: "海关" },
      { id: 37, word: "Baggage", phonetic: "/ˈbæɡɪdʒ/", translation: "行李" },
      { id: 38, word: "Delay", phonetic: "/dɪˈleɪ/", translation: "延误" },
      { id: 39, word: "Lounge", phonetic: "/laʊndʒ/", translation: "休息室" },
    ],
  },
  {
    id: "restaurant",
    name: "西餐厅",
    emoji: "🍽️",
    totalWords: 11,
    imageUrl: "/placeholder-restaurant.jpg",
    description: "An elegant restaurant with a fine dining atmosphere.",
    descriptionCn: "一家氛围优雅的高档西餐厅。",
    wordLabels: [],
    words: [
      { id: 40, word: "Menu", phonetic: "/ˈmenjuː/", translation: "菜单" },
      { id: 41, word: "Waiter", phonetic: "/ˈweɪtər/", translation: "服务员" },
      { id: 42, word: "Appetizer", phonetic: "/ˈæpɪtaɪzər/", translation: "开胃菜" },
      { id: 43, word: "Entrée", phonetic: "/ˈɑːntreɪ/", translation: "主菜" },
      { id: 44, word: "Dessert", phonetic: "/dɪˈzɜːrt/", translation: "甜点" },
      { id: 45, word: "Reservation", phonetic: "/ˌrezərˈveɪʃn/", translation: "预订" },
      { id: 46, word: "Cutlery", phonetic: "/ˈkʌtləri/", translation: "餐具" },
      { id: 47, word: "Napkin", phonetic: "/ˈnæpkɪn/", translation: "餐巾" },
      { id: 48, word: "Bill", phonetic: "/bɪl/", translation: "账单" },
      { id: 49, word: "Tip", phonetic: "/tɪp/", translation: "小费" },
      { id: 50, word: "Chef", phonetic: "/ʃef/", translation: "厨师" },
    ],
  },
  {
    id: "library",
    name: "图书馆",
    emoji: "📚",
    totalWords: 9,
    imageUrl: "/placeholder-library.jpg",
    description: "A quiet library filled with books and study spaces.",
    descriptionCn: "一个安静的图书馆，充满了书籍和学习空间。",
    wordLabels: [],
    words: [
      { id: 51, word: "Shelf", phonetic: "/ʃelf/", translation: "书架" },
      { id: 52, word: "Librarian", phonetic: "/laɪˈbreriən/", translation: "图书管理员" },
      { id: 53, word: "Catalog", phonetic: "/ˈkætəlɔːɡ/", translation: "目录" },
      { id: 54, word: "Borrow", phonetic: "/ˈbɑːroʊ/", translation: "借阅" },
      { id: 55, word: "Return", phonetic: "/rɪˈtɜːrn/", translation: "归还" },
      { id: 56, word: "Reference", phonetic: "/ˈrefrəns/", translation: "参考书" },
      { id: 57, word: "Periodical", phonetic: "/ˌpɪriˈɑːdɪkl/", translation: "期刊" },
      { id: 58, word: "Fine", phonetic: "/faɪn/", translation: "罚金" },
      { id: 59, word: "Quiet", phonetic: "/ˈkwaɪət/", translation: "安静的" },
    ],
  },
];
