import { Heading, Text } from '@ignite-ui/react'
import Image from 'next/image'
import { Container, Hero, Preview } from './styles'

import previewImage from '../../assets/app-preview.png'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'
import { NextSeo } from 'next-seo'

export default function Home() {
    return (
        <>
            <NextSeo
                title="Descomplique sua agenda | Ignite Call"
                description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
            />
            <Container>
                <Hero>
                    <Heading as='h1' size='4xl'>Agendamento descomplicado</Heading>
                    <Text size='xl'>
                        Conecte seu calendário e permite as pessoas marquem agendamentos
                        no seu tempo livre.
                    </Text>

                    <ClaimUsernameForm />

                </Hero>

                <Preview>
                    <Image
                        src={previewImage}
                        height={400} //tam max da img a ser exibida
                        quality={100}// por padrao next faz 80% de qual da img, colocou 100% da qual
                        priority
                        alt='Calendário'
                    />
                </Preview>
            </Container>
        </>
    )
}
