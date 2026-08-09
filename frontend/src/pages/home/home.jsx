import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Salad, ChefHat, Baby, ShieldCheck, BarChart3, MousePointerClick, Star } from 'lucide-react';
import heroMeal from '@/assets/images/hero-meal.jpg';
import SiteLayout, { Section } from '../../components/sitelayout/sitelayout.jsx';
import MealCard from '../../components/mealcard/mealcard.jsx';
import Button from '../../components/button/button.jsx';
import { supabase } from '../../services/supabase';
import { useChild } from '../../contexts/ChildContext.jsx';
import { weeklyMenu } from '../../services/data';
import './home.css';

const trustIndicators = [
  { icon: Salad, label: 'Nutrition-focused meals' },
  { icon: ChefHat, label: 'Freshly prepared' },
  { icon: Baby, label: 'Child-friendly portions' },
  { icon: ShieldCheck, label: 'Food safety' },
  { icon: BarChart3, label: 'Transparent nutrition' },
  { icon: MousePointerClick, label: 'Easy online ordering' }
];

const steps = [
  { n: '01', t: 'Select school & add child', d: "Find your child's school and add their details, diet preferences and allergies." },
  { n: '02', t: 'Choose meals', d: 'Pick from our weekly menu, customise and review your order.' },
  { n: '03', t: 'Track delivery', d: 'Monitor meal preparation and delivery status in real-time.' }
];

function Home() {
  const navigate = useNavigate();
  const { selectedChild } = useChild();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    checkUser();
    fetchMenus();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await getOrCreateCart(user.id);
    }
  };

  const getOrCreateCart = async (authUserId) => {
    try {
      const { data: parentData, error: parentError } = await supabase
        .from('parents')
        .select('id')
        .eq('password_hash', authUserId)
        .eq('status', 'active')
        .single();

      if (parentError || !parentData) return;

      // Get the most recent active cart (or create new one)
      let { data: carts, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('parent_id', parentData.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (cartError) throw cartError;

      let cart = carts && carts.length > 0 ? carts[0] : null;

      if (!cart) {
        const { data: newCart, error: createError } = await supabase
          .from('carts')
          .insert({ parent_id: parentData.id, status: 'active' })
          .select('id')
          .single();

        if (createError) throw createError;
        cart = newCart;
      }

      setCartId(cart.id);
    } catch (error) {
      console.error('Error getting cart:', error);
    }
  };

  const addToCart = async (meal) => {
    if (!user) {
      alert('Please log in to add items to cart');
      navigate('/login');
      return;
    }

    if (!selectedChild) {
      alert('Please select a child from the navigation bar before adding items to cart');
      return;
    }

    if (!cartId) {
      alert('Unable to access cart. Please try again.');
      return;
    }

    console.log('🛒 Adding to cart:', {
      cartId,
      childId: selectedChild.id,
      childName: selectedChild.name,
      mealId: meal.id,
      mealName: meal.name
    });

    setAddingToCart(meal.id);

    try {
      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cartId,
          child_id: selectedChild.id,
          menu_id: meal.id,
          quantity: 1,
          unit_price: meal.price,
          total_price: meal.price,
          selected_date: today
        });

      if (error) throw error;

      console.log('✅ Successfully added to cart!');
      alert(`${meal.name} added to cart for ${selectedChild.name}!`);
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(null);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('status', 'active')
        .order('menu_date', { ascending: false })
        .limit(6);

      if (error) throw error;

      // Transform data to match MealCard component props
      const transformedMenus = data.map(menu => ({
        id: menu.id,
        name: menu.meal_name,
        description: menu.description,
        price: menu.price,
        image: menu.image_url,
        diet: menu.diet_type === 'vegetarian' ? 'veg' : 'nonveg',
        calories: menu.calories,
        protein: menu.protein,
        carbs: menu.carbohydrates,
        fat: menu.fat,
        fibre: menu.fibre,
        allergens: menu.allergens || [],
        ingredients: menu.ingredients || [],
        rating: menu.average_rating || 4.5,
        tag: menu.tags && menu.tags.length > 0 ? menu.tags[0] : null,
        date: menu.menu_date,
      }));

      setMenus(transformedMenus);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="home-hero">
        <div className="home-hero__container">
          <div>
            <span className="home-hero__badge">
              Trusted by 40+ schools across India
            </span>
            <h1 className="home-hero__title">
              Nutritious Meals. Happier Kids. Better Learning.
            </h1>
            <p className="home-hero__description">
              Freshly prepared, child-friendly meals designed to support school students with
              balanced nutrition, great taste and everyday convenience.
            </p>
            <div className="home-hero__actions">
              <Button asChild size="lg" variant="outline" className="home-hero__cta-btn">
                <Link to="/partner">Partner With Us</Link>
              </Button>
            </div>
            <div className="home-hero__rating">
              <div className="home-hero__stars" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="home-hero__star" />
                ))}
              </div>
              <span>4.8 average rating from 6,200+ parents</span>
            </div>
          </div>

          <div className="home-hero__image-wrapper">
            <div className="home-hero__image-container">
              <img
                src={heroMeal}
                alt="A balanced school meal tray with vegetable rice, dal, paneer and fresh fruit"
                width={1408}
                height={1104}
                className="home-hero__image"
              />
            </div>
            <div className="home-hero__card">
              <p className="home-hero__card-label">Today's plate</p>
              <p className="home-hero__card-value">520 kcal · 22g protein</p>
              <p className="home-hero__card-note">
                Balanced against age-appropriate targets
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="home-trust">
        <ul className="home-trust__container">
          {trustIndicators.map((t) => (
            <li key={t.label} className="home-trust__item">
              <span className="home-trust__icon">
                <t.icon className="home-trust__icon-svg" aria-hidden="true" />
              </span>
              <span className="home-trust__label">{t.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <Section
        muted
        title="Our Menu"
        description="Full nutrition, ingredients, allergen information and menu dates on every meal — before you order."
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>Loading today's menu...</p>
          </div>
        ) : menus.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>No meals available for today.</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Check our full menu for upcoming meals.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {menus.map((m) => (
              <MealCard key={m.id} meal={m} onSelectMeal={addToCart} />
            ))}
          </div>
        )}
        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <Button asChild size="lg" variant="outline" style={{ minHeight: '3rem' }}>
            <Link to="/menu">View Full Menu</Link>
          </Button>
        </div>
      </Section>

      <Section
        title="From school to plate in three steps"
        description="Parents finish the whole journey on a phone in under three minutes."
      >
        <ol style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {steps.map((s) => (
            <li key={s.n} className="surface-card" style={{ padding: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>{s.n}</span>
              <h3 style={{ marginTop: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600 }}>{s.t}</h3>
              <p style={{ marginTop: '0.375rem', fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>{s.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section muted title="A rotating weekly menu" description="Published in advance, every week.">
        <div style={{ display: 'grid', gap: '1rem'
, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {weeklyMenu.map((d) => (
            <div key={d.day} className="surface-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1.25rem' }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                  {d.day}
                </p>
                <p style={{ marginTop: '0.25rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.meal}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>+ {d.extra}</p>
              </div>
              <span style={{ flexShrink: 0, borderRadius: '9999px', backgroundColor: 'var(--color-secondary)', padding: '0.375rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-secondary-foreground)' }}>
                {d.kcal} kcal
              </span>
            </div>
          ))}
        </div>
      </Section>

      <section style={{ paddingBottom: '6rem' }}>
        <div className="container-page">
          <div style={{ borderRadius: 'var(--radius-3xl)', backgroundColor: 'var(--color-navy)', padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--color-navy-foreground)' }}>
            <h2 style={{ maxWidth: '42rem', margin: '0 auto', fontSize: '1.875rem', fontWeight: 600 }}>
              Give your child a plate you can trust
            </h2>
            <p style={{ maxWidth: '36rem', margin: '1rem auto 0', color: 'rgba(248, 250, 252, 0.75)' }}>
              Start a plan in minutes, pause any day, and see exactly what was served.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem', alignItems: 'center' }}>
              <Button asChild size="lg" style={{ minHeight: '3rem' }}>
                <Link to="/register">Subscribe Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                style={{ minHeight: '3rem', border: '1px solid rgba(248, 250, 252, 0.25)', backgroundColor: 'transparent', color: 'var(--color-navy-foreground)' }}
              >
                <Link to="/contact">Talk to our team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export default Home;
