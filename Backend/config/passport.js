import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import Customer from '../Models/Customer.js';

const passportConfig = (passport) => {
    // --- GOOGLE STRATEGY ---
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://hotelapp-tiof.onrender.com/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check karo ki user pehle se hai (Email ya GoogleId se)
            let customer = await Customer.findOne({ 
                $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] 
            });

            if (customer) {
                // Agar user pehle se hai par Google ID link nahi thi (Manual Signup tha)
                if (!customer.googleId) {
                    customer.googleId = profile.id;
                    customer.profilePic = profile.photos[0].value;
                    await customer.save();
                }
                return done(null, customer);
            }

            // Naya customer create karo
            customer = await Customer.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                profilePic: profile.photos[0].value
            });
            done(null, customer);
        } catch (err) {
            done(err, null);
        }
    }));

  /*  // --- FACEBOOK STRATEGY ---
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/api/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'emails', 'photos']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let customer = await Customer.findOne({ 
                $or: [{ facebookId: profile.id }, { email: profile.emails[0].value }] 
            });

            if (customer) {
                if (!customer.facebookId) {
                    customer.facebookId = profile.id;
                    customer.profilePic = profile.photos[0].value;
                    await customer.save();
                }
                return done(null, customer);
            }

            customer = await Customer.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                facebookId: profile.id,
                profilePic: profile.photos[0].value
            });
            done(null, customer);
        } catch (err) {
            done(err, null);
        }
    }));*/
};

export default passportConfig;