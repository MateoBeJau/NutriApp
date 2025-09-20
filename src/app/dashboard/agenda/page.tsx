import { getCurrentUser } from '@/lib/auth'
import { AgendaClient } from '@/components/agenda/AgendaClient'
import { redirect } from 'next/navigation'

export default async function AgendaPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  return <AgendaClient usuarioId={user.id} />
}