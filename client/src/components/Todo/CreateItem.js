import React, { useState, useEffect } from "react";
import { Form, Input, Container, ListGroup, ListGroupItem } from "reactstrap";
import axios from "axios";
import { FcEmptyTrash } from "react-icons/fc";
import { BsPen } from "react-icons/bs";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const CreateItem = () => {
  const [inputData, setInputData] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateFormTitle, setUpdateFormTitle] = useState("");
  const [id, setId] = useState("");
  const [text, setText] = useState({
    title: "",
  });
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    requestToDoList();
  }, []);

  const handleClickOpen = (id) => {
    setOpen(true);
    setId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleUpdateClose = () => {
    setOpen(false);
  };

  const requestToDoList = async () => {
    await axios
      .get("http://localhost:5000/all/", {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => {
        setInputData(res.data);
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  };

  const handleChange = (event) => {
    const newData = event.target.value;
    setText({ title: newData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:5000/", text, {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) =>
        setInputData((prevData) => {
          return [...prevData, res.data];
        })
      )
      .catch((err) => console.log(err));
    setText({ title: "" });
  };

  const deleteTodo = async (id) => {
    await axios
      .delete(`http://localhost:5000/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => {
        setInputData((prevData) => {
          return prevData.filter((data) => {
            return data._id !== id;
          });
        });
      });
  };

  const completeTodo = async (id) => {
    //change the completed status
    setCompleted(!completed);
    //update the data
    setInputData((prevData) => {
      return prevData.map((data) => {
        if (data._id === id) {
          data.completed = !data.completed;
        }
        return data;
      });
    });

    await axios
      .put(
        `http://localhost:5000/completed`,
        { id },
        {
          headers: { "x-auth-token": localStorage.getItem("auth-token") },
        }
      )
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Input type="text" value={text.title} onChange={handleChange} />
        <Button type="submit" className="btn-sm">
          Add
        </Button>
      </Form>
      <ListGroup>
        {inputData.map((item, index) => {
          return (
            <ListGroupItem
              key={index}
              className="list"
              style={{
                padding: "0.5rem",
                borderRadius: "0.5rem",
                fontSize: "2rem",
                backgroundColor: "#f5f5f5",
                textDecoration: item.completed ? "line-through" : "none",
              }}
            >
              <span
                onClick={() => {
                  completeTodo(item._id);
                }}
              >
                {item.title}
              </span>
              {/* {item.title} */}

              <span
                style={{
                  float: "right",
                  fontSize: "2rem",
                }}
              >
                <FcEmptyTrash onClick={() => deleteTodo(item._id)} />
              </span>
              <span
                style={{
                  float: "right",
                  paddingRight: "20px",
                }}
              >
                <BsPen
                  onClick={() => {
                    setId(item._id);
                    handleClickOpen(item._id);
                  }}
                />
              </span>
            </ListGroupItem>
          );
        })}
      </ListGroup>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update</DialogTitle>
        <DialogContent>
          <DialogContentText>Update the task</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Task"
            type="text"
            fullWidth
            variant="standard"
            value={updateFormTitle}
            onChange={(e) => {
              setUpdateFormTitle(e.target.value);
              console.log(updateFormTitle);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdateClose}>Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateItem;
