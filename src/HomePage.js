import { ImageForm } from "./ImageForm";
import { IMAGE_LIST_API_URL, IMAGE_DELETE_API_URL } from "./constants";
import { useState, useEffect } from "react";
import { toast } from'react-hot-toast';
import { saveAs } from 'file-saver';
import no_data from './no_data.svg'

export function HomePage() {
    const [data, setData] = useState([]);
    const [next_page_url, setNextPageUrl] = useState(null);
    const [prev_page_url, setPrevPageUrl] = useState(null);
    const [show_form, setFormFlag] = useState(false);
    const [modal_data, setModalData] = useState({});

    const MY_IMAGES_TAB = "my-images-tab";
    const ADD_IMAGES_TAB = "add-images-tab";

    const switchTab = (toTab, fromTab) => {
        document.getElementById(toTab).classList.add("active");
        document.getElementById(fromTab).classList.remove("active");

        if (toTab === ADD_IMAGES_TAB) {
            setFormFlag(true);
        } else {
            setFormFlag(false);
            fetchImages();
        }
    }

    const fetchImages = (url = IMAGE_LIST_API_URL) => {
        fetch(url, {
            method : "GET",
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(response => {
            setData(response.results);
            setNextPageUrl(response.next);
            setPrevPageUrl(response.previous);
        })
    }

    const deleteImage = (image_id) => {
        fetch(IMAGE_DELETE_API_URL + image_id + "/", {
            method : 'DELETE',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        })
        .then(response => {
            if (response.ok) {
                fetchImages();
                toast.success("Image deleted successfully", {
                    position: 'top-right',
                });
            }
        })
    }

    useEffect(() => {
        fetchImages();
    }, [])

    return (
        <div className="container-md mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className="nav-link active" id={MY_IMAGES_TAB} 
                        onClick={() => switchTab(MY_IMAGES_TAB, ADD_IMAGES_TAB)}>My Images</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id={ADD_IMAGES_TAB} 
                        onClick={() => switchTab(ADD_IMAGES_TAB, MY_IMAGES_TAB)}>Add Images</a>
                    </li>
                </ul>
            </div>
            { show_form ?  <ImageForm /> : data.length > 0 ? (
                <>
                    <div className="my-4 grid-container">
                        {data.map((datum) => { return (
                            <div key={datum.id} className="card grid-item">
                                <img className="thumbnail" src={datum.image} alt={datum.title}/>
                                <div className="thumbnail-info-wrapper">
                                    <span><strong>Title : </strong>{datum.title}</span>
                                    <button className="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#image-modal" 
                                    onClick={() => setModalData(datum)}>Show Details</button>
                                </div>
                            </div>
                        )})}
                    </div>
                    <div className="d-flex justify-content-start">
                        <button type="button" className="btn btn-secondary btn-sm me-2" 
                        disabled={prev_page_url == null} onClick={() => fetchImages(prev_page_url)}>Prev</button>
                        <button type="button" className="btn btn-primary btn-sm" 
                        disabled={next_page_url == null}
                        onClick={() => fetchImages(next_page_url)}>Next</button>
                    </div>
                </>
            ) : (
                <div className="d-flex flex-column justify-content-center align-items-center mt-3">
                    <img src={no_data} height="300"></img>
                    <h5 className="mt-3">Oops! No data found. Add some images first.</h5>
                </div>
            )}

            {/* Image detail modal */}
            <div className="modal fade" id="image-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">{modal_data.title}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                    <div className="modal-body">
                        <img className="modal-image" src={modal_data.image} alt={modal_data.title}/>
                        <div className="my-2"><strong>Description : </strong>{modal_data.description}</div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" 
                        onClick={() => deleteImage(modal_data.id)}>Delete</button>
                        <button type="button" className="btn btn-primary" 
                        onClick={() => saveAs(modal_data.image)}>Download</button>
                    </div>
                    </div>
                </div>
            </div>

        </div>
    )
}