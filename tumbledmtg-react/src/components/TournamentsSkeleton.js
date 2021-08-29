const TournamentsSkeleton = () => {
  const content = Array.from({length: 10}).map((element, idx) => {
    return (
      <tr key={idx}>
        <th scope="col">
          <div style={{width: 10, height: 22, backgroundColor: "gray"}}></div>
        </th>
        <th scope="col">
          <div style={{width: 230, height: 22, backgroundColor: "gray"}}></div>
        </th>
        <th scope="col">
          <div style={{width: 63, height: 22, backgroundColor: "gray"}}></div>
        </th>
        <th scope="col">
          <div style={{width: 126, height: 22, backgroundColor: "gray"}}></div>
        </th>
        <th scope="col">
          <div style={{width: 81, height: 22, backgroundColor: "gray"}}></div>
        </th>
      </tr>
    )
  })
  return (
    <div>
      <table className="table table-striped table-dark">
        <thead>
          <tr>
            <th scope="col">Entrants</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Format</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>{content}</tbody>
      </table>
    </div>
  )
}

export default TournamentsSkeleton
