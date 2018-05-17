import spelt from "spelt";
// import one of the dictionaries
import {dictionary} from "spelt-us-dict";
// build dictionary
const check = spelt({
	dictionary:dictionary,
	// can be either "gb" or "us"
	distanceThreshold:0.2
	// when a correction found with this distance
	// we'll stop looking for another
	// this would improve performance
});

import React from 'react'
import ReactDOM from 'react-dom'
import InputBox from './query.jsx'


window.onload = () => {
	let DOM = document.getElementById('input-query')
	let query = DOM.getAttribute('content')
	ReactDOM.render(<InputBox  defaultQuery={query} />, document.getElementById('input-query'))
}