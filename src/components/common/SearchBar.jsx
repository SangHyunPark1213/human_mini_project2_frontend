import "./SearchBar.css";

const SearchBar = ({ placeholder = "천안 맛집 검색...", value, onChange, onSearch }) => {
  return (
    <div className="search-bar">
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button onClick={onSearch}>검색</button>
    </div>
  );
};

export default SearchBar;