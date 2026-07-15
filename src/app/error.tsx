"use client";
const ErrorPage = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div>
      <h1>500</h1>
      <button onClick={reset}>再試行</button>
    </div>
  );
};

export default ErrorPage;
