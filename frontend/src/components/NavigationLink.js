// NavigationLink.js
import React from 'react';
import { Link } from 'react-router-dom';

const NavigationLink = ({ Icon, to, label }) => {
  return (
    <Link to={to}>
      <Icon />
      <span className="link-text">{label}</span>
    </Link>
  );
};

export default NavigationLink;