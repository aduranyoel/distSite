"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSyncCourses = exports.coursesRouter = void 0;
const express_1 = require("express");
const megajs_1 = __importDefault(require("megajs"));
const cache_1 = __importDefault(require("../src/cache"));
const node_1 = require("../model/node");
exports.coursesRouter = express_1.Router();
const accounts = [
    {
        accountId: 1,
        email: 'beiiakotmghumoqgrh@niwghx.com',
        password: 'Yoel44901',
        recovery: '1rqhvSPmPGSN-40KeWZjBw'
    },
    {
        accountId: 2,
        email: 'vjqpeuizcvbleytvqw@miucce.com',
        password: 'Yoel44901',
        recovery: 'POFbAtEd3QRikCUNPF_vjQ'
    }
];
let interval;
exports.coursesRouter.get('/', (req, res) => {
    res.json({
        response: getCoursesFromCache(),
        error: null
    });
});
exports.coursesRouter.get('/reload', (req, res) => {
    getAllCourses().then(completed => {
        res.json({
            response: completed,
            error: null
        });
    });
});
exports.coursesRouter.get('/embed', (req, res) => {
    const { path: string } = req.query;
    if (path) {
        const account = path.split('/')[0], url = path.split('/').slice(1).join('/');
        const wanted = find(url, cache_1.default[account]);
        if (wanted) {
            wanted.link((error, link) => {
                if (error)
                    return responseError(error);
                res.json({
                    response: getEmbed(link),
                    error: null
                });
            });
        }
        else {
            responseError('File not found.');
        }
    }
    else {
        responseError('No path found.');
    }
    function responseError(message) {
        res.status(400).json({
            response: null,
            error: message
        });
    }
});
exports.coursesRouter.get('/:idCourse', (req, res) => {
    const idCourse = req.params['idCourse'];
    let courseFounded = null, response = null;
    for (let [account, course] of Object.entries(cache_1.default)) {
        const exist = course.children.find(c => c.nodeId === idCourse);
        if (exist) {
            courseFounded = exist;
            break;
        }
    }
    if (courseFounded) {
        response = getNodes(courseFounded);
    }
    res.json({
        response,
        error: null
    });
});
function getAllCourses() {
    return new Promise(resolve => {
        let readyAccounts = 0, totalAccounts = accounts.length, readyCourses = 0, totalCourses = 0;
        accounts.forEach(account => {
            const { accountId } = account, login = __rest(account, ["accountId"]);
            new megajs_1.default.Storage(login, (err, res) => {
                ++readyAccounts;
                const courses = res.root.children.find(n => n.name === 'courses');
                if (courses) {
                    totalCourses += courses.children.length || 0;
                    cache_1.default[accountId] = courses;
                    courses.children.forEach((course, index) => {
                        const data = course.children.find(c => c.name === 'data.json');
                        if (data) {
                            data.download((err, res) => {
                                if (!err && res)
                                    cache_1.default[accountId]['children'][index]['courseInfo'] = JSON.parse(res.toString());
                                ++readyCourses;
                                checkFinally();
                            });
                        }
                        else {
                            ++readyCourses;
                            checkFinally();
                        }
                    });
                }
                checkFinally();
            });
        });
        function checkFinally() {
            if ((readyAccounts === totalAccounts) && (readyCourses === totalCourses)) {
                resolve(true);
            }
        }
    });
}
function getNodes(node) {
    const { name, nodeId, type, children, accountId, courseInfo } = node;
    return new node_1.Node({
        name, nodeId, type, accountId, courseInfo,
        children: Array.isArray(children) ? children.map(getNodes) : null
    });
}
function getCoursesFromCache() {
    return Object.entries(cache_1.default).reduce((acc, o) => {
        const [id, course] = o;
        acc = [
            ...acc,
            ...course.children.map(c => {
                c.accountId = id;
                return getNodes(c);
            })
        ];
        return acc;
    }, []);
}
function find(path, node) {
    const nodesPath = path.split('/');
    const isDeep = nodesPath.length > 1;
    if (!Array.isArray(node.children))
        return null;
    if (isDeep) {
        const directory = node.children.find(n => n.type === 1 && n.nodeId === nodesPath.slice(0, 1).join());
        if (directory) {
            return find(nodesPath.slice(1).join('/'), directory);
        }
        else {
            return null;
        }
    }
    else {
        return node.children.find(n => n.nodeId === nodesPath[0]);
    }
}
function getEmbed(url) {
    return url.replace('file', 'embed');
}
function initSyncCourses() {
    getAllCourses();
    interval = setInterval(getAllCourses, 24 * 60 * 60 * 1000);
}
exports.initSyncCourses = initSyncCourses;
