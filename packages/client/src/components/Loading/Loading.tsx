import './Loading.css'
import loading from '../../assets/loading.gif';
import { useAppSelector } from '../../store/hooks';

function Loading() {
  const isLoading = useAppSelector(state => state.loading.isLoading);

  return isLoading ? (
    <div className="loading-container">
      <img
        style={{ width: '100px', paddingTop: '15%' }}
        src={loading}
        alt="loading"
      />
    </div>
  ) : null;
}

export default Loading;
