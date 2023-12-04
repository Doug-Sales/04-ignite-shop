import { stripe } from "@/lib/stripe";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Stripe from "stripe";

interface SuccessProps {
  customerName: string;
  product: {
    name: string;
    imageUrl: string;
  }
}

export default function Success({ customerName, product }: SuccessProps) {

  return (
    <>
      <Head>
        <title>Compra efetuada | Shop</title>

        <meta name="robots" content="noindex" />
      </Head>

      <main className=" flex flex-col items-center 
      justify-center mx-auto h-[41rem] antialiased"
      >

        <h1 className="text-2xl text-gray100/90 font-bold">
          Compra efetuada!
        </h1>

        <div className="w-full rounded-lg max-w-[8.125rem] h-[9.0625rem] 
        p-1 flex items-center justify-center mt-16
        bg-gradient-to-b from-0% from-[#1ea483]  to-[#7465d4] to-100%"
        >
          <Image
            src={product.imageUrl}
            alt='Imagem produto'
            width={120}
            height={110}
            className="object-cover"
          />
        </div>

        <p className=" text-xl font-bold leading-relaxed text-gray100/80 max-w-[35rem] text-center mt-8">
          Uhuul <strong className="capitalize">{customerName}</strong>, sua <strong>{product.name}</strong> já está a caminho da sua casa.
        </p>

        <Link
          href={'/'}
          className="text-green500 hover:text-green300 
         text-lg font-bold mt-20 block "
        >
          Voltar ao catálogo
        </Link>

      </main>

    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

  if (!query.session_id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const sessionId = String(query.session_id);


  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

  const customerName = session.customer_details?.name;
  const product = session.line_items?.data[0].price?.product as Stripe.Product;


  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageUrl: product.images[0],
      }
    }
  }

}