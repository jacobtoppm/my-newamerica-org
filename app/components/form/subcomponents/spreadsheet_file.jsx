import React from 'react';
import Base from './base.jsx';
import Loader from './../../general/loader.jsx';

class SpreadsheetFile extends Base {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
		this.state = {
			isParserLoaded: false
		};
	}


	/*
	 *
	 *
	 */
	render() {
		if (!this.state.isParserLoaded) { return (<Loader />); }
		return (
			<div className='form__wrapper'>
				<label for={this.props.id}>{ this.props.labelText }</label>
				{ this.renderSummary() }
				<p className='form__hint'>{ this.props.hint }</p>
				<input 
					ref='input' 
					onChange={this.saveDataOnParent.bind(this)} 
					type='file'
					disabled={!this.props.isEnabled}
					name={this.props.id} 
					id={this.props.id} 
					placeholder={this.props.placeholder} 
				/>
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderSummary() {
		if (this.props.initialValue) {
			return (
				<p>Data currently available.</p>
			);
		}
	}


	/*
	 *
	 *
	 */
	componentDidMount() {
		$().ensureScript('XLSX', '/assets/vendor/js-xlsx-standalone.js', () => {
			this.setState({ isParserLoaded: true });
		});
	}


	/*
	 *
	 *
	 */
	parseWorkBook(workbook) {
		var obj = {};
		for (let sheetName in workbook.Sheets) {
			let sheet = workbook.Sheets[sheetName];
			let newSheetName = sheetName.toLowerCase().replace(/ /g, '_');
			obj[newSheetName] = XLSX.utils.sheet_to_json(sheet, { raw: true });
		}
		console.log(obj);
		return obj;
	}


	/*
	 * Use HTML5 FileReader API.
	 *
	 */
	saveDataOnParent(e) {

		var file = e.target.files[0];
		var reader = new FileReader();

		reader.onload = () => {
			var bstr = reader.result;
			var workbook = XLSX.read(bstr, { type: 'binary' });
			this.props.saveDataOnParent({
				id: this.props.id,
				value: this.parseWorkBook(workbook)
			});
		};

		reader.readAsBinaryString(file);

	}

}

export default SpreadsheetFile;