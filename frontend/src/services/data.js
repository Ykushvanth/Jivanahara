import vegRice from '@/assets/images/meal-veg-rice.jpg';
import paneer from '@/assets/images/meal-paneer.jpg';
import heroMeal from '@/assets/images/hero-meal.jpg';

export const meals = [
  {
    id: 'veg-pulao-bowl',
    name: 'Garden Vegetable Pulao Bowl',
    description: 'Aromatic rice tossed with seasonal vegetables, served with cooling curd.',
    price: 89,
    image: vegRice,
    diet: 'veg',
    calories: 520,
    protein: 16,
    carbs: 78,
    fat: 14,
    fibre: 7,
    calcium: 180,
    iron: 4.2,
    allergens: ['Milk'],
    ingredients: ['Basmati rice', 'Carrot', 'Green peas', 'Beans', 'Curd', 'Mild spices'],
    rating: 4.7,
    tag: 'Most loved'
  },
  {
    id: 'paneer-roti-plate',
    name: 'Paneer Masala & Soft Roti',
    description: 'Home-style paneer in a mild tomato gravy with whole-wheat rotis.',
    price: 119,
    image: paneer,
    diet: 'veg',
    calories: 610,
    protein: 26,
    carbs: 66,
    fat: 22,
    fibre: 9,
    calcium: 420,
    iron: 5.1,
    allergens: ['Milk', 'Wheat'],
    ingredients: ['Paneer', 'Whole wheat flour', 'Tomato', 'Onion', 'Mild spices'],
    rating: 4.8,
    tag: 'High protein'
  },
  {
    id: 'dal-rice-comfort',
    name: 'Yellow Dal, Rice & Fruit',
    description: 'Everyday comfort dal with steamed rice and a fresh fruit portion.',
    price: 79,
    image: heroMeal,
    diet: 'veg',
    calories: 480,
    protein: 18,
    carbs: 74,
    fat: 10,
    fibre: 10,
    calcium: 140,
    iron: 4.8,
    allergens: [],
    ingredients: ['Toor dal', 'Rice', 'Seasonal fruit', 'Ghee', 'Cumin'],
    rating: 4.6,
    tag: 'Allergen-light'
  },
  {
    id: 'chicken-rice-bowl',
    name: 'Herbed Chicken & Rice Bowl',
    description: 'Lean grilled chicken with steamed rice, salad and a fruit cup.',
    price: 139,
    image: paneer,
    diet: 'nonveg',
    calories: 640,
    protein: 38,
    carbs: 62,
    fat: 20,
    fibre: 6,
    calcium: 90,
    iron: 3.6,
    allergens: ['Soy'],
    ingredients: ['Chicken', 'Rice', 'Cucumber', 'Tomato', 'Herbs'],
    rating: 4.5
  },
  {
    id: 'khichdi-classic',
    name: 'Moong Khichdi & Veggies',
    description: 'Light, easy-to-digest khichdi with sautéed vegetables and papad.',
    price: 75,
    image: vegRice,
    diet: 'veg',
    calories: 450,
    protein: 15,
    carbs: 70,
    fat: 9,
    fibre: 8,
    calcium: 120,
    iron: 4,
    allergens: [],
    ingredients: ['Moong dal', 'Rice', 'Ghee', 'Seasonal vegetables'],
    rating: 4.4
  },
  {
    id: 'rajma-chawal',
    name: 'Rajma Chawal & Salad',
    description: 'Slow-cooked kidney beans with rice, salad and a fruit portion.',
    price: 95,
    image: heroMeal,
    diet: 'veg',
    calories: 560,
    protein: 21,
    carbs: 84,
    fat: 12,
    fibre: 12,
    calcium: 160,
    iron: 6.1,
    allergens: [],
    ingredients: ['Rajma', 'Rice', 'Onion', 'Tomato', 'Mild spices'],
    rating: 4.7,
    tag: 'Fibre rich'
  }
];

export const combos = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'A complete, balanced plate for every school day.',
    price: 89,
    includes: ['Main meal', 'Vegetable', 'Protein source', 'Seasonal fruit']
  },
  {
    id: 'plus',
    name: 'Plus',
    tagline: 'Extra energy for longer days and after-school activity.',
    price: 129,
    includes: [
      'Main meal',
      'Vegetable',
      'Protein source',
      'Seasonal fruit',
      'Healthy snack',
      'Beverage'
    ],
    featured: true
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Our most generous plate with a special protein item.',
    price: 169,
    includes: [
      'Complete meal',
      'Seasonal fruit',
      'Healthy snack',
      'Beverage',
      'Special protein item'
    ]
  }
];

export const schools = [
  { id: 's1', name: 'Greenwood International School', city: 'Bengaluru', students: 1240 },
  { id: 's2', name: "St. Xavier's High School", city: 'Mumbai', students: 980 },
  { id: 's3', name: 'Delhi Public School — Sector 45', city: 'Gurugram', students: 1620 },
  { id: 's4', name: 'Vidya Niketan Academy', city: 'Pune', students: 760 },
  { id: 's5', name: 'Sunrise Global School', city: 'Hyderabad', students: 1130 },
  { id: 's6', name: 'Little Scholars Public School', city: 'Chennai', students: 540 }
];

export const weeklyMenu = [
  { day: 'Monday', meal: 'Garden Vegetable Pulao Bowl', extra: 'Banana', kcal: 520 },
  { day: 'Tuesday', meal: 'Paneer Masala & Soft Roti', extra: 'Apple slices', kcal: 610 },
  { day: 'Wednesday', meal: 'Yellow Dal, Rice & Fruit', extra: 'Buttermilk', kcal: 480 },
  { day: 'Thursday', meal: 'Rajma Chawal & Salad', extra: 'Orange', kcal: 560 },
  { day: 'Friday', meal: 'Moong Khichdi & Veggies', extra: 'Fruit yoghurt', kcal: 450 },
  { day: 'Saturday', meal: 'Herbed Chicken & Rice Bowl', extra: 'Seasonal fruit', kcal: 640 }
];

export const nutritionTargets = [
  { label: 'Calories', value: 520, target: 600, unit: 'kcal' },
  { label: 'Protein', value: 22, target: 26, unit: 'g' },
  { label: 'Carbohydrates', value: 74, target: 85, unit: 'g' },
  { label: 'Fat', value: 14, target: 20, unit: 'g' },
  { label: 'Fibre', value: 9, target: 10, unit: 'g' },
  { label: 'Calcium', value: 320, target: 400, unit: 'mg' },
  { label: 'Iron', value: 4.6, target: 6, unit: 'mg' }
];

export const faqs = [
  {
    q: 'How are meals prepared and delivered?',
    a: 'Meals are cooked fresh each morning in our audited central kitchen, sealed in tamper-evident packaging and delivered to your child\'s school before the evening meal break.'
  },
  {
    q: 'Can I pause or skip meals?',
    a: 'Yes. You can skip individual days or pause an entire subscription from the meal calendar up to 8:00 PM the previous evening. Skipped meals return to your credit balance.'
  },
  {
    q: 'How do you handle allergies?',
    a: 'Every child profile records allergies and foods to avoid. Allergen information is listed on each meal, and meals containing a flagged allergen are blocked from selection with a clear warning.'
  },
  {
    q: 'What are the payment options?',
    a: 'Subscriptions and one-off orders are paid online through a secure Indian payment gateway. We never store raw card details, and invoices are downloadable from your dashboard.'
  },
  {
    q: 'Do you offer vegetarian-only menus?',
    a: 'Yes. Each child profile can be set to vegetarian, and the menu will only ever show vegetarian meals for that child.'
  },
  {
    q: 'How is pricing decided?',
    a: 'Pricing depends on the combo you choose and the plan duration. Monthly plans offer the best per-meal value, and school-wide programmes may have negotiated rates.'
  }
];
