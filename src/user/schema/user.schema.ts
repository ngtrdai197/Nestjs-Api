import { Schema } from 'mongoose'
import { compareSync, hashSync, genSaltSync } from 'bcrypt'

export const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    roles: {
      type: [String],
      default: 'user',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (obj, ret) => {
        delete ret._id, delete ret.__v
      },
    },
  },
)

UserSchema.pre('save', async function(next) {
  const user: any = this
  if (!this.isModified('password')) {
    return next()
  }
  try {
    const salt = await genSaltSync(10)
    user.password = await hashSync(user.password, salt)
    await next()
  } catch (error) {
    await next(error)
  }
})
