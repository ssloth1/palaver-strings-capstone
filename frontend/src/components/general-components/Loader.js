import React from 'react';
import './styles/Loader.css';

// Just a basic loading spinner from https://cssloaders.github.io/
// I figured since we actually have data to load now, it would be nice to have a loading spinner.
// - Jim Bebarski
const Loader = () => (
    <div className="loader-container">
        <div className="loader"></div>
    </div>
);

export default Loader;