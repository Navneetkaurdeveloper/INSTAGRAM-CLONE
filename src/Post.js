/*import React from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";

function Post ({username,caption, imageurl}) {
    return (
        <div className="post">
        <div className="post__header">

        <Avatar className="post_Avatar"
        alt="img"
        src='https://img.freepik.com/free-photo/you-looked-much-better-your-avatar-unimpressed-indifferent-cute-man-glasses_176420-24041.jpg?size=626&ext=jpg'/>
<h3> {username}</h3>
 </div>
<img className  ="post__image" src ={imageurl}/>
        <h4 className="post__text" > <strong>{username}</strong> {caption}</h4>
        
        </div>
    )
}

export default Post;*/


import React, { useState, useEffect } from "react"
import { Card, Icon, Image, Comment, Form, Button } from "semantic-ui-react"
import { db } from "./firebase"
import "./Post.css"
import firebase from "firebase"
import Avatar from "@material-ui/core/Avatar";

const Post = ({ postId, user, username, image, caption }) => {
  const [comments, setComments] = useState([])

  const [comment, setComment] = useState("")
  useEffect(() => {
    let unsubscribe
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("time", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()))
        })
    }

    return () => {
      unsubscribe()
    }
  }, [postId])

  const postComment = (e) => {
    e.preventDefault()
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      time: firebase.firestore.FieldValue.serverTimestamp(),
    })

    setComment("")
  }

  return (
    <div className='post'>
      <Card className='post-card' fluid>
        <Card.Content>
          <Image floated='left' size='mini' src='/app-logo.png' avatar />
          <Card.Header>{username}</Card.Header>

          <Image src={image} wrapped ui={true} className='post-image' />
          <Card.Header className='post-actions'>
            <div>
              <Icon name='heart outline' />
            </div>
            <div>
              <Icon name='comment outline' />
            </div>
            <div>
              <Icon name='paper plane outline' />
            </div>
            <div>
              <Icon name='bookmark outline' />
            </div>
          </Card.Header>
          <Card.Description>
            <span className='post-username'>{username}</span>
            <span className='post-caption'>{caption}</span>
          </Card.Description>
        </Card.Content>
        <Card.Content>
          {user && (
            <Form className='comment-input-form'>
              <Form.Field className='comment-input-field'>
                <input
                  type='text'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  placeholder='Comment...'
                  className='comment-input'
                />
              </Form.Field>
              <Form.Field className='comment-button-field'>
                <Button
                  type='submit'
                  size='tiny'
                  disabled={!comment}
                  className='comment-button'
                  onClick={postComment}
                >
                  Comment
                </Button>
              </Form.Field>
            </Form>
          )}
          <div>

        <Avatar className="post_Avatar"
        alt="img"
        src='https://img.freepik.com/free-photo/you-looked-much-better-your-avatar-unimpressed-indifferent-cute-man-glasses_176420-24041.jpg?size=626&ext=jpg'/>
       </div>
          <div className='comments-div'>
            <h4>Comments</h4>
            {comments.map((comm, index) => (
              <Comment key={index}>
                <Comment.Content
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Comment.Author className='comment-author' as='a'>
                    {comm.username}
                  </Comment.Author>

                  <Comment.Text className='comment-text'>
                    {comm.text}
                  </Comment.Text>
{}
                </Comment.Content>
              </Comment>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default Post
