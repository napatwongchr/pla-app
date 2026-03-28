import TopicList from '@/components/topics/TopicList'

export const metadata = { title: 'Topics — PLA' }

export default function TopicsPage() {
  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
      <TopicList />
    </main>
  )
}
