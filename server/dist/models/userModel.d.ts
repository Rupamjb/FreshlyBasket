import mongoose, { Document } from 'mongoose';
export interface IAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
}
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    addresses?: IAddress[];
    createdAt: Date;
    updatedAt: Date;
    isPasswordMatch(enteredPassword: string): Promise<boolean>;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default User;
