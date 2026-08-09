import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Users, Filter, X } from 'lucide-react';
import SiteLayout, { PageHero } from '../../components/sitelayout/sitelayout';
import Button from '../../components/button/button';
import Select from '../../components/select/select';
import { supabase } from '../../services/supabase';
import './schools.css';

function Schools() {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    status: 'active',
  });
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [schools, filters]);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('school_name');

      if (error) throw error;

      setSchools(data || []);

      // Extract unique cities for filter
      const uniqueCities = [...new Set(data.map(school => school.city))].sort();
      setCities(uniqueCities);
    } catch (error) {
      console.error('Error fetching schools:', error);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...schools];

    // Filter by city
    if (filters.city) {
      filtered = filtered.filter(school => school.city === filters.city);
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(school => school.status === filters.status);
    }

    setFilteredSchools(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      status: 'active',
    });
  };

  const hasActiveFilters = filters.city !== '';

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Partner Schools"
        title="Schools We Serve"
        subtitle="Explore our network of partner schools providing nutritious meals to students"
      />

      <section className="schools-page">
        <div className="schools-page__container">
          {/* Filters */}
          <div className="schools-filters">
            <div className="schools-filters__header">
              <Filter className="schools-filters__icon" />
              <h3 className="schools-filters__title">Filter Schools</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="default"
                  onClick={clearFilters}
                  className="schools-filters__clear"
                >
                  <X className="size-4" />
                  Clear
                </Button>
              )}
            </div>

            <div className="schools-filters__controls">
              <div className="schools-filters__field">
                <label htmlFor="city-filter" className="schools-filters__label">
                  City
                </label>
                <Select
                  id="city-filter"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="schools-filters__select"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="schools-filters__field">
                <label htmlFor="status-filter" className="schools-filters__label">
                  Status
                </label>
                <Select
                  id="status-filter"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="schools-filters__select"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="schools-results">
            <div className="schools-results__header">
              <h3 className="schools-results__title">
                {loading ? 'Loading schools...' : `${filteredSchools.length} School${filteredSchools.length !== 1 ? 's' : ''} Found`}
              </h3>
            </div>

            {loading ? (
              <div className="schools-loading">
                <p>Loading schools...</p>
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="schools-empty">
                <p>No schools found matching your filters.</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="schools-grid">
                {filteredSchools.map((school) => (
                  <div key={school.id} className="school-card">
                    <div className="school-card__header">
                      <h4 className="school-card__name">{school.school_name}</h4>
                      <span className={`school-card__status school-card__status--${school.status}`}>
                        {school.status}
                      </span>
                    </div>

                    {school.school_code && (
                      <p className="school-card__code">Code: {school.school_code}</p>
                    )}

                    <div className="school-card__details">
                      <div className="school-card__detail">
                        <MapPin className="school-card__icon" />
                        <div className="school-card__detail-content">
                          <p className="school-card__address">
                            {school.address_line_1}
                            {school.address_line_2 && `, ${school.address_line_2}`}
                          </p>
                          <p className="school-card__location">
                            {school.area && `${school.area}, `}
                            {school.city}, {school.state} - {school.pincode}
                          </p>
                        </div>
                      </div>

                      {school.phone_number && (
                        <div className="school-card__detail">
                          <Phone className="school-card__icon" />
                          <div className="school-card__detail-content">
                            <p>{school.phone_number}</p>
                            {school.alternate_phone_number && (
                              <p className="school-card__alternate">{school.alternate_phone_number}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {school.email && (
                        <div className="school-card__detail">
                          <Mail className="school-card__icon" />
                          <p>{school.email}</p>
                        </div>
                      )}

                      {school.contact_person_name && (
                        <div className="school-card__detail">
                          <Users className="school-card__icon" />
                          <div className="school-card__detail-content">
                            <p className="school-card__contact-name">{school.contact_person_name}</p>
                            {school.contact_person_phone && (
                              <p className="school-card__contact-phone">{school.contact_person_phone}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export default Schools;
