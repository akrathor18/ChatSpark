import mongoose, {
    Document,
    Schema,
    Types,
} from "mongoose";

interface IEncryptedContent {
    cipherText: string;
    iv: string;
    authTag: string;
    keyVersion?: number;
}

export interface IMessage extends Document {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;

    content: IEncryptedContent;

    status: "sent" | "delivered" | "read";

    replyTo?: Types.ObjectId;

    isUnsent: boolean;

    deletedFor: Types.ObjectId[];

    createdAt: Date;
    updatedAt: Date;
}

const encryptedContentSchema =
    new Schema<IEncryptedContent>(
        {
            cipherText: {
                type: String,
                required: true,
            },

            iv: {
                type: String,
                required: true,
            },

            authTag: {
                type: String,
                required: true,
            },

            keyVersion: {
                type: Number,
                default: 1,
            },
        },
        {
            _id: false,
        }
    );

const messageSchema = new Schema<IMessage>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },

        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        content: {
            type: encryptedContentSchema,
            required: true,
        },

        status: {
            type: String,
            enum: ["sent", "delivered", "read"],
            default: "sent",
        },

        replyTo: {
            type: Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },

        isUnsent: {
            type: Boolean,
            default: false,
        },

        deletedFor: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Message =
    mongoose.model<IMessage>(
        "Message",
        messageSchema
    );