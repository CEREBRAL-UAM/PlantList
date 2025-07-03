export function Buscador({ onChange, placeholder, value }) {
  const manejadorCambios = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="bg-amber-200 w-1/2">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={manejadorCambios}
      />
    </div>
  );
}
