export function NextPrevButtons(props) {
  const checkBottom = func => {
    if (props.bottom) {
      window.scroll(0, 0)
    }
    func()
  }
  return (
    <div className="row" style={{width: "100%"}}>
      <div className="col-lg-9 col-6" style={{textAlign: "right", padding: 0}}>
        <button className="btn btn-outline-success" disabled={!props.prevDisabled} onClick={() => checkBottom(props.onPrev)} style={{width: 120}}>
          Previous Page
        </button>
      </div>
      <div className="col-lg-3 col-6" style={{textAlign: "left", padding: 0}}>
        <button className="btn btn-outline-success" disabled={!props.nextDisabled} onClick={() => checkBottom(props.onNext)} style={{width: 120}}>
          Next Page
        </button>
      </div>
    </div>
  )
}
