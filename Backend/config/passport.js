import GoogleStrategy from 'passport-google-oauth20';
import Customer from '../Models/Customer';
module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    const newCustomer = {
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      profilePic: profile.photos[0].value
    };

    try {
      let customer = await Customer.findOne({ email: newCustomer.email });
      if (customer) {
        // Agar user pehle se hai, toh login karado
        done(null, customer);
      } else {
        // Naya user hai toh create karo
        customer = await Customer.create(newCustomer);
        done(null, customer);
      }
    } catch (err) {
      console.error(err);
    }
  }));
};