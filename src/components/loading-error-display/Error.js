export default function Error({error, content}) {
  console.log(error)
  return (
    <>
      <p className="text-red-800 dark:text-red-400">
        <i className="ri-error-warning-line"></i> Error Loading {content || "content"}
      </p>
    </>
  );
}
