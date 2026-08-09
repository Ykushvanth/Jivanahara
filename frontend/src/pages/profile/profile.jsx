import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Users, Image, LogOut, X } from 'lucide-react';
import SiteLayout, { PageHero } from '../../components/sitelayout/sitelayout.jsx';
import Button from '../../components/button/button.jsx';
import Label from '../../components/label/label.jsx';
import Input from '../../components/input/input.jsx';
import ChildrenSection from '../../components/childrensection/childrensection.jsx';
import { supabase } from '../../services/supabase';
import './profile.css';

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Get current user from Supabase auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        navigate('/login');
        return;
      }

      // Fetch parent data from database
      const { data: parentData, error: dbError } = await supabase
        .from('parents')
        .select('*')
        .eq('email', user.email)
        .single();

      if (dbError) throw dbError;

      setUserData(parentData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (err) {
      alert('Error logging out: ' + err.message);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    const formData = new FormData(e.target);
    const updates = {
      parent_name: formData.get('parent_name'),
      mobile_number: formData.get('mobile_number'),
      no_of_children: parseInt(formData.get('no_of_children')),
      profile_photo_url: formData.get('profile_photo_url') || null,
    };

    try {
      const { error } = await supabase
        .from('parents')
        .update(updates)
        .eq('id', userData.id);

      if (error) throw error;

      alert('Profile updated successfully!');
      setShowEditModal(false);
      fetchUserData(); // Refresh data
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="profile-page">
          <div className="profile-page__container">
            <div className="profile-page__loading">Loading your profile...</div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (error) {
    return (
      <SiteLayout>
        <div className="profile-page">
          <div className="profile-page__container">
            <div className="profile-page__error">
              <p>Error loading profile: {error}</p>
              <Button onClick={() => navigate('/login')}>Back to Login</Button>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Profile"
        title="My Profile"
        subtitle="Manage your account and family details"
      />
      <div className="profile-page">
        <div className="profile-page__container">
          <div className="profile-page__logout">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="profile-page__icon" aria-hidden="true" />
              Log out
            </Button>
          </div>

          <div className="profile-page__card">
            {userData?.profile_photo_url && (
              <div className="profile-page__photo-wrapper">
                <img
                  src={userData.profile_photo_url}
                  alt={userData.parent_name}
                  className="profile-page__photo"
                />
              </div>
            )}

            <div className="profile-page__info">
              <div className="profile-page__field">
                <div className="profile-page__field-icon">
                  <User className="profile-page__icon" aria-hidden="true" />
                </div>
                <div className="profile-page__field-content">
                  <label className="profile-page__label">Parent Name</label>
                  <p className="profile-page__value">{userData?.parent_name}</p>
                </div>
              </div>

              <div className="profile-page__field">
                <div className="profile-page__field-icon">
                  <Mail className="profile-page__icon" aria-hidden="true" />
                </div>
                <div className="profile-page__field-content">
                  <label className="profile-page__label">Email</label>
                  <p className="profile-page__value">{userData?.email}</p>
                </div>
              </div>

              <div className="profile-page__field">
                <div className="profile-page__field-icon">
                  <Phone className="profile-page__icon" aria-hidden="true" />
                </div>
                <div className="profile-page__field-content">
                  <label className="profile-page__label">Mobile Number</label>
                  <p className="profile-page__value">{userData?.mobile_number}</p>
                </div>
              </div>

              <div className="profile-page__field">
                <div className="profile-page__field-icon">
                  <Users className="profile-page__icon" aria-hidden="true" />
                </div>
                <div className="profile-page__field-content">
                  <label className="profile-page__label">Number of Children</label>
                  <p className="profile-page__value">
                    {userData?.no_of_children} {userData?.no_of_children === 1 ? 'child' : 'children'}
                  </p>
                </div>
              </div>

              <div className="profile-page__field">
                <div className="profile-page__field-icon">
                  <Image className="profile-page__icon" aria-hidden="true" />
                </div>
                <div className="profile-page__field-content">
                  <label className="profile-page__label">Account Status</label>
                  <p className="profile-page__value">
                    <span className={`profile-page__status profile-page__status--${userData?.status}`}>
                      {userData?.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="profile-page__actions">
              <Button variant="outline" onClick={() => setShowEditModal(true)}>Edit Profile</Button>
              <Button variant="outline">Change Password</Button>
            </div>
          </div>

          {userData && <ChildrenSection parentId={userData.id} maxChildren={userData.no_of_children} />}

          {showEditModal && (
            <div className="profile-modal" onClick={() => setShowEditModal(false)}>
              <div className="profile-modal__content" onClick={(e) => e.stopPropagation()}>
                <div className="profile-modal__header">
                  <h3 className="profile-modal__title">Edit Profile</h3>
                  <button
                    className="profile-modal__close"
                    onClick={() => setShowEditModal(false)}
                    aria-label="Close"
                  >
                    <X />
                  </button>
                </div>

                <form className="profile-form" onSubmit={handleEditProfile}>
                  <div className="profile-form__field">
                    <Label htmlFor="parent_name">Parent Name</Label>
                    <Input
                      id="parent_name"
                      name="parent_name"
                      defaultValue={userData?.parent_name}
                      required
                      disabled={editLoading}
                    />
                  </div>

                  <div className="profile-form__field">
                    <Label htmlFor="mobile_number">Mobile Number</Label>
                    <Input
                      id="mobile_number"
                      name="mobile_number"
                      type="tel"
                      defaultValue={userData?.mobile_number}
                      required
                      disabled={editLoading}
                    />
                  </div>

                  <div className="profile-form__field">
                    <Label htmlFor="no_of_children">Number of Children</Label>
                    <Input
                      id="no_of_children"
                      name="no_of_children"
                      type="number"
                      min="0"
                      defaultValue={userData?.no_of_children}
                      required
                      disabled={editLoading}
                    />
                  </div>

                  <div className="profile-form__field">
                    <Label htmlFor="profile_photo_url">Profile Photo URL</Label>
                    <Input
                      id="profile_photo_url"
                      name="profile_photo_url"
                      type="url"
                      defaultValue={userData?.profile_photo_url}
                      disabled={editLoading}
                    />
                  </div>

                  <div className="profile-form__actions">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEditModal(false)}
                      disabled={editLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={editLoading}>
                      {editLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

export default Profile;
