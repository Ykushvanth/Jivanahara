import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Leaf, Drumstick, AlertTriangle, Star, ShoppingCart } from 'lucide-react';
import SiteLayout, { PageHero } from '../../components/sitelayout/sitelayout';
import MealCard from '../../components/mealcard/mealcard';
import Button from '../../components/button/button';
import { supabase } from '../../services/supabase';
import { useChild } from '../../contexts/ChildContext.jsx';
import './menu.css';

function Menu() {
  const navigate = useNavigate();
  const { selectedChild } = useChild();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState([]);
  const [user, setUser] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    checkUser();
    fetchAvailableDates();
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
      // First, get the parent record using the auth user ID
      const { data: parentData, error: parentError } = await supabase
        .from('parents')
        .select('id')
        .eq('password_hash', authUserId)
        .eq('status', 'active')
        .single();

      if (parentError || !parentData) {
        console.error('Error fetching parent for cart:', parentError);
        return;
      }

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

    setAddingToCart(meal.id);

    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cartId,
          child_id: selectedChild.id,
          menu_id: meal.id,
          quantity: 1,
          unit_price: meal.price,
          total_price: meal.price,
          selected_date: selectedDate
        });

      if (error) throw error;

      alert(`${meal.name} added to cart for ${selectedChild.name}!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(null);
    }
  };

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchMenusForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableDates = async () => {
    try {
      const { data, error } = await supabase
        .from('menus')
        .select('menu_date')
        .eq('status', 'active')
        .order('menu_date', { ascending: true });

      if (error) throw error;

      // Get unique dates
      const uniqueDates = [...new Set(data.map(item => item.menu_date))];
      setAvailableDates(uniqueDates);

      // Set first available date as selected if current date has no menu
      if (uniqueDates.length > 0 && !uniqueDates.includes(selectedDate)) {
        setSelectedDate(uniqueDates[0]);
      }
    } catch (error) {
      console.error('Error fetching available dates:', error);
    }
  };

  const fetchMenusForDate = async (date) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('menu_date', date)
        .eq('status', 'active')
        .order('meal_name');

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
        rating: menu.average_rating,
        tag: menu.tags && menu.tags.length > 0 ? menu.tags[0] : null,
      }));

      setMenus(transformedMenus);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getNextDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      dates.push({
        date: dateString,
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        hasMenu: availableDates.includes(dateString)
      });
    }
    return dates;
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Daily Menu"
        title="Fresh Meals Every Day"
        subtitle="Browse our nutritious meal options and plan ahead"
      />

      <section className="menu-page">
        <div className="menu-page__container">
          <div className="menu-date-selector">
            <div className="menu-date-selector__header">
              <Calendar className="menu-date-selector__icon" />
              <h2 className="menu-date-selector__title">Select Date</h2>
            </div>
            <div className="menu-date-selector__dates">
              {getNextDates().map((dateInfo) => (
                <button
                  key={dateInfo.date}
                  className={`menu-date-btn ${selectedDate === dateInfo.date ? 'menu-date-btn--active' : ''} ${!dateInfo.hasMenu ? 'menu-date-btn--disabled' : ''}`}
                  onClick={() => dateInfo.hasMenu && setSelectedDate(dateInfo.date)}
                  disabled={!dateInfo.hasMenu}
                >
                  <span className="menu-date-btn__label">{dateInfo.label}</span>
                  <span className="menu-date-btn__date">
                    {new Date(dateInfo.date).getDate()}
                  </span>
                  {!dateInfo.hasMenu && (
                    <span className="menu-date-btn__status">No menu</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-content">
            <div className="menu-content__header">
              <h3 className="menu-content__title">
                Menu for {formatDate(selectedDate)}
              </h3>
              {menus.length > 0 && (
                <p className="menu-content__count">
                  {menus.length} meal{menus.length !== 1 ? 's' : ''} available
                </p>
              )}
            </div>

            {loading ? (
              <div className="menu-loading">
                <p>Loading menu...</p>
              </div>
            ) : menus.length === 0 ? (
              <div className="menu-empty">
                <p>No meals available for this date.</p>
                <p className="menu-empty__hint">Please select another date or check back later.</p>
              </div>
            ) : (
              <div className="menu-grid">
                {menus.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    onSelectMeal={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export default Menu;
