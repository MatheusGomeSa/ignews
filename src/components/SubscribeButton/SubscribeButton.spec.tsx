import { render, screen, fireEvent } from '@testing-library/react';
import { SubscribeButton } from '.'
import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'


jest.mock('next/router')
jest.mock('next-auth/client')
const useSessionMocked = jest.mocked(useSession)


describe('SubscribeButton component', () => {

    it('renders correctly', () => {
        useSessionMocked.mockReturnValueOnce([null, false])
        render(
            <SubscribeButton />
        )
        expect(screen.getByText('Subscribe now')).toBeInTheDocument()
    })
    it('redirects user to sign in when not authenticated', () => {
        useSessionMocked.mockReturnValueOnce([null, false])
        const signInMocked = jest.mocked(signIn)

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton)
        expect(signInMocked).toHaveBeenCalled();
    });
    it('redirects to post when user already has a subscription', () => {

        useSessionMocked.mockReturnValueOnce([
            {
                user: { name: 'John Doe', email: 'john.doe@example.com' },
                activeSubscription: 'fake-activeSubscription',
                expires: 'fake-expires'
            },
            false])

        const UseRouterMocked = jest.mocked(useRouter);


        const pushMocked = jest.fn();

        UseRouterMocked.mockReturnValueOnce({
            push: pushMocked,
        } as any)


        render(<SubscribeButton />)

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);

        expect(pushMocked).toHaveBeenCalledWith('/posts')
    })

})