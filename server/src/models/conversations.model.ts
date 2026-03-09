import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  type: string;
  name: string; 
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    type: { 
        type: String,
        enum: ['private', 'group'],
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const conversation = mongoose.model<IConversation>('conversation', conversationSchema);