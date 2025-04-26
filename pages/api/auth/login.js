import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Hunter Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { client, db } = await connectToDatabase();
        
        try {
          const hunter = await db.collection('hunters').findOne({
            email: credentials.email
          });

          if (!hunter) {
            throw new Error('No hunter found with that email!');
          }

          const isValid = await verifyPassword(
            credentials.password,
            hunter.password
          );

          if (!isValid) {
            throw new Error('Password is incorrect!');
          }

          return {
            id: hunter._id.toString(),
            email: hunter.email,
            name: hunter.hunterName,
            username: hunter.username
          };
        } catch (error) {
          throw new Error(error.message);
        } finally {
          client.close();
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
});
