//pasta parametrizada que recebe o usuario acredito que seja por isso que coloca em [] em vez de criar uma pag estatica para casa usuario
import { prisma } from "@/src/lib/auth/prisma";
import { Avatar, Heading, Text } from "@ignite-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { SheduleForm } from "./SheduleForm";
import { Container, UseHeader } from "./styles";

interface SheduleProps {
    name: string
    bio: string
    avatarUrl: string
}

export default function Shedule({ name, bio, avatarUrl }: SheduleProps) {//pega lá do await user e passa as info aqui p baixo essas info vem do return do props
    return (
        <>
            <NextSeo
                title={`Agendar com ${name} | Ignite Call`}
            />
            <Container>
                <UseHeader>
                    <Avatar src={avatarUrl} />
                    <Heading>{name}</Heading>
                    <Text>{bio}</Text>
                </UseHeader>

                <SheduleForm />

            </Container>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {//quando se tem uma pag statica com a de baixo tem que fazer esse metodo de paths
    return {
        paths: [],// n quer q gere nenhuma pag, só quando alguem acessar q vai ser gerado
        fallback: 'blocking'//caso o usuario tente acessa uma pag q ela n foi gerada de uma forma direta ele bloqueia
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {//pag estatica se usa o params nao o req ou res, sempre executa do lado do servidor
    const username = String(params?.username)//pega da parte do link do username

    const user = await prisma.user.findUnique({//fez uma chamada do banco de dados p verificar se tem usuario
        where: {
            username
        }
    })
    if (!user) { // se n tiver user retorna erro 404
        return {
            notFound: true
        }
    }

    return {// se tiver user faço isso
        props: {
            name: user.name, // pega do banco de dados
            bio: user.bio,
            avatar_url: user.avatar_url
        },
        revalidate: 60 * 60 * 24 //1 dia caso o usuario troque de img atualiza a kd dia
    }

}