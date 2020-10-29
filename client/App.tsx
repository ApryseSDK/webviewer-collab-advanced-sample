import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Grommet } from 'grommet';
import { grommet } from 'grommet/themes';
import './App.scss';
import {
  BrowserRouter as Router,
  Route,
  useHistory,
} from "react-router-dom";
import { Provider, useDispatch } from 'react-redux'
import store from './redux/store';
import Login from './pages/Login/Login';
import View from './pages/View/View';
import SignUp from './pages/Signup/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CollabClient from '@pdftron/collab-client';
import { setClient } from './redux/viewer';

/**
 * This component just wraps the app and sets up the collab client
 */
const WithClient = ({ children }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const client = new CollabClient({
      url: process.env.SERVER_URL,
      subscriptionUrl: process.env.SUBSCRIBE_URL,
      notificationHandler: CollabClient.defaultNotificationHandler({
        onClick: (data) => {
          const { documentId, type } = data;
          if (type === 'message') {
            // @ts-ignore
            history.push(`/view/${documentId}/${data.annotationId}`);
          } else {
            history.push(`/view/${documentId}`);
          }
        },
      }),
    });
  
    dispatch(setClient(client));
  }, [])

  return children;
}
const App = () => {
  return (
    <Router>
      <ToastContainer
        position='top-center'
        closeOnClick
      />
      <Provider store={store}>
        <WithClient>
          <div className='App'>
            <Grommet theme={grommet}>
              <Route path='/' exact>
                <Login />
              </Route>

              <Route path='/signup' exact>
                <SignUp />
              </Route>

                <Route
                  path={['/view/:id/:annotId', '/view/:id', '/view']}
                  render={routeProps => {
                    return (
                      <View {...routeProps} />
                    )
                  }}
                />
              </Grommet>
            </div>
          </WithClient>
      </Provider>
    </Router>
  )
}

ReactDOM.render((<App />), document.getElementById('app'));
