import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { PrismaAdapter } from '../../../lib/auth/prisma-adapter'

export function buildNextAuthOptions(
    req: NextApiRequest | NextPageContext['req'],
    res: NextApiResponse | NextPageContext['res']
): NextAuthOptions {

    return {
        adapter: PrismaAdapter(req, res),//chama a função adapter

        providers: [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID ?? '',
                clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
                authorization: {//permissoes do google
                    params: {
                        prompt: 'consent',
                        access_type: 'offline',
                        response_type: 'code',
                        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar'
                    }
                },
                profile(profile: GoogleProfile) {//acessar foto do profile 
                    return {
                        id: profile.sub,
                        name: profile.name,
                        username: '',
                        email: profile.email,
                        avatar_url: profile.picture
                    }
                }
            }),
        ],

        callbacks: {
            async signIn({ account }) {//momento que usuario entrou
                if (!account?.scope?.includes('https://www.googleapis.com/auth/calendar')) {//se n der permissao do calendar
                    return 'register/connect-calendar/?error=permissions'//retorna erro
                }
                return true // retorna true
            },
            async session({ session, user }) {// retorna tudo dentro de session e user p olhar no console.log(session) front end
                return {
                    ...session,
                    user
                }
            }
        }
    }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    return await NextAuth(req, res, buildNextAuthOptions(req, res))
}