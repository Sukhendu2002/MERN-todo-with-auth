const express = require("express");
const auth = require("../../middleware/auth");
const Todo = require("../../models/Todo");
const router = express();

router.post("/", auth, async (req, res) => {
  try {
    const { title } = req.body;
    //validation
    if (!title) {
      return res.status(400).json({ msg: "Please enter the remaining field." });
    }
    const newTodo = new Todo({
      title,
      userId: req.user,
    });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/all", auth, async (req, res) => {
  const todos = await Todo.find({ userId: req.user });
  res.json(todos);
});

router.delete("/:id", auth, async (req, res) => {
  const todo = await Todo.findOne({ userId: req.user, _id: req.params.id });
  if (!todo) {
    return res
      .status(400)
      .json({ msg: "No todo with current user's id found." });
  }
  const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
  res.json(deletedTodo);
});

router.put("/completed", auth, async (req, res) => {
  const todo = await Todo.findOne({ userId: req.user, _id: req.body.id });
  if (!todo) {
    return res
      .status(400)
      .json({ msg: "No todo with current user's id found." });
  }
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

router.put("/:id", auth, async (req, res) => {
  const todo = await Todo.findOne({ userId: req.user, _id: req.params.id });
  if (!todo) {
    return res
      .status(400)
      .json({ msg: "No todo with current user's id found." });
  }
  console.log({
    title: req.body.title,
    todo: todo,
  });
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
    },
    { new: true }
  );
  res.json(updatedTodo);
});

module.exports = router;
