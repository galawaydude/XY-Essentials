import React, { useEffect, useState } from 'react';
import './broadcast.css';

const Broadcast = () => {
    const [users, setUsers] = useState([]);
    const [carts, setCarts] = useState([]);
    const [category, setCategory] = useState('all');
    const [csvEmails, setCsvEmails] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchAllCarts();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/users', { credentials: 'include' });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users');
        }
    };

    const fetchAllCarts = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/cart/get-all-carts', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            setCarts(data);
        } catch (err) {
            setError('Failed to fetch carts');
        }
    };

    useEffect(() => {
        let filteredEmails = [];

        if (category === 'all') {
            filteredEmails = users.map(u => u.email);
        } else if (category === 'noemptycart') {
            // Users who have at least one product in their cart
            const userIdsWithCartItems = carts
                .filter(c => c.cartItems && c.cartItems.length > 0)
                .map(c => c.user?._id);
            filteredEmails = users
                .filter(u => userIdsWithCartItems.includes(u._id.toString()))
                .map(u => u.email);
        } else if (category === 'emptycart') {
            // Users who have at least one product in their cart
            const userIdsWithCartItems = carts
                .filter(c => c.cartItems && c.cartItems.length === 0)
                .map(c => c.user?._id);
            filteredEmails = users
                .filter(u => userIdsWithCartItems.includes(u._id.toString()))
                .map(u => u.email);
        } else if (category === 'withorders') {
            // Users with orders > 0
            filteredEmails = users
                .filter(u => u.orders?.length > 0)
                .map(u => u.email);
        }

        setCsvEmails(filteredEmails.join(', '));
    }, [users, carts, category]);

    const copyEmails = () => {
        navigator.clipboard.writeText(csvEmails);
        // alert('Emails copied to clipboard!');
    };

    return (
        <div className="broadcast-container">
            <h1>Broadcast</h1>
            <div className="broadcast-controls">
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="all">All Users</option>
                    <option value="noemptycart">Users with NO empty cart</option>
                    <option value="emptycart">Users with empty cart</option>
                    <option value="withorders">Past Customers</option>
                </select>
                <button onClick={copyEmails}>Copy Emails</button>
            </div>
            {error && <div className="broadcast-error">{error}</div>}
            <div className="broadcast-csv">
                {csvEmails}
            </div>
        </div>
    );
};

export default Broadcast;