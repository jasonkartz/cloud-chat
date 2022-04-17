export default function Error({error, content}) {
  console.log(error)
  return (
    <>
      <p className="text-red-800">
        <i className="ri-error-warning-line"></i> Error Loading {content}
      </p>
    </>
  );
}
