import Link from 'next/link'
import { getPosts } from '@/lib/content/posts'
import Posts from '@/components/content/posts'
import siteContent from '@/content/site.json'

export default async function RecentPosts() {
  const posts = await getPosts(siteContent.home.recentCount)

  return (
    <section className="pb-24">
      <div>
        <h2 className="title mb-12 font-mono">{siteContent.home.recentPostsTitle}</h2>
        <Posts posts={posts} />

        <Link
          href="/posts"
          className="text-muted-foreground hover:text-foreground mt-8 inline-flex items-center gap-2 underline decoration-1 underline-offset-2 transition-colors"
        >
          <span>All posts</span>
        </Link>
      </div>
    </section>
  )
}
