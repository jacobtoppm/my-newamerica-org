import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'

import SaveBase from './save_base.js'

class EditBase extends SaveBase {

  constructor (props) {
    super(props)
    this.state = {
      saveResponseStatus: undefined
    }
  }

  getCrudMethodName () { return 'edit' }

  componentWillMount () {
    if (!this.state.model) {
      this.fetchModel()
    }
  }

  fetchModel () {
    if (!this.props.params) { return }
    var id = this.props.params.id
    var Model = this.getResourceConstructor()
    var model = new Model({ id: id })
    model.getClientFetchPromise({ id: id }).then((model) => {
      this.setState({ model: model })
    }).catch((err) => { console.log(err.stack) })
  }

  saveModel () {
    var { model } = this.state

    this.setState({
      saveResponseStatus: 'pending'
    })

    model.getClientUpdatePromise().then((res) => {
      res = JSON.parse(res)
      this.setState({ saveResponseStatus: res.status })
    }, (err) => {
      this.setState({ saveResponseStatus: 'error' })
    })
  }

}

export default EditBase
