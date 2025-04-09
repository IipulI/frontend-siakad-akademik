export default function ProfileInputField({ title, type }) {
  return (
    <div className="flex justify-between items-center">
      <label htmlFor="">{title}</label>
      <input className="rounded-md border-2 p-0.5 px-2" type={type} />
    </div>
  );
}
