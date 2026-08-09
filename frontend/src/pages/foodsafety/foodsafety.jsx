import { ShieldCheck, Thermometer, PackageCheck, Truck, ClipboardCheck, Sprout, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import SiteLayout, { PageHero, Section } from '../../components/sitelayout/sitelayout';
import Button from '../../components/button/button';
import kitchen from '../../assets/images/kitchen.jpg';
import heroMeal from '../../assets/images/hero-meal.jpg';
import './foodsafety.css';

const safetyPillars = [
  {
    icon: Sprout,
    title: 'Ingredient Sourcing',
    description: 'Vetted suppliers, batch-tracked produce, no reheated leftovers and zero artificial colours.'
  },
  {
    icon: ClipboardCheck,
    title: 'Hygiene Procedures',
    description: 'Daily staff health checks, colour-coded prep zones and logged sanitisation cycles.'
  },
  {
    icon: Thermometer,
    title: 'Quality Checks',
    description: 'Temperature logs at cook, hold and dispatch, plus a retained sample from every batch.'
  },
  {
    icon: PackageCheck,
    title: 'Packaging',
    description: 'Food-grade, tamper-evident, biodegradable containers sealed and labelled per child.'
  },
  {
    icon: Truck,
    title: 'Delivery',
    description: 'Insulated transport with scheduled routes and school-side handover signature.'
  },
  {
    icon: ShieldCheck,
    title: 'Certifications',
    description: 'FSSAI licensed, HACCP-aligned processes and periodic third-party audits.'
  },
];

const timeline = [
  { time: '07:00', step: 'Kitchen opens: Produce intake, weighing and quality rejection log' },
  { time: '07:30', step: 'Washing, cutting and colour-coded prep by zone' },
  { time: '09:00', step: 'Batch cooking with temperature and time logging' },
  { time: '10:30', step: 'Retained sample collection and taste panel sign-off' },
  { time: '11:00', step: 'Portioning, sealing and per-school labelling' },
  { time: '11:45', step: 'Insulated dispatch on scheduled school routes' },
  { time: '12:00', step: 'School delivery, handover signature and serve' },
];

function Foodsafety() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Food Safety"
        title="Transparency is our first ingredient."
        subtitle="You should never have to guess how your child's meal was made. Here is our kitchen, our process and our paperwork — in the open."
      />

      <Section>
        <div className="food-images">
          <img
            src={kitchen}
            alt="Chefs in hairnets and gloves preparing fresh vegetables in a stainless-steel commercial kitchen"
            loading="lazy"
            className="food-image"
          />
          <img
            src={heroMeal}
            alt="A sealed compartment meal tray packed with rice, dal, paneer and fruit"
            loading="lazy"
            className="food-image"
          />
        </div>
      </Section>

      <Section
        muted
        title="Six checkpoints between the farm and the classroom"
        description="Every meal goes through rigorous safety protocols"
      >
        <div className="safety-pillars">
          {safetyPillars.map((pillar) => (
            <div key={pillar.title} className="safety-pillar">
              <div className="safety-pillar__icon">
                <pillar.icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="safety-pillar__title">{pillar.title}</h3>
              <p className="safety-pillar__description">{pillar.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Our daily preparation timeline"
        description="From kitchen opening at 7am to school delivery by 12pm"
      >
        <div className="timeline-icon">
          <Clock className="size-16" aria-hidden="true" />
        </div>
        <ol className="timeline">
          {timeline.map((item) => (
            <li key={item.time} className="timeline-item">
              <span className="timeline-item__time">{item.time}</span>
              <span className="timeline-item__step">{item.step}</span>
            </li>
          ))}
        </ol>
        <div className="timeline-cta">
          <Button asChild size="lg">
            <Link to="/contact">Request a kitchen visit</Link>
          </Button>
        </div>
      </Section>

      <Section>
        <div className="food-safety-note">
          <h3 className="food-safety-note__title">Committed to Safety Standards</h3>
          <p className="food-safety-note__text">
            Our kitchen operates under strict FSSAI guidelines and follows HACCP-aligned
            processes. We maintain comprehensive logs for ingredient traceability,
            temperature monitoring, and hygiene protocols. Third-party audits are
            conducted periodically to ensure compliance with food safety regulations.
          </p>
          <p className="food-safety-note__text">
            Every batch includes a retained sample that is stored for quality analysis.
            Our staff undergoes regular health screenings and food safety training to
            maintain the highest standards of hygiene and safety.
          </p>
        </div>
      </Section>
    </SiteLayout>
  );
}

export default Foodsafety;
