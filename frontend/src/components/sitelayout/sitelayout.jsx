import Header from '../header/header.jsx';
import Footer from '../footer/footer.jsx';
import './sitelayout.css';

function SiteLayout({ children }) {
  return (
    <div className="site-layout">
      <Header />
      <main className="site-layout__main">{children}</main>
      <Footer />
    </div>
  );
}

function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="page-hero">
      <div className="page-hero__container">
        <p className="page-hero__eyebrow">{eyebrow}</p>
        <h1 className="page-hero__title">{title}</h1>
        <p className="page-hero__subtitle">{subtitle}</p>
        {children && <div className="page-hero__actions">{children}</div>}
      </div>
    </section>
  );
}

function Section({ title, description, children, muted = false }) {
  const sectionClass = muted ? 'section section--muted' : 'section';
  
  return (
    <section className={sectionClass}>
      <div className="section__container">
        {title && (
          <div className="section__header">
            <h2 className="section__title">{title}</h2>
            {description && <p className="section__description">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export { SiteLayout, PageHero, Section };
export default SiteLayout;
