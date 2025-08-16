'use client'

import { signOut, useSession } from "@/lib/auth-client";
import { LogOut, Package, Pen } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

function Header() {
  const pathName = usePathname()
  // console.log(pathName);
  const router = useRouter()

  const isLoginPage: boolean = pathName === '/login'

  const { data: session, isPending } = useSession()
  const user = session?.user
  // const isAdminUser: boolean = user?.role === 'admin'
  const isAdminUser = user?.role?.toLowerCase() === "admin";
  
  // console.log("User object:", user)
  // console.log("isAdminUser:", isAdminUser)


  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/')
        }
      }
    })
  }

  if (isLoginPage) return null


  return (
    <header className="fixed left-0 right-0 z-50 border-b bg-yellow-100">
      <div className="container ml-6 flex h-16 items-center justify-between"> {/*h-16 == p-64*/}
        <div className="flex items-center gap-6">
          <Link href='/' className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-blue-500">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-blue-600 hover:text-blue-800">
              Calim Assets
            </span>
          </Link>

          <nav className="items-center flex gap-6 ml-6">
            { // galary page avaialable only for users(both auth andauth) not admin
              !isPending && user && isAdminUser ? null : (
                <Link
                  href="/gallery"
                  className="text-sm font-medium hover:text-blue-600" >
                  Gallery
              </Link>
              )
            }

            {
              !isPending && user && !isAdminUser && (
                <>
                  <Link
                    href='/dashboard/assets'
                    className="text-sm font-medium hover:text-blue-600"
                  >
                    Assets
                  </Link>
                  <Link
                    href='/dashboard/purchases'
                    className="text-sm font-medium hover:text-blue-600"
                  >
                    My Purchases
                  </Link>
                </>
              )
            }

            {
              !isPending && user && isAdminUser && (
                <>
                  <Link
                    href='/admin/assets-approval'
                    className="text-sm font-medium hover:text-blue-600"
                  >
                    Assets Approval
                  </Link>
                  <Link
                    href='/admin/settings'
                    className="text-sm font-medium hover:text-blue-600"
                  >
                    Settings
                  </Link>
                </>
              )
            }
          </nav>
        </div>
        <div className="flex items-center gap-6">
          {
            isPending ? null : user ? (
              <div className="mr-24">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'} className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8 border border-slate-300">
                        <AvatarFallback className="bg-blue-500 text-white">
                          {
                            user?.name ? user.name.charAt(0).toUpperCase() : 'U'
                          }
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name}
                        </p>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                      <LogOut className="mr-2 h-2 w-4" />
                      <span className="font-medium">
                        Logout
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>

                </DropdownMenu>
              </div>
            ) : (
              <Link href='/login' className="mr-24">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Login
                </Button>
              </Link>
            )

          }

        </div>
      </div>

    </header>
  );
}

export default Header;