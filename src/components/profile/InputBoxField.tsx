import React from "react";

interface InputBoxFieldProps {
  title: string;
  type: string;
  textArea: boolean;
  placeholder: string;
}

export default function InputBoxField({
  title,
  type,
  textArea,
  placeholder,
}: InputBoxFieldProps) {
  return (
    <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
      <label className="w-full text-black/90 font-semibold" htmlFor="">
        {title}
      </label>
      {textArea ? (
        <textarea className={`border-2 p-0.5 px-2 w-full`} id=""></textarea>
      ) : (
        <input
          className={`rounded-md border-2 p-0.5 px-2 w-full`}
          placeholder={placeholder}
          type={type}
        />
      )}
    </div>
  );
}
