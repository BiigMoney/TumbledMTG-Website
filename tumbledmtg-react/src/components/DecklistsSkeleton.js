const DecklistsSkeleton = () => {
  const content = Array.from({length: 20}).map((element, idx) => {
    return (
      <tr key={idx}>
        <th scope="col" style={{textAlign: "center"}}>
          <div style={{width: 103, height: 25, backgroundColor: "gray", textAlign: "center", margin: "auto"}}></div>
        </th>
        <th scope="col">
          <div style={{width: 50, height: 15, backgroundColor: "gray"}}></div>
        </th>
        <th scope="col">
          <div style={{width: 194, height: 15, backgroundColor: "gray"}}></div>
        </th>
        <th scope="col">
          <div style={{width: 98, height: 15, backgroundColor: "gray"}}></div>
        </th>
        <th scope="col">
          <div style={{width: 50, height: 15, backgroundColor: "gray"}}></div>
        </th>
        <th scope="col">
          <div style={{width: 89, height: 15, backgroundColor: "gray"}}></div>
        </th>
      </tr>
    )
  })
  return (
    <table className="table table-striped table-dark">
      <thead>
        <tr>
          <th scope="col" style={{textAlign: "center"}}>
            Stars
          </th>
          <th scope="col">Colors</th>
          <th scope="col">Title</th>
          <th scope="col">Author</th>
          <th scope="col">Format</th>
          <th scope="col">Date</th>
        </tr>
      </thead>
      <tbody>{content}</tbody>
    </table>
  )
}

export default DecklistsSkeleton
