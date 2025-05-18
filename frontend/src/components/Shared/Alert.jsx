import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function Alert({CloseButton,title,subtitle,btnTitle,cnslBtnTitle,onAllow,onCancel}) {
  return (
    <AlertDialog className="border-1 bg-slate-500">
      <AlertDialogTrigger asChild>
        {CloseButton || <Button variant="outline">Show Dialog</Button>}
      </AlertDialogTrigger>
      <AlertDialogContent className="transition-all duration-700 ease light:bg-light/70 shadow-md dark:bg-slate-800 border border-slate-200 dark:border-slate-700  rounded-xl shadow mb-4">
        <AlertDialogHeader>
          <AlertDialogTitle>{title || "Are you absolutely sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
           {subtitle || " This action cannot be undone. This will permanently delete your account and remove your data from our servers."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>(onCancel && typeof onCancel==="function" && onCancel())}>{cnslBtnTitle || "Cancel"}</AlertDialogCancel>
          <AlertDialogAction onClick={()=>(onAllow && typeof onAllow==="function" && onAllow())}>{ btnTitle ||  "Continue"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
