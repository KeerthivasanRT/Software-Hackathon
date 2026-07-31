import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-4 focus-visible:ring-sky-500/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-[#38BDF8] to-[#0EA5E9] text-white shadow-[0_1px_2px_rgba(14,165,233,0.3),0_1px_0_rgba(255,255,255,0.2)_inset] hover:shadow-[0_4px_12px_rgba(14,165,233,0.25)] hover:from-sky-400 hover:to-sky-500 hover:-translate-y-[1px]",
        outline:
          "border-sky-500/30 bg-white text-sky-600 shadow-sm hover:bg-sky-50 hover:text-sky-700 hover:border-sky-500/50 hover:-translate-y-[1px]",
        secondary:
          "bg-white text-sky-600 border border-sky-500/20 shadow-sm hover:bg-sky-50 hover:text-sky-700 hover:shadow-md hover:-translate-y-[1px]",
        ghost:
          "text-slate-500 hover:bg-sky-50 hover:text-sky-700",
        destructive:
          "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[0_1px_2px_rgba(239,68,68,0.3),0_1px_0_rgba(255,255,255,0.2)_inset] hover:shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:from-red-400 hover:to-red-500 hover:-translate-y-[1px]",
        success:
          "bg-gradient-to-b from-green-500 to-green-600 text-white shadow-[0_1px_2px_rgba(34,197,94,0.3),0_1px_0_rgba(255,255,255,0.2)_inset] hover:shadow-[0_4px_12px_rgba(34,197,94,0.25)] hover:from-green-400 hover:to-green-500 hover:-translate-y-[1px]",
        warning:
          "bg-gradient-to-b from-amber-500 to-amber-600 text-white shadow-[0_1px_2px_rgba(245,158,11,0.3),0_1px_0_rgba(255,255,255,0.2)_inset] hover:shadow-[0_4px_12px_rgba(245,158,11,0.25)] hover:from-amber-400 hover:to-amber-500 hover:-translate-y-[1px]",
        link: "text-sky-500 underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-sky-400 to-sky-500 text-white shadow-[0_4px_12px_rgba(14,165,233,0.2)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.3)] hover:from-sky-300 hover:to-sky-400 hover:-translate-y-[1px]",
      },
      size: {
        default:
          "h-10 px-4 py-2 gap-2",
        xs: "h-7 gap-1.5 rounded-lg px-2.5 text-xs",
        sm: "h-9 gap-1.5 rounded-lg px-3 text-sm",
        lg: "h-12 gap-2 rounded-xl px-8 text-base",
        icon: "size-10",
        "icon-xs": "size-7 rounded-lg",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
