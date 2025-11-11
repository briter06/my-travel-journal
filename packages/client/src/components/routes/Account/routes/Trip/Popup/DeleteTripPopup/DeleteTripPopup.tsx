import '../Popup.css';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handlePromiseError } from '../../../../../../../utils/promises';
import Disclamer from '../../../../../../utils/Disclamer/Disclamer';
import { deleteTrip } from '../../../../../../../api/trips';

type Props = {
  tripId: number;
  onClose: () => void;
  onConfirm: () => void;
};

const useDeleteTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['trips'],
      });
    },
  });
};

export default function DeleteTripPopup({ tripId, onClose, onConfirm }: Props) {
  const [message, setMessage] = useState<{
    error: boolean;
    message: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const tripMutator = useDeleteTrip();

  const deleteTrip = async () => {
    setIsDeleting(true);
    const result = await tripMutator.mutateAsync(tripId);
    if (result != null) {
      onConfirm();
    } else {
      setMessage({
        error: true,
        message: 'An error occurred while deleting the trip. Please try again!',
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="sac-modal-overlay">
      <div className="sac-modal">
        <Disclamer message={message} />
        <h3 style={{ marginTop: 0 }}>Do you want to delete this trip?</h3>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            marginTop: 12,
          }}
        >
          <button
            type="button"
            className="btn cancel"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn delete"
            disabled={isDeleting}
            onClick={() => void deleteTrip().catch(handlePromiseError)}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
