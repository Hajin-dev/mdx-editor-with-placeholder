import React from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import * as styles from './styles.css'

export const LinkUIInput = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>((props, ref) => {
  return <input {...props} className={styles.LinkUIInput} ref={ref} />
})

export function LinkTextContainer(props: React.ComponentProps<'span'>) {
  return <span {...props} className={styles.LinkTextContainer} />
}

export const TooltipContent = React.forwardRef<any, React.ComponentProps<typeof Tooltip.Content>>((props, ref) => {
  return <Tooltip.Content {...props} className={styles.TooltipContent} ref={ref} />
})

export function TooltipArrow(props: React.ComponentProps<typeof Tooltip.Arrow>) {
  return <Tooltip.Arrow {...props} className={styles.TooltipArrow} />
}

export const PopoverButton = React.forwardRef<any, React.ComponentProps<'button'>>((props, ref) => {
  return <button {...props} className={styles.PopoverButton} ref={ref} />
})

export function WorkingLink(props: React.ComponentProps<'a'>) {
  return <a {...props} className={styles.WorkingLink} />
}
