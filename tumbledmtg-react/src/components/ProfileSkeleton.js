import {Fragment} from "react"

const ProfileSkeleton = () => {
  return (
    <Fragment>
      <h3>Discord Name: </h3>
      <h4>
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </h4>
      <br />
      <h3>Cockatrice Name: </h3>
      <h4>
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </h4>
      <br />
      <h3>Account created at: </h3>
      <h4>
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </h4>
    </Fragment>
  )
}

export default ProfileSkeleton
