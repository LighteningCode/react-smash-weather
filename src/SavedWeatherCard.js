import { getWeatherCurrentStatus } from "./utils";


function SavedWeatherCard(props) {
    return (
        <div onClick={() => props.handleClick()} style={{ width: "220px" }} className="card savedWeather mx-1 my-1">
            <div className="card-body p-1">
                <div className="d-flex flex-row">

                    <div className="mr-1">
                        <img src={getWeatherCurrentStatus(props.Weatherdata.description).cardImage} width="60" />
                    </div>

                    <div style={{ flex: "1", minWidth: "0" }} className="d-flex flex-column justify-content-center">
                        <p style={{ width: "100%" }} className="font-weight-bold mb-0 ellipse">{props.Weatherdata.location}</p>
                        <span className="capitalize" style={{ fontSize: "12px" }}>{props.Weatherdata.description}</span>
                    </div>

                    <div>
                        <button onClick={() => props.handleDelete()} className="btn btn-outline-danger py-1 px-2"><i className="fa fa-trash" aria-hidden="true"></i></button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SavedWeatherCard