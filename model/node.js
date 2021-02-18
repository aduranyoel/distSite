"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
class Node {
    constructor({ name, nodeId, type, children, accountId, courseInfo }) {
        this.name = name;
        this.nodeId = nodeId;
        this.type = type;
        this.children = children;
        this.accountId = accountId;
        this.courseInfo = courseInfo;
    }
}
exports.Node = Node;
