import { useTranslation } from 'react-i18next';

type DisclamerProps = {
  message: { message: string; error: boolean } | null;
};

function Disclamer({ message }: DisclamerProps) {
  const { t } = useTranslation();
  return message != null ? (
    <div
      style={{
        color: message.error ? 'red' : 'green',
        marginBottom: '10px',
      }}
    >
      {t(message.message)}
    </div>
  ) : null;
}

export default Disclamer;
