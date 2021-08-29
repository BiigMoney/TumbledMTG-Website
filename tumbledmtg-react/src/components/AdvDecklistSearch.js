const AdvDeckklistSearch = () => {
  return (
    <div className="container">
      <h1>Search Guide: </h1>
      <h4>Any word without a colon will be searched for in body and description of the decklist</h4>
      <h4>You can type t:(word) to search for the word in the title</h4>
      <h4>a:(word) to search for word in the author</h4>
      <h4>c:(colors) to search for decklists that have at least 20% of each color</h4>
      <h4>c:=(color) to search for decklists that have at least 80% of the color</h4>
      <h4>stars:(sign)(value) to search by stars</h4>
    </div>
  )
}

export default AdvDeckklistSearch
