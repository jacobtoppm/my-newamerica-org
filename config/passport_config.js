import passport from 'passport'
import { OAuth2Strategy } from 'passport-google-oauth'
import { Model, Collection } from './../app/models/user.js'
import express from 'express'

// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var { NODE_ENV, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env

var callbackUrlBase = (NODE_ENV === 'development') ? '127.0.0.1:3000' : 'my.newamerica.org'
var callbackUrl = `http://${callbackUrlBase}/auth/google/callback`

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function (user, done) {
  done(null, { id: user.id })
})

passport.deserializeUser(function (obj, done) {
  var model = new Model({ id: obj.id })
  model.getRetrievePromise().then((model) => {
    done(null, model.toClientJSON())
  }).catch((err) => {
    console.log(err.stack)
    console.log('Could not deserialize')
  })
})

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new OAuth2Strategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: callbackUrl
},
    function (accessToken, refreshToken, profile, done) {
      profile._json.accessToken = accessToken

      var model = new Model(profile._json)

      var msg = 'Please log into your newamerica.org as your primary account. We are working on a more robust solution to handle multiple Google logins for more convenient access to the site.'

      if (!model.isDomainAuthorized()) {
        return done(null, false, { message: msg })
      }

      if (model.isAdmin()) {
        model.set('isAdmin', true)
      } else {
        model.set('isAdmin', false)
      }

      model.getSavePromise().then(() => {
        return done(null, model.toSessionJSON())
      })
            .catch((err) => { return done(err) })
    }
))
