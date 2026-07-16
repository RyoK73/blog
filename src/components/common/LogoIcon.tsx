export const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="80"
      height="50"
      viewBox="0 0 80 96"
    >
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7F77DD" />
          <stop offset="100%" stopColor="#1D9E75" />
        </linearGradient>
      </defs>
      <rect width="80" height="80" rx="14" fill="url(#g)" />
      <text
        x="11"
        y="57"
        fontFamily="'SF Mono','Fira Mono','Consolas',monospace"
        fontSize="26"
        fontWeight="700"
        fill="white"
      >
        ../
      </text>
    </svg>
  );
};
