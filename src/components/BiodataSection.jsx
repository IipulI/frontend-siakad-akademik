export default function BiodataSection({ title, isTitle }) {
    return (
        <div className="flex flex-col gap-2">
            {title.map((item, key) => (
                <h3 key={key} className={isTitle ? "text-primary-green" : ""}>{item}</h3>
            ))}
        </div>
    )
}
