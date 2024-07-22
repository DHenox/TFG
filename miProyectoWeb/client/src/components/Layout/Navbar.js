import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import LoginButton from '../Auth/LoginButton';
import LogoutButton from '../Auth/LogoutButton';

const Navbar = () => {
    const { isAuthenticated } = useAuth0();

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                {isAuthenticated && (
                    <>
                        <li>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li>
                            <LogoutButton />
                        </li>
                    </>
                )}
                {!isAuthenticated && (
                    <li>
                        <LoginButton />
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
