import { api } from "@/src/lib/auth/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { AxiosError } from "axios";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ArrowRight } from "phosphor-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Container, Form, FormError, Header } from "./styles";

const registerFormSchema = z.object({
    username: z.string()
        .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
        .regex(/^([a-z\\-]+)$/i, {
            message: 'O usuário pode ter apenas letras e hifens'
        })
        .transform((username) => username.toLocaleLowerCase()),
    name: z.string().min(3, { message: 'O nome precisa ter pelo menos 3 letras.' })
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {

    const {
        register,
        handleSubmit,
        setValue,//coloca o valor do campo digitado automaticamente do username digitado no input usuario
        formState: { errors, isSubmitting } //isSubmiit quando o botao for click ele disabled
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema)
    })

    const router = useRouter()

    useEffect(() => { //se a pessoa digitar no campo da url outro username o campo do input atualiza automaticamente
        if (router.query.username) {
            setValue('username', String(router.query.username))
        }
    }, [router.query?.username, setValue])

    async function handleRegister(data: RegisterFormData) {
        try {
            await api.post('/users', { //post porque esta criando 
                name: data.name,
                username: data.username
            })

            await router.push('/register/connect-calendar') // entra em outra pag

        } catch (err) {
            if (err instanceof AxiosError && err?.response?.data?.message) {
                alert(err.response.data.message)
                return
            }
            console.error(err)
        }
    }

    return (
        <>
            <NextSeo
                title="Crie uma conta | Ignite Call"
            />
            <Container>
                <Header>
                    <Heading as='strong'>Bem vindo ao Ignite Call!</Heading>
                    <Text>
                        Precisamos de algumas informações para criar seu perfil! Ah, você pode
                        editar essas informações depois
                    </Text>

                    <MultiStep size={4} currentStep={1} //4 etapas e começa na primeira
                    />
                </Header>
                <Form as='form' onSubmit={handleSubmit(handleRegister)}>
                    <label>
                        <Text size='sm'>Nome do usuário</Text>
                        <TextInput
                            prefix="ignite.com/"
                            placeholder="seu-usuário"
                            {...register('username')}
                        />
                        {errors.username && (//se for username coloca a message
                            <FormError size='sm'>{errors.username.message}</FormError>
                        )}
                    </label>

                    <label>
                        <Text size='sm'>Nome completo</Text>
                        <TextInput
                            placeholder="seu-nome"
                            {...register('name')}
                        />
                        {errors.name && (//se for name coloca a message
                            <FormError size='sm'>{errors.name.message}</FormError>
                        )}
                    </label>

                    <Button type="submit">
                        Proximo passo
                        <ArrowRight />
                    </Button>
                </Form>
            </Container>
        </>
    )
}