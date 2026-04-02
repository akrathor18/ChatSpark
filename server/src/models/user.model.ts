import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    username: string;
    previousUsernames: [String];
    password?: string;
    avatar?: string;
    avatarId?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    provider: "local" | "google" | "github";
    isOnline: boolean;
    lastSeen?: Date;
    notificationSettings: {
        notifications: boolean;
        emailNotifications: boolean;
    };
    privacySettings: {
        showOnlineStatus: boolean;
        readReceipts: boolean;
    };
    bio?: string;
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
            sparse: true,
            unique: true,
            minlength: 3,
            maxlength: 20,
            lowercase: true,
            trim: true,
        },
        previousUsernames: {
            type: [String],
            default: [],
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
        avatarId: {
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
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
        notificationSettings: {
            notifications: {
                type: Boolean,
                default: true,
            },
            emailNotifications: {
                type: Boolean,
                default: true,
            },
        },
        privacySettings: {
            showOnlineStatus: {
                type: Boolean,
                default: true,
            },
            readReceipts: {
                type: Boolean,
                default: true,
            },
        },
        bio: {
            type: String,
            default: "",
            maxlength: 200,
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