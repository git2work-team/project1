import React, { useState } from "react";

function Form(props) {
  const [review, setReview] = useState({
    rating: "",
    timeVisited: "",
    whatIGot: "",
    title: "",
    description: "",
  });
  function handleChange(event) {
    const { name, value } = event.target;
    setReview({ ...review, [name]: value });
  }
  function submitForm() {
    props.handleSubmit(review);
    setReview({ rating: "", timeVisited: "", whatIGot: "", title: "", description: "" });
  }

  return (
    <form>
      <label htmlFor="rating">Rating</label>
      <input
        type="number"
        min="1"
        max="5"
        name="rating"
        id="rating"
        value={review.rating}
        onChange={handleChange}
      />
      <label htmlFor="timeVisited">Time visited</label>
      <input
        type="datetime-local"
        name="timeVisited"
        id="timeVisited"
        value={review.timeVisited}
        onChange={handleChange}
      />
      <label htmlFor="whatIGot">What I got</label>
      <input
        type="text"
        name="whatIGot"
        id="whatIGot"
        value={review.whatIGot}
        onChange={handleChange}
      />
      <label htmlFor="title">Review title</label>
      <input type="text" name="title" id="title" value={review.title} onChange={handleChange} />
      <label htmlFor="description">Experience / review description</label>
      <textarea
        name="description"
        id="description"
        value={review.description}
        onChange={handleChange}
      />
      <input type="button" value="Submit" onClick={submitForm} />
    </form>
  );
}

export default Form;
