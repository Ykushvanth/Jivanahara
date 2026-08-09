import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Salad } from 'lucide-react';
import SiteLayout from '../../components/sitelayout/sitelayout';
import Button from '../../components/button/button';
import Input from '../../components/input/input';
import Label from '../../components/label/label';
import { supabase } from '../../services/supabase';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate('/profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      alert('Login successful!');
      navigate('/');
    } catch (error) {
      alert(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="login-page">
        <div className="login-page__container">
          <div className="login-page__card">
            <span className="login-page__icon">
              <Salad className="login-page__icon-svg" aria-hidden="true" />
            </span>
            <h1 className="login-page__title">Welcome back</h1>
            <p className="login-page__subtitle">
              Log in to manage your children's meals and subscriptions.
            </p>

            <form className="login-page__form" onSubmit={handleSubmit}>
              <div className="login-page__field">
                <Label htmlFor="l-email">Email</Label>
                <Input
                  id="l-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="login-page__input"
                  required
                  disabled={loading}
                />
              </div>
              <div className="login-page__field">
                <Label htmlFor="l-password">Password</Label>
                <Input
                  id="l-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="login-page__input"
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="login-page__submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
              </Button>
            </form>

            <p className="login-page__footer">
              New here?{' '}
              <Link to="/register" className="login-page__link">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export default Login;
