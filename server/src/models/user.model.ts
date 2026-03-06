import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        avatar: {
            type: String
        },

        isOnline: {
            type: Boolean,
            default: false
        },

        lastSeen: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model<IUser>("User", userSchema);