import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Salad } from 'lucide-react';
import SiteLayout from '../../components/sitelayout/sitelayout.jsx';
import Button from '../../components/button/button.jsx';
import Input from '../../components/input/input.jsx';
import Label from '../../components/label/label.jsx';
import Select from '../../components/select/select.jsx';
import { supabase } from '../../services/supabase';
import './register.css';

function Register() {
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
    const parentName = formData.get('name');
    const mobileNumber = formData.get('phone');
    const email = formData.get('email');
    const password = formData.get('password');
    const noOfChildren = parseInt(formData.get('children') || '0');
    const profilePhotoUrl = formData.get('photo_url') || null;

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      const { error: dbError } = await supabase
        .from('parents')
        .insert([{
          parent_name: parentName,
          mobile_number: mobileNumber,
          email: email,
          password_hash: authData.user?.id || '',
          no_of_children: noOfChildren,
          profile_photo_url: profilePhotoUrl
        }]);

      if (dbError) throw dbError;

      alert('Registration successful! You are now logged in.');
      navigate('/');
    } catch (error) {
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="register-page">
        <div className="register-page__container">
          <div className="register-page__card">
            <span className="register-page__icon">
              <Salad className="register-page__icon-svg" aria-hidden="true" />
            </span>
            <h1 className="register-page__title">Start your meal plan</h1>
            <p className="register-page__subtitle">
              Step 1 of 5 — create your account and pick your child's school.
            </p>

            <form className="register-page__form" onSubmit={handleSubmit}>
              <div className="register-page__row">
                <div className="register-page__field">
                  <Label htmlFor="r-name">Parent name</Label>
                  <Input
                    id="r-name"
                    name="name"
                    autoComplete="name"
                    className="register-page__input"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="register-page__field">
                  <Label htmlFor="r-phone">Mobile number</Label>
                  <Input
                    id="r-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="register-page__input"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="register-page__field">
                <Label htmlFor="r-email">Email</Label>
                <Input
                  id="r-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="register-page__input"
                  required
                  disabled={loading}
                />
              </div>

              <div className="register-page__field">
                <Label htmlFor="r-password">Password</Label>
                <Input
                  id="r-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className="register-page__input"
                  minLength={8}
                  required
                  disabled={loading}
                  aria-describedby="r-password-hint"
                />
                <p id="r-password-hint" className="register-page__hint">
                  At least 8 characters.
                </p>
              </div>

              <div className="register-page__field">
                <Label htmlFor="r-children">Number of children</Label>
                <Select
                  id="r-children"
                  name="children"
                  defaultValue="1"
                  className="register-page__input"
                  required
                  disabled={loading}
                >
                  <option value="1">1 child</option>
                  <option value="2">2 children</option>
                  <option value="3">3 children</option>
                  <option value="4">4 children</option>
                  <option value="5">5 children</option>
                </Select>
              </div>

              <div className="register-page__field">
                <Label htmlFor="r-photo">Profile photo URL (optional)</Label>
                <Input
                  id="r-photo"
                  name="photo_url"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className="register-page__input"
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="register-page__submit" disabled={loading}>
                Create account
              </Button>
            </form>

            <p className="register-page__footer">
              Already have an account?{' '}
              <Link to="/login" className="register-page__link">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export default Register;
