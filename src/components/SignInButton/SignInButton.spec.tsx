import { render, screen } from '@testing-library/react';
import { SingInButtoon } from '.'
import { useSession } from 'next-auth/client'


jest.mock('next/router', () => {
    return {
        useRouter() {
            return {
                asPath: '/'
            }
        }
    }
})


jest.mock('next-auth/client')
const useSessionMocked = jest.mocked(useSession)


describe('SignInButton component', () => {

    it('renders correctly when user is not authenticated', () => {
        useSessionMocked.mockReturnValueOnce([null, false])
        render(
            <SingInButtoon />
        )
        expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
    })
    it('renders correctly when user is  authenticated', () => {
        useSessionMocked.mockReturnValueOnce([
            { user: { name: 'John Doe', email: 'john.doe@example.com' }, expires: 'fake-expires' },
            false])
        render(
            <SingInButtoon />
        )
        expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
})