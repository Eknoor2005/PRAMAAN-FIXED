import admin from 'firebase-admin';
import { UserModel } from '../models/User.js';
import { EncryptionService } from './encryption.service.js';

export class FirebaseService {
  static async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new Error(`Failed to verify Firebase token: ${error}`);
    }
  }

  static async createOrUpdateUser(
    firebaseUid: string,
    email: string,
    firstName: string,
    lastName: string,
    authMethod: 'firebase' | 'google' | 'github',
    photoURL?: string
  ) {
    try {
      // Check if user already exists with this firebaseUid
      let user = await UserModel.findOne({ firebaseUid });

      if (user) {
        // Update existing user
        user.lastLogin = new Date();
        if (!user.linkedAuthMethods.includes(authMethod)) {
          user.linkedAuthMethods.push(authMethod);
        }
        await user.save();
        return user;
      }

      // Check if user exists with this email
      user = await UserModel.findOne({ email: email.toLowerCase() });

      if (user) {
        // Link Firebase to existing account
        user.firebaseUid = firebaseUid;
        user.authMethod = authMethod;
        user.linkedAuthMethods.push(authMethod);
        user.lastLogin = new Date();
        await user.save();
        return user;
      }

      // Create new user
      const { publicKey, privateKeyEncrypted } = await EncryptionService.generateKeyPair();

      const newUser = new UserModel({
        email: email.toLowerCase(),
        password: '', // Firebase handles password
        firstName: firstName || 'User',
        lastName: lastName || '',
        firebaseUid,
        authMethod,
        linkedAuthMethods: [authMethod],
        publicKey,
        privateKeyEncrypted,
        encryptionAlgorithm: 'rsa-2048',
        isEmailVerified: true, // Firebase handles email verification
        role: 'survivor',
        lastLogin: new Date(),
      });

      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error(`Failed to create/update Firebase user: ${error}`);
    }
  }

  static async linkAuthMethod(
    userId: string,
    firebaseUid: string,
    authMethod: 'firebase' | 'google' | 'github'
  ) {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          $addToSet: { linkedAuthMethods: authMethod },
          firebaseUid: firebaseUid,
        },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to link auth method: ${error}`);
    }
  }

  static async getUserByFirebaseUid(firebaseUid: string) {
    try {
      return await UserModel.findOne({ firebaseUid });
    } catch (error) {
      throw new Error(`Failed to get user by Firebase UID: ${error}`);
    }
  }

  static async generateCustomToken(userId: string) {
    try {
      const customToken = await admin.auth().createCustomToken(userId);
      return customToken;
    } catch (error) {
      throw new Error(`Failed to generate custom token: ${error}`);
    }
  }
}
