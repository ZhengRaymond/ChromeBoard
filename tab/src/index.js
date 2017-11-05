import React from 'react';
import {render} from 'react-dom';
import './style.css';

import App from './components/App';

renderMathInElement(document.body);

render(
    <App/>
  , document.getElementById('app'));
