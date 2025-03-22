import { auth } from '@/auth'
import Login from '@/components/UI/Login'
import { redirect } from 'next/navigation'

const Page = async () => {

  const session = await auth()
  if (session?.user) redirect(`/`)

    return (
    <div className="mt-8 con2 mx-auto mt-[20vh] w-[500px] ">
      <Login />
    </div>
  )
}

export default Page