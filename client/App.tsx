import React from 'react';
import ReactDOM from 'react-dom';
import { Grommet } from 'grommet';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import View from './pages/View';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';
import { WithClient } from './context/client';
import Home from './pages/Home';
import { WithInstance } from './context/instance';
import useAuth from './hooks/useAuth';

const Authorized = ({ children }) => {
  const { loading, user } = useAuth();
  if (loading) {
    return <div></div>;
  }
  return children(user);
};

function App() {
  return (
    <Router>
      <ToastContainer position="top-center" closeOnClick />
      <WithClient>
        <WithInstance>
          <div className="App">
            <Grommet theme={theme}>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route
                path={['/view/:id/:annotId', '/view/:id', '/view']}
                render={(routeProps) => {
                  return (
                    <Authorized>
                      {(user) => {
                        return <View {...routeProps} user={user} />;
                      }}
                    </Authorized>
                  );
                }}
              />
            </Grommet>
          </div>
        </WithInstance>
      </WithClient>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
