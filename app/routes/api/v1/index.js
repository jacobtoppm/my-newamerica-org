import express from 'express'

import deleteMiddleware from './../../../middleware/crud/delete.js'
import newMiddleware from './../../../middleware/crud/new.js'
import updateMiddleware from './../../../middleware/crud/update.js'
import showMiddleware from './../../../middleware/crud/show.js'
import indexMiddleware from './../../../middleware/crud/index.js'

import {ensureAuthenticated, ensureNothing, ensureAdminAuthenticated} from './../../../middleware/auth.js'

const resources = [
  'staff_members',
  'resources',
  'weekly_wins',
  'faqs',
  'readmes',
  'departments',
  'floors',
  'passwords'
]

// Unsafe setting to test back-end while in development, skipping the auth step which is required at each server restart.
const currentAuthMiddleware = (process.NODE_ENV === 'production') ? ensureAuthenticated : ensureNothing
const currentAdminAuthMiddleware = (process.NODE_ENV === 'production') ? ensureAdminAuthenticated : ensureNothing

const router = express.Router()

for (let resource of resources) {
  const basePath = `/${resource}`

  router.get(basePath, currentAuthMiddleware, indexMiddleware.bind(this, {dbCollectionName: resource}), (req, res) => {
    res.json(req.dbResponse)
  })

  router.get(`${basePath}/:id`, currentAuthMiddleware, showMiddleware.bind(this, {dbCollectionName: resource}), (req, res) => {
    res.json(req.dbResponse)
  })

  router.post(`${basePath}`, currentAdminAuthMiddleware, newMiddleware.bind(this, {dbCollectionName: resource}), (req, res) => {
    res.json(req.dbResponse)
  })

  router.post(`${basePath}/:id/edit`, currentAdminAuthMiddleware, updateMiddleware.bind(this, {dbCollectionName: resource}), (req, res) => {
    res.json(req.dbResponse)
  })

  router.delete(`${basePath}/:id`, currentAdminAuthMiddleware, deleteMiddleware.bind(this, {dbCollectionName: resource}), (req, res) => {
    res.json(req.dbResponse)
  })
}

export default router
