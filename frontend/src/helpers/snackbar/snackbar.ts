import { toast } from 'sonner';

import './style.scss';

export const snackbar = (type: 'success' | 'error' | 'info', text: string) => {
  switch (type) {
    case 'success':
      return toast.success(text, {
        duration: 3000,
        className: 'snackbar-success'
      });
    case 'error':
      return toast.error(text, {
        duration: 3000,
        className: 'snackbar-error'
      });
    case 'info':
      return toast.info(text, {
        duration: 3000,
        className: 'snackbar-info'
      });
  }
};
