import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IConversation extends Document {
    type: string;
    name: string;
    createdBy: Types.ObjectId;
    lastMessageId?: Types.ObjectId;
    lastMessage?: string;
    lastMessageAt?: Date;
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
        },
        
        lastMessage: {
            type: String,
        },
        
        lastMessageAt: {
            type: Date,
        }
        
    },
    { timestamps: true }
);

export const Conversation = mongoose.model<IConversation>('conversation', conversationSchema);