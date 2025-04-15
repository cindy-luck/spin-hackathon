import React, { useState } from "react";
import './SelectMenu.css';

const levels = [
  {
    label: 'Beginner',
    icon: '🐣',
    color: '#d4edda',
    categories: [
      {
        label: 'Foundational Shapes',
        models: [
          { name: 'Cube', path: '/models/cube.glb' },
          { name: 'Cylinder', path: '/models/cylinder.glb'},
          { name: 'Soccer Ball', path: '/models/soccer_ball.glb' },
          { name: 'Dumbbell', path: '/models/dumbbell.glb' },
          { name: 'Pyramid', path: '/models/pyramid.glb' },
          { name: 'Intersecting', path: '/models/intersecting1.glb' },
          { name: 'Sphere', path: '/models/sphere.glb' },
        ]
      },
      {
        label: 'Everyday Objects',
        models: [
          { name: 'Intro Model', path: '/models/beginner/intro.glb' },
          { name: 'Guided Run', path: '/models/beginner/guided.glb' }
        ]
      }
    ]
  },
  {
    label: 'Intermediate',
    icon: '🌶️',
    color: '#fff3cd',
    categories: [
      {
        label: 'Challenge 1',
        models: [
          { name: 'Model C', path: '/models/intermediate/model-c.glb' },
          { name: 'Model D', path: '/models/intermediate/model-d.glb' }
        ]
      },
      {
        label: 'Speed Practice',
        models: [
          { name: 'Model E', path: '/models/intermediate/model-e.glb' },
          { name: 'Model F', path: '/models/intermediate/model-f.glb' }
        ]
      }
    ]
  },
  {
    label: 'Expert',
    icon: '🔥',
    color: '#f8d7da',
    categories: [
      {
        label: 'Boss Level',
        models: [
          { name: 'Model G', path: '/models/expert/model-g.glb' },
          { name: 'Model H', path: '/models/expert/model-h.glb' }
        ]
      },
      {
        label: 'Timed Trial',
        models: [
          { name: 'Model I', path: '/models/expert/model-i.glb' },
          { name: 'Model J', path: '/models/expert/model-j.glb' }
        ]
      }
    ]
  }
];


const LevelSelection = ({ onSelect }) => {
  const [expandedLevel, setExpandedLevel] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleLevel = (label) => {
    setExpandedLevel((prev) => (prev === label ? null : label));
    setExpandedCategory(null);
  };

  const toggleCategory = (level, categoryLabel) => {
    if (expandedLevel === level) {
      setExpandedCategory((prev) =>
        prev === categoryLabel ? null : categoryLabel
      );
    }
  };

  return (
    <div className="levelSelector">
      <img alt="Logo" src="/logos/spinlogo.png" className="title" />
      <div className="levels scrollContainer">
        {levels.map((level) => (
          <div key={level.label}>
            <div
              className="levelCard"
              style={{ backgroundColor: level.color }}
              onClick={() => toggleLevel(level.label)}
            >
              <span className="icon">{level.icon}</span>
              <span className="label">{level.label}</span>
            </div>

            <div
              className={`categoryList ${
                expandedLevel === level.label ? 'expanded' : ''
              }`}
            >
              {level.categories.map((category) => (
                <div key={category.label}>
                  <div
                    className="categoryCard"
                    onClick={() => toggleCategory(level.label, category.label)}
                  >
                    {category.label}
                  </div>

                  <div
                    className={`modelList ${
                      expandedCategory === category.label ? 'expanded' : ''
                    }`}
                  >
                    {category.models.map((model) => (
                      <div
                        key={model.name}
                        className="modelCard"
                        onClick={() => onSelect(model)} // pass model object back to App.jsx
                      >
                        {model.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function SelectMenu({ onSelect }) {
  return (
    <>
      <LevelSelection onSelect={onSelect} />
    </>
  );
}

export default SelectMenu;