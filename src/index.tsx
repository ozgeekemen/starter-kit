import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Products} from "./components/products";

window.onload = () => {
    ReactDOM.render(
        <Products/>,
        document.getElementById('app')
    );
};
