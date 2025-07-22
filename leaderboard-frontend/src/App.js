import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- Configuration ---
const API_URL = 'https://leaderboard-backend-fz39.onrender.com/api'; // Your backend URL
const USERS_PER_PAGE = 7; // Number of users to display per page in the list

// --- Helper & UI Components ---

/**
 * UserAvatar Component
 * Displays a colored circle with the user's first initial.
 * @param {{name: string}} props
 */
const UserAvatar = ({ name }) => {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    // Generates a consistent color from the user's name
    const colorHash = name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const hue = colorHash % 360;
    const backgroundColor = `hsl(${hue}, 60%, 85%)`;
    const color = `hsl(${hue}, 60%, 30%)`;

    return (
        <div className="avatar" style={{ backgroundColor, color }}>
            {initial}
        </div>
    );
};

/**
 * UserManagement Component
 * Handles adding a new user and selecting a user to claim points for.
 * @param {object} props
 */
const UserManagement = ({ users, selectedUser, setSelectedUser, onAddUser, onClaim }) => {
    const [newUserName, setNewUserName] = useState('');

    const handleAddUser = (e) => {
        e.preventDefault();
        if (newUserName.trim()) {
            onAddUser(newUserName.trim());
            setNewUserName('');
        }
    };

    return (
        <div className="card user-management">
            <h2 className="card-title">User Controls</h2>
            <form onSubmit={handleAddUser} className="form-section">
                <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter new user name"
                    className="input-field"
                />
                <button type="submit" className="btn">Add User</button>
            </form>
            <div className="form-section">
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="select-field">
                    <option value="">-- Select a User to Claim For --</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                    ))}
                </select>
                <button onClick={onClaim} disabled={!selectedUser} className="btn btn-claim">
                    ✨ Claim Points
                </button>
            </div>
        </div>
    );
};

/**
 * Leaderboard Component
 * Displays the ranked list of users with a podium and a paginated list.
 * @param {object} props
 */
const Leaderboard = ({ leaderboard }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Separate top 3 for the podium
    const topThree = leaderboard.slice(0, 3);
    const restOfLeaderboard = leaderboard.slice(3);

    // Pagination Logic
    const totalPages = Math.ceil(restOfLeaderboard.length / USERS_PER_PAGE);
    const paginatedUsers = restOfLeaderboard.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    if (!leaderboard.length) {
        return <div className="card leaderboard-card"><p>No users on the leaderboard yet.</p></div>;
    }

    // Pad topThree with nulls if there are fewer than 3 users
    while (topThree.length < 3) topThree.push(null);
    const displayOrder = [topThree[1], topThree[0], topThree[2]];

    return (
        <div className="card leaderboard-card">
            <div className="leaderboard-header">
                <h2 className="card-title">🏆 Leaderboard</h2>
            </div>
            
            {/* Top 3 Podium */}
            <div className="podium">
                {displayOrder.map((user, index) => {
                    const rank = [2, 1, 3][index];
                    if (!user) return <div key={`placeholder-${rank}`} className={`podium-item rank-${rank}`}></div>;
                    
                    return (
                        <div key={user._id} className={`podium-item rank-${rank}`}>
                            <div className="podium-rank-badge">{rank}</div>
                            <UserAvatar name={user.name} />
                            <p className="podium-name">{user.name}</p>
                            <p className="podium-points">{user.totalPoints.toLocaleString()}</p>
                        </div>
                    );
                })}
            </div>

            {/* Paginated list for the rest of the users */}
            <ul className="leaderboard-list">
                {paginatedUsers.map((user, index) => (
                    <li key={user._id} className="list-item">
                        <span className="list-rank">{(currentPage - 1) * USERS_PER_PAGE + index + 4}</span>
                        <div className="list-user-info">
                            <UserAvatar name={user.name} />
                            <span className="list-name">{user.name}</span>
                        </div>
                        <span className="list-points">{user.totalPoints.toLocaleString()}</span>
                    </li>
                ))}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}
        </div>
    );
};


// --- Main App Component ---
export default function App() {
    // --- State Management ---
    const [users, setUsers] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        try {
            const [usersRes, leaderboardRes] = await Promise.all([
                axios.get(`${API_URL}/users`),
                axios.get(`${API_URL}/leaderboard`)
            ]);
            setUsers(usersRes.data);
            setLeaderboard(leaderboardRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Could not connect to the server. Please ensure the backend is running.');
        }
    }, []);

    // Fetch data on initial component mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Helper Functions ---
    const showNotification = (msg, isError = false) => {
        isError ? setError(msg) : setMessage(msg);
        setTimeout(() => {
            setMessage('');
            setError('');
        }, 3000);
    };

    // --- Event Handlers ---
    const handleAddUser = async (name) => {
        try {
            const res = await axios.post(`${API_URL}/users`, { name });
            showNotification(res.data.message);
            fetchData();
        } catch (err) {
            showNotification(err.response?.data?.message || 'Error adding user', true);
        }
    };

    const handleClaimPoints = async () => {
        if (!selectedUser) return;
        try {
            const res = await axios.post(`${API_URL}/users/${selectedUser}/claim`);
            showNotification(res.data.message);
            fetchData();
        } catch (err) {
            showNotification(err.response?.data?.message || 'Error claiming points', true);
        }
    };

    return (
        <>
            {/* All styles are now in a single block for simplicity */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                :root {
                    --bg-color: #f3e8ff;
                    --card-bg: #ffffff;
                    --primary-color: #9d4edd;
                    --secondary-color: #8c38c9;
                    --text-color: #3c1361;
                    --light-text: #7b5e97;
                    --border-color: #e9ecef;
                    --shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                    --rank1-color: #ffd700;
                    --rank2-color: #c0c0c0;
                    --rank3-color: #cd7f32;
                }
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: var(--bg-color);
                    color: var(--text-color);
                    margin: 0;
                    padding: 2rem 1rem;
                }
                .main-container { max-width: 800px; margin: 0 auto; }
                .app-header { text-align: center; margin-bottom: 2rem; }
                .app-header h1 { color: var(--text-color); font-weight: 700; }
                .card { 
                    background: var(--card-bg); 
                    color: var(--text-color);
                    border-radius: 16px; 
                    padding: 1.5rem; 
                    box-shadow: var(--shadow); 
                    margin-bottom: 2rem;
                    border: 1px solid var(--border-color);
                }
                .card-title { margin-top: 0; font-size: 1.25rem; font-weight: 600; color: var(--text-color); }
                .user-management { text-align: center; }
                .form-section { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
                .input-field, .select-field { 
                    padding: 0.75rem; 
                    border: 1px solid var(--border-color); 
                    border-radius: 8px; 
                    font-size: 1rem; 
                    flex-grow: 1; 
                    min-width: 200px; 
                    background-color: #f8f9fa;
                    color: var(--text-color);
                }
                .select-field option {
                    background: #fff;
                    color: var(--text-color-dark);
                }
                .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; background: var(--primary-color); color: white; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .btn:hover { background: var(--secondary-color); }
                .btn:disabled { background: #ccc; color: #666; cursor: not-allowed; }
                .notification { text-align: center; padding: 0.75rem; margin-bottom: 1rem; border-radius: 8px; font-weight: 600; }
                .message { background-color: #e6ffed; color: #006421; }
                .error { background-color: #ffebe6; color: #c50000; }
                .leaderboard-header { text-align: center; margin-bottom: 2rem; }
                .podium { display: flex; justify-content: center; align-items: flex-end; gap: 1rem; margin-bottom: 2.5rem; min-height: 200px; }
                .podium-item { width: 120px; text-align: center; padding: 1rem; border-radius: 12px; position: relative; transition: transform 0.3s ease; border-top: 4px solid; background-color: var(--card-bg); box-shadow: var(--shadow); }
                .podium-item:hover { transform: translateY(-8px); }
                .podium-rank-badge { position: absolute; top: 12px; right: 12px; background-color: rgba(255,255,255,0.7); backdrop-filter: blur(5px); border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; }
                .rank-1 { order: 2; height: 150px; border-color: var(--rank1-color); }
                .rank-2 { order: 1; height: 120px; border-color: var(--rank2-color); }
                .rank-3 { order: 3; height: 100px; border-color: var(--rank3-color); }
                .rank-1 .podium-rank-badge { color: var(--rank1-color); }
                .rank-2 .podium-rank-badge { color: var(--rank2-color); }
                .rank-3 .podium-rank-badge { color: var(--rank3-color); }
                .podium .avatar { width: 60px; height: 60px; font-size: 2rem; margin: 0.5rem auto; }
                .podium-name { font-weight: 600; margin: 0.5rem 0; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
                .podium-points { font-size: 1.1rem; color: var(--text-color); margin: 0; font-weight: 700; }
                .leaderboard-list { list-style: none; padding: 0; margin: 0; }
                .list-item { display: flex; align-items: center; padding: 0.75rem 1rem; border-radius: 10px; transition: background-color 0.2s; margin-bottom: 0.5rem; }
                .list-item:hover { background-color: #e9d5ff; }
                .list-rank { font-size: 1rem; font-weight: 600; color: var(--light-text); width: 40px; text-align: center; }
                .list-user-info { display: flex; align-items: center; flex-grow: 1; }
                .list-item .avatar { width: 45px; height: 45px; margin-right: 1rem; }
                .list-name { font-weight: 600; }
                .list-points { font-weight: 600; color: var(--primary-color); }
                .avatar { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 600; }
                .pagination-controls { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color); }
                .pagination-controls button { background-color: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
                .pagination-controls button:disabled { background-color: #ccc; cursor: not-allowed; }
                .pagination-controls span { font-weight: 600; color: var(--light-text); }
            `}</style>
            <div className="main-container">
                <header className="app-header">
                    <h1>Leaderboard</h1>
                </header>

                {message && <div className="notification message">{message}</div>}
                {error && <div className="notification error">{error}</div>}

                <UserManagement
                    users={users}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    onAddUser={handleAddUser}
                    onClaim={handleClaimPoints}
                />
                
                <Leaderboard leaderboard={leaderboard} />
            </div>
        </>
    );
}
