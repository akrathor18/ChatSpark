import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    content: string;
    status: "sent" | "delivered" | "read";
    createdAt: Date;
    updatedAt: Date;
}


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
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["sent", "delivered", "read"],
            default: "sent"
        },

    },
    {
        timestamps: true
    },
)

export const Message = mongoose.model<IMessage>("Message", messageSchema);