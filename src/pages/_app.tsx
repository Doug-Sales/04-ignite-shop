import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import logoImg from '../assets/logo.svg'
import Image from 'next/image'
import Link from 'next/link'

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  style: 'normal',
  variable: '--font-roboto'
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${roboto.className} antialiased 
    flex
    flex-col 
    items-start 
    justify-center
    min-h-[98vh] `}>

      <header className='mx-auto py-8 w-full max-w-[1180px]'>
        <Link href={'/'} title='Home' tabIndex={0} >
          <Image
            alt='logo'
            src={logoImg}
            height={120}
            width={120}
          />
        </Link>
      </header>

      <Component {...pageProps} />
    </div>
  )
}
