import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IConversation extends Document {
    type: string;
    name: string;
    createdBy: Types.ObjectId;
    lastMessageId?: Types.ObjectId;

    updatedAt: Date;
}

const conversationSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["direct", "group"],
            required: true
        },
        name: String,
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        lastMessageId: {
            type: Schema.Types.ObjectId,
            ref: "Message"
        }
    },
    { timestamps: true }
);

export const Conversation = mongoose.model<IConversation>('conversation', conversationSchema);