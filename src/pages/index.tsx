import Head from "next/head";
import Link from "next/link";
import Image from 'next/image'

import { GetStaticProps } from "next";
import { useKeenSlider } from 'keen-slider/react'

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";


interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }[]
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  })
  return (

    <>
      <Head>
        <title>Home | Shop</title>
      </Head>

      <main
        id='screenSize'
        ref={sliderRef}
        className=" keen-slider  ml-auto  w-full flex"
      >
        {products.map(({ id, imageUrl, name, price }) => {
          return (
            <Link
              key={id}
              href={`/product/${id}`}
              prefetch={false}
            >
              <div
                className="flex  lg:h-[39rem] md:h-[26.625rem] keen-slider__slide 
                group  cursor-pointer relative  
                rounded-md  items-center 
                justify-center overflow-hidden
                bg-gradient-to-b from-0% from-[#1ea483]  to-[#7465d4] to-100% "
              >

                <Image
                  src={imageUrl}
                  alt='Imagem produto'
                  width={520}
                  height={480}
                  className="object-cover"
                />

                <footer
                  className="absolute bottom-1 left-1 
                  right-1 p-2 rounded-md 
                  sm:flex-wrap flex items-center
                  ease-in-out justify-between bg-[rgba(0,0,0,0.6)] 
                  translate-y-[110%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all"
                >

                  <strong className="text-lg text-gray100 antialiased" >
                    {name}
                  </strong>
                  <span className=" text-xl font-bold text-green300">
                    {price}
                  </span>
                </footer>

              </div>
            </Link>
          );
        })}
      </main>

    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price.unit_amount ? price.unit_amount / 100 : 0)
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2 //2 hours,
  }
} 
