import { Link } from 'react-router-dom';
import { Salad } from 'lucide-react';
import './footer.css';

const footerGroups = [
  {
    title: 'Platform',
    links: [
      { to: '/meal-plans', label: 'Meal Plans' },
      { to: '/menu', label: 'Weekly Menu' },
      { to: '/nutrition', label: 'Nutrition' },
      { to: '/how-it-works', label: 'How It Works' }
    ]
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/food-safety', label: 'Food Safety' },
      { to: '/schools', label: 'Schools' },
      { to: '/partner', label: 'Partner With Us' }
    ]
  },
  {
    title: 'Support',
    links: [
      { to: '/faq', label: 'FAQ' },
      { to: '/contact', label: 'Contact' },
      { to: '/login', label: 'Log in' },
      { to: '/register', label: 'Register' }
    ]
  }
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <div className="footer__brand-header">
            <span className="footer__logo-icon">
              <Salad className="footer__logo-svg" aria-hidden="true" />
            </span>
            <span className="footer__brand-name">NourishEd</span>
          </div>
          <p className="footer__brand-description">
            Nutritious meals for growing minds — fresh, balanced, transparent and convenient
            evening meals for school students.
          </p>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.title} aria-label={group.title} className="footer__nav">
            <h2 className="footer__nav-title">{group.title}</h2>
            <ul className="footer__nav-list">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer__nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="footer__bottom">
        <div className="footer__bottom-content">
          <p>© {new Date().getFullYear()} NourishEd School Nutrition Pvt. Ltd.</p>
          <p>
            Nutrition information is indicative and reviewed by qualified nutrition professionals.
            No medical claims are made.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
