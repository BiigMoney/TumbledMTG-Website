import {Link} from "react-router-dom"

const SearchBar = props => {
  return (
    <div className="form-center container">
      <form onSubmit={props.onSubmit}>
        <input className="form-control-lg" style={{width: "50%"}} type="text" placeholder={props.placeholder} aria-label="Search" autoComplete="off" name="searchValue" id="cardSearchBar" onChange={props.onChange} value={props.value} />
        <Link
          to={{
            pathname: `/${props.page}=${props.searchTerm}&pg=1`
          }}
        >
          <button className="btn btn-outline-success btn-rounded btn-lg my-0" type="submit" onClick={props.onSubmit}>
            Search
          </button>
        </Link>
      </form>
    </div>
  )
}

export default SearchBar
