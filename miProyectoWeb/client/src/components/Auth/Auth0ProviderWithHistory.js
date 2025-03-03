import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
    const navigate = useNavigate();
    const domain = process.env.REACT_APP_AUTH0_DOMAIN;
    const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
    const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

    const onRedirectCallback = (appState) => {
        navigate(appState?.returnTo || '/dashboard');
    };

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            audience={audience}
            authorizationParams={{
                redirect_uri: window.location.origin,
            }}
            onRedirectCallback={onRedirectCallback}
            scope="openid profile email read:current_user"
        >
            {children}
        </Auth0Provider>
    );
};

export default Auth0ProviderWithHistory;
