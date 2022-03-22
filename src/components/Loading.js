export default function Loading() {
  return (
    <main className="main-box">
      <h2 className="flex gap-1 blue-heading animate-pulse">
        Loading
        <div className="animate-spin">
          <i className="ri-loader-5-line"></i>
        </div>
      </h2>
    </main>
  );
}
