import React, { useLayoutEffect, useRef } from 'react';
import './Skills.css';

const Skill = ({ skill, level, color }) => {
  const barRef = useRef(null);

  useLayoutEffect(() => {
    const barElement = barRef.current;
    const fillWidth = (level / 100) * barElement.clientWidth;

    barElement.style.setProperty('--fill-width', `${fillWidth}px`);
  }, [level]);

  return (
    <div className="skill-bar">
      <div className="skill-bar__label">{skill}</div>
      <div className="skill-bar__bar">
        <div ref={barRef} className="skill-bar__fill" style={{backgroundColor: color, textShadow: '0 0 10px rgba(0, 174, 239, 0.8)'}} />
      </div>
    </div>
  );
};

export default Skill;
