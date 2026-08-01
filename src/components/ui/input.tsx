import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-xl border border-[#D6EAF8] bg-white px-4 py-2 text-sm text-[#1E293B] shadow-2xs transition-all duration-200 outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:border-[#005BAC] focus-visible:ring-2 focus-visible:ring-[#005BAC]/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
        className
      )}
      {...props}
    />
  )
}

export { Input }
