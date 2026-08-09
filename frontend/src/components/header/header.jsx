import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Salad, User, ShoppingCart, ChevronDown, Baby } from 'lucide-react';
import Button from '../button/button.jsx';
import { supabase } from '../../services/supabase';
import { useChild } from '../../contexts/ChildContext.jsx';
import './header.css';

const navigation = [
  { to: '/menu', label: 'Menu' },
  { to: '/nutrition', label: 'Nutrition' },
  { to: '/food-safety', label: 'Food Safety' },
  { to: '/schools', label: 'Schools' },
  { to: '/how-it-works', label: 'How It Works' }
];

function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [childDropdownOpen, setChildDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { selectedChild, childrenList, selectChild } = useChild();

  useEffect(() => {
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCartItemCount();
      // Expose refresh function globally
      window.refreshCartCount = fetchCartItemCount;
      // Refresh count every 3 seconds while on the page
      const interval = setInterval(fetchCartItemCount, 3000);
      return () => {
        clearInterval(interval);
        delete window.refreshCartCount;
      };
    } else {
      setCartItemCount(0);
      delete window.refreshCartCount;
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchCartItemCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get parent record
      const { data: parentData } = await supabase
        .from('parents')
        .select('id')
        .eq('password_hash', user.id)
        .eq('status', 'active')
        .single();

      if (!parentData) return;

      // Get the most recent cart
      const { data: carts } = await supabase
        .from('carts')
        .select('id')
        .eq('parent_id', parentData.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      const cart = carts && carts.length > 0 ? carts[0] : null;
      if (!cart) return;

      // Count items in cart
      const { count, error } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('cart_id', cart.id);

      if (!error) {
        setCartItemCount(count || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo" aria-label="NourishEd home">
          <img
            src="/logo.png"
            alt="NourishEd"
            className="header__logo-image"
          />
        </Link>

        <nav aria-label="Main" className="header__nav">
          {navigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="header__nav-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {user && childrenList.length > 0 && (
          <div className="header__child-selector">
            <button
              className="header__child-selector-btn"
              onClick={() => setChildDropdownOpen(!childDropdownOpen)}
              aria-expanded={childDropdownOpen}
              aria-label="Select child"
            >
              <Baby className="header__child-icon" aria-hidden="true" />
              <span className="header__child-name">
                {selectedChild ? selectedChild.name : 'Select Child'}
              </span>
              <ChevronDown className="header__child-chevron" aria-hidden="true" />
            </button>

            {childDropdownOpen && (
              <div className="header__child-dropdown">
                {childrenList.map((child) => (
                  <button
                    key={child.id}
                    className={`header__child-option ${selectedChild?.id === child.id ? 'header__child-option--active' : ''}`}
                    onClick={() => {
                      selectChild(child);
                      setChildDropdownOpen(false);
                    }}
                  >
                    <span className="header__child-option-name">{child.name}</span>
                    {selectedChild?.id === child.id && (
                      <span className="header__child-option-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="header__actions">
          {user ? (
            <>
              <Button asChild variant="ghost" className="header__login-btn">
                <Link to="/profile">
                  <User className="size-4" aria-hidden="true" />
                  Profile
                </Link>
              </Button>
              <Button asChild variant="ghost" className="header__login-btn">
                <Link to="/cart" className="header__cart-link">
                  <div className="header__cart-icon-wrapper">
                    <ShoppingCart className="size-4" aria-hidden="true" />
                    {cartItemCount > 0 && (
                      <span className="header__cart-badge">{cartItemCount}</span>
                    )}
                  </div>
                  Cart
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout} className="header__register-btn">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="header__login-btn">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="header__register-btn">
                <Link to="/register">Start Meal Plan</Link>
              </Button>
            </>
          )}
          <button
            className="header__mobile-toggle"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="header__mobile-icon" /> : <Menu className="header__mobile-icon" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="header__mobile-menu">
          <nav aria-label="Mobile" className="header__mobile-nav">
            {[
              ...navigation,
              { to: '/about', label: 'About Us' },
              { to: '/partner', label: 'Partner With Us' },
              { to: '/faq', label: 'FAQ' },
              { to: '/contact', label: 'Contact' }
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="header__mobile-link"
              >
                {item.label}
              </Link>
            ))}
            <div className="header__mobile-buttons">
              {user ? (
                <>
                  <Button asChild variant="outline" className="header__mobile-login">
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      Profile
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="header__mobile-login">
                    <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                      Cart
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="header__mobile-register">
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="header__mobile-login">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild className="header__mobile-register">
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
