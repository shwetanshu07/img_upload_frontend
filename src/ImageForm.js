import { useState } from "react"
import { IMAGE_UPLOAD_API_URL } from "./constants";
import { toast } from "react-hot-toast";

export function ImageForm() {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [image, setImage] = useState(null);
    const [key, setKey] = useState(0);

    const checkError = () => {
        if (title === "") {
            toast.error("Title is required", {
                position: 'top-right',
            });
            return true;
        }
        if (desc === "") {
            toast.error("Description is required", {
                position: 'top-right',
            });
            return true;
        }

        if (image === null) {
            toast.error("Image is required", {
                position: 'top-right',
            });
            return true;
        }

        return false;
    }

    const clearForm = () => {
        setTitle("");
        setDesc("");
        setImage(null);
        setKey(key+1); // re-rendering the image input to clear the file name
    }
    
    const handleUpload = () => {
        if (checkError()) {
            return;
        }

        const upload_data = new FormData();
        upload_data.append("title", title);
        upload_data.append("description", desc);
        upload_data.append("image", image, image.name);

        fetch(IMAGE_UPLOAD_API_URL, {
            method: "POST",
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            },
            body: upload_data
        })
        .then(response => response.json())
        .then(response => {
            if (response.id) {
                clearForm();    
                toast.success("Image uploaded", {
                    position: 'top-right',
                });
            }
        })
        .catch(error => console.log(error));
    }

    return (
        <div className="card my-5 my-form">
            <div className="card-body">
                <form>
                    <div className="mb-3">
                        <label htmlFor="title-input" className="form-label">Title <span className="req-text">*</span></label>
                        <input type="text" className="form-control" id="title-input" 
                        value={title} onChange={(event) => setTitle(event.target.value)}></input>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="desc-input" className="form-label">Description <span className="req-text">*</span></label>
                        <textarea className="form-control" id="desc-input" 
                        value={desc} onChange={(event) => setDesc(event.target.value)}></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Image <span className="req-text">*</span></label>
                        <input className="form-control" type="file" id="formFile" accept="image/png, image/jpeg" 
                        key={key} onChange={(event) => setImage(event.target.files[0])}></input>
                    </div>
                </form>
            </div>
            <div className="card-footer d-flex justify-content-end">
                <button type="button" className="btn btn-primary" onClick={handleUpload}>Upload Image</button>
            </div>
        </div>
    )  
}