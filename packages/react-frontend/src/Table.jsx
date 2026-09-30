function TableHeader() {
  return (
    <thead>
      <tr>
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
  const rows = props.characterData.map((row, index) => {
    return (
        <tr key={index}>
            <td>{row.rating}</td>
            <td>{row.timeVisited}</td>
            <td>{row.whatIGot}</td>
            <td>{row.title}</td>
            <td>{row.description}</td>
            <td>
                <button onClick={() => props.removeCharacter(row._id)}>
                Delete
                </button>
            </td>
        </tr>
    );
   }
  );
  return (
      <tbody>
        {rows}
       </tbody>
   );
}

function Table(props) {
    return (
      <table>
        <TableHeader />
        <TableBody 
            characterData={props.characterData} 
            removeCharacter={props.removeCharacter}
        />
      </table>
    );
}

export default Table;