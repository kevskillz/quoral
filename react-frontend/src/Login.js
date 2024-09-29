import React from 'react';
import './Login.css'; // Assuming you're importing the CSS file
import { Link } from 'react-router-dom';
const Login = () => {
    return (
        <div className="login-container">
            <form className="login-form">
                <h2>LOGIN</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <Link to="/map">
                    <button className='login-button'>Login</button>
                </Link>
            </form>
     </div>
    );
};

export default Login;