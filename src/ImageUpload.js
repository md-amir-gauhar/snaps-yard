import React, { useState } from 'react';
import { Button, Input } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function ImageUpload({ username }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState('');

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post image inside db
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption('');
            setImage(null);
          });
      }
    );
  };

  return (
    <div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://dewey.tailorbrands.com/production/brand_version_mockup_image/839/4037480839_98239a3f-c15c-4473-883c-7dcf3b4b7b79.png?cb=1604238923"
                alt="logo"
              />
            </center>
            <progress value={progress} max="100" />
            <Input
              type="text"
              placeholder="Enter a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <input type="file" onChange={handleChange} />

            <Button className="imageupload__button" onClick={handleUpload}>
              Upload
            </Button>
          </form>
        </div>
      </Modal>

      <AddToPhotosIcon fontSize="large" onClick={() => setOpen(true)} />
    </div>
  );
}

export default ImageUpload;
