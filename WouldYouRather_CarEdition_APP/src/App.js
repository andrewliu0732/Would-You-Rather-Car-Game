import React, { useState, useEffect } from 'react';
import './App.css';
import { cars as carsData } from './cars';

// Determine category based on price
function getCategory(price) {
  if (price < 20000) return 'Economy / Daily';
  if (price < 50000) return 'Entry Fun';
  if (price < 100000) return 'Performance';
  if (price < 200000) return 'Entry Supercar';
  if (price < 500000) return 'Supercar';
  if (price < 1000000) return 'Upper Supercar';
  return 'Hypercar';
}

// Assign emoji based on price/category
function getEmoji(price) {
  if (price < 20000) return '🚗';
  if (price < 100000) return '🚙';
  if (price < 1000000) return '🏎️';
  return '🏎️';
}

// Add IDs and enrich car data
const CARS = carsData.map((car, index) => ({
  ...car,
  id: index + 1,
  category: getCategory(car.price),
  emoji: getEmoji(car.price)
}));

// Game Logic
function getRandomCars(cars, excludeIds = []) {
  const availableCars = cars.filter(car => !excludeIds.includes(car.id));
  const shuffled = [...availableCars].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
}

function formatPrice(price) {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(2)}M`;
  } else if (price >= 1000) {
    return `$${(price / 1000).toFixed(0)}k`;
  }
  return `$${price.toLocaleString()}`;
}

function App() {
  const [car1, setCar1] = useState(null);
  const [car2, setCar2] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [usedCars, setUsedCars] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  // Initialize game
  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    if (usedCars.length >= CARS.length - 1) {
      setGameOver(true);
      return;
    }

    const [newCar1, newCar2] = getRandomCars(CARS, usedCars);
    setCar1(newCar1);
    setCar2(newCar2);
    setSelectedCar(null);
  };

  const handleChoice = (chosenCar, otherCar) => {
    if (selectedCar) return; // Prevent double clicks

    setSelectedCar(chosenCar.id);
    
    // Add both cars to used list
    setUsedCars(prev => [...prev, chosenCar.id, otherCar.id]);
    
    // Increment score
    setScore(prev => prev + 1);
    
    // Wait a moment to show selection, then move to next round
    setTimeout(() => {
      setRound(prev => prev + 1);
      startNewRound();
    }, 1500);
  };

  const resetGame = () => {
    setScore(0);
    setRound(1);
    setUsedCars([]);
    setGameOver(false);
    setSelectedCar(null);
    startNewRound();
  };

  if (gameOver) {
    return (
      <div className="app">
        <div className="game-over">
          <h1>🎉 Game Complete! 🎉</h1>
          <h2>Final Score: {score} rounds</h2>
          <p>You've seen all the cars!</p>
          <button onClick={resetGame} className="reset-button">
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (!car1 || !car2) {
    return <div className="app">Loading...</div>;
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🚗 Would You Rather: Car Edition 🚗</h1>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Round:</span>
            <span className="stat-value">{round}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{score}</span>
          </div>
        </div>
      </div>

      <div className="question">
        <h2>Which car would you rather have?</h2>
      </div>

      <div className="cars-container">
        <div 
          className={`car-card ${selectedCar === car1.id ? 'selected' : ''} ${selectedCar && selectedCar !== car1.id ? 'dimmed' : ''}`}
          onClick={() => handleChoice(car1, car2)}
        >
          <div className="car-emoji">{car1.emoji}</div>
          <h3 className="car-name">{car1.name}</h3>
          <div className="car-details">
            <span className="car-category">{car1.category}</span>
            <span className="car-price">{formatPrice(car1.price)}</span>
            <div className="car-specs">
              <div className="spec-item">
                <span className="spec-label">HP:</span>
                <span className="spec-value">{car1.hp}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Top Speed:</span>
                <span className="spec-value">{car1.topSpeed} mph</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Engine:</span>
                <span className="spec-value">{car1.engine}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Reliability:</span>
                <span className={`spec-value reliability-${car1.reliability.toLowerCase().replace(/\s+/g, '-')}`}>
                  {car1.reliability}
                </span>
              </div>
              {car1.built && (
                <div className="spec-item">
                  <span className="spec-label">Built:</span>
                  <span className="spec-value">{car1.built.toLocaleString()} units</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="vs-divider">
          <span>VS</span>
        </div>

        <div 
          className={`car-card ${selectedCar === car2.id ? 'selected' : ''} ${selectedCar && selectedCar !== car2.id ? 'dimmed' : ''}`}
          onClick={() => handleChoice(car2, car1)}
        >
          <div className="car-emoji">{car2.emoji}</div>
          <h3 className="car-name">{car2.name}</h3>
          <div className="car-details">
            <span className="car-category">{car2.category}</span>
            <span className="car-price">{formatPrice(car2.price)}</span>
            <div className="car-specs">
              <div className="spec-item">
                <span className="spec-label">HP:</span>
                <span className="spec-value">{car2.hp}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Top Speed:</span>
                <span className="spec-value">{car2.topSpeed} mph</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Engine:</span>
                <span className="spec-value">{car2.engine}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Reliability:</span>
                <span className={`spec-value reliability-${car2.reliability.toLowerCase().replace(/\s+/g, '-')}`}>
                  {car2.reliability}
                </span>
              </div>
              {car2.built && (
                <div className="spec-item">
                  <span className="spec-label">Built:</span>
                  <span className="spec-value">{car2.built.toLocaleString()} units</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(usedCars.length / CARS.length) * 100}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {usedCars.length} / {CARS.length} cars seen
        </p>
      </div>
    </div>
  );
}

export default App;

