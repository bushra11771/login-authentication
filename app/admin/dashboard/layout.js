"use client";



export default function DashboardLayout({ children }) {
    return (
<div>
{/* <AuthProvider> */}
          <main>{children}</main>

{/* </AuthProvider> */}

</div>
    )
  }