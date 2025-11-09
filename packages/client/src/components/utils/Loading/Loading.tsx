import './Loading.css';
import loading from '../../../assets/loading.gif';
import { isLoading } from '../../../store/slices/loading';

function Loading() {
  return isLoading() ? (
    <div className="loading-container">
      <img className="loading-image" src={loading} alt="loading" />
    </div>
  ) : null;
}

export default Loading;
