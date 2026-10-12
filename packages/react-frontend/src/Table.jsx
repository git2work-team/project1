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
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const rows = props.reviewData.map((row) => {
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
          <button onClick={() => props.removeReview(row._id)}>Delete</button>
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
      <TableBody reviewData={props.reviewData} removeReview={props.removeReview} />
    </table>
  );
}

export default Table;
