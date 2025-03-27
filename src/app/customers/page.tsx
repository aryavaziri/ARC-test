import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CustomerTable from '@/components/Customer/CustomerTable'
import CustomerTable2 from '@/components/Customer/CustomerTable2'

const Customer = async () => {
  const session = await auth()
  if (!session?.user) redirect(`/login`)


  return (
    <div className="p-12">
      <div className="mt-8 con">
        <CustomerTable />
      </div>
      <div className="mt-8 con">
        <CustomerTable2 />
      </div>
    </div>
  )
}

export default Customer
