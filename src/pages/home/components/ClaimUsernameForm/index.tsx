import { Button, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormAnnotation } from './styles'
import { useRouter } from 'next/router'

const claimUsernameFormSchema = z.object({
    username: z.string()
        .min(3, { message: 'O usuário precisa ter no min 3 letras.' })//min 3 letras
        .regex(/^([a-z\\-]+)$/i, { message: 'O usuário pode ter apenas letras e hifens' })//de a-z com hifen
        .transform((username) => username.toLocaleLowerCase())//transf letra min
})
type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema> //passa o z.object p tipo typescript

export function ClaimUsernameForm() {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClaimUsernameFormData>({
        resolver: zodResolver(claimUsernameFormSchema)
    })

    const router = useRouter()

    async function handleClaimUsername(data: ClaimUsernameFormData) {
        const { username } = data // desestruturou o data pegando o username

        await router.push(`/register?username=${username}`)//rota p acessar register com o username na url
    }

    return (
        <>
            <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
                <TextInput
                    size="sm"
                    prefix="ignite.com/"
                    placeholder="seu-usuário"
                    {...register('username')}//nome que aparece no dentro do objeto console
                />
                <Button size="sm" type="submit" disabled={isSubmitting}>
                    Reservar
                    <ArrowRight />
                </Button>
            </Form>

            <FormAnnotation>
                <Text size='sm'>
                    {errors.username
                        ? errors.username.message
                        : 'Digite o nome do usuario desejado'}
                </Text>
            </FormAnnotation>
        </>
    )
}