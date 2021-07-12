import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import CountriesCases from './View/CountriesCases/CountriesCases.js';
import {BrowserRouter,Switch, Route ,Redirect} from 'react-router-dom';
import CountryDetails from './View/CountriesCases/CountryDetials';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/countriescases" component={CountriesCases} />
      <Route path="/country" component={CountryDetails} />
      <Redirect from="/" to="/countriescases" />
    </Switch>
  </BrowserRouter>,
   
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
