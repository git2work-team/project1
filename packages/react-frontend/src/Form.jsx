import React, { useState } from "react";

const RATING_LABELS = ["Bad", "Not Great", "Ok", "Good", "Great"];

function Form(props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);

  // The hovered star wins so the user sees a preview before clicking
  const shownRating = hoverRating || rating;
  const canPost = rating > 0 && description.trim() !== "";

  function submitForm() {
    props.handleSubmit({ rating, description }, photos);
  }
//removes photos
  function removePhoto(indexToRemove) {
    const remainingPhotos = [];
    for (let i = 0; i < photos.length; i++) {
      if (i !== indexToRemove) {
        remainingPhotos.push(photos[i]);
      }
    }
    setPhotos(remainingPhotos);
  }

  return (
    <form className="reviewForm" onSubmit={(event) => event.preventDefault()}>
      <h2>How would you rate your experience?</h2>
      <div className="reviewStars" onMouseLeave={() => setHoverRating(0)}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            type="button"
            key={value}
            className={value <= shownRating ? "reviewStar reviewStarOn" : "reviewStar"}
            aria-label={`${value} star${value > 1 ? "s" : ""}`}
            onMouseEnter={() => setHoverRating(value)}
            onClick={() => setRating(value)}
          >
            ★
          </button>
        ))}
        <span className="reviewStarLabel">{shownRating ? RATING_LABELS[shownRating - 1] : ""}</span>
      </div>

      <label htmlFor="description">Tell us about your experience</label>
      <textarea
        name="description"
        id="description"
        rows="10"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <label htmlFor="photo">Add a photo</label>
      {/* user can select multiple photos to upload */}
      <input
        id="photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(e) => {
          const newPhotos = Array.from(e.target.files || []);
          setPhotos((currentPhotos) => [...currentPhotos, ...newPhotos]);
          e.target.value = "";
        }}
      />
    {/* tracks every photo with an index, displays photo names, removes photos */}
      <ul>
        {photos.map((photo, index) => (
          <li key={index}>
            {photo.name}
            <button
              type="button"
              onClick={() => removePhoto(index)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="postReviewBtn" disabled={!canPost} onClick={submitForm}>
        Post Review
      </button>
    </form>
  );
}

export default Form;
