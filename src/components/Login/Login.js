import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const history = useHistory();
    const { login } = useContext(UserContext);

  
    const validateForm = () => {
        let newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) return; 

        try {
            const response = await axios.get(`http://localhost:4000/users?email=${email}&password=${password}`);

            if (response.data.length > 0) {
                const user = response.data[0];
                login(user);
                history.push(user.role === 'admin' ? '/' : '/profiles');
            } else {
                setErrors({ login: 'Invalid email or password' });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrors({ login: 'Server error. Please try again later.' });
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p style={{ color: 'red', margin: '5px 0' }}>{errors.email}</p>}
                </div>

                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p style={{ color: 'red', margin: '5px 0' }}>{errors.password}</p>}
                </div>

                {errors.login && <p style={{ color: 'red', margin: '5px 0' }}>{errors.login}</p>}

                <button type="submit">Login</button>
            </form>

            <button onClick={() => history.push('/signup')}>Sign Up</button>
        </div>
    );
};

export default Login;
