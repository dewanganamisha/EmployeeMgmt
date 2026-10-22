export default function SearchBar({ value, onChange }) {
  return (
    <div className="search">
      <label htmlFor="search" className="sr-only">Search employees</label>
      <input
        id="search"
        type="search"
        placeholder="Search by name or email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
