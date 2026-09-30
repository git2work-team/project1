import React, {useState, useEffect} from 'react';
import Table from "./Table"
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const updated = characters.filter((character, i) => {
      return i !== index;
    });
    setCharacters(updated);
  }


  //Initially get the Users from backend
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  
  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );


  //Adds user, gets the input and adds to the list
  function postUser(review) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });

    return promise;
  }

  function updateList(review) {
    postUser(review)
      .then((res) => {
        if (res.status === 200) {
          return res.json().then((newUser) => {
            setCharacters([...characters, newUser]);
          });
        } else {
          console.log("Insert failed, status:", res.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Deletes the user from users list in backend
  function deleteUser(id) {
    const promise = fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });

    return promise;
  }

  function updateDelete(id){
    deleteUser(id)
      .then((response) => {
          if (response.status === 200) {
            setCharacters((prevCharacters) => 
              prevCharacters.filter((character) => {
                return character["_id"] !== id
            }));
          } else {
            console.log("Deletion failed: status:", response.status);
          }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
        <div className="container">
            <Table
            characterData={characters}
            removeCharacter={updateDelete}
            />
            <Form handleSubmit={updateList} />
        </div>
    );
}
export default MyApp;