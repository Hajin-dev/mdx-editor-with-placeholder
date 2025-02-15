import * as Tooltip from '@radix-ui/react-tooltip'
import classNames from 'classnames'
import React, { ReactNode } from 'react'
import { useEmitterValues } from '../../system/EditorSystemComponent'
import styles from '../styles.module.css'

export const InstantTooltip = React.forwardRef<HTMLButtonElement, { title: string; children: ReactNode }>(({ title, children }, ref) => {
  const [editorRootElementRef] = useEmitterValues('editorRootElementRef')

  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger ref={ref} asChild>
          <span>{children}</span>
        </Tooltip.Trigger>
        <Tooltip.Portal container={editorRootElementRef?.current}>
          <Tooltip.Content className={classNames(styles.tooltipContent)} sideOffset={10}>
            {title}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
})
