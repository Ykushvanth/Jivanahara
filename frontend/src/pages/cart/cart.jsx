import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import SiteLayout, { PageHero } from '../../components/sitelayout/sitelayout.jsx';
import Button from '../../components/button/button.jsx';
import { supabase } from '../../services/supabase';
import { useChild } from '../../contexts/ChildContext.jsx';
import './cart.css';

function Cart() {
  const navigate = useNavigate();
  const { childrenList } = useChild();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    checkUserAndFetchCart();
  }, []);

  const checkUserAndFetchCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      await fetchOrCreateCart(user.id);
    } else {
      setLoading(false);
    }
  };

  const fetchOrCreateCart = async (authUserId) => {
    try {
      console.log('🔍 Cart page: Fetching cart for auth user:', authUserId);

      // First, get the parent record using the auth user ID
      const { data: parentData, error: parentError } = await supabase
        .from('parents')
        .select('id')
        .eq('password_hash', authUserId)
        .eq('status', 'active')
        .single();

      if (parentError || !parentData) {
        console.error('❌ Cart page: Error fetching parent:', parentError);
        setLoading(false);
        return;
      }

      console.log('✅ Cart page: Found parent with ID:', parentData.id);

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
        console.log('📦 Cart page: Creating new cart for parent:', parentData.id);
        const { data: newCart, error: createError } = await supabase
          .from('carts')
          .insert({ parent_id: parentData.id, status: 'active' })
          .select('id')
          .single();

        if (createError) throw createError;
        cart = newCart;
        console.log('✅ Cart page: Created new cart with ID:', cart.id);
      } else {
        console.log('✅ Cart page: Using existing cart with ID:', cart.id);
      }

      setCartId(cart.id);
      await fetchCartItems(cart.id);
    } catch (error) {
      console.error('❌ Cart page: Error fetching cart:', error);
      setLoading(false);
    }
  };

  const fetchCartItems = async (cartId) => {
    setLoading(true);
    console.log('📦 Fetching cart items for cart_id:', cartId);

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          children:child_id (id, student_name),
          menus:menu_id (id, meal_name, image_url, diet_type)
        `)
        .eq('cart_id', cartId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching cart items:', error);
        throw error;
      }

      console.log('📋 Cart items query returned:', data?.length || 0, 'items');
      console.log('Raw data:', data);

      // Transform the data to use consistent field names
      const transformedData = (data || []).map(item => ({
        ...item,
        children: item.children ? {
          ...item.children,
          name: item.children.student_name
        } : null
      }));

      console.log('✅ Transformed cart items:', transformedData.length, 'items');
      setCartItems(transformedData);
    } catch (error) {
      console.error('❌ Error fetching cart items:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const item = cartItems.find(i => i.id === itemId);
      const newTotal = item.unit_price * newQuantity;

      const { error } = await supabase
        .from('cart_items')
        .update({
          quantity: newQuantity,
          total_price: newTotal,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) throw error;

      // Update local state
      setCartItems(cartItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, total_price: newTotal }
          : item
      ));

      // Refresh cart count in header
      window.refreshCartCount?.();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(cartItems.filter(item => item.id !== itemId));

      // Refresh cart count in header
      window.refreshCartCount?.();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const groupItemsByChild = () => {
    const grouped = {};

    cartItems.forEach(item => {
      const childId = item.child_id;
      if (!grouped[childId]) {
        grouped[childId] = {
          child: item.children,
          items: [],
          total: 0
        };
      }
      grouped[childId].items.push(item);
      grouped[childId].total += parseFloat(item.total_price);
    });

    return grouped;
  };

  const calculateGrandTotal = () => {
    return cartItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <SiteLayout>
        <PageHero
          eyebrow="Cart"
          title="Your Shopping Cart"
          subtitle="Review and manage your meal orders"
        />
        <section className="cart-empty">
          <div className="cart-empty__container">
            <ShoppingBag className="cart-empty__icon" />
            <h2 className="cart-empty__title">Please log in to view your cart</h2>
            <p className="cart-empty__text">You need to be logged in to add items to cart.</p>
            <Button asChild size="lg">
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const groupedItems = groupItemsByChild();
  const grandTotal = calculateGrandTotal();

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Cart"
        title="Your Cart"
        subtitle="Review and manage your meal orders"
      />

      <section className="cart-page">
        <div className="cart-page__container">
          {loading ? (
            <div className="cart-loading">
              <p>Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag className="cart-empty__icon" />
              <h2 className="cart-empty__title">Your cart is empty</h2>
              <p className="cart-empty__text">Add some delicious meals to get started!</p>
              <Button asChild size="lg">
                <Link to="/menu">Browse Menu</Link>
              </Button>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {Object.entries(groupedItems).map(([childId, data]) => (
                  <div key={childId} className="cart-child-group">
                    <div className="cart-child-header">
                      <h2 className="cart-child-name">{data.child?.name || 'Unknown Child'}</h2>
                      <span className="cart-child-total">₹{data.total.toFixed(2)}</span>
                    </div>

                    <div className="cart-items-list">
                      {data.items.map((item) => (
                        <div key={item.id} className="cart-item">
                          <div className="cart-item__image">
                            {item.menus?.image_url ? (
                              <img src={item.menus.image_url} alt={item.menus.meal_name} />
                            ) : (
                              <div className="cart-item__image-placeholder">
                                <ShoppingBag />
                              </div>
                            )}
                          </div>

                          <div className="cart-item__details">
                            <h3 className="cart-item__name">{item.menus?.meal_name}</h3>
                            <p className="cart-item__date">For: {formatDate(item.selected_date)}</p>
                            <p className="cart-item__price">₹{item.unit_price} each</p>
                          </div>

                          <div className="cart-item__actions">
                            <div className="cart-item__quantity">
                              <button
                                className="cart-item__qty-btn"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="cart-item__qty-icon" />
                              </button>
                              <span className="cart-item__qty-value">{item.quantity}</span>
                              <button
                                className="cart-item__qty-btn"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="cart-item__qty-icon" />
                              </button>
                            </div>

                            <div className="cart-item__total">
                              <span className="cart-item__total-label">Total:</span>
                              <span className="cart-item__total-value">₹{item.total_price}</span>
                            </div>

                            <button
                              className="cart-item__remove"
                              onClick={() => removeItem(item.id)}
                              aria-label="Remove item"
                            >
                              <Trash2 className="cart-item__remove-icon" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="cart-summary__card">
                  <h2 className="cart-summary__title">Order Summary</h2>

                  <div className="cart-summary__details">
                    {Object.entries(groupedItems).map(([childId, data]) => (
                      <div key={childId} className="cart-summary__row">
                        <span>{data.child?.name} ({data.items.length} items)</span>
                        <span>₹{data.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="cart-summary__divider"></div>

                  <div className="cart-summary__total">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>

                  <Button className="cart-summary__checkout" size="lg">
                    Proceed to Payment
                  </Button>

                  <Button asChild variant="outline" size="lg" className="cart-summary__continue">
                    <Link to="/menu">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

export default Cart;
