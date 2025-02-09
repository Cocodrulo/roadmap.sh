import express from "express";
import config from "./config.js";
import { initDB } from "./db.js";
import {
    validatePost,
    addNewPost,
    getPost,
    getPosts,
    deletePost,
} from "./utils.js";

initDB();

const app = express();
app.use(express.json());
app.disable("x-powered-by");

app.post("/posts", (req, res) => {
    if (!validatePost(req.body)) {
        return res.status(400).send("Bad Request");
    }

    const id = addNewPost(req.body);

    return res.status(201).json(getPost(id));
});

app.put("/posts/:id", (req, res) => {
    if (!validatePost(req.body)) {
        return res.status(400).send("Bad Request");
    }

    const post = getPost(req.params.id);

    if (!post) {
        return res.status(404).send("Not Found");
    }

    return res.status(200).json(getPost(id));
});

app.delete("/posts/:id", (req, res) => {
    const post = getPost(req.params.id);

    if (!post) {
        return res.status(404).send("Not Found");
    }

    deletePost(req.params.id);

    return res.status(204).json(post);
});

app.get("/posts/:id", (req, res) => {
    const post = getPost(req.params.id);

    if (!post) {
        return res.status(404).send("Not Found");
    }

    return res.status(200).json(post);
});

app.get("/posts?term=:term", (req, res) => {
    const posts = getPosts();
    const term = req.params.term;

    const filteredPosts = posts.filter((post) => {
        return (
            post.title.includes(term) ||
            post.content.includes(term) ||
            post.category.includes(term) ||
            post.tags.includes(term)
        );
    });

    return res.json(filteredPosts);
});

app.get("/posts", (req, res) => {
    const posts = getPosts();

    return res.json(posts);
});

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
