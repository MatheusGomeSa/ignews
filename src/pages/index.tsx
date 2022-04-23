import { GetStaticProps } from 'next'
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe'
import styles from './Home.module.scss';

interface HomeProps {
    product: {
        priceId: string;
        amount: string;
    }
}

export default function Home({ product }: HomeProps) {
    return (<>
        <Head>
            <title>Home | Ig.News</title>
        </Head>
        <main className={styles.contentContainer}>
            <section className={styles.hero}>
                <div>
                    <span>👏Hey, welcome</span>
                    <h1>News about the <span>React</span> world</h1>
                    <p>
                        Get access to all the publications <br />
                        <span>for {product.amount} month</span>
                    </p>
                    <SubscribeButton />
                </div>
            </section>
            <img src='/images/avatar.svg' alt="Girl coding" />
        </main>
    </>)
}
export const getStaticProps: GetStaticProps = async () => {
    const price = await stripe.prices.retrieve('price_1JkdAGE0RYxrJ5Rv65j36nL6');
    const product = {
        priceId: price.id,
        amount: new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'USD',
        }).format(price.unit_amount / 100,)
    };

    return {
        props: {
            product
        },
        revalidate: 60 * 60 * 24 // 24 horas 
    }
}