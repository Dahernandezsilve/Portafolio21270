import TitleP from './TitleP'

export default {
  title: 'Components/TitleP',
  component: TitleP,
  tags: ['autodocs'],
  argTypes: {
    strings: {control: 'array' }
  },
}

export const Title = {
  args: {
    strings: ['hola', '...', 'prueba1','....', 'prueba2']

  },
}
