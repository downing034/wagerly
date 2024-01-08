import mongoose from 'mongoose';
import { Password } from '../services/password';

// an interface that describes the properties that
// are required to create a new user, so typescript
// can keep validation checks for us.
interface UserAttrs {
  email: string;
  password: string;
}

// an interface that describes the properties that
// a user model has (so we can override the base build function)
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
};

// an interface that describes the properties that
// a user document has (so we can override the base build function)
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
};

const userSchema = new mongoose.Schema(
  {
    email: {
      // this mongoose db specific, not typescript
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
  },
  {
    toJSON: {
      // tell mongoose how to return our 'document' as JSON
      // doc: mongoose doc which is getting converted
      // ret: plain object representation of what's been converted
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// add to statics so we can override the build function
// withour custom typescript validating build function
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };