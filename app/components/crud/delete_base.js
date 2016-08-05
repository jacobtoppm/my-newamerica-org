import React from 'react';
import {Link} from 'react-router';
import _ from 'underscore';

import Static from './../general/static.jsx';
import Loader from './../general/loader.jsx';

import Base from './base.js';
import BaseStatusModal from './base_status_modal.js';


class FormModal extends BaseStatusModal {

  renderSuccessContent() {
    var resourceName = this.props.model.resourceName;
    return (
      <div>
        <p className='title'>Delete successful</p>
        { this.renderLinks() }
      </div>
    )
  }

  renderFailureContent() {
    var resourceName = this.props.model.resourceName;
    return (
      <div>
        <p className='title'>Delete failed</p>
        { this.renderLinks() }
      </div>
    )
  }

  renderPendingContent() {
    return (
      <div>
        <p className='title'>Deleting...</p>
      </div>
    )
  }

  renderLinks() {
    var resourceName = this.props.model.resourceName;
    return (
      <ul>
        <li><a className='link' href={this.props.model.getIndexUrl()}>View Resources</a></li>
      </ul>
    )
  }

}


class DeleteBase extends Base {

  constructor(props) {
    super(props)
    this.state = { saveResponseStatus: undefined }
  }

  render() {
    return (
      <div className='atl atl--explainer'>
        <div className='atl__main fill-parent' onScroll={ this.setStickyPageNav.bind(this) }>
          { this.renderTitleBar('solid') }
          { this.renderContentBar() }
        </div>
        { this.renderModal() }
      </div>
    );
  }

  renderModal() {
    if (this.state.saveResponseStatus) {
      return (
        <FormModal
          model={this.state.model}
          status={this.state.saveResponseStatus}
          reactivateForm={this.reactivateForm.bind(this)}
        />
      );
    }
  }

  renderTitleBarContent() {
    return (
      <div className='atl__title-bar__content'>
        <h1 className='title'>{ `Delete ${this.getResourceName()}` }</h1>
        <ul>
          <li>
						{this.renderViewLink()}
            {this.renderEditLink()}
          </li>
        </ul>
      </div>
    );
  }

  renderViewLink() {
    if (!this.state.model) { return null; }
    const url = this.state.model.getViewUrl();
		if (!url) { return null; }
		return (
			<Link className="icon-button" to={url} target="_blank">
				<div className="icon-button__icon bg-img-link--off-white"></div>
				<div className="icon-button__text">{ `View ${this.getResourceName()}` }</div>
			</Link>
		);
  }

  renderEditLink() {
		if (!this.state.model) { return null; }
    const url = this.state.model.getEditUrl();
		if (!url) { return null; }
		return (
			<Link className="icon-button" to={url} target="_blank">
				<div className="icon-button__icon bg-img-link--off-white"></div>
				<div className="icon-button__text">{ `Edit ${this.getResourceName()}` }</div>
			</Link>
		);
  }

  renderPageNavContent() {
    return (
      <div>
        <p>I navigate the page!</p>
      </div>
    );
  }

  renderPageContent() {
    var bulk = this.state.model ? this.renderSummary() : <Loader />
    return (
      <div className="static-content">
        { bulk }
      </div>
    );
  }

  renderSummary() {
    return (
      <div>
        <p>You are about to irreversibly delete this project. You may be able to get it back from the database backups, but I sure would not count on that.</p>
        <p>Remember, you can always make the project invisible to the public by visiting its edit link.</p>
        <p>If you are still positive, hit the link below:</p>
        <a onClick={this.handleDeleteClick.bind(this)} href='#' className='link'>Sure?</a>
      </div>
    );
  }

  reactivateForm() {
    this.setState({ saveResponseStatus: undefined })
  }

  componentDidMount() {
    if(!this.state.model) { this.fetchModel() }
  }

  fetchModel() {
    if (!this.props.params) { return; }
    const {id} = this.props.params;
    const Model = this.getResourceConstructor();
    let model = new Model({id: id});
    model.getClientFetchPromise().then((model) => {
      this.setState({model: model});
    }).catch((err) => {
			console.log(err.stack);
		});
  }

  handleDeleteClick(e) {
    e.preventDefault();
    this.deleteModel();
  }

  deleteModel() {

    var { model } = this.state

    this.setState({ saveResponseStatus: 'pending' })

    model.getClientDeletePromise().then((res) => {
      if (!_.isObject(res)) {
        res = JSON.parse(res);
      }
      this.setState({ saveResponseStatus: res.status })
    }, (err) => {
      this.setState({ saveResponseStatus: 'error' })
    })

  }

}


export default DeleteBase
