import { useState, useEffect } from 'react';
import { Users, Plus, X, User as UserIcon, School, Calendar, BookOpen, Edit } from 'lucide-react';
import Button from '../button/button.jsx';
import Input from '../input/input.jsx';
import Label from '../label/label.jsx';
import Select from '../select/select.jsx';
import { supabase } from '../../services/supabase';
import './childrensection.css';

function ChildrenSection({ parentId, maxChildren }) {
  const [children, setChildren] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const isLimitReached = children.length >= maxChildren;

  useEffect(() => {
    if (parentId) {
      fetchChildren();
      fetchSchools();
    }
  }, [parentId]);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select(`
          *,
          schools (
            school_name,
            city
          )
        `)
        .eq('parent_id', parentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('id, school_name, city')
        .eq('status', 'active')
        .order('school_name');

      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const formData = new FormData(e.target);
    const childData = {
      parent_id: parentId,
      school_id: parseInt(formData.get('school_id')),
      student_name: formData.get('student_name'),
      registration_number: formData.get('registration_number'),
      date_of_birth: formData.get('date_of_birth') || null,
      class: formData.get('class'),
      section: formData.get('section') || null,
      gender: formData.get('gender'),
      profile_photo_url: formData.get('profile_photo_url') || null,
    };

    try {
      const { error } = await supabase
        .from('children')
        .insert([childData]);

      if (error) throw error;

      alert('Child added successfully!');
      setShowAddForm(false);
      fetchChildren();
      e.target.reset();
    } catch (error) {
      alert(error.message || 'Failed to add child. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditChild = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const formData = new FormData(e.target);
    const updates = {
      school_id: parseInt(formData.get('school_id')),
      student_name: formData.get('student_name'),
      registration_number: formData.get('registration_number'),
      date_of_birth: formData.get('date_of_birth') || null,
      class: formData.get('class'),
      section: formData.get('section') || null,
      gender: formData.get('gender'),
      profile_photo_url: formData.get('profile_photo_url') || null,
    };

    try {
      const { error } = await supabase
        .from('children')
        .update(updates)
        .eq('id', editingChild.id);

      if (error) throw error;

      alert('Child updated successfully!');
      setShowEditForm(false);
      setEditingChild(null);
      fetchChildren();
    } catch (error) {
      alert(error.message || 'Failed to update child. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="children-section">
        <div className="children-section__loading">Loading children...</div>
      </div>
    );
  }

  return (
    <div className="children-section">
      <div className="children-section__header">
        <div>
          <h2 className="children-section__title">
            <Users className="children-section__title-icon" aria-hidden="true" />
            My Children
          </h2>
          <p className="children-section__subtitle">
            {children.length} of {maxChildren} children added
            {isLimitReached && <span className="children-section__limit-text"> (Limit reached)</span>}
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          size="default"
          disabled={isLimitReached}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add Child
        </Button>
      </div>

      {children.length === 0 ? (
        <div className="children-section__empty">
          <p>No children added yet. Click "Add Child" to get started.</p>
        </div>
      ) : (
        <div className="children-section__grid">
          {children.map((child) => (
            <div key={child.id} className="child-card">
              {child.profile_photo_url && (
                <img
                  src={child.profile_photo_url}
                  alt={child.student_name}
                  className="child-card__photo"
                />
              )}
              <div className="child-card__content">
                <h3 className="child-card__name">{child.student_name}</h3>
                <div className="child-card__details">
                  <div className="child-card__detail">
                    <School className="child-card__icon" aria-hidden="true" />
                    <span>{child.schools?.school_name || 'N/A'}</span>
                  </div>
                  <div className="child-card__detail">
                    <BookOpen className="child-card__icon" aria-hidden="true" />
                    <span>Class {child.class}{child.section ? ` - ${child.section}` : ''}</span>
                  </div>
                  <div className="child-card__detail">
                    <UserIcon className="child-card__icon" aria-hidden="true" />
                    <span>Reg: {child.registration_number}</span>
                  </div>
                  {child.date_of_birth && (
                    <div className="child-card__detail">
                      <Calendar className="child-card__icon" aria-hidden="true" />
                      <span>{new Date(child.date_of_birth).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <span className={`child-card__status child-card__status--${child.status}`}>
                  {child.status}
                </span>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => {
                    setEditingChild(child);
                    setShowEditForm(true);
                  }}
                  className="child-card__edit-btn"
                >
                  <Edit className="size-4" aria-hidden="true" />
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <div className="children-modal" onClick={() => setShowAddForm(false)}>
          <div className="children-modal__content" onClick={(e) => e.stopPropagation()}>
            <div className="children-modal__header">
              <h3 className="children-modal__title">Add Child</h3>
              <button
                className="children-modal__close"
                onClick={() => setShowAddForm(false)}
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <form className="children-form" onSubmit={handleAddChild}>
              <div className="children-form__field">
                <Label htmlFor="student_name">Student Name *</Label>
                <Input
                  id="student_name"
                  name="student_name"
                  required
                  disabled={formLoading}
                />
              </div>

              <div className="children-form__row">
                <div className="children-form__field">
                  <Label htmlFor="registration_number">Registration Number *</Label>
                  <Input
                    id="registration_number"
                    name="registration_number"
                    required
                    disabled={formLoading}
                  />
                </div>
                <div className="children-form__field">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    disabled={formLoading}
                  />
                </div>
              </div>

              <div className="children-form__field">
                <Label htmlFor="school_id">School *</Label>
                <Select
                  id="school_id"
                  name="school_id"
                  required
                  disabled={formLoading}
                >
                  <option value="">Select a school</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.school_name} - {school.city}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="children-form__row">
                <div className="children-form__field">
                  <Label htmlFor="class">Class *</Label>
                  <Input
                    id="class"
                    name="class"
                    placeholder="e.g., 5, 10, KG"
                    required
                    disabled={formLoading}
                  />
                </div>
                <div className="children-form__field">
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    name="section"
                    placeholder="e.g., A, B, C"
                    disabled={formLoading}
                  />
                </div>
              </div>

              <div className="children-form__field">
                <Label htmlFor="gender">Gender</Label>
                <Select id="gender" name="gender" disabled={formLoading}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </div>

              <div className="children-form__field">
                <Label htmlFor="profile_photo_url">Profile Photo URL</Label>
                <Input
                  id="profile_photo_url"
                  name="profile_photo_url"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  disabled={formLoading}
                />
              </div>

              <div className="children-form__actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Adding...' : 'Add Child'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && editingChild && (
        <div className="children-modal" onClick={() => { setShowEditForm(false); setEditingChild(null); }}>
          <div className="children-modal__content" onClick={(e) => e.stopPropagation()}>
            <div className="children-modal__header">
              <h3 className="children-modal__title">Edit Child</h3>
              <button
                className="children-modal__close"
                onClick={() => { setShowEditForm(false); setEditingChild(null); }}
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <form className="children-form" onSubmit={handleEditChild}>
              <div className="children-form__field">
                <Label htmlFor="edit_student_name">Student Name *</Label>
                <Input
                  id="edit_student_name"
                  name="student_name"
                  defaultValue={editingChild.student_name}
                  required
                  disabled={formLoading}
                />
              </div>

              <div className="children-form__row">
                <div className="children-form__field">
                  <Label htmlFor="edit_registration_number">Registration Number *</Label>
                  <Input
                    id="edit_registration_number"
                    name="registration_number"
                    defaultValue={editingChild.registration_number}
                    required
                    disabled={formLoading}
                  />
                </div>
                <div className="children-form__field">
                  <Label htmlFor="edit_date_of_birth">Date of Birth</Label>
                  <Input
                    id="edit_date_of_birth"
                    name="date_of_birth"
                    type="date"
                    defaultValue={editingChild.date_of_birth}
                    disabled={formLoading}
                  />
                </div>
              </div>

              <div className="children-form__field">
                <Label htmlFor="edit_school_id">School *</Label>
                <Select
                  id="edit_school_id"
                  name="school_id"
                  defaultValue={editingChild.school_id}
                  required
                  disabled={formLoading}
                >
                  <option value="">Select a school</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.school_name} - {school.city}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="children-form__row">
                <div className="children-form__field">
                  <Label htmlFor="edit_class">Class *</Label>
                  <Input
                    id="edit_class"
                    name="class"
                    defaultValue={editingChild.class}
                    placeholder="e.g., 5, 10, KG"
                    required
                    disabled={formLoading}
                  />
                </div>
                <div className="children-form__field">
                  <Label htmlFor="edit_section">Section</Label>
                  <Input
                    id="edit_section"
                    name="section"
                    defaultValue={editingChild.section}
                    placeholder="e.g., A, B, C"
                    disabled={formLoading}
                  />
                </div>
              </div>

              <div className="children-form__field">
                <Label htmlFor="edit_gender">Gender</Label>
                <Select
                  id="edit_gender"
                  name="gender"
                  defaultValue={editingChild.gender}
                  disabled={formLoading}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </div>

              <div className="children-form__field">
                <Label htmlFor="edit_profile_photo_url">Profile Photo URL</Label>
                <Input
                  id="edit_profile_photo_url"
                  name="profile_photo_url"
                  type="url"
                  defaultValue={editingChild.profile_photo_url}
                  placeholder="https://example.com/photo.jpg"
                  disabled={formLoading}
                />
              </div>

              <div className="children-form__actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowEditForm(false); setEditingChild(null); }}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Updating...' : 'Update Child'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChildrenSection;
