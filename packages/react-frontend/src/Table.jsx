function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Posted by</th>
        <th>Restaurant</th>
        <th>Rating</th>
        <th>Time visited</th>
        <th>What I got</th>
        <th>Review title</th>
        <th>Experience</th>
        {/* CHANGED: Header for the delete-button column. */}
        <th>Actions</th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const rows = props.reviewData.map((row) => {
    // CHANGED: Support either a populated user object or a user ID.
    const authorId = row.userId?._id ?? row.userId;

    // CHANGED: Only the signed-in author gets a delete button.
    const canDelete =
      Boolean(props.currentUserId) &&
      String(authorId) === String(props.currentUserId) &&
      typeof props.removeReview === "function";

    return (
      <tr key={row._id}>
        <td>{row.userId?.fullName}</td>
        <td>{row.restaurantId?.name}</td>
        <td>{row.rating}</td>
        <td>{row.timeVisited}</td>
        <td>{row.whatIGot}</td>
        <td>{row.title}</td>
        <td>{row.description}</td>
        <td>
          {/* CHANGED: Hide Delete unless this review belongs to the user. */}
          {canDelete && (
            <button onClick={() => props.removeReview(row._id)}>
              Delete
            </button>
          )}
        </td>
      </tr>
    );
  });

  return <tbody>{rows}</tbody>;
}

function Table(props) {
  return (
    <table>
      <TableHeader />
      {/* CHANGED: Forward the current user's ID to TableBody. */}
      <TableBody
        reviewData={props.reviewData}
        removeReview={props.removeReview}
        currentUserId={props.currentUserId}
      />
    </table>
  );
}

export default Table;