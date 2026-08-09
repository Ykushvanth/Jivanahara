import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChildProvider } from './contexts/ChildContext.jsx';
import Home from './pages/home/home.jsx';
import Login from './pages/login/login.jsx';
import Register from './pages/register/register.jsx';
import Profile from './pages/profile/profile.jsx';
import Menu from './pages/menu/menu.jsx';
import Cart from './pages/cart/cart.jsx';
import MealPlans from './pages/mealplans/mealplans.jsx';
import About from './pages/about/about.jsx';
import Contact from './pages/contact/contact.jsx';
import Faq from './pages/faq/faq.jsx';
import FoodSafety from './pages/foodsafety/foodsafety.jsx';
import HowItWorks from './pages/howitworks/howitworks.jsx';
import Nutrition from './pages/nutrition/nutrition.jsx';
import Partner from './pages/partner/partner.jsx';
import Schools from './pages/schools/schools.jsx';

function App() {
  return (
    <Router>
      <ChildProvider>
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
      </ChildProvider>
    </Router>
  );
}

export default App;
