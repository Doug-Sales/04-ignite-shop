import Image from "next/image"
import { GetStaticPaths, GetStaticProps } from 'next'
import { stripe } from "@/lib/stripe"
import Stripe from "stripe"
import axios from "axios"
import { useState } from "react"


interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    defaultPriceId: string;
  }
}

export default function Products({ product }: ProductProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)
  
  if (!product) {
    return <h1>Loading...</h1>
  }
  

  async function handleBuyProduct() {

    try {
      setIsCreatingCheckoutSession(true)

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl

    } catch (err) {
      // Conectar com uma ferramenta de observabilidade (Datadog / Sentry)

      setIsCreatingCheckoutSession(false)

      alert('Falha ao redirecionar para o checkout!')
    }

  }


  return (
    <>

      <main className="grid grid-cols-2 items-stretch gap-16 max-w-[1180px] mx-auto">

        <div className="flex w-full  
            rounded-lg p-sm  items-center
            h-[41rem] 
            justify-center overflow-hidden
            bg-gradient-to-r from-0% from-[#1ea483]  to-[#7465d4] to-100%">

          <Image
            src={`${product.imageUrl}`}
            alt='Imagem produto'
            width={520}
            height={480}
            className="object-cover"
          />
        </div>

        <div className=" flex flex-col container">

          <h1 className="text-2xl text-gray300 ">
            {product.name}
          </h1>

          <span className=" mt-4 block text-green300 text-2xl ">
            {product.price}
          </span>

          <p className=" text-md lg:p-1 leading-relaxed p-5 text-gray100 mt-10 ">
            {product.description}
          </p>

          <button
            type="button"
            className="lg:mt-auto m-4 bg-green500 border-0
           text-white rounded-lg p-5
           cursor-pointer font-bold text-md disabled:motion-safe:animate-pulse
            enabled:hover:bg-green300 disabled:opacity-60 disabled:cursor-not-allowed "
            disabled={isCreatingCheckoutSession}
            onClick={handleBuyProduct}
          >
            Comprar agora
          </button>
        </div>

      </main>

    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {

  return {
    paths: [],
    fallback: true, // false or "blocking"
  }
}


export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params!.id

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  });

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(price.unit_amount ? price.unit_amount / 100 : 0),
        description: product.description,
        defaultPriceId: price.id,
      }
    },
    revalidate: 60 * 60 * 1, // 1 hour 
  }
}
