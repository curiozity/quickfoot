import React, { useState } from 'react'
import { useEffect } from 'react';
import { firebase } from '../firebase/firebase-config'
import { useDispatch } from 'react-redux';

import {
    BrowserRouter as Router,
    Switch,
    Redirect,
  } from "react-router-dom";

import LoginScreen from '../LoginScreen';

import DashboardRoutes from './DashboardRoutes';
import { login } from '../actions/auth';
// import { exportSpecifier } from '@babel/types';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

function AppRouter() {

    const dispatch = useDispatch();

    const [ checking, setChecking] = useState(true);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect( () => {
        firebase.auth().onAuthStateChanged( ( user ) => {
            if ( user?.uid ) {
                dispatch( login( user.uid, user.displayName ) );
                setIsLoggedIn( true );
            } else {
                setIsLoggedIn( false );
            }
            
            setChecking(false);

        });
    }, [ dispatch, setChecking, setIsLoggedIn ] )

    if ( checking ) {
        return (
            <h1>Espere...</h1>
        )
    }

    return (
        <>
            <Router>

                <div>
                    <Switch>
                        <PublicRoute exact path="/login" component={ LoginScreen } isAuthenticated={ isLoggedIn } />
                        <PrivateRoute path="/" component={ DashboardRoutes } isAuthenticated={ isLoggedIn } />

                        <Redirect to="/login" />
                        
                    </Switch>
                </div>
            </Router>
        </>
    )
}

export default AppRouter
