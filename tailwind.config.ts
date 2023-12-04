import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',

  ],
  theme: {
    colors: {
      'white': '#fff',
      'gray900': '#121214',
      'gray800': '#202024',
      'gray300': '#c4c4cc',
      'gray100': '#e1e1e6',

      'green500': '#00875f',
      'green300': '#00b37e',
    },
    fontWeight: {
      'normal': '400',
      'bold': '700'
    },
    extend: {
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
        'bold': ['Roboto', 'sans-serif'],

      },
      
    },
    fontSize: {
      md: '1.125rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '2rem',
    }




  },
  plugins: [],
}
export default config



