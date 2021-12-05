import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function msgPopup(msg, level = 'error') {
  switch (level) {
    case 'error':
      toast.error(msg);
      break;
    case 'success':
      toast.success(msg);
      break;
    case 'info':
      toast.info(msg);
      break;
    case 'warn':
      toast.warn(msg);
      break;
    default:
      toast.error(msg);
  }
}

export default msgPopup;
