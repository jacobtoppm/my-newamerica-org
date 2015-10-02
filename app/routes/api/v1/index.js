import express from 'express';

import authMiddleware from './../../../middleware/auth.js';
import deleteMiddleware from './../../../middleware/crud/delete.js';
import newMiddleware from  './../../../middleware/crud/new.js';
import updateMiddleware from './../../../middleware/crud/update.js';
import showMiddleware from './../../../middleware/crud/show.js';
import indexMiddleware from './../../../middleware/crud/index.js';

var resources = [ 'staff_member', 'resource', 'weekly_win', 'faq', 'readme' ];

var router = express.Router();

// Unsafe setting to test back-end while in development, skipping the auth step which is required at each server restart.
var currentAuthMiddleware = (process.NODE_ENV === 'production') ? authMiddleware.ensureAuthenticated : authMiddleware.ensureNothing;

for (let resource of resources) {

	router.get(`/${resource}s`, indexMiddleware.bind(this, { dbCollectionName: `${resource}s` }), (req, res) => {
		res.json(req.dbResponse);
	});

}

// router.get('/:id', showMiddleware.bind(this, { dbCollectionName: 'images' }), (req, res) => {
// 	res.json(req.dbResponse);
// });

// // authenticated requests
// router.post('/:id/edit', currentAuthMiddleware, updateMiddleware.bind(this, { dbCollectionName: 'images' }), (req, res) => {
// 	res.json(req.dbResponse);
// });

// router.post('/new', currentAuthMiddleware, newMiddleware.bind(this, { dbCollectionName: 'images' }), (req, res) => {
// 	res.json(req.dbResponse);
// });

// router.delete('/:id', currentAuthMiddleware, deleteMiddleware.bind(this, { dbCollectionName: 'images' }), (req, res) => {
// 	res.json(req.dbResponse);
// });

module.exports = router;