import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Drumstick, AlertTriangle, Star, X } from 'lucide-react';
import Button from '../button/button.jsx';
import Badge from '../badge/badge.jsx';
import './mealcard.css';

function Macro({ label, value, unit }) {
  return (
    <div className="meal-card__macro">
      <div className="meal-card__macro-value">
        {value}
        <span className="meal-card__macro-unit">{unit}</span>
      </div>
      <div className="meal-card__macro-label">{label}</div>
    </div>
  );
}

function MealCard({ meal, onSelectMeal }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <article className="meal-card">
        <div className="meal-card__image-container">
          <img
            src={meal.image}
            alt={meal.name}
            loading="lazy"
            className="meal-card__image"
          />
          <div className="meal-card__badges">
            <span className="meal-card__badge">
              {meal.diet === 'veg' ? (
                <Leaf className="meal-card__badge-icon meal-card__badge-icon--veg" aria-hidden="true" />
              ) : (
                <Drumstick className="meal-card__badge-icon meal-card__badge-icon--nonveg" aria-hidden="true" />
              )}
              {meal.diet === 'veg' ? 'Vegetarian' : 'Non-vegetarian'}
            </span>
            {meal.tag && <Badge>{meal.tag}</Badge>}
          </div>
        </div>

        <div className="meal-card__content">
          {meal.date && (
            <div className="meal-card__date">
              {new Date(meal.date).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          )}
          <div className="meal-card__header">
            <h3 className="meal-card__title">{meal.name}</h3>
            <span className="meal-card__price">₹{meal.price}</span>
          </div>
          <p className="meal-card__description">{meal.description}</p>

          <div className="meal-card__macros">
            <Macro label="Kcal" value={meal.calories} unit="" />
            <Macro label="Prot" value={meal.protein} unit="g" />
            <Macro label="Carb" value={meal.carbs} unit="g" />
            <Macro label="Fat" value={meal.fat} unit="g" />
            <Macro label="Fibre" value={meal.fibre} unit="g" />
          </div>

          <p className="meal-card__allergens">
            {meal.allergens.length > 0 ? (
              <>
                <AlertTriangle className="meal-card__allergen-icon meal-card__allergen-icon--warning" aria-hidden="true" />
                <span>
                  <span className="meal-card__allergen-label">Allergens:</span>{' '}
                  {meal.allergens.join(', ')}
                </span>
              </>
            ) : (
              <>
                <Leaf className="meal-card__allergen-icon meal-card__allergen-icon--safe" aria-hidden="true" />
                <span>No declared major allergens</span>
              </>
            )}
          </p>

          <div className="meal-card__rating">
            <Star className="meal-card__rating-icon" aria-hidden="true" />
            {meal.rating.toFixed(1)} parent rating
          </div>

          <div className="meal-card__actions">
            <Button variant="outline" className="meal-card__action-btn" onClick={() => setShowDetails(true)}>
              View Details
            </Button>
            {onSelectMeal ? (
              <Button className="meal-card__action-btn" onClick={() => onSelectMeal(meal)}>
                Add to Cart
              </Button>
            ) : (
              <Button asChild className="meal-card__action-btn">
                <Link to="/register">Select Meal</Link>
              </Button>
            )}
          </div>
        </div>
      </article>

      {showDetails && (
        <MealDetailsDialog meal={meal} onClose={() => setShowDetails(false)} onSelectMeal={onSelectMeal} />
      )}
    </>
  );
}

function MealDetailsDialog({ meal, onClose, onSelectMeal }) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2 className="dialog-title">{meal.name}</h2>
          <button className="dialog-close" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        <p className="dialog-description">{meal.description}</p>

        <img
          src={meal.image}
          alt={meal.name}
          loading="lazy"
          className="dialog-image"
        />

        <div className="dialog-nutrition">
          {[
            ['Calories', `${meal.calories} kcal`],
            ['Protein', `${meal.protein} g`],
            ['Carbs', `${meal.carbs} g`],
            ['Fat', `${meal.fat} g`],
            ['Fibre', `${meal.fibre} g`],
            ['Calcium', `${meal.calcium} mg`],
            ['Iron', `${meal.iron} mg`],
            ['Price', `₹${meal.price}`]
          ].map(([key, value]) => (
            <div key={key} className="dialog-nutrition-item">
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </div>

        <div>
          <h4 className="dialog-section-title">Ingredients</h4>
          <p className="dialog-section-text">{meal.ingredients.join(', ')}</p>
        </div>

        <div>
          <h4 className="dialog-section-title">Allergens</h4>
          <p className="dialog-section-text">
            {meal.allergens.length ? meal.allergens.join(', ') : 'None declared'}
          </p>
        </div>

        {onSelectMeal ? (
          <Button className="dialog-action" onClick={() => { onSelectMeal(meal); onClose(); }}>
            Add to Cart
          </Button>
        ) : (
          <Button asChild className="dialog-action">
            <Link to="/register">Select Meal</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default MealCard;
