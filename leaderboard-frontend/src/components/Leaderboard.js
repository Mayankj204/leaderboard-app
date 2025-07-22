import React from 'react';
import UserAvatar from './UserAvatar'; // We will create this component next.

/**
 * A component that displays the ranked leaderboard, including a podium for the top 3.
 * @param {object} props - The component props.
 * @param {Array} props.leaderboard - The sorted array of user objects.
 * @param {string} props.theme - The current visual theme.
 */
const Leaderboard = ({ leaderboard, theme }) => {
    // Configuration for different themes
    const themeConfig = {
        weekly: { title: '🏆 Weekly Contribution Ranking', icon: '🏆' },
        hourly: { title: '🔥 Hourly Ranking', icon: '🔥' },
        wealth: { title: '💰 Wealth Ranking', icon: '💰' }
    };
    const currentConfig = themeConfig[theme];

    // Function to format points based on the theme (e.g., masking for 'wealth')
    const formatPoints = (points) => {
        if (theme !== 'wealth') {
            return points.toLocaleString();
        }
        const str = points.toString();
        if (str.length <= 2) return str;
        // Masks the points like "9****9" for the wealth theme
        return `${str[0]}****${str.slice(-1)}`;
    };

    if (!leaderboard || leaderboard.length === 0) {
        return <div className="card leaderboard-card"><p>No users on the leaderboard yet.</p></div>;
    }

    // Split the leaderboard into the top three and the rest
    const topThree = leaderboard.slice(0, 3);
    const restOfLeaderboard = leaderboard.slice(3);

    // Pad the topThree array with nulls if there are fewer than 3 users, to maintain the podium structure
    while (topThree.length < 3) {
        topThree.push(null);
    }
    
    // Reorder for visual presentation: 2nd, 1st, 3rd place
    const displayOrder = [topThree[1], topThree[0], topThree[2]];

    return (
        <div className="card leaderboard-card">
            <div className="leaderboard-header">
                <h2 className="card-title">{currentConfig.title}</h2>
                <p className="settlement-time">Settlement time: 2 days 01:45:29</p>
            </div>
            
            {/* Top 3 Podium */}
            <div className="podium">
                {displayOrder.map((user, index) => {
                    const rank = [2, 1, 3][index];
                    // If a spot is empty, render a placeholder
                    if (!user) return <div key={`placeholder-${rank}`} className={`podium-item rank-${rank}`}></div>;
                    
                    return (
                        <div key={user._id} className={`podium-item rank-${rank}`}>
                            <div className="podium-rank-badge">{rank}</div>
                            <UserAvatar name={user.name} theme={theme}/>
                            <p className="podium-name">{user.name}</p>
                            <p className="podium-points">
                                <span role="img" aria-label="icon">{currentConfig.icon}</span> {formatPoints(user.totalPoints)}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Rest of the leaderboard list */}
            <ul className="leaderboard-list">
                {restOfLeaderboard.map((user, index) => (
                    <li key={user._id} className="list-item">
                        <span className="list-rank">{index + 4}</span>
                        <div className="list-user-info">
                            <UserAvatar name={user.name} theme={theme} />
                            <span className="list-name">{user.name}</span>
                        </div>
                        <span className="list-points">
                            <span role="img" aria-label="icon">{currentConfig.icon}</span> {formatPoints(user.totalPoints)}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
