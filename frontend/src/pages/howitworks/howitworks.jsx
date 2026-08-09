import { Link } from 'react-router-dom';
import SiteLayout, { Section } from '../../components/sitelayout/sitelayout';
import Button from '../../components/button/button';
import './howitworks.css';

const flow = [
  ['Select school & add child', 'Find your child\'s school and add their details, diet preferences and allergies.'],
  ['Choose meals', 'Pick from our weekly menu, customise and review your order.'],
  ['Track delivery', 'Monitor meal preparation and delivery status in real-time.'],
];

const afterOrder = [
  ['Meal calendar', 'Ordered, skipped, holiday, available and completed days — colour-coded.'],
  ['Skip & pause', 'Change any future meal before 8:00 PM the previous evening.'],
  ['Delivery tracking', 'Preparing, ready, dispatched, out for delivery, delivered.'],
  ['Feedback', 'Rate a meal, raise a complaint, get a response with a ticket number.'],
];

function Howitworks() {
  return (
    <SiteLayout>
      <section className="howitworks-hero">
        <div className="container-page howitworks-hero__content">
          <span className="eyebrow">How It Works</span>
          <h1 className="howitworks-hero__title">
            Three simple steps. About three minutes.
          </h1>
          <p className="howitworks-hero__subtitle">
            Designed for a parent standing in a school pickup line with one hand on a phone.
          </p>
        </div>
      </section>

      <Section>
        <ol className="flow-grid">
          {flow.map(([title, description], index) => (
            <li key={title} className="flow-card">
              <span className="flow-card__number">
                {index + 1}
              </span>
              <h2 className="flow-card__title">{title}</h2>
              <p className="flow-card__description">{description}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="After you order"
        description="The part most services forget about."
        muted
      >
        <div className="after-order-grid">
          {afterOrder.map(([title, description]) => (
            <div key={title} className="after-order-card">
              <h3 className="after-order-card__title">{title}</h3>
              <p className="after-order-card__description">{description}</p>
            </div>
          ))}
        </div>
        <div className="howitworks-cta">
          <Button asChild size="lg">
            <Link to="/register">Start Meal Plan</Link>
          </Button>
        </div>
      </Section>
    </SiteLayout>
  );
}

export default Howitworks;
