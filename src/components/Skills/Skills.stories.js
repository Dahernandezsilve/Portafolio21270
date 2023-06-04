import Skills from './Skills'

export default {
  title: 'Components/Skills',
  component: Skills,
  tags: ['autodocs'],
  argTypes: {
    skill: { control: 'text' },
    level: { control: 'text' },
    color: { control: 'text '}
  },
}

export const Skill = {
  args: {
    skill: 'Jump',
    level: '30',
    color: 'Black',
  },
}
