import React, { useState } from "react"
import "./ImageUpload.css"
import { Button, Icon, Modal, Form, Progress } from "semantic-ui-react"
import firebase from 'firebase'

import { storage, db } from "./firebase"

const ImageUpload = ({username}) => {

  const [image, setImage] = useState(null)
  const [progress, setProgress] = useState(0)
  const [caption, setCaption] = useState("")
  const [open, setOpen] = useState(false)

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleUpload = () => {

    if(image){
    const uploadact = storage.ref(`images/${image.name}`).put(image)

    uploadact.on("state_changed", (snapshot) => {
      //progress bar
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );

      setProgress(progress);
    },
    (error)=>{
        //error function
        console.log(error);
        alert(error.message);
    },
    ()=>{
        //upload completed : grab the url of uploaded image
        storage.ref("images").child(image.name).getDownloadURL().then(url=>{
            //save url inside db
            db.collection("posts").add({
                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                caption:caption ? caption : "",
                image:url,
                username:username

            })
            setProgress(0);
            setCaption("");
            setImage(null);
            setOpen(false);

        })

    }
    )
    }
  }

  
  return (
    <div className='image-upload'>
      {/*Modal for image upload */}

      <Modal
        centered={true}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='mini'
      >
        <Modal.Header>Upload Image</Modal.Header>
        <Modal.Content>
            <Progress value={progress} total='100' progress='percent' success/>
          <Form>
            <Form.Field>
              <label>Image</label>
              <input type='file' onChange={handleChange} />
            </Form.Field>
            <Form.Field>
              <label>Caption</label>
              <input
                type='text'
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder='Enter Caption..'
              />
            </Form.Field>
            <Form.Field>
              <Button color='green' onClick={handleUpload}>
                Upload
              </Button>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    <div className='upload-button'>
      <Button size='small' onClick={() => setOpen(true)}>
        <Button.Content>
          <Icon name='plus circle' size='big' />
        </Button.Content>
      </Button>
      </div>
    </div>
  )
}

export default ImageUpload
