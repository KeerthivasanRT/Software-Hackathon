import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-[#D6ECFA] bg-white px-4 py-2 text-sm text-slate-900 shadow-sm transition-all duration-200 outline-none placeholder:text-slate-400 focus-visible:border-sky-500 focus-visible:ring-4 focus-visible:ring-sky-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
        className
      )}
      ref={ref}
      data-slot="textarea"
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
