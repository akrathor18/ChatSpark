import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IConversation extends Document {
    conversationId: Types.ObjectId;
    userId: Types.ObjectId;
    role: 'admin' | 'member';
    joinedAt: Date;
}

const conversationMemberSchema = new Schema<IConversation>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'member'],
            required: true
        }
    }, {
    timestamps: true
});

export const ConversationMember = mongoose.model<IConversation>('ConversationMember', conversationMemberSchema);