import { toast } from 'react-toastify';

export const handleSuccess = (msg: string): void => {
    toast.success(msg, {
        position: 'top-right',
    });
}

export const handleError = (msg: string): void => {
    toast.error(msg, {
        position: 'top-right',
    });
}
