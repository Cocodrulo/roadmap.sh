import { db } from "./db.js";

export const validatePost = (post) => {
    if (
        !post.title ||
        typeof post.title !== "string" ||
        !post.content ||
        typeof post.content !== "string" ||
        !post.category ||
        typeof post.category !== "string" ||
        !post.tags ||
        !Array.isArray(post.tags)
    ) {
        return false;
    }

    if (post.tags.some((tag) => typeof tag !== "string")) {
        return false;
    }

    return true;
};

export const getPosts = () => {
    const stmt = db.prepare("SELECT * FROM posts");

    const results = stmt.all();

    results.forEach((result) => {
        result.tags = JSON.parse(result.tags);
    });

    return results;
};

export const getPost = (id) => {
    const stmt = db.prepare("SELECT * FROM posts WHERE id = ? LIMIT 1");

    const [result] = stmt.all(id);

    if (!result) {
        return null;
    }

    result.tags = JSON.parse(result.tags);

    return result;
};

export const updatePost = (id, post) => {
    const stmt = db.prepare(
        "UPDATE posts SET title = ?, content = ?, category = ?, tags = ? WHERE id = ?"
    );

    stmt.run(
        post.title,
        post.content,
        post.category,
        JSON.stringify(post.tags),
        id
    );

    return id;
};

export const deletePost = (id) => {
    const stmt = db.prepare("DELETE FROM posts WHERE id = ?");

    stmt.run(id);
};

export const addNewPost = (post) => {
    const stmt = db.prepare(
        "INSERT INTO posts (title, content, category, tags) VALUES (?, ?, ?, ?)"
    );

    const { lastInsertRowid: lastID } = stmt.run(
        post.title,
        post.content,
        post.category,
        JSON.stringify(post.tags)
    );

    return lastID;
};
