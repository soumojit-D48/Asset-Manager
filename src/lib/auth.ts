import {betterAuth, email} from 'better-auth'
import {drizzleAdapter} from 'better-auth/adapters/drizzle'
import { db } from './db'
import {admin} from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'

const adminRole = 'admin'
const userRole = 'user'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg'
    }),

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            mapProfileToUser: (profile) => {
                return {
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: userRole  // any user logged in they will be normal user
                    // role: adminEmails.includes(profile.email) ? "admin" : "user"
                    // by default 
                }
            }
        }
    },

    plugins: [
        admin({
            adminRoles: [adminRole], // (property) adminRoles: string[]
            defaultRole: userRole  // (property) defaultRole: string
        }),
        nextCookies()
    ]
})
