import React, { useState } from 'react';

/**
 * A component that provides UI for adding new users and claiming points for existing users.
 * @param {object} props - The component props.
 * @param {Array} props.users - The list of all users.
 * @param {string} props.selectedUser - The ID of the currently selected user.
 * @param {function} props.setSelectedUser - Function to update the selected user.
 * @param {function} props.onAddUser - Function to call when adding a new user.
 * @param {function} props.onClaim - Function to call when claiming points.
 */
const UserManagement = ({ users, selectedUser, setSelectedUser, onAddUser, onClaim }) => {
    const [newUserName, setNewUserName] = useState('');

    // Handles the submission of the "Add User" form.
    const handleAddUser = (e) => {
        e.preventDefault(); // Prevent the form from reloading the page
        if (newUserName.trim()) {
            onAddUser(newUserName.trim());
            setNewUserName(''); // Clear the input field after submission
        }
    };

    return (
        <div className="card user-management">
            <h2 className="card-title">User Controls</h2>
            
            {/* Section for adding a new user */}
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

            {/* Section for selecting a user and claiming points */}
            <div className="form-section">
                <select 
                    value={selectedUser} 
                    onChange={(e) => setSelectedUser(e.target.value)} 
                    className="select-field"
                >
                    <option value="">-- Select a User to Claim For --</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>
                            {user.name}
                        </option>
                    ))}
                </select>
                <button onClick={onClaim} disabled={!selectedUser} className="btn btn-claim">
                    ✨ Claim Points
                </button>
            </div>
        </div>
    );
};

export default UserManagement;
