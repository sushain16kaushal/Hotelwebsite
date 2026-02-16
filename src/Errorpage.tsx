import { useRouteError } from 'react-router-dom'
interface Routeerror{
statusText?:string;
message?:string;
}
function Errorpage() {
     const error = useRouteError() as Routeerror;
    return (
        <div style={{ padding: "2rem" }}>
      <h1>Oops 😬</h1>
      <p>Something went wrong.</p>
      <p style={{ color: "red" }}>
        {error.statusText || error.message}
      </p>
    </div>
    )
}

export default Errorpage
