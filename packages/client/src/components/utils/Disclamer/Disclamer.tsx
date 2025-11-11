type DisclamerProps = {
  message: { message: string; error: boolean } | null;
};

function Disclamer({ message }: DisclamerProps) {
  return message != null ? (
    <div
      style={{
        color: message.error ? 'red' : 'green',
        marginBottom: '10px',
      }}
    >
      {message.message}
    </div>
  ) : null;
}

export default Disclamer;
