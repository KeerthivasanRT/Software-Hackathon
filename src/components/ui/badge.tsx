import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 capitalize tracking-wide shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 ring-1 ring-inset ring-sky-500/20 shadow-sm",
        secondary:
          "border-transparent bg-sky-50 text-sky-700 hover:bg-sky-100 ring-1 ring-inset ring-sky-200",
        destructive:
          "border-transparent bg-red-50 text-red-600 hover:bg-red-100 ring-1 ring-inset ring-red-200",
        outline: "text-slate-600 border-[#D6ECFA] hover:bg-sky-50",
        success: "border-transparent bg-emerald-50 text-emerald-600 hover:bg-emerald-100 ring-1 ring-inset ring-emerald-200",
        warning: "border-transparent bg-amber-50 text-amber-600 hover:bg-amber-100 ring-1 ring-inset ring-amber-200",
        info: "border-transparent bg-cyan-50 text-cyan-600 hover:bg-cyan-100 ring-1 ring-inset ring-cyan-200",
        purple: "border-transparent bg-purple-50 text-purple-600 hover:bg-purple-100 ring-1 ring-inset ring-purple-200",
        orange: "border-transparent bg-orange-50 text-orange-600 hover:bg-orange-100 ring-1 ring-inset ring-orange-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
