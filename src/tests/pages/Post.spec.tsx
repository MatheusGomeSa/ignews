import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic'

const post = {
    slug: 'my-new-posts',
    title: 'My new posts',
    content: '<p>Post expect</p>',
    updatedAt: '10 de Abril'
}
jest.mock('next/router')
jest.mock('next-auth/client')
jest.mock('../../services/prismic')

describe('Post page', () => {
    it('renders currectly', () => {

        render(<Post post={post} />)

        expect(screen.getByText('My new posts')).toBeInTheDocument();
        expect(screen.getByText('Post expect')).toBeInTheDocument();
    });
    it('redirects user  if no subscriptions is found', async () => {
        const getSessionMocked = jest.mocked(getSession)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscriptions: null,
        } as any)
        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/'
                })
            })
        )
    });
    it('loads initial data', async () => {
        const getSessionMocked = jest.mocked(getSession)
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'My new post' }
                    ],
                    content: [
                        { type: 'paragraph', text: 'Post content' }
                    ],
                },
                last_publication_date: '04-01-2022'
            })
        } as any)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription',
        } as any);

        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My new post',
                        content: '<p>Post content</p>',
                        updatedAt: '01 de abril de 2022'
                    }
                }
            })
        )

    })
})