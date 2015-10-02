// This component is used generically for crud forms on any resource.

import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import Static from './../general/static.jsx';
import Form from './../form/root.jsx';
import Loading from './../general/loading.jsx';

import Base from './base.js';
import BaseStatusModal from './base_status_modal.js';

class SaveBaseModal extends BaseStatusModal {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
	}


	/*
	 *
	 *
	 */
	renderSuccessContent() {
		var resourceName = this.props.model.name;
		return (
			<div>
				<p className='title'>Save successful</p>
				<ul>
					{ this.renderLinks() }
				</ul>
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderFailureContent() {
		return (
			<div>
				<p className='title'>Save failed</p>
				<ul>
					<li><a className='link' onClick={this.reactivateForm.bind(this)} href='/'>Keep Editing</a></li>
				</ul>
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderPendingContent() {
		return (
			<div>
				<p className='title'>Saving...</p>
			</div>
		);
	}

}



/*
 *
 *
 */
class SaveBase extends Base {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
		this.state = {
			model: undefined,
			saveResponseStatus: undefined
		};
	}

	/*
	 *
	 *
	 */
	render() {
		var style = { 'overflow-y': 'scroll' };
		return (
			<div className='atl'>
				<div className='atl__main fill-parent' style={style} onScroll={ this.setStickyPageNav.bind(this) }>
					{ this.renderTitleBar('solid') }
					{ this.renderContentBar() }
				</div>
				{ this.renderModal() }
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderModal() {
		if (this.state.saveResponseStatus) {
			return (
				<SaveBaseModal
					model={this.state.model}
					status={this.state.saveResponseStatus}
					reactivateForm={this.reactivateForm.bind(this)}
				/>
			);
		}
	}


	/*
	 *
	 *
	 */
	renderTitleBarContent() {
		return (
			<div className="atl__title-bar__content">
				<h1 className='title'>{ `${this.getCrudMethodName()} ${this.getResourceName()}` }</h1>
				<ul>
					<li>Updated: {  }</li>
				</ul>
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderPageNavContent() {
		return (
			<div>
				<p>Later on, we can put things here that help navigate the entry form.</p>
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderPageContent() {
		var isFormEnabled = (this.state.saveResponseStatus == null);
		if (!this.state.model) { return (<Loading />); }
		return (
			<div className="static-content">
				<Form 
					model={ this.state.model }
					isEnabled={ isFormEnabled }
					submitButtonText={ this.getSubmitButtonText() }
					onSubmit={ this.saveModel.bind(this) }
				/>
			</div>
		);
	}


	// Define on subclass.
	componentWillMount() {
		// obtain project model, either by creating a new one or fetching one from the db
	}

	// Define on subclass.
	getCrudMethodName() {
		return 'new';
	}

	// Define on subclass.
	getSubmitButtonText() {
		return 'Submit';
	}

	// Define on subclass.
	saveModel(formData) {

		var model = this.state.model;

		// Set status to pending.
		this.setState({ saveResponseStatus: 'pending' });

		// Call before save method on the model.
		model.beforeSave();

		// While pending, save form data using the instance method on the model.
		model.getClientSavePromise().then((res) => {
			res = JSON.parse(res);
			model.set('id', res.id);
			this.setState({ saveResponseStatus: res.status });
		}, (err) => { this.setState({ saveResponseStatus: 'error' }); 
		});

	}



	/*
	 *
	 *
	 */
	reactivateForm() {
		this.setState({ saveResponseStatus: undefined });
	}

}

export default SaveBase;