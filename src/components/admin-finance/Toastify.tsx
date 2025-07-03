import { ToastContainer, ToastOptions, toast } from "react-toastify";

export const ToastNotif = () => {
  return <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />;
};

export const showToast = {
  success: (message: string, options?: ToastOptions) => toast.success(message, options),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
  loading: (message: string) => toast.loading(message),
  update: (toastId: any, options: any) => toast.update(toastId, options),
  dismiss: (toastId?: string | number) => toast.dismiss(toastId),
};
