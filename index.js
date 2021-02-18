"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const courses_1 = require("./routes/courses");
const app = express();
/**
 * Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors_1.default({
    origin: '*',
    methods: 'GET',
}));
app.use(express.static(path_1.default.join(__dirname, "static")));
/**
 * Routes
 */
app.use('/api', courses_1.coursesRouter);
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "static", 'index.html'));
});
/**
 * Config
 */
app.set('port', process.env.PORT || 3001);
/**
 * Server
 */
app.listen(app.get('port'), () => {
    console.log(`Server running in port ${app.get('port')}`);
    courses_1.initSyncCourses();
});
