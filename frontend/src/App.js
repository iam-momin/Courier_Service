import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import './App.css';
import Admin from './pages/Admin';
import Calculator from './pages/Calculator';
import Customer from './pages/Customer';
import Login from './pages/Login';
import Password from './pages/Password';

function App() {
  return (
    <div className="App" id='App'>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route path='/login' component={Login} />
          <Route path='/calculator' component={Calculator} />
          <Route path='/customer' component={Customer} />
          <Route path='/admin' component={Admin} />
          <Route path='/recover' component={Password} />
          <Redirect from="*" to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
