import React from 'react';
import {render} from 'react-dom';
import './style.css';

import App from './components/app/App';

renderMathInElement(document.body);

render(
    <App/>
  , document.getElementById('app'));
