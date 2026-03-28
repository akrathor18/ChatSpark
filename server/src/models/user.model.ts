import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    username: string;
    password?: string;
    avatar?: string;
    provider: "local" | "google" | "github";
    isOnline: boolean;
    lastSeen?: Date;
    createdAt: Date;
    updatedAt: Date;

    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
            maxlength: 20,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: function () {
                return this.provider === "local";
            },
        },

        avatar: {
            type: String,
        },

        provider: {
            type: String,
            enum: ["local", "google", "github"],
            default: "local",
        },

        isOnline: {
            type: Boolean,
            default: false,
        },

        lastSeen: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password
userSchema.pre("save", async function (this: IUser) {
    if (!this.isModified("password") || !this.password) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//  Compare password
userSchema.methods.comparePassword = async function (
    candidatePassword: string
) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);