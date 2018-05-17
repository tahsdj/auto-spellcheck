import React from 'react'
import ReactDOM from 'react-dom'
import './query.sass'
import spelt from 'spelt/dist/index.js';
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
})

class InputBox extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			spellCheckList: [],
			query: this.props.defaultQuery || '',
			activeIndex: -1
		}
		this.inputHandler = this.inputHandler.bind(this)
		this.keyHandler = this.keyHandler.bind(this)
		this.keyUpHandler = this.keyUpHandler.bind(this)
	}
	render() {
		console.log('state query: ' + this.state.query)
		let wrongCount = 0
		let stringLength = 5 // left default position is 5px
		const corrections = this.state.spellCheckList.map( (c,qIndex) => {
			if ( !c.correct ) wrongCount += 1
			if ( qIndex > 0 ) stringLength += (this.state.spellCheckList[qIndex-1].raw.length*6 + 6)
			let list = c.corrections.map( (word,index) => {
				if ( index < 5) {
					let className = 'correction-word'
					if ( qIndex === this.state.spellCheckList.length - 1 && index === this.state.activeIndex ) {
						className = 'correction-word active'
					}
					return (
						<div 
							className={className}
							onClick={this.correctQuery.bind(this,qIndex,word.correction)}
						>{word.correction}</div>
					)
				}
			})
			return (
				<div className="corrections-list" style={{left: `${stringLength}px`}}> {list} </div>
			)
		})
		const wrongMsg = (
				<div id="msg-alert">
					You had better go back to learn the English
				</div>
			)
		if ( wrongCount >= 5 ) window.location.href = 'https://learnenglishkids.britishcouncil.org/zh-hant'
		return (
			<div id="query-box">
				<textarea
					id="q"
					className="form-control"
					rows="5"
					name="q" 
					placeholder="enter the keyword"
					value={this.state.query}
					onChange={this.inputHandler}
					onKeyDown={this.keyHandler}
					onKeyUp={this.keyUpHandler}
				>
				</textarea>
				<div className="results-container">
					{corrections}
				</div>
			</div>
		)
	}
	inputHandler(e) {
		if ( this.state.activeIndex < 0 ) {
			console.log('ㄚㄚ~~')
			this.setState({
				query: e.target.value
			})
			//fumc()
		
			const text = e.target.value.split('')
			const lastString = text[text.length - 1]
			if ( lastString === ' ' ) {
				//console.log(check(e.target.value.split(' ')[0]))
				let keywords = e.target.value.split(' ')
				keywords.pop(keywords.length-1) //remove the last element
				const results = keywords.map( (word,index) => {
					return check(word)
				})
				console.log(results)
				this.setState({
					spellCheckList: results
				})
			}
		}
	}
	correctQuery(index,correction) {
		console.log(index)
		console.log(correction)
		let query = this.state.query.split(" ")
		query[index] = correction
		query.pop(query.length - 1)
		console.log(query)
		let newQuery = ''
		query.forEach( (q,i) => {
			newQuery += (q + ' ') 
		})
		this.state.spellCheckList.pop(index)
		const spellCheckList = this.state.spellCheckList
		this.setState({
			query: newQuery,
			spellCheckList: spellCheckList
		})
	}
	keyHandler(e) {
		//console.log(e.keyCode)
		if( e.keyCode === 40 ) {
			let nowActiveIndex = this.state.activeIndex + 1
			//maker sure the similar words exits
			const lastCorrectionIndex = this.state.spellCheckList.length - 1
				//console.log(this.state.spellCheckList[lastCorrectionIndex])
			const corrections = this.state.spellCheckList[lastCorrectionIndex].corrections
			if ( corrections.length > 0 ) {
				let maxCorrections =  corrections.length > 5 ? 5 : corrections.length
				this.setState({
					activeIndex: nowActiveIndex > maxCorrections - 1 ? maxCorrections - 1 : nowActiveIndex 
				})
			}
		}
		if( e.keyCode === 38 ) {
			let nowActiveIndex = this.state.activeIndex - 1
			this.setState({
				activeIndex: nowActiveIndex < 0 ? 0 : nowActiveIndex 
			})
		}
		if ( e.keyCode === 13 ) {
			if ( this.state.activeIndex >= 0 ) {
				const lastCorrectionIndex = this.state.spellCheckList.length - 1
				//console.log(this.state.spellCheckList[lastCorrectionIndex])
				const correction = this.state.spellCheckList[lastCorrectionIndex].corrections[this.state.activeIndex].correction
				this.correctQuery(lastCorrectionIndex,correction)
			}
		}
	}
	keyUpHandler(e) {
		if ( e.keyCode === 13 && this.state.activeIndex >= 0 ) {
			this.setState({
				activeIndex: -1
			})
		}
	}
}

export default InputBox