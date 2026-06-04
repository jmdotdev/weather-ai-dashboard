type ErrorProps = {
  message: string;
};

export default function Error({ message }: ErrorProps) {
  return (
    <div className="bg-red-900 text-red-200 p-3 rounded-lg text-center">
      {message}
    </div>
  );
}