import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Users.css';
import { FaSort, FaSearch, FaEye, FaLock, FaUnlock, FaFilter } from 'react-icons/fa';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                credentials: 'include',
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError('Failed to fetch users');
        }
        setLoading(false);
    };

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilter = (e) => {
        setFilter(e.target.value);
    };

    const handleUserAction = async (action, userId) => {
        try {
            const endpoint = action === 'block' ? 'block' : 'unblock';
            await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                method: 'PUT',
                credentials: 'include'
            });
            fetchUsers();
        } catch (error) {
            setError('Failed to perform action');
        }
    };

    const filteredUsers = users
        .filter(user => {
            const matchesSearch = (
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.mobileNumber?.toString().includes(searchTerm)
            );
            const matchesFilter = filter === 'all' || 
                                (filter === 'active' && user.isActive) ||
                                (filter === 'blocked' && !user.isActive);
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (sortConfig.direction === 'asc') {
                return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
            }
            return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
        });

    if (loading) return <div className="loading-spinner">Loading users...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>User Management</h1>
                <div className="header-actions">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    {/* <select className="filter-select" onChange={handleFilter} value={filter}>
                        <option value="all">All Users</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                    </select> */}
                </div>
            </div>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')}>User Info <FaSort /></th>
                            <th onClick={() => handleSort('mobileNumber')}>Mobile <FaSort /></th>
                            <th onClick={() => handleSort('email')}>Email <FaSort /></th>
                            <th onClick={() => handleSort('orders')}>Orders <FaSort /></th>
                            {/* <th>Status</th> */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id}>
                                <td className="user-info">
                                    {/* <img src={user.pfp || '/default-avatar.png'} alt={user.name} /> */}
                                    <div>
                                        <h4>{user.name}</h4>
                                        <span>{user.isAdmin ? 'Admin' : 'User'}</span>
                                    </div>
                                </td>
                                <td>{user.mobileNumber || 'Not provided'}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className="orders-badge">
                                        {user.orders?.length || 0}
                                    </span>
                                </td>
                                {/* <td>
                                    <span className={`status-badge ${user.isActive ? 'active' : 'blocked'}`}>
                                        {user.isActive ? 'Active' : 'Blocked'}
                                    </span>
                                </td> */}
                                <td className="actions-cell">
                                    <div className="action-buttons">
                                        <Link
                                            className="action-btn view"
                                            to={`/admin/users/${user._id}`}
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </Link>
                                        {/* <button
                                            className={`action-btn ${user.isActive ? 'block' : 'unblock'}`}
                                            onClick={() => handleUserAction(user.isActive ? 'block' : 'unblock', user._id)}
                                            title={user.isActive ? 'Block User' : 'Unblock User'}
                                        >
                                            {user.isActive ? <FaLock /> : <FaUnlock />}
                                        </button> */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
