export default function ProfileInputField({ title, type }) {
  return (
    <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
      <label className="w-full" htmlFor="">
        {title}
      </label>
      <input className="rounded-md border-2 p-0.5 px-2 w-full" type={type} />
    </div>
  );
}
