import React from 'react';
import ReactDOM from 'react-dom';
import { Grommet } from 'grommet';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './pages/Login';
import View from './pages/View';
import SignUp from './pages/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';
import { WithClient } from './context/client';
import { WithUser } from './context/user';
import { WithInstance } from './context/instance';
import { WithDocument } from './context/document';
import Home from './pages/Home';

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-center" closeOnClick />
      <WithClient>
        <WithUser>
          <WithInstance>
            <WithDocument>
              <div className="App">
                <Grommet theme={theme}>
                  <Route path="/" exact>
                    <Home />
                  </Route>

                  <Route path="/login" exact>
                    <Login />
                  </Route>

                  <Route path="/signup" exact>
                    <SignUp />
                  </Route>

                  <Route
                    path={['/view/:id/:annotId', '/view/:id', '/view']}
                    render={(routeProps) => {
                      return <View {...routeProps} />;
                    }}
                  />
                </Grommet>
              </div>
            </WithDocument>
          </WithInstance>
        </WithUser>
      </WithClient>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
