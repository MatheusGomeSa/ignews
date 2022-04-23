import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import { signIn, signOut, useSession } from 'next-auth/client'

import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { isMobile } from '../../utils/isMobile';


export function SingInButtoon() {
    const { Mobile } = isMobile();
    const [MobileScreen, SetMobileScreen] = useState(Mobile)

    useEffect(() => {
        SetMobileScreen(Mobile);
    }, [Mobile])

    const [session] = useSession();

    return session ? (
        <button
            type="button"
            className={styles.singInButtoon}
            onClick={() => signOut()}
        >
            <FaGithub color="#04d361" />
            {!MobileScreen && <p>{session.user.name}</p>}
            <FiX color="#737380" className={styles.closeIten} />
        </button>
    ) : (
        <button
            type="button"
            className={styles.singInButtoon}
            onClick={() => signIn('github')}
        >
            <FaGithub color="#eba417" />
            {!MobileScreen && <p> Sign in with Github</p>}
        </button >
    );
}