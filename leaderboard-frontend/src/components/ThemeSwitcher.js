import React from 'react';

/**
 * A component that renders buttons to switch between different visual themes.
 * @param {object} props - The component props.
 * @param {string} props.theme - The currently active theme.
 * @param {function} props.setTheme - The function to call when a new theme is selected.
 */
const ThemeSwitcher = ({ theme, setTheme }) => {
    return (
        <div className="card theme-switcher">
            <h3 className="card-title">Select Theme</h3>
            <div className="theme-buttons">
                <button 
                    className={`btn-theme ${theme === 'weekly' ? 'active' : ''}`} 
                    onClick={() => setTheme('weekly')}
                >
                    🏆 Weekly
                </button>
                <button 
                    className={`btn-theme ${theme === 'hourly' ? 'active' : ''}`} 
                    onClick={() => setTheme('hourly')}
                >
                    🔥 Hourly
                </button>
                <button 
                    className={`btn-theme ${theme === 'wealth' ? 'active' : ''}`} 
                    onClick={() => setTheme('wealth')}
                >
                    💰 Wealth
                </button>
            </div>
        </div>
    );
};

export default ThemeSwitcher;
