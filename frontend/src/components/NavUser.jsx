import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Authenticated, UnAuthenticated } from "./Dashboard/IsAuthenticated"
import { useLazyLogoutAdminQuery } from "../services/dashboad/adminAuthServices"
import { useDispatch } from "react-redux"
import { logout } from "../slices/dashboard/adminSlice"
import { toast } from "./Shared/Toast"
import {Loader2} from "lucide-react"
export function NavUser({
  user,
}) {
  const { isMobile } = useSidebar()
  const [logoutAdmin,{isLoading,isSuccess}]=useLazyLogoutAdminQuery();
  const dispatch=useDispatch();

  const handleLogout = async () => {

    await logoutAdmin().unwrap().then((res)=>{
      if(res?.status){
        dispatch(logout());
        toast({toastType:"success",description:res?.message,title:"Logout Success"})
      }
    }).catch((err)=>{

      toast({toastType:"error",description:err?.data?.message,title:"Logout Failed"})
    })
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Authenticated>

           {({ admin }) => (
     <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={admin?.profilePic} alt={"image"} />
                <AvatarFallback className="rounded-lg uppercase light:text-light  bg-slate-900/70  ">{admin?.name[0] || U}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{admin?.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {admin?.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg shadow-md "
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={admin?.profilePic} alt={admin?.name} />
                  <AvatarFallback className="rounded-lg uppercase border">{admin?.name[0]}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{admin?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {admin.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center ">
              <IconLogout />
              <p className="flex-1">Logout</p>
              {isLoading && <Loader2 className={`size-4 "animate-spin"`}/>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
  )}
      
        </Authenticated>
        {/* <UnAuthenticated>

        </UnAuthenticated> */}
        {/* <Authenticated>
         
        </Authenticated> */}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
