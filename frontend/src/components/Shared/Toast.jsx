import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast as useToast } from "sonner"
export const toastIcons = {
  success: <CheckCircle className="text-green-500 w-5 h-5" />,
  error: <XCircle className="text-red-500 w-5 h-5" />,
  info: <Info className="text-blue-500 w-5 h-5" />,
  warning: <AlertTriangle className="text-yellow-500 w-5 h-5" />,
  loading: <Loader2 className="animate-spin text-muted-foreground w-5 h-5" />,
};

import {cn} from "@/lib/utils";
export const toast=({title,description,toastType=""}={})=>{

  useToast.custom((e) => (
    
  <div className="rounded-md min-w-[200px]  lg:min-w-[300px] flex gap-3 items-center  border border-border bg-white dark:bg-slate-900 p-2 shadow-md text-slate-900 dark:text-white">
     {toastIcons[toastType || "success"]}
    <span className={cn("flex flex-col",toastType==="error"?"text-red-500":toastType==="success"?"text-green-500":toastType==="info"?"text-blue-500":toastType==="warning"?text-yellow-500:"")}>
        <p className="text-md font-semibold">{title}</p>
    <p className="text-sm ">{description}</p>
    </span>
  </div>
));
}