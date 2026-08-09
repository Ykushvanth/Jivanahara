import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChildProvider } from './contexts/ChildContext.jsx';

// Lazy load all pages for code splitting
const Home = lazy(() => import('./pages/home/home.jsx'));
const Login = lazy(() => import('./pages/login/login.jsx'));
const Register = lazy(() => import('./pages/register/register.jsx'));
const Profile = lazy(() => import('./pages/profile/profile.jsx'));
const Menu = lazy(() => import('./pages/menu/menu.jsx'));
const Cart = lazy(() => import('./pages/cart/cart.jsx'));
const MealPlans = lazy(() => import('./pages/mealplans/mealplans.jsx'));
const About = lazy(() => import('./pages/about/about.jsx'));
const Contact = lazy(() => import('./pages/contact/contact.jsx'));
const Faq = lazy(() => import('./pages/faq/faq.jsx'));
const FoodSafety = lazy(() => import('./pages/foodsafety/foodsafety.jsx'));
const HowItWorks = lazy(() => import('./pages/howitworks/howitworks.jsx'));
const Nutrition = lazy(() => import('./pages/nutrition/nutrition.jsx'));
const Partner = lazy(() => import('./pages/partner/partner.jsx'));
const Schools = lazy(() => import('./pages/schools/schools.jsx'));

function App() {
  return (
    <Router>
      <ChildProvider>
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '1.125rem', color: 'var(--color-muted-foreground)' }}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/meal-plans" element={<MealPlans />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/food-safety" element={<FoodSafety />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/schools" element={<Schools />} />
          </Routes>
        </Suspense>
      </ChildProvider>
    </Router>
  );
}

export default App;
