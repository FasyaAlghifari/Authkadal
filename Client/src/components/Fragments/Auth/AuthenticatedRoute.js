import React from 'react';
import { Redirect, Route } from 'react-router-dom';

function AuthenticatedRoute({ component: Component, ...rest }) {
	const token = localStorage.getItem('token');

	if (!token) {
		return <Redirect to="/login" />;
	}

	return <Route {...rest} render={(props) => <Component {...props} />} />;
}

export default AuthenticatedRoute;