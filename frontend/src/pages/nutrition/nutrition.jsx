import { useState } from 'react';
import { Apple, Info } from 'lucide-react';
import SiteLayout, { PageHero, Section } from '../../components/sitelayout/sitelayout';
import Select from '../../components/select/select';
import './nutrition.css';

// Nutritional targets by age group (researched data for Indian students)
const nutritionDataByGrade = {
  'preschool': {
    label: 'Pre-School (3-5 years)',
    targets: [
      { label: 'Calories', value: 420, target: 500, unit: 'kcal' },
      { label: 'Protein', value: 14, target: 18, unit: 'g' },
      { label: 'Carbohydrates', value: 62, target: 75, unit: 'g' },
      { label: 'Fat', value: 12, target: 15, unit: 'g' },
      { label: 'Fibre', value: 6, target: 8, unit: 'g' },
      { label: 'Calcium', value: 280, target: 350, unit: 'mg' },
      { label: 'Iron', value: 3.8, target: 5, unit: 'mg' },
    ]
  },
  '1-2': {
    label: 'Grade 1-2 (6-7 years)',
    targets: [
      { label: 'Calories', value: 450, target: 550, unit: 'kcal' },
      { label: 'Protein', value: 16, target: 20, unit: 'g' },
      { label: 'Carbohydrates', value: 68, target: 80, unit: 'g' },
      { label: 'Fat', value: 13, target: 16, unit: 'g' },
      { label: 'Fibre', value: 7, target: 9, unit: 'g' },
      { label: 'Calcium', value: 300, target: 380, unit: 'mg' },
      { label: 'Iron', value: 4.2, target: 5.5, unit: 'mg' },
    ]
  },
  '3-5': {
    label: 'Grade 3-5 (8-10 years)',
    targets: [
      { label: 'Calories', value: 520, target: 600, unit: 'kcal' },
      { label: 'Protein', value: 22, target: 26, unit: 'g' },
      { label: 'Carbohydrates', value: 74, target: 85, unit: 'g' },
      { label: 'Fat', value: 14, target: 18, unit: 'g' },
      { label: 'Fibre', value: 9, target: 10, unit: 'g' },
      { label: 'Calcium', value: 320, target: 400, unit: 'mg' },
      { label: 'Iron', value: 4.6, target: 6, unit: 'mg' },
    ]
  },
  '6-8': {
    label: 'Grade 6-8 (11-13 years)',
    targets: [
      { label: 'Calories', value: 580, target: 680, unit: 'kcal' },
      { label: 'Protein', value: 26, target: 32, unit: 'g' },
      { label: 'Carbohydrates', value: 82, target: 95, unit: 'g' },
      { label: 'Fat', value: 16, target: 20, unit: 'g' },
      { label: 'Fibre', value: 10, target: 12, unit: 'g' },
      { label: 'Calcium', value: 380, target: 480, unit: 'mg' },
      { label: 'Iron', value: 5.8, target: 7.5, unit: 'mg' },
    ]
  },
  '9-10': {
    label: 'Grade 9-10 (14-16 years)',
    targets: [
      { label: 'Calories', value: 640, target: 750, unit: 'kcal' },
      { label: 'Protein', value: 32, target: 38, unit: 'g' },
      { label: 'Carbohydrates', value: 88, target: 105, unit: 'g' },
      { label: 'Fat', value: 18, target: 22, unit: 'g' },
      { label: 'Fibre', value: 11, target: 14, unit: 'g' },
      { label: 'Calcium', value: 420, target: 520, unit: 'mg' },
      { label: 'Iron', value: 6.8, target: 9, unit: 'mg' },
    ]
  },
};

function Nutrition() {
  const [selectedGrade, setSelectedGrade] = useState('3-5');
  const currentData = nutritionDataByGrade[selectedGrade];

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Nutrition Transparency"
        title="Nothing hidden on the plate."
        subtitle="Every meal is designed against age-appropriate nutrition targets. Parents see the same numbers our kitchen team works to."
      />

      <Section>
        <div className="nutrition-page">
          <div className="nutrition-filter">
            <Apple className="nutrition-filter__icon" />
            <div className="nutrition-filter__content">
              <label htmlFor="grade-select" className="nutrition-filter__label">
                Select Age Group / Grade
              </label>
              <Select
                id="grade-select"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="nutrition-filter__select"
              >
                {Object.entries(nutritionDataByGrade).map(([key, data]) => (
                  <option key={key} value={key}>
                    {data.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <h3 className="nutrition-section-title">
            Sample meal for {currentData.label}
          </h3>
          <p className="nutrition-section-subtitle">
            Illustrative values for one evening meal against age-appropriate daily targets
          </p>

          <div className="nutrition-grid">
            <div className="nutrition-card">
              <h4 className="nutrition-card__title">Macronutrients & Minerals</h4>
              <div className="nutrition-targets">
                {currentData.targets.map((nutrient) => {
                  const percentage = Math.min(100, Math.round((nutrient.value / nutrient.target) * 100));
                  return (
                    <div key={nutrient.label} className="nutrition-target">
                      <div className="nutrition-target__header">
                        <span className="nutrition-target__label">{nutrient.label}</span>
                        <span className="nutrition-target__value">
                          <strong>{nutrient.value}{nutrient.unit}</strong> of {nutrient.target}{nutrient.unit}
                        </span>
                      </div>
                      <div className="nutrition-progress">
                        <div
                          className="nutrition-progress__bar"
                          style={{ width: `${percentage}%` }}
                          role="progressbar"
                          aria-valuenow={percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${nutrient.label}: ${percentage}% of target`}
                        />
                      </div>
                      <span className="nutrition-target__percentage">{percentage}% of target</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="nutrition-info">
              <div className="nutrition-card nutrition-card--secondary">
                <h4 className="nutrition-card__title">How targets are set</h4>
                <ul className="nutrition-list">
                  <li>Targets are configured per age band and grade by our nutrition team</li>
                  <li>All targets are designed and periodically reviewed by qualified nutrition professionals</li>
                  <li>Based on ICMR (Indian Council of Medical Research) dietary guidelines</li>
                  <li>Recipes are recosted and re-analyzed whenever an ingredient changes</li>
                  <li>We publish indicative values only and make no medical or health claims</li>
                </ul>
              </div>

              <div className="nutrition-card nutrition-card--secondary">
                <h4 className="nutrition-card__title">Micronutrients we track</h4>
                <div className="nutrition-micronutrients">
                  {['Calcium', 'Iron', 'Vitamin A', 'Vitamin C', 'Zinc', 'Folate', 'Vitamin D', 'Vitamin B12'].map((micro) => (
                    <span key={micro} className="nutrition-badge">
                      {micro}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="nutrition-disclaimer">
            <Info className="nutrition-disclaimer__icon" />
            <div className="nutrition-disclaimer__content">
              <p>
                <strong>Important:</strong> Nutrition information is indicative and provided for transparency.
                It is not medical advice. For a child with a specific medical or dietary condition,
                please consult a qualified healthcare professional.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

export default Nutrition;
