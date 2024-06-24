import {
  Content,
  Portal,
  Provider,
  Root,
  Trigger
} from '@radix-ui/react-tooltip';
import React from 'react';
import './style.scss';

interface TooltipProps {
  helpText: string | React.ReactElement;
  children: React.ReactElement;
}
export const Tooltip = ({ helpText, children }: TooltipProps) => {
  return (
    <Provider>
      <Root delayDuration={100}>
        <Trigger className="TooltipTrigger" asChild>
          {children}
        </Trigger>
        <Portal>
          <Content className="TooltipContent" sideOffset={5}>
            {helpText}
          </Content>
        </Portal>
      </Root>
    </Provider>
  );
};
