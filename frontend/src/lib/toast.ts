import { toast } from "sonner";

const COMMUNICATION_ERROR_MESSAGE = "通信エラーが発生しました";

export function notifyError(message: string = COMMUNICATION_ERROR_MESSAGE) {
  toast.error(message);
}

export function notifySuccess(message: string) {
  toast.success(message);
}
