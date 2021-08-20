import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { NavDropdown } from "react-bootstrap";

import { startLogout } from '../actions/auth';
import escudo from '../assets/images/escudo-transparente.png'

import { firebase, googleAuthProvider } from '../firebase/firebase-config';

const user = firebase.auth().currentUser;
if ( user ) {
    console.log(user.email)
} else {
    console.log('No autenticado')
}

export const Navbar = () => {

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch( startLogout() );
    }

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            
            <img src={ escudo } width="25" alt="Logo" />

            <Link 
                className="navbar-brand" 
                to="/"
            >
                &nbsp;QuickFoot
            </Link>

            <div className="navbar-collapse">
                <div className="navbar-nav">

                    <NavDropdown title="Plantilla" id="nav-dropdown">
                        <NavDropdown.Item className="bg-dark">
                            <NavLink 
                                activeClassName="active"
                                className="nav-item nav-link bg-dark" 
                                exact
                                to="/players"
                            >
                                Jugadores
                            </NavLink>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="bg-dark">
                            <NavLink 
                                activeClassName="active"
                                className="nav-item nav-link" 
                                exact
                                to="/staff"
                            >
                                Cuerpo técnico
                            </NavLink>
                        </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Entrenamientos" id="nav-dropdown">
                        <NavDropdown.Item className="bg-dark">
                            <NavLink 
                                activeClassName="active"
                                className="nav-item nav-link" 
                                exact
                                to="/trainings"
                            >
                                Sesiones
                            </NavLink>
                        </NavDropdown.Item>
                        <NavDropdown.Item className="bg-dark">
                            <NavLink 
                                activeClassName="active"
                                className="nav-item nav-link" 
                                exact
                                to="/tasks"
                            >
                                Tareas
                            </NavLink>
                        </NavDropdown.Item>
                    </NavDropdown>  

                    <NavLink 
                        activeClassName="active"
                        className="nav-item nav-link" 
                        exact
                        to="/matches"
                    >
                        Partidos
                    </NavLink>

                    <NavDropdown title="Datos" id="nav-dropdown">
                        <NavDropdown.Item className="bg-dark">
                            <NavLink 
                                activeClassName="active"
                                className="nav-item nav-link" 
                                exact
                                to="/teams"
                            >
                                Equipos
                            </NavLink>
                        </NavDropdown.Item>
                    </NavDropdown>            
                 
                </div>
            </div>

            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                <ul className="navbar-nav ms-auto">
                    <h6 className="text-light mt-2">{user?.email || ''}</h6>
                    <NavLink 
                        activeClassName="active"
                        className="nav-item nav-link"
                        onClick={ handleLogout }
                        exact
                        to="/login"
                    >
                        Salir
                    </NavLink>
                </ul>
                
            </div>
        </nav>
    )
}