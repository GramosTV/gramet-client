import '../styles/loading.css';
const Loading = () => {
  return (
    <div className="mx-auto min-h-[calc(100vh-var(--header-height))] flex justify-center items-center">
      <div className="transform scale-125">
        <div className="hourglass"></div>
      </div>
    </div>
  );
};

export default Loading;
