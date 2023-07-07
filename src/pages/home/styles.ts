import { styled, Heading, Text } from '@ignite-ui/react'

export const Container = styled('div', {
    maxWidth: 'calc(100vw - (100vw - 1160px) / 2)',
    marginLeft: 'auto',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    gap: '$20',
})

export const Hero = styled('div', {
    maxWidth: 480,
    padding: '0 $10',

    [`> ${Heading}`]: { // aplica  apenas dentro desse container colocando o sinal de maior
        '@media(max-width: 600px)': {
            fontSize: '$6xl',
        },
    },

    [`> ${Text}`]: { // aplica  apenas dentro desse container colocando o sinal de maior
        maskType: '$2',
        color: '$gray200',
    },
})

export const Preview = styled('div', {
    paddingRight: '$8',
    overflow: 'hidden',

    '@media(max-width: 600px)': {
        display: 'none',
    },
})