import React from 'react';

class Modal extends React.Component {

	/*
	 *
	 *
	 */
	render() {
		return (
			<div className='modal'>
				<div className='modal__window bg-c-off-white'>
					<div className='modal__content'>
						{ this.renderContent() }
					</div>
				</div>
			</div>
		);
	}


	/*
	 * Customize on subclass.
	 *
	 */
	renderContent() {
		return (
			<p>It is not nice to leave a model empty.</p>
		);
	}

}

export default Modal;