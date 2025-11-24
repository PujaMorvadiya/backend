import User from '@/sequelizeDir/models/user.model';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { JWT_SECRET } from '../config';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload: any, done) => {
    try {
      const user = await User.findOne({ where: { id: jwt_payload.id }, raw: true });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
