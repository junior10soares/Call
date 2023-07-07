import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { signIn, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ArrowRight, Check } from "phosphor-react";
import { Container, Header } from "../styles";
import { AuthError, ConnectBox, ConnectItem } from "./styles";

export default function ConnectCalendar() {

    const session = useSession()//inf do login do usuario

    const router = useRouter()

    const hasAuthError = !!router.query.error //se existir true se nao false

    const isSignedIn = session.status === "authenticated" // usuario conectado

    async function handleConnectCalendar() {
        await signIn('google')
    }

    async function handleNavigateToNextStep() {
        await router.push('/register/time-intervals')
    }

    return (
        <>
            <NextSeo
                title="Conecte sua agenda do Google | Ignite Call" noindex />
            <Container>
                <Header>
                    <Heading as='strong'>Conect sua agenda!</Heading>
                    <Text>
                        Conecte seu calendário para verificar automaticamente as horas
                        ocupadas e os novos eventos a medida em que são agendados.
                    </Text>

                    <MultiStep size={4} currentStep={2} //4 etapas e começa na primeira
                    />
                </Header>

                <ConnectBox>
                    <ConnectItem>
                        <Text>Google Calendary</Text>
                        {
                            isSignedIn ? (//se o usuario estiver logado
                                <Button size='sm' disabled>
                                    Conectado
                                    <Check />
                                </Button>
                            ) : (//se nao mostra esse
                                <Button variant='secondary' size='sm' onClick={handleConnectCalendar}>
                                    Conectar
                                    <ArrowRight />
                                </Button>
                            )
                        }
                    </ConnectItem>

                    {hasAuthError && (//se tiver erro
                        <AuthError size='sm'>
                            Falha ao conectar no Google, verifique se voce habilitou as
                            permissões de acesso ao Google Calendar.
                        </AuthError>
                    )}

                    <Button
                        onClick={handleNavigateToNextStep}
                        type="submit"
                        disabled={!isSignedIn}>
                        Próximo passo
                        <ArrowRight />
                    </Button>
                </ConnectBox>
            </Container>
        </>
    )
}