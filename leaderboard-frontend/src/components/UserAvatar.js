import React from 'react';

/**
 * A component that displays a user's avatar.
 * It shows a colored circle with the user's first initial.
 * @param {object} props - The component props.
 * @param {string} props.name - The name of the user.
 * @param {string} props.theme - The current visual theme.
 */
const UserAvatar = ({ name, theme }) => {
    // Special case for the 'wealth' theme's mystery user
    if (theme === 'wealth' && name === 'Mystery Billionaire') {
        return <div className="avatar mystery-avatar">?</div>;
    }
    
    // Get the first character of the name, or '?' if the name is missing.
    const initial = name ? name.charAt(0).toUpperCase() : '?';

    // A simple hash function to generate a consistent color from the user's name.
    // This ensures a user's avatar color remains the same.
    const colorHash = name.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const hue = colorHash % 360;
    const backgroundColor = `hsl(${hue}, 70%, 80%)`;
    const color = `hsl(${hue}, 70%, 30%)`;

    return (
        <div className="avatar" style={{ backgroundColor, color }}>
            {initial}
        </div>
    );
};

export default UserAvatar;
