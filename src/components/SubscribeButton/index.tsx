import styles from './styles.module.scss';
import { useSession, signIn } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import { useRouter } from 'next/router';


interface ApiResponse {
    sessionId: {
        id: string;
    }
}

export function SubscribeButton() {
    const [session] = useSession();
    const router = useRouter();
    async function handleSubscribe() {
        if (!session) {
            signIn('github')
            return;
        }
        if (session.activeSubscription) {
            router.push('/posts')
            return
        }
        try {
            const response = await api.post<ApiResponse>('/subscribe')
            const stripe = await getStripeJs()

            stripe.redirectToCheckout({ sessionId: response.data.sessionId.id })
        } catch (err) {
            alert(err.message);
        }
    }
    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}
