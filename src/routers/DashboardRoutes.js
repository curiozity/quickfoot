import React from 'react';

import { Switch, Route, Redirect } from "react-router-dom";
import PlayersComponent from '../components/PlayersComponent';
import StaffComponent from '../components/StaffComponent';
import TrainingsComponents from '../components/TrainingsComponent';
import MatchesComponents from '../components/MatchesComponent';
import TeamsComponents from '../components/TeamsComponent';
import TasksComponents from '../components/TasksComponent';
import { Navbar } from '../ui/NavBar';



function DashboardRoutes() {
    return (
        <>
            <Navbar />

            <div>
                <Switch>
                    <Route exact path="/staff" component={ StaffComponent } />
                    <Route exact path="/players" component={ PlayersComponent } />
                    <Route exact path="/trainings" component={ TrainingsComponents } />
                    <Route exact path="/matches" component={ MatchesComponents } />
                    <Route exact path="/teams" component={ TeamsComponents } />
                    <Route exact path="/tasks" component={ TasksComponents } />

                    <Redirect to="/players" />
                </Switch>
            </div>

        </>
    )
}

export default DashboardRoutes
