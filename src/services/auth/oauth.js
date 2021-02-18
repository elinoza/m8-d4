const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const AuthorSchema = require("../authors/schema")
const { authenticate } = require("./tools")

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:3005/authors/googleRedirect",
    },
    async (request, accessToken, refreshToken, profile, next) => {
     

      try {
        const user = await AuthorSchema.findOne({ googleId: profile.id })

        if (user) {
          const tokens = await authenticate(user)
          next(null, { user, tokens })
        } else {
        const newUser = {
                googleId: profile.id,
                name: profile.name.givenName,
                surname: profile.name.familyName,
                email: profile.emails[0].value,
                img:profile.picture
                // refreshToken:[]
           }
          const createdUser =  new AuthorSchema(newUser)
          await createdUser.save()
          const tokens = await authenticate(createdUser)
          
          next(null, { user: createdUser, tokens })
        }
      } catch (error) {
          console.log(error)
        next(error)
      }
    }
  )
)

passport.serializeUser(function (user, next) {
  next(null, user)
})