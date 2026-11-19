import AdminPanel from '@/components/admin/admin-panel'

export const metadata = {
  title: 'Portfolio Admin | Pankaj Yadav'
}

export default function AdminPage() {
  return (
    <section className="container max-w-5xl pt-40 pb-24">
      <AdminPanel />
    </section>
  )
}
